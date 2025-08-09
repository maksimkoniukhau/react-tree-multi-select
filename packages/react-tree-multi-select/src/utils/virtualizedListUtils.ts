import {ItemPosition} from '../VirtualizedList';

export const binarySearchStartIndex = (positions: ItemPosition[], scrollTop: number): number => {
  let low = 0;
  let high = positions.length - 1;
  let result = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const {top, height} = positions[mid];

    if (top + height > scrollTop) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return result;
};

export interface ItemScrollMetrics {
  clientHeight: number;
  itemHeight: number;
  itemTop: number;
  itemBottom: number;
  scrollTop: number;
  scrollBottom: number;
  topItemsHeight: number;
}

export const calculateItemScrollMetrics = (
  index: number, outerElement: HTMLDivElement, positions: ItemPosition[], scrollTop: number, topItemCount: number
): ItemScrollMetrics => {
  const clientHeight = outerElement.clientHeight;
  const itemHeight = positions[index].height;
  const itemTop = positions[index].top;
  const itemBottom = itemTop + itemHeight;
  const scrollBottom = scrollTop + clientHeight;
  const topItemsHeight = topItemCount > 0
    ? Array.from({length: topItemCount})
      .reduce((sum: number, _, index: number): number => {
        return sum + positions[index].height;
      }, 0)
    : 0;

  return {clientHeight, itemHeight, itemTop, itemBottom, scrollTop, scrollBottom, topItemsHeight};
};

export const isItemOutsideViewport = (scrollData: ItemScrollMetrics): boolean => {
  return scrollData.itemBottom > scrollData.scrollBottom
    || (scrollData.scrollTop !== 0 && (scrollData.itemTop - scrollData.topItemsHeight < scrollData.scrollTop))
};

export const computeScrollTopForItem = (scrollData: ItemScrollMetrics): number => {
  let top: number;
  if (scrollData.itemBottom >= scrollData.scrollBottom) {
    top = scrollData.itemBottom - scrollData.clientHeight;
  } else {
    top = scrollData.itemTop - scrollData.topItemsHeight;
  }
  return top < 0 ? 0 : top;
};
