import React, {FC, memo, ReactNode, useEffect} from 'react';
import {DROPDOWN, FOOTER, SELECT_ALL} from './constants';
import {buildFocusedElement} from './utils/focusUtils';
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
  displayedItemCount: number;
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  focusedElement: string;
  noDataText: string;
  noMatchesText: string;
  showFooter: boolean;
  onSelectAllChange: (e: React.MouseEvent) => void;
  onNodeChange: (node: Node) => (e: React.MouseEvent) => void;
  onNodeToggle: (node: Node) => (e: React.MouseEvent) => void;
  onFooterClick: (e: React.MouseEvent) => void;
  input: ReactNode;
  components: InnerComponents;
  onRender: () => void;
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
    focusedElement,
    noDataText,
    noMatchesText,
    showFooter,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    input,
    components,
    onRender
  } = props;

  useEffect(() => {
    onRender();
  });

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
        label={SELECT_ALL}
        checkedState={selectAllCheckedState}
        focused={focusedElement === buildFocusedElement(SELECT_ALL, DROPDOWN)}
        onClick={onSelectAllChange}
      />
    );
  }

  if (showFooter && index === displayedItemCount - 1) {
    const isFooterFocused = focusedElement === buildFocusedElement(FOOTER, DROPDOWN);
    return (
      <components.Footer.component
        attributes={{className: `rtms-footer${isFooterFocused ? ' focused' : ''}`, onClick: onFooterClick}}
        ownProps={{focused: isFooterFocused}}
        customProps={components.Footer.props}
      />
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoMatchesWrapper
        noMatches={components.NoMatches}
        label={nodesAmount === 0 ? noDataText : noMatchesText}
      />
    );
  }

  let nodeIndex = index;
  if ((showSelectAll || Boolean(input)) && nodesAmount > 0) {
    nodeIndex = showSelectAll && Boolean(input) ? index - 2 : index - 1;
  }
  const node = displayedNodes[nodeIndex];
  const focused = focusedElement === buildFocusedElement(node.path, DROPDOWN);
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
