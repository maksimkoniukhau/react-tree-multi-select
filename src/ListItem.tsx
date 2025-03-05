import React, {FC, memo, ReactNode, useEffect} from 'react';
import {SELECT_ALL} from './constants';
import {CheckedState, Type} from './types';
import {InnerComponents} from './innerTypes';
import {Node} from './Node';
import {NoMatchesWrapper} from './components/NoMatches';
import {SelectAllWrapper} from './components/SelectAllWrapper';
import {NodeWrapper} from './components/NodeWrapper';

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
  onSelectAllChange: (e: React.MouseEvent) => void;
  onNodeChange: (node: Node) => (e: React.MouseEvent) => void;
  onNodeToggle: (node: Node) => (e: React.MouseEvent) => void;
  input: ReactNode;
  components: InnerComponents;
  onRender: () => void;
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
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    input,
    components,
    onRender
  } = props;

  useEffect(() => {
    onRender();
  });

  if (Boolean(input) && index === 0) {
    return (
      <div className="rtms-header-item">
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
        label={SELECT_ALL}
        checkedState={selectAllCheckedState}
        focused={focusedElement === SELECT_ALL}
        onClick={onSelectAllChange}
      />
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoMatchesWrapper noMatches={components.NoMatches} label={noMatchesText}/>
    );
  }

  let nodeIndex = index;
  if ((showSelectAll || Boolean(input)) && nodesAmount > 0) {
    nodeIndex = showSelectAll && Boolean(input) ? index - 2 : index - 1;
  }
  const node = displayedNodes[nodeIndex];
  const focused = focusedElement === node.path;
  const expanded = searchValue ? node.searchExpanded : node.expanded;
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SELECT)
    && isAnyHasChildren
    && !node.hasChildren();

  return (
    <NodeWrapper
      components={components}
      type={type}
      node={node}
      label={node.name}
      disabled={node.disabled}
      selected={node.selected}
      partial={node.partiallySelected}
      expanded={expanded}
      focused={focused}
      matched={node.matched}
      indentation={indentation}
      onNodeChange={onNodeChange}
      onNodeToggle={onNodeToggle}
    />
  );
});
