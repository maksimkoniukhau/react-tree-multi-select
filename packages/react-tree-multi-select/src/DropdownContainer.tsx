import React, {FC, JSX, memo, RefObject, useEffect, useRef} from 'react';
import {CheckedState, DROPDOWN_PREFIX, DropdownProps, FOOTER_SUFFIX, SELECT_ALL_SUFFIX, Type} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {buildVirtualFocusId, extractElementId, isVirtualFocusInDropdown} from './utils/focusUtils';
import {Node} from './Node';
import {ListItem} from './ListItem';
import {VirtualizedList, VirtualizedListHandle} from './VirtualizedList';
import {InputWrapper} from './components/Input';

export const Dropdown: FC<DropdownProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface DropdownContainerProps {
  type: Type;
  nodeMap: Map<string, Node>;
  nodesAmount: number;
  displayedNodes: Node[];
  selectedNodes: Node[];
  isAnyHasChildren: boolean;
  isSearchable: boolean;
  withDropdownInput: boolean;
  inputPlaceholder: string;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  virtualFocusId: NullableVirtualFocusId;
  noDataText: string;
  noMatchesText: string;
  dropdownHeight: number;
  showFooter: boolean;
  overscan: number;
  isVirtualized: boolean;
  components: InnerComponents;
  componentDisabled: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectAllChange: (event: React.MouseEvent) => void;
  onNodeChange: (id: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (id: string) => (event: React.MouseEvent) => void;
  onFooterClick: (event: React.MouseEvent) => void;
  onLastItemReached: () => void;
  onMount: () => void;
  onUnmount: () => void;
}

export const DropdownContainer: FC<DropdownContainerProps> = memo((props) => {
  const {
    type,
    nodeMap,
    nodesAmount,
    displayedNodes,
    selectedNodes,
    isAnyHasChildren,
    isSearchable,
    withDropdownInput,
    inputPlaceholder,
    searchValue,
    showSelectAll,
    selectAllCheckedState,
    virtualFocusId,
    noDataText,
    noMatchesText,
    dropdownHeight,
    showFooter,
    overscan,
    isVirtualized,
    components,
    componentDisabled,
    inputRef,
    onInputChange,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    onLastItemReached,
    onMount,
    onUnmount
  } = props;

  const virtualizedListRef = useRef<VirtualizedListHandle>(null);

  const withInput = withDropdownInput && isSearchable;
  const topItemCount = (showSelectAll ? 1 : 0) + (withInput ? 1 : 0);
  const displayedItemCount = (displayedNodes.length || 1) + topItemCount + (showFooter ? 1 : 0);

  useEffect(() => {
    onMount();
    return () => onUnmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVirtualFocusInDropdown(virtualFocusId) && virtualizedListRef.current && displayedNodes.length) {
      let elementIndex = -1;
      if (virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX)) {
        elementIndex = 0;
      } else if (virtualFocusId === buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX)) {
        elementIndex = displayedNodes.length + (showSelectAll ? 1 : 0) + (withInput ? 1 : 0);
      } else {
        const node = nodeMap.get(extractElementId(virtualFocusId));
        if (node) {
          elementIndex = displayedNodes.indexOf(node) + (showSelectAll ? 1 : 0) + (withInput ? 1 : 0);
        }
      }
      if (elementIndex >= 0) {
        virtualizedListRef.current.scrollIntoView(elementIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualFocusId, showSelectAll, withInput]);

  const renderItem = (index: number): JSX.Element => {
    return (
      <ListItem
        type={type}
        index={index}
        nodesAmount={nodesAmount}
        displayedNodes={displayedNodes}
        selectedNodes={selectedNodes}
        displayedItemCount={displayedItemCount}
        isAnyHasChildren={isAnyHasChildren}
        searchValue={searchValue}
        showSelectAll={showSelectAll}
        selectAllCheckedState={selectAllCheckedState}
        virtualFocusId={virtualFocusId}
        noDataText={noDataText}
        noMatchesText={noMatchesText}
        showFooter={showFooter}
        onSelectAllChange={onSelectAllChange}
        onNodeChange={onNodeChange}
        onNodeToggle={onNodeToggle}
        onFooterClick={onFooterClick}
        input={withInput ? (
          <InputWrapper
            input={components.Input}
            inputRef={inputRef}
            placeholder={inputPlaceholder}
            value={searchValue}
            onChange={onInputChange}
            componentDisabled={componentDisabled}
            region={DROPDOWN_PREFIX}
          />
        ) : null}
        components={components}
      />
    );
  };

  return (
    <components.Dropdown.component
      attributes={{className: `rtms-dropdown${componentDisabled ? ' disabled' : ''}`}}
      ownProps={{componentDisabled}}
      customProps={components.Dropdown.props}
    >
      <VirtualizedList
        ref={virtualizedListRef}
        height={dropdownHeight}
        totalCount={displayedItemCount}
        topItemCount={topItemCount}
        renderItem={renderItem}
        onLastItemReached={onLastItemReached}
        overscan={overscan}
        isVirtualized={isVirtualized}
      />
    </components.Dropdown.component>
  );
});
