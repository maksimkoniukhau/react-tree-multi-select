import React, {FC, memo, useMemo} from 'react';

import {SELECT_ALL} from './constants';
import {isAnyHasChildren} from './utils';
import {CheckedState} from './models';
import {NodeRow} from './NodeRow';
import {SelectAll} from './SelectAll';
import {NoMatches} from './NoMatches';
import {Node} from './Node';

export interface ListItemProps {
  index: number;
  nodesAmount: number;
  displayedNodes: Node[];
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  showNodeExpand: boolean;
  showNodeCheckbox: boolean;
  focusedElement: string;
  noMatchesText: string;
  onChangeSelectAll: (e: React.MouseEvent) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent) => void;
}

export const ListItem: FC<ListItemProps> = memo((props) => {

  const {
    index,
    nodesAmount = 0,
    displayedNodes = [],
    isAnyHasChildren = false,
    searchValue = '',
    showSelectAll = false,
    selectAllCheckedState = CheckedState.UNSELECTED,
    showNodeExpand = false,
    showNodeCheckbox = false,
    focusedElement = '',
    noMatchesText,
    onChangeSelectAll,
    onToggleNode,
    onClickExpandNode
  } = props;

  if (showSelectAll && index === 0) {
    return (
      <SelectAll
        label={SELECT_ALL}
        checkedState={selectAllCheckedState}
        focused={focusedElement === SELECT_ALL}
        onChange={onChangeSelectAll}
      />
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoMatches label={noMatchesText}/>
    );
  }

  const nodeIndex = showSelectAll && nodesAmount > 0 ? index - 1 : index;
  const node = displayedNodes[nodeIndex];
  const focused = focusedElement === node.path;
  const expanded = searchValue ? node.searchExpanded : node.expanded;

  return (
    <NodeRow
      key={node.path}
      node={node}
      focused={focused}
      expanded={expanded}
      showNodeExpand={showNodeExpand && node.hasChildren()}
      showNodeCheckbox={showNodeCheckbox}
      indentation={!isAnyHasChildren}
      onToggleNode={onToggleNode(node)}
      onClickExpandIcon={onClickExpandNode(node)}
    />
  );
});
