import React, {CSSProperties, FC, ReactNode, UIEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DEFAULT_OPTIONS_CONTAINER_WIDTH} from './constants';

interface ItemPosition {
  top: number;
  height: number;
}

interface ItemProps {
  index: number;
  top: number;
  updateHeight: (index: number, height: number) => void;
  children: ReactNode;
  isSticky?: boolean;
}

const Item: FC<ItemProps> = (props) => {

  const {index, top, updateHeight, children, isSticky} = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const measuredHeight = ref.current.offsetHeight;
      updateHeight(index, measuredHeight);
    }
  }, [index, updateHeight]);


  const commonStyle = {top, width: '100%'};
  const style: CSSProperties = isSticky
    ? {...commonStyle, position: 'sticky', zIndex: 1}
    : {...commonStyle, position: 'absolute'};

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

interface VirtualizedListProps {
  height: number;
  totalCount: number;
  topItemCount: number;
  renderItem: (index: number) => ReactNode;
  estimatedItemHeight?: number;
  overscan?: number;
}

export const VirtualizedList: FC<VirtualizedListProps> = (props) => {

  const {height: propHeight, totalCount, topItemCount, renderItem, estimatedItemHeight = 20, overscan = 2} = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number>(propHeight);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map<number, number>());

  const totalHeight = useMemo((): number => {
    return Array.from({length: totalCount}).reduce((sum: number, _, index: number): number => {
      return sum + (itemHeights.get(index) || estimatedItemHeight);
    }, 0);
  }, [totalCount, itemHeights, estimatedItemHeight]);

  useEffect(() => {
    setHeight(Math.min(propHeight, totalHeight));
  }, [totalHeight, propHeight]);

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

  const startIndex = useMemo((): number => {
    let startIdx = positions.findIndex((pos: ItemPosition) => pos.top + pos.height >= scrollTop);
    if (startIdx < 0) {
      startIdx = 0;
    }
    if (topItemCount > 0) {
      startIdx = startIdx + topItemCount;
    }
    return startIdx
  }, [topItemCount, positions, scrollTop]);

  const endIndex = useMemo((): number => {
    let endIdx = startIndex;
    let visibleHeight = 0;
    while (endIdx < positions.length && visibleHeight < height + overscan * estimatedItemHeight) {
      visibleHeight += positions[endIdx].height;
      endIdx++;
    }
    return endIdx;
  }, [height, overscan, estimatedItemHeight, positions, startIndex]);

  const updateHeight = useCallback((index: number, height: number): void => {
    setItemHeights((prev: Map<number, number>) => {
      if (prev.get(index) === height) {
        return prev;
      }
      const newMap = new Map<number, number>(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{height, width: DEFAULT_OPTIONS_CONTAINER_WIDTH, overflowY: 'auto', position: 'relative'}}
      onScroll={handleScroll}
    >
      <div ref={ref} style={{height: totalHeight, position: 'relative'}}>
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
        {positions.slice(startIndex, endIndex).map((pos: ItemPosition, idx: number) => {
          const index = startIndex + idx;
          return (
            <Item
              key={index}
              index={index}
              top={pos.top}
              updateHeight={updateHeight}
            >
              {renderItem(index)}
            </Item>
          );
        })}
      </div>
    </div>
  );
};
