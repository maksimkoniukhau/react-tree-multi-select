import React, {
  CSSProperties,
  FC,
  forwardRef,
  ReactNode,
  UIEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {useResizeObserver} from './hooks/useResizeObserver';
import {
  binarySearchStartIndex,
  calculateItemScrollMetrics,
  computeScrollTopForItem,
  isItemOutsideViewport
} from './utils/virtualizedListUtils';

export interface ItemPosition {
  top: number;
  height: number;
}

interface ItemProps {
  index: number;
  top: number;
  updateHeight: (index: number, height: number) => void;
  children: ReactNode;
  isSticky?: boolean;
  isVirtualized?: boolean;
}

const Item: FC<ItemProps> = (props) => {

  const {index, top, updateHeight, children, isSticky, isVirtualized} = props;

  const ref = useRef<HTMLDivElement>(null);

  const updateHeightCallback = useCallback((size: { width: number; height: number }): void => {
    if (size.height === 0 && size.width === 0) {
      return;
    }
    updateHeight(index, size.height);
  }, [index, updateHeight]);

  useResizeObserver(ref.current, updateHeightCallback);

  const style: CSSProperties = {
    width: '100%',
    ...(isSticky && {top, position: 'sticky', zIndex: 1}),
    ...(isVirtualized && {top, position: 'absolute'})
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export interface VirtualizedListHandle {
  scrollIntoView: (index: number) => void;
}

export interface VirtualizedListProps {
  height: number;
  totalCount: number;
  topItemCount: number;
  renderItem: (index: number) => ReactNode;
  onLastItemReached: () => void;
  overscan: number;
  isVirtualized: boolean;
  estimatedItemHeight?: number;
}

export const VirtualizedList = forwardRef<VirtualizedListHandle, VirtualizedListProps>((props, ref) => {
  const {
    height: propHeight,
    totalCount,
    topItemCount,
    renderItem,
    onLastItemReached,
    overscan: propOverscan,
    isVirtualized,
    estimatedItemHeight = 25
  } = props;

  const overscan = propOverscan > 0 ? propOverscan : 0;

  const outerRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map<number, number>());
  const [pendingScrollIndex, setPendingScrollIndex] = useState<number | null>(null);

  useEffect(() => {
    setItemHeights(new Map<number, number>());
    setPendingScrollIndex(null);
  }, [totalCount, topItemCount]);

  const totalHeight = useMemo((): number => {
    return Array.from({length: totalCount}).reduce((sum: number, _, index: number): number => {
      return sum + (itemHeights.get(index) || estimatedItemHeight);
    }, 0);
  }, [totalCount, itemHeights, estimatedItemHeight]);

  const height = useMemo(() => {
    return Math.min(outerRef.current?.clientHeight || propHeight, totalHeight);
  }, [propHeight, totalHeight]);

  const positions = useMemo((): ItemPosition[] => {
    const positions: ItemPosition[] = [];
    let offset = 0;
    for (let i = 0; i < totalCount; i++) {
      const height = itemHeights.get(i) || estimatedItemHeight;
      positions[i] = {top: offset, height};
      offset += height;
    }
    return positions;
  }, [totalCount, itemHeights, estimatedItemHeight]);

  const topItemsHeight = useMemo(() => {
    return positions.slice(0, topItemCount)
      .reduce((sum: number, position: ItemPosition): number => sum + position.height, 0);
  }, [topItemCount, positions]);

  const scrollTopWithTopItemsHeight = scrollTop + topItemsHeight;

  const startIndex = useMemo((): number => {
    return binarySearchStartIndex(positions, scrollTopWithTopItemsHeight);
  }, [positions, scrollTopWithTopItemsHeight]);

  const endIndex = useMemo((): number => {
    let endIdx = startIndex;
    let visibleHeight = 0;
    while (endIdx < positions.length && visibleHeight < height - topItemsHeight) {
      visibleHeight = positions[endIdx].top + positions[endIdx].height - scrollTopWithTopItemsHeight;
      endIdx++;
    }
    return endIdx;
  }, [height, positions, startIndex, topItemsHeight, scrollTopWithTopItemsHeight]);

  const overscanStartIndex = Math.max(topItemCount, startIndex - overscan);
  const overscanEndIndex = Math.min(totalCount, endIndex + overscan);

  const start = isVirtualized ? overscanStartIndex : topItemCount;
  const end = isVirtualized ? overscanEndIndex : positions.length;

  const updateHeight = useCallback((index: number, height: number): void => {
    setItemHeights((prev: Map<number, number>) => {
      if (prev.get(index) === height) {
        return prev;
      }
      const newMap = new Map<number, number>(prev);
      if (index === topItemCount) {
        Array.from({length: totalCount - topItemCount}, (_, i) => i + topItemCount)
          .forEach(index => newMap.set(index, height));
      } else {
        newMap.set(index, height);
      }
      return newMap;
    });
  }, [totalCount, topItemCount]);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const scrollIntoView = useCallback((index: number) => {
    if (!outerRef.current) {
      return;
    }
    const itemScrollMetrics = calculateItemScrollMetrics(index, outerRef.current, positions, scrollTop, topItemCount);
    if (isItemOutsideViewport(itemScrollMetrics)) {
      setPendingScrollIndex(index);
      outerRef.current.scrollTo({top: computeScrollTopForItem(itemScrollMetrics), behavior: 'instant'});
    } else {
      setPendingScrollIndex(null);
    }
  }, [topItemCount, positions, scrollTop]);

  useImperativeHandle(ref, (): VirtualizedListHandle => ({scrollIntoView}));

  useEffect(() => {
    if (pendingScrollIndex !== null && outerRef.current) {
      const itemScrollMetrics = calculateItemScrollMetrics(pendingScrollIndex, outerRef.current, positions, scrollTop, topItemCount);
      if (isItemOutsideViewport(itemScrollMetrics)) {
        outerRef.current.scrollTo({top: computeScrollTopForItem(itemScrollMetrics), behavior: 'instant'});
      } else {
        setPendingScrollIndex(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemHeights]);

  useEffect(() => {
    if (overscanEndIndex === totalCount) {
      onLastItemReached?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overscanEndIndex, totalCount]);

  return (
    <div
      tabIndex={-1}
      ref={outerRef}
      className="rtms-list-outer"
      onScroll={handleScroll}
    >
      <div style={{height: totalHeight}} className="rtms-list-inner">
        {Array.from({length: topItemCount}).map((_, index: number) => (
          <Item
            key={index}
            index={index}
            top={positions[index].top}
            updateHeight={updateHeight}
            isSticky
          >
            {renderItem(index)}
          </Item>
        ))}
        {positions.slice(start, end).map((pos: ItemPosition, idx: number) => {
          const index = start + idx;
          return (
            <Item
              key={index}
              index={index}
              top={pos.top}
              updateHeight={updateHeight}
              isVirtualized={isVirtualized}
            >
              {renderItem(index)}
            </Item>
          );
        })}
      </div>
    </div>
  );
});
