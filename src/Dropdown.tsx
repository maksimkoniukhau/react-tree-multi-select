import React, {FC, JSX, memo, ReactNode, RefObject, useEffect, useRef} from 'react';
import {DROPDOWN, FOOTER, SELECT_ALL} from './constants';
import {buildFocusedElement, extractPathFromFocusedElement, isFocusedElementInDropdown} from './utils/focusUtils';
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
  overscan: number;
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
  componentDisabled: boolean;
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
    overscan,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    input,
    inputRef,
    onLastItemReached,
    onUnmount,
    components,
    onListItemRender,
    componentDisabled
  } = props;

  const virtualizedListRef = useRef<VirtualizedListHandle>(null);

  const topItemCount = (showSelectAll ? 1 : 0) + (input ? 1 : 0);
  const displayedItemCount = (displayedNodes.length || 1) + topItemCount + (showFooter ? 1 : 0);

  useEffect(() => {
    return () => onUnmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFocusedElementInDropdown(focusedElement) && virtualizedListRef.current && displayedNodes.length) {
      let elementIndex = -1;
      if (focusedElement === buildFocusedElement(SELECT_ALL, DROPDOWN)) {
        elementIndex = 0;
      } else if (focusedElement === buildFocusedElement(FOOTER, DROPDOWN)) {
        elementIndex = displayedNodes.length + (showSelectAll ? 1 : 0) + (input ? 1 : 0);
      } else {
        const node = nodeMap.get(extractPathFromFocusedElement(focusedElement));
        if (node) {
          elementIndex = displayedNodes.indexOf(node) + (showSelectAll ? 1 : 0) + (input ? 1 : 0);
        }
      }
      if (elementIndex >= 0) {
        virtualizedListRef.current.scrollIntoView(elementIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className={`rtms-dropdown${componentDisabled ? ' disabled' : ''}`} onMouseDown={handleMouseDown}>
      <VirtualizedList
        ref={virtualizedListRef}
        height={dropdownHeight}
        totalCount={displayedItemCount}
        topItemCount={topItemCount}
        renderItem={renderItem}
        onLastItemReached={onLastItemReached}
        overscan={overscan}
      />
    </div>
  );
});
