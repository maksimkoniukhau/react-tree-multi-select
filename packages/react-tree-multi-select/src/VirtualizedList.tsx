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
import {useItemsResizeObserver} from './hooks/useItemsResizeObserver';
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
  observeItem: (element: HTMLElement | null, index: number) => void;
  unobserveItem: (element: HTMLElement | null) => void;
  children: ReactNode;
  isSticky?: boolean;
  isVirtualized?: boolean;
}

const Item: FC<ItemProps> = (props) => {

  const {index, top, observeItem, unobserveItem, children, isSticky, isVirtualized} = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    observeItem(element, index);

    return () => unobserveItem(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style: CSSProperties = {
    ...(isSticky && {top, position: 'sticky', zIndex: 1}),
    ...(isVirtualized && {top, position: 'absolute'})
  };

  return (
    <div ref={ref} style={style} className="rtms-list-item-container">
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
    setPendingScrollIndex(null);
  }, [totalCount, topItemCount]);

  const totalHeight = useMemo((): number => {
    return Array.from({length: totalCount}).reduce((sum: number, _, index: number): number => {
      return sum + (itemHeights.get(index) || estimatedItemHeight);
    }, 0);
  }, [totalCount, itemHeights, estimatedItemHeight]);

  const height = Math.min(propHeight, totalHeight);

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

  const updateHeight = useCallback((index: number, size: { width: number; height: number }): void => {
    setItemHeights((prev: Map<number, number>) => {
      if (prev.get(index) === size.height) {
        return prev;
      }
      const newMap = new Map<number, number>(prev);
      if (index === topItemCount) {
        Array.from({length: totalCount - topItemCount}, (_, i) => i + topItemCount)
          .forEach(idx => newMap.set(idx, size.height));
      } else {
        newMap.set(index, size.height);
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

  const {observeItem, unobserveItem} = useItemsResizeObserver(updateHeight);

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
            observeItem={observeItem}
            unobserveItem={unobserveItem}
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
              observeItem={observeItem}
              unobserveItem={unobserveItem}
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
