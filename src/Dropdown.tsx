import React, {FC, JSX, useEffect, useRef, useState} from 'react';
import {CalculateViewLocation, StateSnapshot, Virtuoso, VirtuosoHandle} from 'react-virtuoso'

import {DEFAULT_OPTIONS_CONTAINER_HEIGHT, DEFAULT_OPTIONS_CONTAINER_WIDTH, SELECT_ALL} from './constants';
import {preventDefaultOnMouseEvent} from './utils';
import {CheckedState} from './models';
import {Node} from './Node';
import {ListItem} from './ListItem';

export interface DropdownProps {
  nodeMap: Map<string, Node>;
  nodesAmount: number;
  displayedNodes: Node[];
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  focusedElement: string;
  noMatchesText: string;
  onChangeSelectAll: (e: React.MouseEvent<Element>) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent<Element>) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent<Element>) => void;
}


export const Dropdown: FC<DropdownProps> = (props) => {

  const {
    nodeMap = new Map(),
    nodesAmount = 0,
    displayedNodes = [],
    searchValue = '',
    showSelectAll = false,
    selectAllCheckedState = CheckedState.UNSELECTED,
    focusedElement = '',
    noMatchesText,
    onChangeSelectAll,
    onToggleNode,
    onClickExpandNode
  } = props;

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [height, setHeight] = useState<number>(DEFAULT_OPTIONS_CONTAINER_HEIGHT);

  const itemCount = (displayedNodes.length || 1) + (showSelectAll ? 1 : 0);

  const calculateViewLocation: CalculateViewLocation = (params) => {
    const {
      itemTop,
      itemBottom,
      viewportTop,
      viewportBottom,
      locationParams: {behavior, align, ...rest},
    } = params;

    let topElmSize = 0;
    if (showSelectAll) {
      virtuosoRef.current?.getState((state: StateSnapshot) => {
        topElmSize = state?.ranges
          ?.find(range => range.startIndex === 0)
          ?.size || 0;
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
    if (focusedElement && virtuosoRef.current && displayedNodes.length) {
      const elementIndex = focusedElement === SELECT_ALL
        ? 0
        : displayedNodes.indexOf(nodeMap?.get(focusedElement)) + (showSelectAll ? 1 : 0);
      if (elementIndex >= 0) {
        virtuosoRef.current.scrollIntoView({
          index: elementIndex,
          calculateViewLocation
        });
      }
    }
  }, [focusedElement, showSelectAll]);

  const handleTotalListHeightChanged = (height: number): void => {
    setHeight(Math.min(DEFAULT_OPTIONS_CONTAINER_HEIGHT, height));
  };

  const itemContent = (index: number): JSX.Element => {
    return <ListItem
      index={index}
      nodesAmount={nodesAmount}
      displayedNodes={displayedNodes}
      searchValue={searchValue}
      showSelectAll={showSelectAll}
      selectAllCheckedState={selectAllCheckedState}
      focusedElement={focusedElement}
      noMatchesText={noMatchesText}
      onChangeSelectAll={onChangeSelectAll}
      onToggleNode={onToggleNode}
      onClickExpandNode={onClickExpandNode}
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
        totalListHeightChanged={handleTotalListHeightChanged}
        totalCount={itemCount}
        topItemCount={showSelectAll ? 1 : 0}
        itemContent={itemContent}
      />
    </div>
  );
};
