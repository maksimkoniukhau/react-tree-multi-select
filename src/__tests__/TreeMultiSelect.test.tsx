import '@testing-library/jest-dom';

import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent, {UserEvent} from '@testing-library/user-event';
import {CheckedState, TreeMultiSelect, TreeNode, Type} from '../index';
import {getBaseTreeNodeData, getTreeNodeData} from './testutils/dataUtils';
import {
  getChipClear,
  getChipClears,
  getChipContainer,
  getChipContainers,
  getChipLabel,
  getDropdown,
  getDropdownInput,
  getDropdownListOuter,
  getField,
  getFieldClear,
  getFieldInput,
  getFieldToggle,
  getHiddenInput,
  getListItem,
  getListItems,
  getNodeToggle,
  getRootContainer,
  getStickyItem,
  getStickyItems
} from './testutils/selectorUtils';
import {NO_DATA, NO_MATCHES} from '../constants';

const treeNodeData = getBaseTreeNodeData();

describe('TreeMultiSelect component: base', () => {
  it('renders component', () => {
    render(<TreeMultiSelect data={treeNodeData}/>);

    const chip = screen.getByText(/Angular/i);
    expect(chip).toBeInTheDocument();
  });
});

describe('TreeMultiSelect component: noDataText, noMatchesText props', () => {
  const noMatchesTextMatcher = (
    container: HTMLElement,
    noMatchesText: string,
    isPresent: boolean,
  ): void => {
    if (isPresent) {
      expect(getDropdown(container)).toBeInTheDocument();
      expect(getListItems(container).length).not.toBeGreaterThan(0);
      expect(screen.queryByText(noMatchesText)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).toBeInTheDocument();
      expect(getListItems(container).length).toBeGreaterThan(0);
      expect(screen.queryByText(noMatchesText)).not.toBeInTheDocument();
    }
  };

  it('tests component with default noDataText', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={[]}/>
    );

    await user.click(getField(container));
    noMatchesTextMatcher(container, NO_DATA, true);

    await user.keyboard('qwerty');
    noMatchesTextMatcher(container, NO_DATA, true);

    await user.keyboard('{Control>}a{Backspace}');
    noMatchesTextMatcher(container, NO_DATA, true);

    await user.keyboard('java');
    noMatchesTextMatcher(container, NO_DATA, true);
  });

  it.each([['no options'], ['no items']])('tests component when noDataText={%s}',
    async (noDataText) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect data={[]} noDataText={noDataText}/>
      );

      await user.click(getField(container));
      noMatchesTextMatcher(container, noDataText, true);

      await user.keyboard('qwerty');
      noMatchesTextMatcher(container, noDataText, true);

      await user.keyboard('{Control>}a{Backspace}');
      noMatchesTextMatcher(container, noDataText, true);

      await user.keyboard('java');
      noMatchesTextMatcher(container, noDataText, true);
    });

  it('tests component with default noMatchesText', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={treeNodeData}/>
    );

    await user.click(getField(container));
    noMatchesTextMatcher(container, NO_MATCHES, false);

    await user.keyboard('qwerty');
    noMatchesTextMatcher(container, NO_MATCHES, true);

    await user.keyboard('{Control>}a{Backspace}');
    noMatchesTextMatcher(container, NO_MATCHES, false);

    await user.keyboard('java');
    noMatchesTextMatcher(container, NO_MATCHES, false);
  });

  it.each([['not found'], ['no items found']])('tests component when noMatchesText={%s}',
    async (noMatchesText) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect data={treeNodeData} noMatchesText={noMatchesText}/>
      );

      await user.click(getField(container));
      noMatchesTextMatcher(container, noMatchesText, false);

      await user.keyboard('qwerty');
      noMatchesTextMatcher(container, noMatchesText, true);

      await user.keyboard('{Control>}a{Backspace}');
      noMatchesTextMatcher(container, noMatchesText, false);

      await user.keyboard('java');
      noMatchesTextMatcher(container, noMatchesText, false);
    });
});

describe('TreeMultiSelect component: isDisabled prop', () => {
  const isDisabledMatcher = (
    container: HTMLElement,
    withDropdownInput: boolean,
    openDropdown: boolean,
    handleFocus: (event: React.FocusEvent) => void,
    handleBlur: (event: React.FocusEvent) => void,
    handleNodeChange: (node: TreeNode, selectedNodes: TreeNode[]) => void,
    handleNodeToggle: (node: TreeNode, expandedNodes: TreeNode[]) => void,
    handleClearAll: (selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void
  ): void => {
    expect(container.contains(document.activeElement)).toBeFalsy();
    expect(getRootContainer(container)).not.toHaveClass('focused');
    expect(handleFocus).not.toHaveBeenCalled();
    expect(handleBlur).not.toHaveBeenCalled();
    expect(handleNodeChange).not.toHaveBeenCalled();
    expect(handleNodeToggle).not.toHaveBeenCalled();
    expect(handleClearAll).not.toHaveBeenCalled();
    if (withDropdownInput) {
      expect(getFieldInput(container)).not.toBeInTheDocument();
      expect(getHiddenInput(container)).toBeInTheDocument();
    } else {
      expect(getFieldInput(container)).toBeInTheDocument();
      expect(getHiddenInput(container)).not.toBeInTheDocument();
    }
    if (openDropdown) {
      expect(getDropdown(container)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).not.toBeInTheDocument();
    }
    expect(getChipContainers(container).length).toBe(8);
  };

  it.each([[true, true], [false, true], [true, false], [false, false]])(
    'tests component when isDisabled=true and withDropdownInput={%s} and openDropdown={%s}',
    async (withDropdownInput, openDropdown
    ) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const handleNodeChange = jest.fn();
      const handleNodeToggle = jest.fn();
      const handleClearAll = jest.fn();
      const {container} = render(
        <TreeMultiSelect
          data={treeNodeData}
          isDisabled={true}
          withDropdownInput={withDropdownInput}
          openDropdown={openDropdown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggle}
          onClearAll={handleClearAll}
        />
      );

      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getField(container));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getFieldClear(container));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(document.body);
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getFieldToggle(container));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{tab}');
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{shift}{tab}');
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(document.body);
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{tab}');
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipContainer(container, 1));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipLabel(container, 1));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipClear(container, 1));
      isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      if (openDropdown) {
        await user.click(getListItem(container, 0));
        isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);
        if (!withDropdownInput) {
          await user.click(getNodeToggle(container, 0));
          isDisabledMatcher(container, withDropdownInput, openDropdown, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);
        }
      }
    });
});

describe('TreeMultiSelect component: isSearchable prop', () => {
  const isSearchableMatcher = (
    container: HTMLElement, isSearchable: boolean, withDropdownInput: boolean, opened: boolean
  ): void => {
    if (isSearchable) {
      if (withDropdownInput) {
        expect(getFieldInput(container)).not.toBeInTheDocument();
        expect(getHiddenInput(container)).toBeInTheDocument();
        if (opened) {
          expect(getDropdownInput(container)).toBeInTheDocument();
        }
      } else {
        expect(getFieldInput(container)).toBeInTheDocument();
        expect(getHiddenInput(container)).not.toBeInTheDocument();
        if (opened) {
          expect(getDropdownInput(container)).not.toBeInTheDocument();
        }
      }
    } else {
      expect(getFieldInput(container)).not.toBeInTheDocument();
      expect(getHiddenInput(container)).toBeInTheDocument();
      if (opened) {
        expect(getDropdownInput(container)).not.toBeInTheDocument();
      }
    }
  };

  it.each([[true, false], [true, true], [false, false], [false, true]])(
    'tests component when isSearchable={%s} and withDropdownInput={%s}',
    async (isSearchable, withDropdownInput
    ) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect data={treeNodeData} isSearchable={isSearchable} withDropdownInput={withDropdownInput}/>
      );

      isSearchableMatcher(container, isSearchable, withDropdownInput, false);

      await user.click(getField(container));

      isSearchableMatcher(container, isSearchable, withDropdownInput, true);
    });
});

describe('TreeMultiSelect component: withChipClear prop', () => {
  const withChipClearMatcher = (
    container: HTMLElement,
    withChipClear: boolean,
    chipClearsAmount: number,
    handleNodeChange: (node: TreeNode, selectedNodes: TreeNode[]) => void,
    nodeChangeTimes: number
  ): void => {
    if (withChipClear) {
      expect(getChipClears(container).length).toBe(chipClearsAmount);
      expect(handleNodeChange).toHaveBeenCalledTimes(nodeChangeTimes);
    } else {
      expect(getChipClears(container).length).toBe(chipClearsAmount);
      expect(handleNodeChange).not.toHaveBeenCalled();
    }
  };

  it.each([[true], [false]])('tests component when withChipClear={%s} (click)', async (withChipClear) => {
    const user: UserEvent = userEvent.setup();

    const handleNodeChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect data={treeNodeData} withChipClear={withChipClear} onNodeChange={handleNodeChange}/>
    );

    withChipClearMatcher(container, withChipClear, withChipClear ? 4 : 0, handleNodeChange, 0);

    await user.click(getChipClear(container, 5));
    withChipClearMatcher(container, withChipClear, withChipClear ? 3 : 0, handleNodeChange, withChipClear ? 1 : 0);

    await user.click(getChipClear(container, 1));
    withChipClearMatcher(container, withChipClear, withChipClear ? 2 : 0, handleNodeChange, withChipClear ? 2 : 0);

    await user.click(getChipClear(container, 3));
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.click(getChipClear(container, 1));
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.click(getChipClear(container, 4));
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.click(getChipClear(container, 3));
    withChipClearMatcher(container, withChipClear, 0, handleNodeChange, withChipClear ? 4 : 0);

    await user.click(getChipClear(container, 2));
    withChipClearMatcher(container, withChipClear, 0, handleNodeChange, withChipClear ? 4 : 0);
  });

  it.each([[true], [false]])('tests component when withChipClear={%s} (keydown)', async (withChipClear) => {
    const user: UserEvent = userEvent.setup();

    const handleNodeChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect data={treeNodeData} withChipClear={withChipClear} onNodeChange={handleNodeChange}/>
    );

    withChipClearMatcher(container, withChipClear, withChipClear ? 4 : 0, handleNodeChange, 0);

    await user.keyboard('{tab}');
    await user.keyboard('{arrowleft}');
    await user.keyboard('{arrowleft}');
    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, withChipClear ? 3 : 0, handleNodeChange, withChipClear ? 1 : 0);

    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, withChipClear ? 2 : 0, handleNodeChange, withChipClear ? 2 : 0);

    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.keyboard('{arrowleft}');
    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, withChipClear ? 1 : 0, handleNodeChange, withChipClear ? 3 : 0);

    await user.keyboard('{arrowleft}');
    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, 0, handleNodeChange, withChipClear ? 4 : 0);

    await user.keyboard('{backspace}');
    withChipClearMatcher(container, withChipClear, 0, handleNodeChange, withChipClear ? 4 : 0);
  });
});

describe('TreeMultiSelect component: withSelectAll prop', () => {
  const withSelectAllMatcher = (
    container: HTMLElement,
    selectAllState: CheckedState,
    chipsAmount: number,
    selectedNodesAmount: number,
    handleSelectAllChange: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void,
    selectAllChangeTimes: number
  ): void => {
    const selectAll = getStickyItem(container, 0);
    expect(selectAll).toBeInTheDocument();
    if (selectAllState === CheckedState.UNSELECTED) {
      expect(selectAll.classList.contains('selected')).toBeFalsy();
      expect(selectAll.classList.contains('partial')).toBeFalsy();
    } else {
      expect(selectAll.classList.contains(selectAllState.toLowerCase())).toBeTruthy();
    }
    expect(getChipContainers(container).length).toBe(chipsAmount);
    const selectedNodes = getListItems(container).filter(el => el.classList.contains('selected'));
    expect(selectedNodes.length).toBe(selectedNodesAmount);
    expect(handleSelectAllChange).toHaveBeenCalledTimes(selectAllChangeTimes);
  };

  it('tests component when withSelectAll=false as a default', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect data={getTreeNodeData([], [], [])} onSelectAllChange={handleSelectAllChange}/>
    );

    await user.click(getField(container));
    expect(getStickyItems(container).length).toBe(0);
  });

  it('tests component when withSelectAll=true and component type=SELECT', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const treeNodeData = getTreeNodeData([], [], []);

    const {container, rerender} = render(
      <TreeMultiSelect
        data={treeNodeData}
        withSelectAll
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    expect(getStickyItem(container, 0)).toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={treeNodeData}
        type={Type.SELECT}
        withSelectAll
        onSelectAllChange={handleSelectAllChange}
      />
    );

    expect(getStickyItems(container).length).toBe(0);
  });

  it('tests component when withSelectAll=true', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData([], [], [])}
        withSelectAll
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    withSelectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange, 0);

    await user.click(getStickyItem(container, 0));
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange, 1);

    await user.click(getStickyItem(container, 0));
    withSelectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange, 2);

    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange, 3);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.PARTIAL, 7, 7, handleSelectAllChange, 3);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.PARTIAL, 6, 6, handleSelectAllChange, 3);

    await user.keyboard('{arrowup}');
    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange, 4);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 11, handleSelectAllChange, 4);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange, 4);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange, 4);

    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange, 4);

    await user.click(getListItem(container, 5));
    withSelectAllMatcher(container, CheckedState.PARTIAL, 9, 11, handleSelectAllChange, 4);

    await user.click(getListItem(container, 10));
    withSelectAllMatcher(container, CheckedState.PARTIAL, 8, 10, handleSelectAllChange, 4);

    await user.click(getStickyItem(container, 0));
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange, 5);

    await user.click(getStickyItem(container, 0));
    withSelectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange, 6);

    await user.click(getListItem(container, 4));
    withSelectAllMatcher(container, CheckedState.PARTIAL, 1, 1, handleSelectAllChange, 6);

    await user.click(getListItem(container, 0));
    await user.click(getListItem(container, 6));
    await user.click(getListItem(container, 7));
    await user.click(getListItem(container, 8));
    await user.click(getListItem(container, 9));
    await user.click(getListItem(container, 10));
    await user.click(getListItem(container, 11));
    withSelectAllMatcher(container, CheckedState.PARTIAL, 7, 12, handleSelectAllChange, 6);

    await user.click(getListItem(container, 12));
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange, 6);

    await user.click(getField(container));
    expect(getDropdown(container)).not.toBeInTheDocument();
    expect(getChipContainers(container).length).toBe(8);

    await user.click(getField(container));
    withSelectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange, 6);
  });
});

describe('TreeMultiSelect component: closeDropdownOnNodeChange prop', () => {
  const closeDropdownOnNodeChangeMatcher = (
    container: HTMLElement,
    withDropdownInput: boolean,
    focused: boolean,
    opened: boolean,
    handleFocus: (event: React.FocusEvent) => void,
    focusTimes: number,
    handleBlur: (event: React.FocusEvent) => void,
    blurTimes: number
  ): void => {
    if (withDropdownInput) {
      expect(getFieldInput(container)).not.toBeInTheDocument();
      expect(getHiddenInput(container)).toBeInTheDocument();
      if (opened) {
        expect(getDropdownInput(container)).toBeInTheDocument();
      } else {
        expect(getDropdown(container)).not.toBeInTheDocument();
      }
    } else {
      expect(getFieldInput(container)).toBeInTheDocument();
      expect(getHiddenInput(container)).not.toBeInTheDocument();
      if (opened) {
        expect(getDropdown(container)).toBeInTheDocument();
      } else {
        expect(getDropdown(container)).not.toBeInTheDocument();
      }
    }
    if (focused) {
      expect(container.contains(document.activeElement)).toBeTruthy();
      expect(getRootContainer(container)).toHaveClass('focused');
    } else {
      expect(container.contains(document.activeElement)).toBeFalsy();
      expect(getRootContainer(container)).not.toHaveClass('focused');
    }
    expect(handleFocus).toHaveBeenCalledTimes(focusTimes);
    expect(handleBlur).toHaveBeenCalledTimes(blurTimes);
  };

  it.each([[false, false], [true, false], [false, true], [true, true]])(
    'tests component when closeDropdownOnNodeChange={%s} and withDropdownInput={%s}',
    async (closeDropdownOnNodeChange, withDropdownInput
    ) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      const {container} = render(
        <TreeMultiSelect
          data={treeNodeData}
          onFocus={handleFocus}
          onBlur={handleBlur}
          closeDropdownOnNodeChange={closeDropdownOnNodeChange}
          withDropdownInput={withDropdownInput}
        />
      );

      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, false, false, handleFocus, 0, handleBlur, 0);

      await user.click(getField(container));
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 1));
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, !closeDropdownOnNodeChange, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, !closeDropdownOnNodeChange, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, true, closeDropdownOnNodeChange, handleFocus, 1, handleBlur, 0);

      await user.click(document.body);
      closeDropdownOnNodeChangeMatcher(container, withDropdownInput, false, false, handleFocus, 1, handleBlur, 1);
    });
});

describe('TreeMultiSelect component: dropdownHeight prop', () => {
  it('tests component with default dropdownHeight', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(<TreeMultiSelect data={treeNodeData}/>);

    await user.click(getField(container));

    const dropdownListOuter = getDropdownListOuter(container);
    expect(dropdownListOuter).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(dropdownListOuter);
    expect(computedStyles.height).toEqual('300px');
  });

  it.each([[100], [200], [400]])('tests component when dropdownHeight={%s}', async (dropdownHeight) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(<TreeMultiSelect data={treeNodeData} dropdownHeight={dropdownHeight}/>);

    await user.click(getField(container));

    const dropdownListOuter = getDropdownListOuter(container);
    expect(dropdownListOuter).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(dropdownListOuter);
    expect(computedStyles.height).toEqual(`${dropdownHeight}px`);
  });
});

describe('TreeMultiSelect component: focus/blur component and open/close dropdown', () => {
  const focusBlurMatcher = (
    container: HTMLElement,
    focused: boolean,
    opened: boolean,
    handleFocus: (event: React.FocusEvent) => void,
    focusTimes: number,
    handleBlur: (event: React.FocusEvent) => void,
    blurTimes: number
  ): void => {
    if (focused) {
      expect(container.contains(document.activeElement)).toBeTruthy();
      expect(getRootContainer(container)).toHaveClass('focused');
    } else {
      expect(container.contains(document.activeElement)).toBeFalsy();
      expect(getRootContainer(container)).not.toHaveClass('focused');
    }
    if (opened) {
      expect(getDropdown(container)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).not.toBeInTheDocument();
    }
    expect(handleFocus).toHaveBeenCalledTimes(focusTimes);
    expect(handleBlur).toHaveBeenCalledTimes(blurTimes);
  };

  const inputMatcher = (container: HTMLElement, withDropdownInput: boolean, opened: boolean): void => {
    if (withDropdownInput) {
      expect(getFieldInput(container)).not.toBeInTheDocument();
      expect(getHiddenInput(container)).toBeInTheDocument();
      if (opened) {
        expect(getDropdownInput(container)).toBeInTheDocument();
      }
    } else {
      expect(getFieldInput(container)).toBeInTheDocument();
      expect(getHiddenInput(container)).not.toBeInTheDocument();
      if (opened) {
        expect(getDropdownInput(container)).not.toBeInTheDocument();
      }
    }
  };

  const resetMatcher = (container: HTMLElement, opened: boolean, value: string): void => {
    if (opened) {
      expect(getDropdown(container)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).not.toBeInTheDocument();
    }
    expect(getFieldInput(container)).toHaveValue(value);
  };

  it.each([[false], [true]])(`focus/blur and open/close when withDropdownInput={%s} (click)`,
    async (withDropdownInput) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      const {container} = render(
        <TreeMultiSelect
          data={treeNodeData}
          onFocus={handleFocus}
          onBlur={handleBlur}
          withDropdownInput={withDropdownInput}
        />
      );

      expect(getRootContainer(container)).toBeInTheDocument();
      inputMatcher(container, withDropdownInput, false);
      focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

      await user.click(getField(container));
      inputMatcher(container, withDropdownInput, true);
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipContainer(container, 0));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipLabel(container, 0));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(document.body);
      focusBlurMatcher(container, false, false, handleFocus, 1, handleBlur, 1);

      await user.click(getChipLabel(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.click(getField(container));
      focusBlurMatcher(container, true, false, handleFocus, 2, handleBlur, 1);

      await user.click(getChipContainer(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.click(document.body);
      focusBlurMatcher(container, false, false, handleFocus, 2, handleBlur, 2);
    });

  it.each([[false], [true]])(`focus/blur and open/close when withDropdownInput={%s} (keydown)`,
    async (withDropdownInput) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      const {container} = render(
        <TreeMultiSelect
          data={treeNodeData}
          onFocus={handleFocus}
          onBlur={handleBlur}
          withDropdownInput={withDropdownInput}
        />
      );

      expect(getRootContainer(container)).toBeInTheDocument();
      focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

      await user.keyboard('{tab}');
      inputMatcher(container, withDropdownInput, false);
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      inputMatcher(container, withDropdownInput, true);
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{escape}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{tab}');
      focusBlurMatcher(container, false, false, handleFocus, 1, handleBlur, 1);

      await user.keyboard('{shift}{tab}');
      focusBlurMatcher(container, true, false, handleFocus, 2, handleBlur, 1);

      await user.keyboard('{arrowdown}');
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.keyboard('{escape}');
      focusBlurMatcher(container, true, false, handleFocus, 2, handleBlur, 1);

      await user.keyboard('{shift}{tab}');
      focusBlurMatcher(container, false, false, handleFocus, 2, handleBlur, 2);
    });

  it.each([[false], [true]])(`focus/blur and open/close when withDropdownInput={%s} (click/keydown)`,
    async (withDropdownInput) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      const {container} = render(
        <TreeMultiSelect
          data={treeNodeData}
          onFocus={handleFocus}
          onBlur={handleBlur}
          withDropdownInput={withDropdownInput}
        />
      );

      expect(getRootContainer(container)).toBeInTheDocument();
      focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

      await user.keyboard('{tab}');
      inputMatcher(container, withDropdownInput, false);
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      inputMatcher(container, withDropdownInput, true);
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipContainer(container, 0));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipLabel(container, 0));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{escape}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{escape}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getChipLabel(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getChipContainer(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{tab}');
      focusBlurMatcher(container, false, false, handleFocus, 1, handleBlur, 1);

      await user.click(getField(container));
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.keyboard('{shift}{tab}');
      focusBlurMatcher(container, false, false, handleFocus, 2, handleBlur, 2);

      await user.keyboard('{tab}');
      focusBlurMatcher(container, true, false, handleFocus, 3, handleBlur, 2);

      await user.click(getField(container));
      focusBlurMatcher(container, true, true, handleFocus, 3, handleBlur, 2);

      await user.click(getListItem(container, 0));
      focusBlurMatcher(container, true, true, handleFocus, 3, handleBlur, 2);

      await user.click(document.body);
      focusBlurMatcher(container, false, false, handleFocus, 3, handleBlur, 3);
    });

  it(`focus/blur, open/close and reset state`, async () => {
    const user: UserEvent = userEvent.setup();

    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        data={treeNodeData}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );

    expect(getRootContainer(container)).toBeInTheDocument();
    focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

    await user.keyboard('{tab}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.click(getChipContainer(container, 0));
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{arrowup}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.keyboard('java');
    resetMatcher(container, false, 'java');

    await user.keyboard('{tab}');
    focusBlurMatcher(container, false, false, handleFocus, 1, handleBlur, 1);
    resetMatcher(container, false, '');

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);
    resetMatcher(container, true, '');

    await user.keyboard('java');
    resetMatcher(container, true, 'java');

    await user.click(getListItem(container, 0));
    focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);
    resetMatcher(container, true, 'java');

    await user.keyboard('{shift}{tab}');
    focusBlurMatcher(container, false, false, handleFocus, 2, handleBlur, 2);
    resetMatcher(container, false, '');

    await user.keyboard('{tab}');
    focusBlurMatcher(container, true, false, handleFocus, 3, handleBlur, 2);
    resetMatcher(container, false, '');

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 3, handleBlur, 2);
    resetMatcher(container, true, '');

    await user.keyboard('java');
    resetMatcher(container, true, 'java');

    await user.click(getListItem(container, 0));
    focusBlurMatcher(container, true, true, handleFocus, 3, handleBlur, 2);
    resetMatcher(container, true, 'java');

    await user.click(document.body);
    focusBlurMatcher(container, false, false, handleFocus, 3, handleBlur, 3);
    resetMatcher(container, false, '');
  });
});
