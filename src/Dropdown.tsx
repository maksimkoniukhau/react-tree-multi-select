import React, {FC, JSX, memo, ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CalculateViewLocation, StateSnapshot, Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {DEFAULT_OPTIONS_CONTAINER_WIDTH, FOOTER, SELECT_ALL} from './constants';
import {CheckedState, Type} from './types';
import {InnerComponents} from './innerTypes';
import {Node} from './Node';
import {ListItem} from './ListItem';

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
  noMatchesText: string;
  dropdownHeight: number;
  showFooter: boolean;
  onSelectAllChange: (e: React.MouseEvent) => void;
  onNodeChange: (node: Node) => (e: React.MouseEvent) => void;
  onNodeToggle: (node: Node) => (e: React.MouseEvent) => void;
  onFooterClick: (e: React.MouseEvent) => void;
  input: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  onUnmount: () => void;
  components: InnerComponents;
  onListItemRender: () => void;
}


export const Dropdown: FC<DropdownProps> = memo((props) => {

  const {
    type,
    nodeMap = new Map(),
    nodesAmount,
    displayedNodes,
    isAnyHasChildren,
    searchValue,
    showSelectAll,
    selectAllCheckedState,
    focusedElement,
    noMatchesText,
    dropdownHeight,
    showFooter,
    onSelectAllChange,
    onNodeChange,
    onNodeToggle,
    onFooterClick,
    input,
    inputRef,
    onUnmount,
    components,
    onListItemRender
  } = props;

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [height, setHeight] = useState<number>(dropdownHeight);

  const topItemCount = (showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0);
  const itemCount = (displayedNodes.length || 1) + topItemCount;
  const footerFocused = focusedElement === FOOTER;

  const calculateViewLocation: CalculateViewLocation = (params) => {
    const {
      itemTop,
      itemBottom,
      viewportTop,
      viewportBottom,
      locationParams: {behavior, align, ...rest},
    } = params;

    let topElmSize = 0;
    if (showSelectAll || Boolean(input)) {
      virtuosoRef.current?.getState((state: StateSnapshot) => {
        topElmSize = topElmSize + (state?.ranges
          ?.find(range => range.startIndex === 0)
          ?.size || 0);
        if (showSelectAll && Boolean(input)) {
          topElmSize = topElmSize + (state?.ranges
            ?.find(range => range.startIndex === 1)
            ?.size || 0);
        }
      });
    }

    if (itemTop - topElmSize < viewportTop) {
      return {...rest, behavior, align: align ?? 'start'};
    }

    if (itemBottom > viewportBottom) {
      return {...rest, behavior, align: align ?? 'end'};
    }

    return null;
  };

  useEffect(() => {
    return () => onUnmount();
  }, []);

  useEffect(() => {
    if (focusedElement && virtuosoRef.current && displayedNodes.length) {
      let elementIndex: number;
      if (focusedElement === SELECT_ALL) {
        elementIndex = 0;
      } else if (focusedElement === FOOTER) {
        elementIndex = displayedNodes.length - 1 + (showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0);
      } else {
        elementIndex = displayedNodes.indexOf(nodeMap.get(focusedElement)) + (showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0);
      }
      if (elementIndex >= 0) {
        virtuosoRef.current.scrollIntoView?.({
          index: elementIndex,
          calculateViewLocation
        });
      }
    }
  }, [focusedElement, showSelectAll, input]);

  const handleTotalListHeightChanged = useCallback((height: number): void => {
    setHeight(Math.min(dropdownHeight, height));
  }, [dropdownHeight]);

  const itemContent = (index: number): JSX.Element => {
    return <ListItem
      type={type}
      index={index}
      nodesAmount={nodesAmount}
      displayedNodes={displayedNodes}
      isAnyHasChildren={isAnyHasChildren}
      searchValue={searchValue}
      showSelectAll={showSelectAll}
      selectAllCheckedState={selectAllCheckedState}
      focusedElement={focusedElement}
      noMatchesText={noMatchesText}
      onSelectAllChange={onSelectAllChange}
      onNodeChange={onNodeChange}
      onNodeToggle={onNodeToggle}
      input={input}
      components={components}
      onRender={onListItemRender}
    />
  };

  const handleMouseDown = (event: React.MouseEvent): void => {
    if (event.target !== inputRef?.current) {
      // needed for staying focus on input
      event.preventDefault();
    }
  };

  const Footer: FC = useCallback(() => {
    return (
      <components.Footer.component
        componentAttributes={{className: `rtms-footer${footerFocused ? ' focused' : ''}`, onClick: onFooterClick}}
        componentProps={{focused: footerFocused}}
        customProps={components.Footer.props}
      />
    );
  }, [components.Footer, footerFocused, onFooterClick]);

  const virtuosoComponents = useMemo(() => (
    showFooter ? {Footer} : {}
  ), [showFooter, Footer]);

  return (
    <div className="rtms-dropdown" onMouseDown={handleMouseDown}>
      <Virtuoso
        ref={virtuosoRef}
        style={{height: `${height}px`, width: DEFAULT_OPTIONS_CONTAINER_WIDTH}}
        className="rtms-dropdown-virtuoso"
        totalListHeightChanged={handleTotalListHeightChanged}
        totalCount={itemCount}
        topItemCount={topItemCount}
        itemContent={itemContent}
        components={virtuosoComponents}
      />
    </div>
  );
});
