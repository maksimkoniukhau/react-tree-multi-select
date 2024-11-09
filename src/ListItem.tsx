import React, {FC} from 'react';

import {NO_OPTIONS, SELECT_ALL} from './constants';
import {SelectAllCheckedState} from './models';
import {NodeRow} from './NodeRow';
import {SelectAll} from './SelectAll';
import {NoOptions} from './NoOptions';
import {Node} from './Node';

export interface ListItemProps {
  index: number;
  nodesAmount: number;
  displayedNodes: Node[];
  searchValue: string;
  withSelectAll: boolean;
  selectAllCheckedState: SelectAllCheckedState;
  focusedElement: string;
  onChangeSelectAll: (e: React.MouseEvent<Element>) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent<Element>) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent<Element>) => void;
}

const ListItemFC: FC<ListItemProps> = (props) => {

  const {
    index,
    nodesAmount = 0,
    displayedNodes = [],
    searchValue = '',
    withSelectAll = false,
    selectAllCheckedState = SelectAllCheckedState.UNSELECTED,
    focusedElement = '',
    onChangeSelectAll,
    onToggleNode,
    onClickExpandNode
  } = props;

  if (withSelectAll && index === 0) {
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
      <NoOptions label={NO_OPTIONS}/>
    );
  }

  const nodeIndex = withSelectAll && nodesAmount > 0 ? index - 1 : index;
  const node = displayedNodes[nodeIndex];
  const focused = focusedElement === node.path;
  const expanded = searchValue ? node.searchExpanded : node.expanded;

  return (
    <NodeRow
      key={node.path}
      node={node}
      focused={focused}
      expanded={expanded}
      onToggleNode={onToggleNode(node)}
      onClickExpandIcon={onClickExpandNode(node)}
    />
  );
};

export const ListItem = React.memo(ListItemFC);
