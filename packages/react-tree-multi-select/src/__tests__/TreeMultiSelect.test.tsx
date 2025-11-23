import '@testing-library/jest-dom';

import React, {FC} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent, {UserEvent} from '@testing-library/user-event';
import {CheckedState, FooterProps, TreeMultiSelect, TreeNode, Type} from '../index';
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
  getFooter,
  getHiddenInput,
  getListItem,
  getListItems,
  getNodeToggle,
  getRootContainer,
  getStickyItem,
  getStickyItems
} from './testutils/selectorUtils';
import {INPUT_PLACEHOLDER, NO_DATA_TEXT, NO_MATCHES_TEXT} from '../constants';

const treeNodeData = getBaseTreeNodeData();

const footerText = 'Custom Footer';
const CustomFooter: FC<FooterProps> = (props) => {
  return (
    <div {...props.attributes}>
      <label>{footerText}</label>
    </div>
  );
};

const selectAllMatcher = (
  container: HTMLElement,
  selectAllState: CheckedState,
  chipsAmount: number,
  selectedNodesAmount: number,
  handleSelectAllChange?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void
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
  if (handleSelectAllChange) {
    expect(handleSelectAllChange).toHaveBeenCalledTimes(1);
  }
};

describe('TreeMultiSelect component: base', () => {
  it('renders component', () => {
    render(<TreeMultiSelect data={treeNodeData}/>);

    const chip = screen.getByText(/Angular/i);
    expect(chip).toBeInTheDocument();
  });
});

describe('TreeMultiSelect component: inputPlaceholder prop', () => {
  const inputPlaceholderMatcher = (
    container: HTMLElement,
    inputPlaceholder: string,
    isPresent: boolean,
    inputValue: string,
    withDropdownInput: boolean
  ): void => {
    if (withDropdownInput) {
      expect(getDropdownInput(container)).toHaveAttribute('placeholder', inputPlaceholder);
      expect(getDropdownInput(container)).toHaveValue(inputValue);
    } else {
      if (isPresent) {
        expect(getFieldInput(container)).toHaveAttribute('placeholder', inputPlaceholder);
      } else {
        expect(getFieldInput(container)).toHaveAttribute('placeholder', '');
      }
      expect(getFieldInput(container)).toHaveValue(inputValue);
    }
  };

  it.each([[true, Type.TREE_SELECT], [false, Type.TREE_SELECT],
    [true, Type.TREE_SELECT_FLAT], [false, Type.TREE_SELECT_FLAT],
    [true, Type.MULTI_SELECT], [false, Type.MULTI_SELECT],
    [true, Type.SELECT], [false, Type.SELECT]])(
    'tests component with default inputPlaceholder and withDropdownInput={%s} and component type={%s}',
    async (withDropdownInput, type) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData([], [], [])}
          type={type}
          withDropdownInput={withDropdownInput}/>
      );

      await user.click(getField(container));
      inputPlaceholderMatcher(container, INPUT_PLACEHOLDER, true, '', withDropdownInput);

      await user.keyboard('qwerty');
      inputPlaceholderMatcher(container, INPUT_PLACEHOLDER, true, 'qwerty', withDropdownInput);

      await user.keyboard('{Control>}a{Backspace}');
      inputPlaceholderMatcher(container, INPUT_PLACEHOLDER, true, '', withDropdownInput);

      await user.click(getListItem(container, 0));
      inputPlaceholderMatcher(container, INPUT_PLACEHOLDER, false, '', withDropdownInput);

      await user.click(getChipClear(container, 0));
      inputPlaceholderMatcher(container, INPUT_PLACEHOLDER, true, '', withDropdownInput);
    });

  it.each([['search nodes', true, Type.TREE_SELECT], ['search nodes', false, Type.TREE_SELECT],
    ['search options', true, Type.TREE_SELECT_FLAT], ['search options', false, Type.TREE_SELECT_FLAT],
    ['custom placeholder', true, Type.MULTI_SELECT], ['custom placeholder', false, Type.MULTI_SELECT],
    ['some text', true, Type.SELECT], ['some text', false, Type.SELECT]])(
    'tests component when inputPlaceholder={%s} and withDropdownInput={%s} and component type={%s}',
    async (inputPlaceholder, withDropdownInput, type) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData([], [], [])}
          type={type}
          inputPlaceholder={inputPlaceholder}
          withDropdownInput={withDropdownInput}
        />
      );

      await user.click(getField(container));
      inputPlaceholderMatcher(container, inputPlaceholder, true, '', withDropdownInput);

      await user.keyboard('qwerty');
      inputPlaceholderMatcher(container, inputPlaceholder, true, 'qwerty', withDropdownInput);

      await user.keyboard('{Control>}a{Backspace}');
      inputPlaceholderMatcher(container, inputPlaceholder, true, '', withDropdownInput);

      await user.click(getListItem(container, 0));
      inputPlaceholderMatcher(container, inputPlaceholder, false, '', withDropdownInput);

      await user.click(getChipClear(container, 0));
      inputPlaceholderMatcher(container, inputPlaceholder, true, '', withDropdownInput);
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
    noMatchesTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('qwerty');
    noMatchesTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('{Control>}a{Backspace}');
    noMatchesTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('java');
    noMatchesTextMatcher(container, NO_DATA_TEXT, true);
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
    noMatchesTextMatcher(container, NO_MATCHES_TEXT, false);

    await user.keyboard('qwerty');
    noMatchesTextMatcher(container, NO_MATCHES_TEXT, true);

    await user.keyboard('{Control>}a{Backspace}');
    noMatchesTextMatcher(container, NO_MATCHES_TEXT, false);

    await user.keyboard('java');
    noMatchesTextMatcher(container, NO_MATCHES_TEXT, false);
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
    async (withDropdownInput, openDropdown) => {
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
    async (isSearchable, withDropdownInput) => {
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

describe('TreeMultiSelect component: withClearAll prop', () => {
  const withClearAllPresentsMatcher = (
    container: HTMLElement,
    withClearAll: boolean,
    presents: boolean,
  ): void => {
    if (!withClearAll) {
      expect(getFieldClear(container)).not.toBeInTheDocument();
    } else {
      if (presents) {
        expect(getFieldClear(container)).toBeInTheDocument();
      } else {
        expect(getFieldClear(container)).not.toBeInTheDocument();
      }
    }
  };

  const withClearAllMatcher = (
    container: HTMLElement,
    withClearAll: boolean,
    chipsAmount: number,
    selectedNodesAmount: number,
    handleClearAll?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined, data: TreeNode[]) => void
  ): void => {
    if (withClearAll) {
      expect(getFieldClear(container)).toBeInTheDocument();
    } else {
      expect(getFieldClear(container)).not.toBeInTheDocument();
    }
    expect(getChipContainers(container).length).toBe(chipsAmount);
    const selectedNodes = getListItems(container).filter(el => el.classList.contains('selected'));
    expect(selectedNodes.length).toBe(selectedNodesAmount);
    if (handleClearAll) {
      expect(handleClearAll).toHaveBeenCalledTimes(1);
    }
  };

  it.each([[true, true], [false, true], [true, false], [false, false]])(
    'tests component when withClearAll={%s} and data presents={%s}',
    async (withClearAll, presents) => {
      const {container, rerender} = render(
        <TreeMultiSelect
          data={presents ? getTreeNodeData(['1'], [], []) : []}
          withClearAll={withClearAll ? undefined : withClearAll}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData(['1'], [], []) : []}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.TREE_SELECT_FLAT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData(['1'], [], []) : []}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.MULTI_SELECT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData(['1'], [], []) : []}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.SELECT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={getTreeNodeData([], [], [])}
          withClearAll={withClearAll ? undefined : withClearAll}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, false);
    });

  it('tests component when withClearAll=true, some selected and disabled items', async () => {
    let user: UserEvent = userEvent.setup();

    const handleClearAll = jest.fn();

    const {container, rerender} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['8'], ['7'], ['8'])}
        withSelectAll
        onClearAll={handleClearAll}
      />
    );

    await user.click(getField(container));
    withClearAllMatcher(container, false, 1, 1);

    await user.click(getListItem(container, 1));
    withClearAllMatcher(container, true, 1, 3);

    await user.click(getStickyItem(container, 0));
    withClearAllMatcher(container, true, 8, 10);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 1, 1, handleClearAll);
    handleClearAll.mockClear();

    await user.click(getListItem(container, 0));
    withClearAllMatcher(container, true, 2, 2);

    await user.click(getField(container));
    await user.keyboard('{enter}');
    await user.keyboard('{arrowright}');
    await user.keyboard('{Backspace}');
    withClearAllMatcher(container, false, 1, 1);
    handleClearAll.mockClear();

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData(['8'], ['7'], [])}
        withSelectAll
        onClearAll={handleClearAll}
      />
    );
    user = userEvent.setup();
    withClearAllMatcher(container, true, 1, 1);

    await user.click(getListItem(container, 2));
    withClearAllMatcher(container, false, 0, 0);

    await user.click(getListItem(container, 2));
    withClearAllMatcher(container, true, 1, 1);

    await user.click(getListItem(container, 4));
    withClearAllMatcher(container, true, 2, 2);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);
    handleClearAll.mockClear();

    await user.click(getStickyItem(container, 0));
    withClearAllMatcher(container, true, 8, 10);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);
    handleClearAll.mockClear();

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData([], ['7'], ['8'])}
        withSelectAll
        onClearAll={handleClearAll}
      />
    );
    user = userEvent.setup();
    withClearAllMatcher(container, false, 0, 0);

    await user.click(getListItem(container, 2));
    withClearAllMatcher(container, false, 0, 0);

    await user.click(getListItem(container, 5));
    withClearAllMatcher(container, true, 1, 1);

    await user.click(getListItem(container, 0));
    withClearAllMatcher(container, true, 2, 2);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);
    handleClearAll.mockClear();

    await user.click(getStickyItem(container, 0));
    withClearAllMatcher(container, true, 8, 8);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);
    handleClearAll.mockClear();

    await user.click(getListItem(container, 0));
    withClearAllMatcher(container, true, 1, 1);

    await user.click(getChipClear(container, 0));
    withClearAllMatcher(container, false, 0, 0);
  });
});

describe('TreeMultiSelect component: withSelectAll prop', () => {
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
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.PARTIAL, 7, 7);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.PARTIAL, 6, 6);

    await user.keyboard('{arrowup}');
    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.SELECTED, 8, 8, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    selectAllMatcher(container, CheckedState.SELECTED, 8, 11);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.PARTIAL, 10, 10);

    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13);

    await user.click(getListItem(container, 5));
    selectAllMatcher(container, CheckedState.PARTIAL, 9, 11);

    await user.click(getListItem(container, 10));
    selectAllMatcher(container, CheckedState.PARTIAL, 8, 10);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getListItem(container, 4));
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 0));
    await user.click(getListItem(container, 6));
    await user.click(getListItem(container, 7));
    await user.click(getListItem(container, 8));
    await user.click(getListItem(container, 9));
    await user.click(getListItem(container, 10));
    await user.click(getListItem(container, 11));
    selectAllMatcher(container, CheckedState.PARTIAL, 7, 12);

    await user.click(getListItem(container, 12));
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13);

    await user.click(getField(container));
    expect(getDropdown(container)).not.toBeInTheDocument();
    expect(getChipContainers(container).length).toBe(8);

    await user.click(getField(container));
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13);
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
    async (closeDropdownOnNodeChange, withDropdownInput) => {
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

describe('TreeMultiSelect component: openDropdown and onDropdownToggle props', () => {
  const openDropdownMatcher = (
    container: HTMLElement,
    openDropdown: boolean,
    handleDropdownToggle: (open: boolean) => void,
    handleDropdownTogglePayload: boolean | null
  ): void => {
    if (openDropdown) {
      expect(getDropdown(container)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).not.toBeInTheDocument();
    }
    if (handleDropdownTogglePayload != null) {
      expect(handleDropdownToggle).toHaveBeenCalledWith(handleDropdownTogglePayload);
    } else {
      expect(handleDropdownToggle).not.toHaveBeenCalled();
    }
  };

  it('tests uncontrolled component', async () => {
    const user: UserEvent = userEvent.setup();

    const handleDropdownToggle = jest.fn();

    const {container} = render(<TreeMultiSelect data={treeNodeData} onDropdownToggle={handleDropdownToggle}/>);

    openDropdownMatcher(container, false, handleDropdownToggle, null);
    handleDropdownToggle.mockClear();

    await user.click(getField(container));
    openDropdownMatcher(container, true, handleDropdownToggle, true);
    handleDropdownToggle.mockClear();

    await user.keyboard('{arrowup}');
    openDropdownMatcher(container, false, handleDropdownToggle, false);
    handleDropdownToggle.mockClear();

    await user.keyboard('{arrowdown}');
    openDropdownMatcher(container, true, handleDropdownToggle, true);
    handleDropdownToggle.mockClear();

    await user.keyboard('{escape}');
    openDropdownMatcher(container, false, handleDropdownToggle, false);
    handleDropdownToggle.mockClear();

    await user.click(getFieldToggle(container));
    openDropdownMatcher(container, true, handleDropdownToggle, true);
    handleDropdownToggle.mockClear();

    await user.click(getFieldToggle(container));
    openDropdownMatcher(container, false, handleDropdownToggle, false);
    handleDropdownToggle.mockClear();

    await user.click(getChipContainer(container, 0));
    openDropdownMatcher(container, true, handleDropdownToggle, true);
    handleDropdownToggle.mockClear();

    await user.click(getFieldInput(container));
    openDropdownMatcher(container, false, handleDropdownToggle, false);
    handleDropdownToggle.mockClear();
  });

  it('tests controlled component', async () => {
    let user: UserEvent = userEvent.setup();

    const handleDropdownToggle = jest.fn();

    const {container, rerender} = render(
      <TreeMultiSelect data={treeNodeData} openDropdown={true} onDropdownToggle={handleDropdownToggle}/>
    );

    openDropdownMatcher(container, true, handleDropdownToggle, null);
    handleDropdownToggle.mockClear();

    await user.click(getField(container));
    openDropdownMatcher(container, true, handleDropdownToggle, false);
    handleDropdownToggle.mockClear();

    rerender(<TreeMultiSelect data={treeNodeData} openDropdown={false} onDropdownToggle={handleDropdownToggle}/>);
    user = userEvent.setup();
    openDropdownMatcher(container, false, handleDropdownToggle, null);
    handleDropdownToggle.mockClear();

    await user.click(getField(container));
    openDropdownMatcher(container, false, handleDropdownToggle, true);
    handleDropdownToggle.mockClear();
  });
});

describe('TreeMultiSelect component: dropdownHeight prop', () => {
  it('tests component with default dropdownHeight', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(<TreeMultiSelect data={treeNodeData}/>);

    await user.click(getField(container));

    const dropdown = getDropdown(container);
    expect(dropdown).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(dropdown);
    expect(computedStyles.maxHeight).toEqual('300px');
  });

  it.each([[100], [200], [400]])('tests component when dropdownHeight={%s}', async (dropdownHeight) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(<TreeMultiSelect data={treeNodeData} dropdownHeight={dropdownHeight}/>);

    await user.click(getField(container));

    const dropdown = getDropdown(container);
    expect(dropdown).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(dropdown);
    expect(computedStyles.maxHeight).toEqual(`${dropdownHeight}px`);
  });
});

describe('TreeMultiSelect component: overscan prop', () => {
  const overscanMatcher = (
    container: HTMLElement,
    overscan: number,
    amounts: number[]
  ): void => {
    expect(getListItems(container).length).toBe(amounts[overscan]);
  };

  it.each([[0], [1], [2]])('tests component when overscan={%s}', async (overscan) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={getTreeNodeData([], [], [])} overscan={overscan === 1 ? undefined : overscan}/>
    );

    await user.click(getField(container));
    overscanMatcher(container, overscan, [8, 8, 8]);

    await user.click(getNodeToggle(container, 3));
    overscanMatcher(container, overscan, [10, 10, 10]);

    await user.click(getNodeToggle(container, 4));
    overscanMatcher(container, overscan, [12, 13, 13]);

    await user.click(getNodeToggle(container, 0));
    overscanMatcher(container, overscan, [12, 13, 14]);

    await user.click(getNodeToggle(container, 1));
    overscanMatcher(container, overscan, [12, 13, 14]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 25}});
    overscanMatcher(container, overscan, [12, 14, 15]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 50}});
    overscanMatcher(container, overscan, [12, 14, 16]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 150}});
    overscanMatcher(container, overscan, [12, 13, 14]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 0}});
    overscanMatcher(container, overscan, [12, 13, 14]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 75}});
    overscanMatcher(container, overscan, [12, 14, 16]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 76}});
    overscanMatcher(container, overscan, [13, 15, 17]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 74}});
    overscanMatcher(container, overscan, [13, 15, 17]);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 0}});
    overscanMatcher(container, overscan, [12, 13, 14]);

    await user.click(getNodeToggle(container, 0));
    overscanMatcher(container, overscan, [12, 13, 13]);
  });
});

describe('TreeMultiSelect component: isVirtualized prop', () => {
  it.each([[true], [false]])('tests component when isVirtualized={%s}', async (isVirtualized) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={treeNodeData} isVirtualized={isVirtualized ? undefined : isVirtualized}/>
    );

    await user.click(getField(container));
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 21);

    await user.click(getNodeToggle(container, 6));
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 23);

    await user.click(getNodeToggle(container, 12));
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 26);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 25}});
    expect(getListItems(container).length).toBe(isVirtualized ? 14 : 26);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 350}});
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 26);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 0}});
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 26);

    await user.click(getNodeToggle(container, 12));
    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 275}});
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 23);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 125}});
    expect(getListItems(container).length).toBe(isVirtualized ? 14 : 23);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 126}});
    expect(getListItems(container).length).toBe(isVirtualized ? 15 : 23);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 124}});
    expect(getListItems(container).length).toBe(isVirtualized ? 15 : 23);

    fireEvent.scroll(getDropdownListOuter(container), {target: {scrollTop: 0}});
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 23);

    await user.click(getNodeToggle(container, 0));
    expect(getListItems(container).length).toBe(isVirtualized ? 13 : 18);
  });
});

describe('TreeMultiSelect component: footerConfig prop', () => {
  it('tests component when custom Footer component is rendered', async () => {
    let user: UserEvent = userEvent.setup();

    const {container, rerender} = render(
      <TreeMultiSelect data={getTreeNodeData([], [], [])}/>
    );

    await user.click(getField(container));
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    rerender(
      <TreeMultiSelect data={getTreeNodeData([], [], [])} components={{Footer: {component: CustomFooter}}}/>
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    rerender(
      <TreeMultiSelect data={[]} components={{Footer: {component: CustomFooter}}}/>
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={[]}
        footerConfig={{showWhenSearching: true}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={[]}
        footerConfig={{showWhenNoItems: true}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData([], [], [])}
        footerConfig={{showWhenNoItems: true}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData([], [], [])}
        footerConfig={{showWhenSearching: true}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).not.toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData([], [], [])}
        footerConfig={{showWhenSearching: true, showWhenNoItems: true}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('java');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('no items');
    expect(screen.queryByText(footerText)).toBeInTheDocument();

    await user.keyboard('{Control>}a{Backspace}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();
  });

  it('tests Footer click', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={getTreeNodeData([], [], [])} components={{Footer: {component: CustomFooter}}}/>
    );

    await user.click(getField(container));
    expect(screen.queryByText(footerText)).toBeInTheDocument();
    expect(getFooter(container)).not.toHaveClass('focused');

    await user.click(getFooter(container));
    expect(screen.queryByText(footerText)).toBeInTheDocument();
    expect(getFooter(container)).toHaveClass('focused');

    await user.keyboard('{arrowup}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();
    expect(getFooter(container)).not.toHaveClass('focused');

    await user.keyboard('{arrowdown}');
    expect(screen.queryByText(footerText)).toBeInTheDocument();
    expect(getFooter(container)).toHaveClass('focused');
  });
});

describe('TreeMultiSelect component: keyboardConfig prop', () => {
  const fieldKeyboardConfigMatcher = (
    container: HTMLElement,
    focused: number | null
  ): void => {
    if (focused !== null) {
      if (focused === -1) {
        expect(getChipContainers(container).filter(chip => chip.classList.contains('focused'))).toHaveLength(0);
        expect(getFieldClear(container)).toHaveClass('focused');
      } else {
        expect(getChipContainers(container).filter(chip => chip.classList.contains('focused'))).toHaveLength(1);
        expect(getChipContainer(container, focused)).toHaveClass('focused');
        expect(getFieldClear(container)).not.toHaveClass('focused');
      }
    } else {
      expect(getChipContainers(container).filter(chip => chip.classList.contains('focused'))).toHaveLength(0);
      expect(getFieldClear(container)).not.toHaveClass('focused');
    }
  };

  const dropdownKeyboardConfigMatcher = (
    container: HTMLElement,
    focused: number | null
  ): void => {
    if (focused !== null) {
      if (focused === -1) {
        expect(getListItems(container).filter(item => item.classList.contains('focused'))).toHaveLength(0);
        expect(getFooter(container)).not.toHaveClass('focused');
        expect(getStickyItem(container, 0)).toHaveClass('focused');
      } else if (focused === -2) {
        expect(getListItems(container).filter(item => item.classList.contains('focused'))).toHaveLength(0);
        expect(getStickyItem(container, 0)).not.toHaveClass('focused');
        expect(getFooter(container)).toHaveClass('focused');
      } else {
        expect(getListItems(container).filter(item => item.classList.contains('focused'))).toHaveLength(1);
        expect(getListItem(container, focused)).toHaveClass('focused');
        expect(getStickyItem(container, 0)).not.toHaveClass('focused');
        expect(getFooter(container)).not.toHaveClass('focused');
      }
    } else {
      expect(getListItems(container).filter(item => item.classList.contains('focused'))).toHaveLength(0);
      expect(getStickyItem(container, 0)).not.toHaveClass('focused');
      expect(getFooter(container)).not.toHaveClass('focused');
    }
  };

  it('tests component with different field keyboard options', async () => {
    let user: UserEvent = userEvent.setup();

    const {container, rerender} = render(
      <TreeMultiSelect data={getTreeNodeData(['1', '7', '10'], [], [])}/>
    );

    fieldKeyboardConfigMatcher(container, null);

    await user.click(getField(container));
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 2);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    rerender(
      <TreeMultiSelect data={getTreeNodeData(['1', '7', '10'], [], [])} keyboardConfig={{field: {loopLeft: true}}}/>
    );
    user = userEvent.setup();
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 2);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    rerender(
      <TreeMultiSelect data={getTreeNodeData(['1', '7', '10'], [], [])} keyboardConfig={{field: {loopRight: true}}}/>
    );
    user = userEvent.setup();
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 2);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData(['7', '10', '11'], [], [])}
        keyboardConfig={{field: {loopLeft: true, loopRight: true}}}
      />
    );
    user = userEvent.setup();
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 2);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 2);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, null);

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData(['7', '10', '11'], [], [])}
        keyboardConfig={{field: {loopLeft: true, loopRight: true}}}
      />
    );
    user = userEvent.setup();
    fieldKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowright}');
    fieldKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowleft}');
    fieldKeyboardConfigMatcher(container, -1);
  });

  it('tests component with different dropdown keyboard options', async () => {
    let user: UserEvent = userEvent.setup();

    const {container, rerender} = render(
      <TreeMultiSelect
        data={[{id: '1', label: '1'}, {id: '2', label: '2'}]}
        withSelectAll
        components={{Footer: {component: CustomFooter}}}
      />
    );

    await user.click(getField(container));
    dropdownKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -2);

    rerender(
      <TreeMultiSelect
        data={[{id: '1', label: '1'}, {id: '2', label: '2'}]}
        withSelectAll
        keyboardConfig={{dropdown: {loopDown: false}}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    rerender(
      <TreeMultiSelect
        data={[{id: '1', label: '1'}, {id: '2', label: '2'}]}
        withSelectAll
        keyboardConfig={{dropdown: {loopUp: false}}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 0);

    rerender(
      <TreeMultiSelect
        data={[{id: '1', label: '1'}, {id: '2', label: '2'}]}
        withSelectAll
        keyboardConfig={{dropdown: {loopUp: false, loopDown: false}}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -2);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowup}');
    dropdownKeyboardConfigMatcher(container, -1);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 0);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, 1);

    rerender(
      <TreeMultiSelect
        data={[{id: '1', label: '1'}]}
        withSelectAll
        keyboardConfig={{dropdown: {loopUp: false, loopDown: false}}}
        components={{Footer: {component: CustomFooter}}}
      />
    );
    user = userEvent.setup();
    dropdownKeyboardConfigMatcher(container, null);

    await user.keyboard('{arrowdown}');
    dropdownKeyboardConfigMatcher(container, -1);
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

  const focusBlurMatcherAsync = async (
    container: HTMLElement,
    focused: boolean,
    opened: boolean,
    handleFocus: (event: React.FocusEvent) => void,
    focusTimes: number,
    handleBlur: (event: React.FocusEvent) => void,
    blurTimes: number
  ): Promise<void> => {
    await new Promise((r) => setTimeout(r, 10));
    focusBlurMatcher(container, focused, opened, handleFocus, focusTimes, handleBlur, blurTimes);
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

  const inputMatcherAsync = async (
    container: HTMLElement, withDropdownInput: boolean, opened: boolean
  ): Promise<void> => {
    await new Promise((r) => setTimeout(r, 10));
    inputMatcher(container, withDropdownInput, opened);
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

      await user.keyboard('{enter}');
      focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

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

      if (withDropdownInput) {
        await user.click(getDropdownInput(container));
        focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);
      }

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

  it.each([[false], [true]])(`focus/blur and open/close when withDropdownInput={%s} (click/keydown) async`,
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
      await focusBlurMatcherAsync(container, false, false, handleFocus, 0, handleBlur, 0);

      await user.keyboard('{tab}');
      await inputMatcherAsync(container, withDropdownInput, false);
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      await inputMatcherAsync(container, withDropdownInput, true);
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipContainer(container, 0));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getChipLabel(container, 0));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowdown}');
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{escape}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{escape}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getChipLabel(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      if (withDropdownInput) {
        await user.click(getDropdownInput(container));
        await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);
      }

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getFieldToggle(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{enter}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.click(getChipContainer(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{arrowup}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 1, handleBlur, 0);

      await user.keyboard('{tab}');
      await focusBlurMatcherAsync(container, false, false, handleFocus, 1, handleBlur, 1);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 2, handleBlur, 1);

      await user.keyboard('{shift}{tab}');
      await focusBlurMatcherAsync(container, false, false, handleFocus, 2, handleBlur, 2);

      await user.keyboard('{tab}');
      await focusBlurMatcherAsync(container, true, false, handleFocus, 3, handleBlur, 2);

      await user.click(getField(container));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 3, handleBlur, 2);

      await user.click(getListItem(container, 0));
      await focusBlurMatcherAsync(container, true, true, handleFocus, 3, handleBlur, 2);

      await user.click(document.body);
      await focusBlurMatcherAsync(container, false, false, handleFocus, 3, handleBlur, 3);
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

describe('TreeMultiSelect component: nodes state behavior', () => {
  const itemsStateMatcher = (
    container: HTMLElement,
    itemsState: { index: number, state: 'selected' | 'partial' | 'unselected' }[]
  ): void => {
    itemsState.forEach((item) => {
      switch (item.state) {
        case 'selected':
          expect(getListItem(container, item.index).classList.contains('selected')).toBeTruthy();
          expect(getListItem(container, item.index).classList.contains('partial')).toBeFalsy();
          break;
        case 'partial':
          expect(getListItem(container, item.index).classList.contains('selected')).toBeFalsy();
          expect(getListItem(container, item.index).classList.contains('partial')).toBeTruthy();
          break;
        default:
          expect(getListItem(container, item.index).classList.contains('selected')).toBeFalsy();
          expect(getListItem(container, item.index).classList.contains('partial')).toBeFalsy();
          break;
      }
    })
  };

  it('tests nodes state behavior when deep inner node is disabled and unselected', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData([], ['1', '2'], ['4'])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
    handleSelectAllChange.mockClear();
  });

  it('tests nodes state behavior when click disabled and unselected node', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData([], ['1', '2'], ['4', '10'])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 9, 9, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
    handleSelectAllChange.mockClear();
  });

  it('tests nodes state behavior when deep inner node is disabled and selected', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['4'], ['1', '2'], ['4'])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 6);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 2, 2);

    await user.click(getListItem(container, 3));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 2, 2);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.SELECTED, 8, 13, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1, handleSelectAllChange);
    handleSelectAllChange.mockClear();
  });

  it('tests nodes state behavior when parent inner node is disabled and one its child is selected', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['4'], ['1', '2'], ['2'])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 1));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 2));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 3));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getListItem(container, 4));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 9, 9);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getFieldClear(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'partial'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);
  });

  it('tests nodes state behavior when deep inner nodes are changing', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData([], ['11', '12', '13'], [])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 8));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 2, 2);

    await user.click(getListItem(container, 6));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 4);

    await user.click(getListItem(container, 8));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 2, 2);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 6));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'},
      {index: 13, state: 'selected'},
      {index: 14, state: 'selected'},
      {index: 15, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.SELECTED, 8, 16, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getListItem(container, 7));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'},
      {index: 13, state: 'selected'},
      {index: 14, state: 'selected'},
      {index: 15, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 12, 12);

    await user.click(getListItem(container, 6));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'partial'},
      {index: 4, state: 'partial'},
      {index: 5, state: 'partial'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'},
      {index: 13, state: 'selected'},
      {index: 14, state: 'selected'},
      {index: 15, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.PARTIAL, 11, 11);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'selected'},
      {index: 1, state: 'selected'},
      {index: 2, state: 'selected'},
      {index: 3, state: 'selected'},
      {index: 4, state: 'selected'},
      {index: 5, state: 'selected'},
      {index: 6, state: 'selected'},
      {index: 7, state: 'selected'},
      {index: 8, state: 'selected'},
      {index: 9, state: 'selected'},
      {index: 10, state: 'selected'},
      {index: 11, state: 'selected'},
      {index: 12, state: 'selected'},
      {index: 13, state: 'selected'},
      {index: 14, state: 'selected'},
      {index: 15, state: 'selected'}
    ]);
    selectAllMatcher(container, CheckedState.SELECTED, 8, 16, handleSelectAllChange);
    handleSelectAllChange.mockClear();

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'unselected'},
      {index: 1, state: 'unselected'},
      {index: 2, state: 'unselected'},
      {index: 3, state: 'unselected'},
      {index: 4, state: 'unselected'},
      {index: 5, state: 'unselected'},
      {index: 6, state: 'unselected'},
      {index: 7, state: 'unselected'},
      {index: 8, state: 'unselected'},
      {index: 9, state: 'unselected'},
      {index: 10, state: 'unselected'},
      {index: 11, state: 'unselected'},
      {index: 12, state: 'unselected'},
      {index: 13, state: 'unselected'},
      {index: 14, state: 'unselected'},
      {index: 15, state: 'unselected'}
    ]);
    selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
    handleSelectAllChange.mockClear();
  });

  it('tests nodes state behavior when deep inner node is disabled and deselected and all other descendants are selected',
    async () => {
      const user: UserEvent = userEvent.setup();

      const handleSelectAllChange = jest.fn();
      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData(['4', '5', '6'], ['1', '2'], ['3'])}
          withSelectAll
          isVirtualized={false}
          onSelectAllChange={handleSelectAllChange}
        />
      );

      await user.click(getField(container));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'partial'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'selected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'selected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

      await user.click(getListItem(container, 0));
      itemsStateMatcher(container, [
        {index: 0, state: 'unselected'},
        {index: 1, state: 'unselected'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'unselected'},
        {index: 4, state: 'unselected'},
        {index: 5, state: 'unselected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0);

      await user.click(getListItem(container, 0));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'partial'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'selected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'selected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);

      await user.click(getStickyItem(container, 0));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'partial'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'selected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'selected'},
        {index: 6, state: 'selected'},
        {index: 7, state: 'selected'},
        {index: 8, state: 'selected'},
        {index: 9, state: 'selected'},
        {index: 10, state: 'selected'},
        {index: 11, state: 'selected'},
        {index: 12, state: 'selected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 10, 10, handleSelectAllChange);
      handleSelectAllChange.mockClear();

      await user.click(getStickyItem(container, 0));
      itemsStateMatcher(container, [
        {index: 0, state: 'unselected'},
        {index: 1, state: 'unselected'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'unselected'},
        {index: 4, state: 'unselected'},
        {index: 5, state: 'unselected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.UNSELECTED, 0, 0, handleSelectAllChange);
      handleSelectAllChange.mockClear();

      await user.click(getListItem(container, 4));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'unselected'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'unselected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'unselected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 1, 1);

      await user.click(getListItem(container, 5));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'unselected'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'unselected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'selected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 2, 2);

      await user.click(getListItem(container, 0));
      itemsStateMatcher(container, [
        {index: 0, state: 'partial'},
        {index: 1, state: 'partial'},
        {index: 2, state: 'unselected'},
        {index: 3, state: 'selected'},
        {index: 4, state: 'selected'},
        {index: 5, state: 'selected'},
        {index: 6, state: 'unselected'},
        {index: 7, state: 'unselected'},
        {index: 8, state: 'unselected'},
        {index: 9, state: 'unselected'},
        {index: 10, state: 'unselected'},
        {index: 11, state: 'unselected'},
        {index: 12, state: 'unselected'}
      ]);
      selectAllMatcher(container, CheckedState.PARTIAL, 3, 3);
    });
});
