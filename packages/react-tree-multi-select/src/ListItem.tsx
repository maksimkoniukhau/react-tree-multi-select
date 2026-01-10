import React, {FC, memo} from 'react';
import {SELECT_ALL_LABEL} from './constants';
import {buildVirtualFocusId} from './utils/focusUtils';
import {DROPDOWN_PREFIX, FOOTER_SUFFIX, SELECT_ALL_SUFFIX, SelectionAggregateState, Type} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {NodesManager} from './NodesManager';
import {Node} from './Node';
import {NoDataWrapper} from './components/NoData';
import {SelectAllWrapper} from './components/SelectAllWrapper';
import {NodeWrapper} from './components/NodeWrapper';
import {FooterWrapper} from './components/Footer';

export interface ListItemProps {
  type: Type;
  index: number;
  nodesManager: NodesManager;
  displayedNodes: Node[];
  selectedIds: string[];
  expandedIds: string[];
  loadedIds: Set<string>;
  displayedItemCount: number;
  isAnyCanExpand: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectionAggregateState: SelectionAggregateState;
  virtualFocusId: NullableVirtualFocusId;
  noDataText: string;
  noMatchesText: string;
  showFooter: boolean;
  onSelectAllChange: (event: React.MouseEvent) => void;
  onNodeChange: (id: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (id: string) => (event: React.MouseEvent) => void;
  onFooterClick: (event: React.MouseEvent) => void;
  components: InnerComponents;
}

export const ListItem: FC<ListItemProps> = memo((props) => {
  const {
    type,
    index,
    nodesManager,
    displayedNodes,
    loadedIds,
    displayedItemCount,
    isAnyCanExpand,
    searchValue,
    showSelectAll,
    selectionAggregateState,
    virtualFocusId,
    noDataText,
    noMatchesText,
    showFooter,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    components
  } = props;

  if (showSelectAll && index === 0) {
    return (
      <SelectAllWrapper
        components={components}
        label={SELECT_ALL_LABEL}
        selectionAggregateState={selectionAggregateState}
        focused={virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX)}
        onClick={onSelectAllChange}
      />
    );
  }

  if (showFooter && index === displayedItemCount - 1) {
    const isFooterFocused = virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX);
    return (
      <FooterWrapper footer={components.Footer} focused={isFooterFocused} onClick={onFooterClick}/>
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoDataWrapper
        noData={components.NoData}
        label={nodesManager.getSize() === 0 ? noDataText : noMatchesText}
      />
    );
  }

  let nodeIndex = index;
  if (showSelectAll && nodesManager.getSize() > 0) {
    nodeIndex = index - 1;
  }
  const node = displayedNodes[nodeIndex];
  const focused = virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, node.id);
  const expanded = searchValue
    ? nodesManager.expansionState.searchExpandedIds.has(node.id)
    : nodesManager.expansionState.expandedIds.has(node.id);
  const canExpand = node.canExpand();
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SINGLE_SELECT)
    && isAnyCanExpand
    && !canExpand;

  return (
    <NodeWrapper
      components={components}
      id={node.id}
      depth={node.depth}
      label={node.name}
      disabled={node.disabled}
      selected={nodesManager.selectionState.selectedIds.has(node.id)}
      partial={nodesManager.selectionState.partiallySelectedIds.has(node.id)}
      expanded={expanded}
      focused={focused}
      matched={nodesManager.searchState.matchedIds.has(node.id)}
      loaded={loadedIds.has(node.id)}
      indentation={indentation}
      withToggle={type !== Type.MULTI_SELECT && type !== Type.SINGLE_SELECT && canExpand}
      withCheckbox={type !== Type.MULTI_SELECT && type !== Type.SINGLE_SELECT}
      onNodeChange={onNodeChange}
      onNodeToggle={onNodeToggle}
    />
  );
});
