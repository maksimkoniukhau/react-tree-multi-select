import React, {FC, JSX, memo, ReactNode, RefObject, useEffect, useRef} from 'react';
import {FOOTER, SELECT_ALL} from './constants';
import {CheckedState, Type} from './types';
import {InnerComponents} from './innerTypes';
import {Node} from './Node';
import {ListItem} from './ListItem';
import {VirtualizedList, VirtualizedListHandle} from './VirtualizedList';

export interface DropdownProps {
  type: Type;
  nodeMap: Map<string, Node>;
  nodesAmount: number;
  displayedNodes: Node[];
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  focusedElement: string;
  noDataText: string;
  noMatchesText: string;
  dropdownHeight: number;
  showFooter: boolean;
  onSelectAllChange: (e: React.MouseEvent) => void;
  onNodeChange: (node: Node) => (e: React.MouseEvent) => void;
  onNodeToggle: (node: Node) => (e: React.MouseEvent) => void;
  onFooterClick: (e: React.MouseEvent) => void;
  input: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  onLastItemReached: () => void;
  onUnmount: () => void;
  components: InnerComponents;
  onListItemRender: () => void;
}

export const Dropdown: FC<DropdownProps> = memo((props) => {
  const {
    type,
    nodeMap,
    nodesAmount,
    displayedNodes,
    isAnyHasChildren,
    searchValue,
    showSelectAll,
    selectAllCheckedState,
    focusedElement,
    noDataText,
    noMatchesText,
    dropdownHeight,
    showFooter,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    input,
    inputRef,
    onLastItemReached,
    onUnmount,
    components,
    onListItemRender
  } = props;

  const virtualizedListRef = useRef<VirtualizedListHandle>(null);

  const topItemCount = (showSelectAll ? 1 : 0) + (input ? 1 : 0);
  const displayedItemCount = (displayedNodes.length || 1) + topItemCount + (showFooter ? 1 : 0);

  useEffect(() => {
    return () => onUnmount();
  }, []);

  useEffect(() => {
    if (focusedElement && virtualizedListRef.current && displayedNodes.length) {
      let elementIndex = -1;
      if (focusedElement === SELECT_ALL) {
        elementIndex = 0;
      } else if (focusedElement === FOOTER) {
        elementIndex = displayedNodes.length + (showSelectAll ? 1 : 0) + (input ? 1 : 0);
      } else {
        const node = nodeMap.get(focusedElement);
        if (node) {
          elementIndex = displayedNodes.indexOf(node) + (showSelectAll ? 1 : 0) + (input ? 1 : 0);
        }
      }
      if (elementIndex >= 0) {
        virtualizedListRef.current.scrollIntoView(elementIndex);
      }
    }
  }, [focusedElement, showSelectAll, input]);

  const renderItem = (index: number): JSX.Element => {
    return (
      <ListItem
        type={type}
        index={index}
        nodesAmount={nodesAmount}
        displayedNodes={displayedNodes}
        displayedItemCount={displayedItemCount}
        isAnyHasChildren={isAnyHasChildren}
        searchValue={searchValue}
        showSelectAll={showSelectAll}
        selectAllCheckedState={selectAllCheckedState}
        focusedElement={focusedElement}
        noDataText={noDataText}
        noMatchesText={noMatchesText}
        showFooter={showFooter}
        onSelectAllChange={onSelectAllChange}
        onNodeChange={onNodeChange}
        onNodeToggle={onNodeToggle}
        onFooterClick={onFooterClick}
        input={input}
        components={components}
        onRender={onListItemRender}
      />
    );
  };

  const handleMouseDown = (event: React.MouseEvent): void => {
    if (event.target !== inputRef?.current) {
      // needed for staying focus on input
      event.preventDefault();
    }
  };

  return (
    <div className="rtms-dropdown" onMouseDown={handleMouseDown}>
      <VirtualizedList
        ref={virtualizedListRef}
        height={dropdownHeight}
        totalCount={displayedItemCount}
        topItemCount={topItemCount}
        renderItem={renderItem}
        onLastItemReached={onLastItemReached}
      />
    </div>
  );
});
