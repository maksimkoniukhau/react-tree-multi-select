import React, {FC, memo} from 'react';
import {SELECT_ALL_LABEL} from './constants';
import {buildVirtualFocusId} from './utils/focusUtils';
import {CheckedState, DROPDOWN_PREFIX, FOOTER_SUFFIX, SELECT_ALL_SUFFIX, Type} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {NodesManager} from './NodesManager';
import {Node} from './Node';
import {NoDataWrapper} from './components/NoData';
import {SelectAllWrapper} from './components/SelectAllWrapper';
import {NodeWrapper} from './components/NodeWrapper';

export interface ListItemProps {
  type: Type;
  index: number;
  nodesManager: NodesManager;
  displayedNodes: Node[];
  selectedIds: string[];
  expandedIds: string[];
  displayedItemCount: number;
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
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
    displayedItemCount,
    isAnyHasChildren,
    searchValue,
    showSelectAll,
    selectAllCheckedState,
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
        checkedState={selectAllCheckedState}
        focused={virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX)}
        onClick={onSelectAllChange}
      />
    );
  }

  if (showFooter && index === displayedItemCount - 1) {
    const isFooterFocused = virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX);
    return (
      <components.Footer.component
        attributes={{
          'data-rtms-virtual-focus-id': buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX),
          className: `rtms-footer${isFooterFocused ? ' focused' : ''}`,
          onClick: onFooterClick
        }}
        ownProps={{focused: isFooterFocused}}
        customProps={components.Footer.props}
      />
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
  const hasChildren = node.hasChildren();
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SELECT) && isAnyHasChildren && !hasChildren;

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
      matched={nodesManager.searchingState.matchedIds.has(node.id)}
      skipDropdownVirtualFocus={node.skipDropdownVirtualFocus}
      indentation={indentation}
      withToggle={type !== Type.MULTI_SELECT && type !== Type.SELECT && hasChildren}
      withCheckbox={type !== Type.MULTI_SELECT && type !== Type.SELECT}
      onNodeChange={onNodeChange}
      onNodeToggle={onNodeToggle}
    />
  );
});
