import React, {FC, useEffect, useRef, useState} from 'react';
import {CalculateViewLocation, StateSnapshot, Virtuoso, VirtuosoHandle} from 'react-virtuoso'

import {DEFAULT_OPTIONS_CONTAINER_HEIGHT, DEFAULT_OPTIONS_CONTAINER_WIDTH, NO_OPTIONS, SELECT_ALL} from './constants';
import {preventDefaultOnMouseEvent} from './utils';
import {SelectAllCheckedState} from './models';
import {Node} from './Node';
import {NodeRow} from './NodeRow';
import {SelectAll} from './SelectAll';
import {NoOptions} from './NoOptions';

export interface DropdownProps {
  nodeMap: Map<string, Node>;
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


export const Dropdown: FC<DropdownProps> = (props) => {

  const {
    nodeMap = new Map(),
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

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [height, setHeight] = useState<number>(DEFAULT_OPTIONS_CONTAINER_HEIGHT);

  const itemCount = (displayedNodes.length || 1) + (withSelectAll ? 1 : 0);

  const defaultCalculateViewLocation: CalculateViewLocation = (params) => {
    const {
      itemTop,
      itemBottom,
      viewportTop,
      viewportBottom,
      locationParams: {behavior, align, ...rest},
    } = params;

    let topElmSize = 0;
    if (withSelectAll) {
      virtuosoRef.current.getState((state: StateSnapshot) => {
        topElmSize = state?.ranges
          ?.find(range => range.startIndex === 0)
          ?.size;
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
        : displayedNodes.indexOf(nodeMap?.get(focusedElement)) + (withSelectAll ? 1 : 0);
      if (elementIndex >= 0) {
        virtuosoRef.current.scrollIntoView({
          index: elementIndex,
          calculateViewLocation: defaultCalculateViewLocation
        });
      }
    }
  }, [focusedElement]);

  const getDisplayedNode = (index: number): Node => {
    return displayedNodes[index];
  };

  const handleTotalListHeightChanged = (height: number): void => {
    setHeight(Math.min(DEFAULT_OPTIONS_CONTAINER_HEIGHT, height));
  };

  const renderNode = (index: number): JSX.Element => {
    if (displayedNodes.length === 0) {
      return (
        <NoOptions label={NO_OPTIONS}/>
      );
    }
    const nodeIndex = withSelectAll && nodesAmount > 0 ? index - 1 : index;
    const node = getDisplayedNode(nodeIndex);
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

  const Row = (index: number) => (
    withSelectAll && index === 0 ? (
      <SelectAll
        label={SELECT_ALL}
        checkedState={selectAllCheckedState}
        focused={focusedElement === SELECT_ALL}
        onChange={onChangeSelectAll}
      />
    ) : renderNode(index)
  );

  return (
    <div
      className="rts-dropdown"
      // needed for staying focus on input
      onMouseDown={preventDefaultOnMouseEvent}
    >
      <Virtuoso
        ref={virtuosoRef}
        style={{height: `${height}px`, width: DEFAULT_OPTIONS_CONTAINER_WIDTH}}
        totalListHeightChanged={handleTotalListHeightChanged}
        totalCount={itemCount}
        topItemCount={withSelectAll ? 1 : 0}
        itemContent={Row}
      />
    </div>
  );
};
