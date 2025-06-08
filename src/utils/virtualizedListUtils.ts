import {ItemPosition} from '../VirtualizedList';

export const binarySearchStartIndex = (positions: ItemPosition[], scrollTop: number): number => {
  let low = 0;
  let high = positions.length - 1;
  let result = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const {top, height} = positions[mid];

    if (top + height >= scrollTop) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return result;
};
