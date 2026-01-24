import {screen} from '@testing-library/react';
import {SelectionAggregateState} from '../../index';
import {getChipContainers, getDropdown, getListItems, getStickyItem} from './selectorUtils';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

export const noDataTextMatcher = (container: HTMLElement, noDataText: string, isPresent: boolean): void => {
  if (isPresent) {
    expect(getDropdown(container)).toBeInTheDocument();
    expect(getListItems(container).length).not.toBeGreaterThan(0);
    expect(screen.queryByText(noDataText)).toBeInTheDocument();
  } else {
    expect(getDropdown(container)).toBeInTheDocument();
    expect(getListItems(container).length).toBeGreaterThan(0);
    expect(screen.queryByText(noDataText)).not.toBeInTheDocument();
  }
};

export const isDropdownOpenMatcher = (
  container: HTMLElement,
  isDropdownOpen: boolean,
  handleDropdownToggle: jest.Mock,
  handleDropdownTogglePayload: boolean | null
): void => {
  if (isDropdownOpen) {
    expect(getDropdown(container)).toBeInTheDocument();
  } else {
    expect(getDropdown(container)).not.toBeInTheDocument();
  }
  if (handleDropdownTogglePayload != null) {
    expect(handleDropdownToggle).toHaveBeenCalledWith(handleDropdownTogglePayload);
  } else {
    expect(handleDropdownToggle).not.toHaveBeenCalled();
  }
  handleDropdownToggle.mockClear();
};

export const isDropdownOpenFullMatcher = (
  container: HTMLElement,
  isDropdownOpenExpected: boolean,
  isDropdownOpenActual: boolean,
  handleDropdownToggle: jest.Mock,
  handleDropdownTogglePayload: boolean | null
): void => {
  expect(isDropdownOpenActual).toEqual(isDropdownOpenExpected);
  isDropdownOpenMatcher(container, isDropdownOpenExpected, handleDropdownToggle, handleDropdownTogglePayload);
};

export const selectAllMatcher = (
  container: HTMLElement,
  selectionAggregateState: SelectionAggregateState,
  chipsCount: number,
  selectedNodesCount: number,
  handleSelectAllChange?: jest.Mock
): void => {
  const selectAll = getStickyItem(container, 0);
  expect(selectAll).toBeInTheDocument();
  switch (selectionAggregateState) {
    case SelectionAggregateState.ALL:
      expect(selectAll.classList.contains('selected')).toBeTruthy();
      break;
    case SelectionAggregateState.EFFECTIVE_ALL:
    case SelectionAggregateState.PARTIAL:
      expect(selectAll.classList.contains('partial')).toBeTruthy();
      break;
    default:
      expect(selectAll.classList.contains('selected')).toBeFalsy();
      expect(selectAll.classList.contains('partial')).toBeFalsy();
  }
  expect(getChipContainers(container).length).toBe(chipsCount);
  const selectedNodes = getListItems(container).filter(el => el.classList.contains('selected'));
  expect(selectedNodes.length).toBe(selectedNodesCount);
  if (handleSelectAllChange) {
    expect(handleSelectAllChange).toHaveBeenCalledTimes(1);
    handleSelectAllChange.mockClear();
  }
};

export const selectAllFullMatcher = (
  container: HTMLElement,
  selectionAggregateStateExpected: SelectionAggregateState,
  selectionAggregateStateActual: SelectionAggregateState,
  chipsCount: number,
  selectedNodesCount: number,
  handleSelectAllChange?: jest.Mock
): void => {
  expect(selectionAggregateStateActual).toEqual(selectionAggregateStateExpected);
  selectAllMatcher(container, selectionAggregateStateExpected, chipsCount, selectedNodesCount, handleSelectAllChange);
};

export const selectionMatcher = (
  selectedIdsExpected: string[],
  selectedIdsActual: string[],
  handleNodeChange: jest.Mock,
  handleNodeChangeCallCount: number
): void => {
  expect(arraysEqual(selectedIdsExpected, selectedIdsActual)).toBeTruthy();
  if (handleNodeChangeCallCount === 0) {
    expect(handleNodeChange).not.toHaveBeenCalled();
  } else {
    expect(handleNodeChange).toHaveBeenCalledTimes(handleNodeChangeCallCount);
    handleNodeChange.mockClear();
  }
};

export const expansionMatcher = (
  expandedIdsExpected: string[],
  expandedIdsActual: string[],
  handleNodeToggle: jest.Mock,
  handleNodeToggleCallCount: number
): void => {
  expect(arraysEqual(expandedIdsExpected, expandedIdsActual)).toBeTruthy();
  if (handleNodeToggleCallCount === 0) {
    expect(handleNodeToggle).not.toHaveBeenCalled();
  } else {
    expect(handleNodeToggle).toHaveBeenCalledTimes(handleNodeToggleCallCount);
    handleNodeToggle.mockClear();
  }
};
