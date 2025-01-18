import React, {FC, JSX, memo, ReactNode, useEffect, useRef, useState} from 'react';
import {CalculateViewLocation, StateSnapshot, Virtuoso, VirtuosoHandle} from 'react-virtuoso'
import {DEFAULT_OPTIONS_CONTAINER_HEIGHT, DEFAULT_OPTIONS_CONTAINER_WIDTH, SELECT_ALL} from './constants';
import {preventDefaultOnMouseEvent} from './utils';
import {CheckedState, InnerComponents, Type} from './models';
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
  onChangeSelectAll: (e: React.MouseEvent) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent) => void;
  input: ReactNode;
  onUnmount: () => void;
  components: InnerComponents;
}


export const Dropdown: FC<DropdownProps> = memo((props) => {

  const {
    type,
    nodeMap = new Map(),
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
    onClickExpandNode,
    input,
    onUnmount,
    components,
  } = props;

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [height, setHeight] = useState<number>(DEFAULT_OPTIONS_CONTAINER_HEIGHT);

  const itemCount = (displayedNodes.length || 1) + (showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0);

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
      const elementIndex = focusedElement === SELECT_ALL
        ? 0
        : displayedNodes.indexOf(nodeMap?.get(focusedElement)) + (showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0);
      if (elementIndex >= 0) {
        virtuosoRef.current.scrollIntoView({
          index: elementIndex,
          calculateViewLocation
        });
      }
    }
  }, [focusedElement, showSelectAll, input]);

  const handleTotalListHeightChanged = (height: number): void => {
    setHeight(Math.min(DEFAULT_OPTIONS_CONTAINER_HEIGHT, height));
  };

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
      onChangeSelectAll={onChangeSelectAll}
      onToggleNode={onToggleNode}
      onClickExpandNode={onClickExpandNode}
      input={input}
      components={components}
    />
  };

  return (
    <div
      className="rts-dropdown"
      // needed for staying focus on input
      onMouseDown={preventDefaultOnMouseEvent}
    >
      <Virtuoso
        ref={virtuosoRef}
        style={{height: `${height}px`, width: DEFAULT_OPTIONS_CONTAINER_WIDTH, borderRadius: '4px'}}
        className="rts-dropdown-virtuoso"
        totalListHeightChanged={handleTotalListHeightChanged}
        totalCount={itemCount}
        topItemCount={(showSelectAll ? 1 : 0) + (Boolean(input) ? 1 : 0)}
        itemContent={itemContent}
      />
    </div>
  );
});
