import React, {FC, HTMLProps, memo, ReactNode} from 'react';
import {SELECT_ALL_LABEL} from './constants';
import {buildVirtualFocusId} from './utils/focusUtils';
import {CheckedState, DROPDOWN_PREFIX, FOOTER_SUFFIX, SELECT_ALL_SUFFIX, Type} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {Node} from './Node';
import {NoDataWrapper} from './components/NoData';
import {SelectAllWrapper} from './components/SelectAllWrapper';
import {NodeWrapper} from './components/NodeWrapper';

export interface ListItemProps {
  type: Type;
  index: number;
  nodesAmount: number;
  displayedNodes: Node[];
  selectedNodes: Node[];
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
  onNodeChange: (path: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (path: string) => (event: React.MouseEvent) => void;
  onFooterClick: (event: React.MouseEvent) => void;
  input: ReactNode;
  components: InnerComponents;
}

export const ListItem: FC<ListItemProps> = memo((props) => {
  const {
    type,
    index,
    nodesAmount,
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
    input,
    components
  } = props;

  if (Boolean(input) && index === 0) {
    return (
      <div className="rtms-sticky-item">
        <div className="rtms-input-container">
          {input}
        </div>
      </div>
    );
  }

  if ((showSelectAll && Boolean(input) && index === 1) || (showSelectAll && index === 0)) {
    return (
      <SelectAllWrapper
        components={components}
        label={SELECT_ALL_LABEL}
        checkedState={selectAllCheckedState}
        focused={virtualFocusId === buildVirtualFocusId(SELECT_ALL_SUFFIX, DROPDOWN_PREFIX)}
        onClick={onSelectAllChange}
      />
    );
  }

  if (showFooter && index === displayedItemCount - 1) {
    const isFooterFocused = virtualFocusId === buildVirtualFocusId(FOOTER_SUFFIX, DROPDOWN_PREFIX);
    return (
      <components.Footer.component
        attributes={{
          'data-rtms-virtual-focus-id': buildVirtualFocusId(FOOTER_SUFFIX, DROPDOWN_PREFIX),
          className: `rtms-footer${isFooterFocused ? ' focused' : ''}`,
          onClick: onFooterClick
        } as HTMLProps<HTMLDivElement>}
        ownProps={{focused: isFooterFocused}}
        customProps={components.Footer.props}
      />
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoDataWrapper
        noData={components.NoData}
        label={nodesAmount === 0 ? noDataText : noMatchesText}
      />
    );
  }

  let nodeIndex = index;
  if ((showSelectAll || Boolean(input)) && nodesAmount > 0) {
    nodeIndex = showSelectAll && Boolean(input) ? index - 2 : index - 1;
  }
  const node = displayedNodes[nodeIndex];
  const focused = virtualFocusId === buildVirtualFocusId(node.path, DROPDOWN_PREFIX);
  const expanded = searchValue ? node.searchExpanded : node.expanded;
  const hasChildren = node.hasChildren();
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SELECT) && isAnyHasChildren && !hasChildren;

  return (
    <NodeWrapper
      components={components}
      path={node.path}
      depth={node.depth}
      label={node.name}
      disabled={node.disabled}
      selected={node.selected}
      partial={node.partiallySelected}
      expanded={expanded}
      focused={focused}
      matched={node.matched}
      indentation={indentation}
      withToggle={type !== Type.MULTI_SELECT && type !== Type.SELECT && hasChildren}
      withCheckbox={type !== Type.MULTI_SELECT && type !== Type.SELECT}
      onNodeChange={onNodeChange}
      onNodeToggle={onNodeToggle}
    />
  );
});
