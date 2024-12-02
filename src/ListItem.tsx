import React, {FC, memo} from 'react';

import {SELECT_ALL} from './constants';
import {CheckedState, Type} from './models';
import {NodeRow} from './NodeRow';
import {SelectAll} from './SelectAll';
import {NoMatches} from './NoMatches';
import {Node} from './Node';

export interface ListItemProps {
  type: Type;
  index: number;
  nodesAmount: number;
  displayedNodes: Node[];
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  focusedElement: string;
  noMatchesText: string;
  onChangeSelectAll: (e: React.MouseEvent) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent) => void;
}

export const ListItem: FC<ListItemProps> = memo((props) => {

  const {
    type,
    index,
    nodesAmount = 0,
    displayedNodes = [],
    isAnyHasChildren = false,
    searchValue = '',
    showSelectAll = false,
    selectAllCheckedState = CheckedState.UNSELECTED,
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
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SELECT)
    && isAnyHasChildren
    && !node.hasChildren();

  return (
    <NodeRow
      key={node.path}
      node={node}
      focused={focused}
      expanded={expanded}
      showNodeExpand={type !== Type.MULTI_SELECT && type !== Type.SELECT && node.hasChildren()}
      showNodeCheckbox={type !== Type.MULTI_SELECT && type !== Type.SELECT}
      indentation={indentation}
      onToggleNode={onToggleNode(node)}
      onClickExpandIcon={onClickExpandNode(node)}
    />
  );
});
