import '@testing-library/jest-dom';

import React, {createRef, FC} from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent, {UserEvent} from '@testing-library/user-event';
import {
  buildVirtualFocusId,
  CLEAR_ALL_SUFFIX,
  DROPDOWN_PREFIX,
  FIELD_PREFIX,
  FooterProps,
  INPUT_SUFFIX,
  SELECT_ALL_SUFFIX,
  SelectionAggregateState,
  TreeMultiSelect,
  TreeMultiSelectHandle,
  TreeNode,
  Type
} from '../index';
import {INPUT_PLACEHOLDER, NO_DATA_TEXT, NO_MATCHES_TEXT} from '../constants';
import {
  baseExpandedIds,
  baseSelectedIds,
  baseTreeNodeData,
  generateRandomTreeNodesWithHasChildren,
  getTreeNodeData,
  randomString
} from './testutils/dataUtils';
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
import {
  expansionMatcher,
  isDropdownOpenFullMatcher,
  isDropdownOpenMatcher,
  noDataTextMatcher,
  selectAllFullMatcher,
  selectAllMatcher,
  selectionMatcher
} from './testutils/matcherUtils';
import {LoadDataTestWrapper} from './testwrappers/LoadDataTestWrapper';
import {LoadChildrenTestWrapper} from './testwrappers/LoadChildrenTestWrapper';

const inputVirtualFocusId = buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX);
const clearAllVirtualFocusId = buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX);
const selectAllVirtualFocusId = buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX);

const footerText = 'Custom Footer';
const CustomFooter: FC<FooterProps> = (props) => {
  return (
    <div {...props.attributes}>
      <label>{footerText}</label>
    </div>
  );
};

describe('TreeMultiSelect component: base', () => {
  it('renders component', () => {
    render(<TreeMultiSelect data={baseTreeNodeData} selectedIds={baseSelectedIds} expandedIds={baseExpandedIds}/>);

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
    [true, Type.SINGLE_SELECT], [false, Type.SINGLE_SELECT]])(
    'tests component with default inputPlaceholder and withDropdownInput={%s} and component type={%s}',
    async (withDropdownInput, type) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData([])}
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
    ['some text', true, Type.SINGLE_SELECT], ['some text', false, Type.SINGLE_SELECT]])(
    'tests component when inputPlaceholder={%s} and withDropdownInput={%s} and component type={%s}',
    async (inputPlaceholder, withDropdownInput, type) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData([])}
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
  it('tests component with default noDataText', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={[]}/>
    );

    await user.click(getField(container));
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('qwerty');
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('{Control>}a{Backspace}');
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await user.keyboard('java');
    noDataTextMatcher(container, NO_DATA_TEXT, true);
  });

  it.each([['no options'], ['no items']])('tests component when noDataText={%s}',
    async (noDataText) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect data={[]} noDataText={noDataText}/>
      );

      await user.click(getField(container));
      noDataTextMatcher(container, noDataText, true);

      await user.keyboard('qwerty');
      noDataTextMatcher(container, noDataText, true);

      await user.keyboard('{Control>}a{Backspace}');
      noDataTextMatcher(container, noDataText, true);

      await user.keyboard('java');
      noDataTextMatcher(container, noDataText, true);
    });

  it('tests component with default noMatchesText', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={baseTreeNodeData} selectedIds={baseSelectedIds} expandedIds={baseExpandedIds}/>
    );

    await user.click(getField(container));
    noDataTextMatcher(container, NO_MATCHES_TEXT, false);

    await user.keyboard('qwerty');
    noDataTextMatcher(container, NO_MATCHES_TEXT, true);

    await user.keyboard('{Control>}a{Backspace}');
    noDataTextMatcher(container, NO_MATCHES_TEXT, false);

    await user.keyboard('java');
    noDataTextMatcher(container, NO_MATCHES_TEXT, false);
  });

  it.each([['not found'], ['no items found']])('tests component when noMatchesText={%s}',
    async (noMatchesText) => {
      const user: UserEvent = userEvent.setup();

      const {container} = render(
        <TreeMultiSelect
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
          noMatchesText={noMatchesText}
        />
      );

      await user.click(getField(container));
      noDataTextMatcher(container, noMatchesText, false);

      await user.keyboard('qwerty');
      noDataTextMatcher(container, noMatchesText, true);

      await user.keyboard('{Control>}a{Backspace}');
      noDataTextMatcher(container, noMatchesText, false);

      await user.keyboard('java');
      noDataTextMatcher(container, noMatchesText, false);
    });
});

describe('TreeMultiSelect component: isDisabled prop', () => {
  const isDisabledMatcher = (
    container: HTMLElement,
    withDropdownInput: boolean,
    isDropdownOpen: boolean,
    handleFocus: (event: React.FocusEvent) => void,
    handleBlur: (event: React.FocusEvent) => void,
    handleNodeChange: (node: TreeNode, selectedIds: string[]) => void,
    handleNodeToggle: (node: TreeNode, expandedIds: string[]) => void,
    handleClearAll: (selectedIds: string[], selectionAggregateState?: SelectionAggregateState) => void
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
    if (isDropdownOpen) {
      expect(getDropdown(container)).toBeInTheDocument();
    } else {
      expect(getDropdown(container)).not.toBeInTheDocument();
    }
    expect(getChipContainers(container).length).toBe(8);
  };

  it.each([[true, true], [false, true], [true, false], [false, false]])(
    'tests component when isDisabled=true and withDropdownInput={%s} and isDropdownOpen={%s}',
    async (withDropdownInput, isDropdownOpen) => {
      const user: UserEvent = userEvent.setup();

      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const handleNodeChange = jest.fn();
      const handleNodeToggle = jest.fn();
      const handleClearAll = jest.fn();
      const {container} = render(
        <TreeMultiSelect
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
          isDisabled={true}
          withDropdownInput={withDropdownInput}
          isDropdownOpen={isDropdownOpen}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggle}
          onClearAll={handleClearAll}
        />
      );

      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getField(container));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getFieldClear(container));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(document.body);
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getFieldToggle(container));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{tab}');
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{shift}{tab}');
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(document.body);
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.keyboard('{tab}');
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipContainer(container, 1));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipLabel(container, 1));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      await user.click(getChipClear(container, 1));
      isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);

      if (isDropdownOpen) {
        await user.click(getListItem(container, 0));
        isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);
        if (!withDropdownInput) {
          await user.click(getNodeToggle(container, 0));
          isDisabledMatcher(container, withDropdownInput, isDropdownOpen, handleFocus, handleBlur, handleNodeChange, handleNodeToggle, handleClearAll);
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
        <TreeMultiSelect
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
          isSearchable={isSearchable}
          withDropdownInput={withDropdownInput}
        />
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
    chipClearsCount: number,
    handleNodeChange: (node: TreeNode, selectedIds: string[]) => void,
    nodeChangeTimes: number
  ): void => {
    if (withChipClear) {
      expect(getChipClears(container).length).toBe(chipClearsCount);
      expect(handleNodeChange).toHaveBeenCalledTimes(nodeChangeTimes);
    } else {
      expect(getChipClears(container).length).toBe(chipClearsCount);
      expect(handleNodeChange).not.toHaveBeenCalled();
    }
  };

  it.each([[true], [false]])('tests component when withChipClear={%s} (click)', async (withChipClear) => {
    const user: UserEvent = userEvent.setup();

    const handleNodeChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        data={baseTreeNodeData}
        defaultSelectedIds={baseSelectedIds}
        defaultExpandedIds={baseExpandedIds}
        withChipClear={withChipClear}
        onNodeChange={handleNodeChange}
      />
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
      <TreeMultiSelect
        data={baseTreeNodeData}
        defaultSelectedIds={baseSelectedIds}
        defaultExpandedIds={baseExpandedIds}
        withChipClear={withChipClear}
        onNodeChange={handleNodeChange}
      />
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
    chipsCount: number,
    selectedNodesCount: number,
    handleClearAll?: jest.Mock
  ): void => {
    if (withClearAll) {
      expect(getFieldClear(container)).toBeInTheDocument();
    } else {
      expect(getFieldClear(container)).not.toBeInTheDocument();
    }
    expect(getChipContainers(container).length).toBe(chipsCount);
    const selectedNodes = getListItems(container).filter(el => el.classList.contains('selected'));
    expect(selectedNodes.length).toBe(selectedNodesCount);
    if (handleClearAll) {
      expect(handleClearAll).toHaveBeenCalledTimes(1);
      handleClearAll.mockClear();
    }
  };

  it.each([[true, true], [false, true], [true, false], [false, false]])(
    'tests component when withClearAll={%s} and data presents={%s}',
    async (withClearAll, presents) => {
      const user: UserEvent = userEvent.setup();
      const {container, rerender} = render(
        <TreeMultiSelect
          data={presents ? getTreeNodeData([]) : []}
          defaultSelectedIds={['1']}
          withClearAll={withClearAll ? undefined : withClearAll}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData([]) : []}
          defaultSelectedIds={['1']}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.TREE_SELECT_FLAT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData([]) : []}
          defaultSelectedIds={['1']}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.MULTI_SELECT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      rerender(
        <TreeMultiSelect
          data={presents ? getTreeNodeData([]) : []}
          defaultSelectedIds={['1']}
          withClearAll={withClearAll ? undefined : withClearAll}
          type={Type.SINGLE_SELECT}
        />
      );
      withClearAllPresentsMatcher(container, withClearAll, presents);

      await user.click(getFieldClear(container));
      rerender(
        <TreeMultiSelect
          data={getTreeNodeData([])}
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
        data={getTreeNodeData(['8'])}
        defaultSelectedIds={['8']}
        defaultExpandedIds={['7']}
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

    await user.click(getListItem(container, 0));
    withClearAllMatcher(container, true, 2, 2);

    await user.click(getField(container));
    await user.keyboard('{enter}');
    await user.keyboard('{arrowright}');
    await user.keyboard('{Backspace}');
    withClearAllMatcher(container, false, 1, 1, handleClearAll);

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData([])}
        defaultSelectedIds={['8']}
        defaultExpandedIds={['7']}
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

    await user.click(getStickyItem(container, 0));
    withClearAllMatcher(container, true, 8, 10);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);

    rerender(
      <TreeMultiSelect
        data={getTreeNodeData(['8'])}
        defaultExpandedIds={['7']}
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

    await user.click(getStickyItem(container, 0));
    withClearAllMatcher(container, true, 8, 8);

    await user.click(getFieldClear(container));
    withClearAllMatcher(container, false, 0, 0, handleClearAll);

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
      <TreeMultiSelect data={getTreeNodeData([])} onSelectAllChange={handleSelectAllChange}/>
    );

    await user.click(getField(container));
    expect(getStickyItems(container).length).toBe(0);
  });

  it('tests component when withSelectAll=true and component type=SELECT', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const treeNodeData = getTreeNodeData([]);

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
        type={Type.SINGLE_SELECT}
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
        data={getTreeNodeData([])}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 8, handleSelectAllChange);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);

    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 8, handleSelectAllChange);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 7, 7);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 6, 6);

    await user.keyboard('{arrowup}');
    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 8, handleSelectAllChange);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 11);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{arrowright}');
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13);

    await user.keyboard('{arrowdown}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10);

    await user.keyboard('{arrowup}');
    await user.keyboard('{enter}');
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13);

    await user.click(getListItem(container, 5));
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 9, 11);

    await user.click(getListItem(container, 10));
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 8, 10);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13, handleSelectAllChange);

    await user.click(getStickyItem(container, 0));
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);

    await user.click(getListItem(container, 4));
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 0));
    await user.click(getListItem(container, 6));
    await user.click(getListItem(container, 7));
    await user.click(getListItem(container, 8));
    await user.click(getListItem(container, 9));
    await user.click(getListItem(container, 10));
    await user.click(getListItem(container, 11));
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 7, 12);

    await user.click(getListItem(container, 12));
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13);

    await user.click(getField(container));
    expect(getDropdown(container)).not.toBeInTheDocument();
    expect(getChipContainers(container).length).toBe(8);

    await user.click(getField(container));
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13);
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
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
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

describe('TreeMultiSelect component: isDropdownOpen and onDropdownToggle props', () => {
  it('tests uncontrolled component', async () => {
    const user: UserEvent = userEvent.setup();

    const handleDropdownToggle = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        data={baseTreeNodeData}
        selectedIds={baseSelectedIds}
        expandedIds={baseExpandedIds}
        onDropdownToggle={handleDropdownToggle}
      />
    );

    isDropdownOpenMatcher(container, false, handleDropdownToggle, null);

    await user.click(getField(container));
    isDropdownOpenMatcher(container, true, handleDropdownToggle, true);

    await user.keyboard('{arrowup}');
    isDropdownOpenMatcher(container, false, handleDropdownToggle, false);

    await user.keyboard('{arrowdown}');
    isDropdownOpenMatcher(container, true, handleDropdownToggle, true);

    await user.keyboard('{escape}');
    isDropdownOpenMatcher(container, false, handleDropdownToggle, false);

    await user.click(getFieldToggle(container));
    isDropdownOpenMatcher(container, true, handleDropdownToggle, true);

    await user.click(getFieldToggle(container));
    isDropdownOpenMatcher(container, false, handleDropdownToggle, false);

    await user.click(getChipContainer(container, 0));
    isDropdownOpenMatcher(container, true, handleDropdownToggle, true);

    await user.click(getFieldInput(container));
    isDropdownOpenMatcher(container, false, handleDropdownToggle, false);
  });

  it('tests controlled component', async () => {
    let user: UserEvent = userEvent.setup();

    const handleDropdownToggle = jest.fn();

    const {container, rerender} = render(
      <TreeMultiSelect
        data={baseTreeNodeData}
        selectedIds={baseSelectedIds}
        expandedIds={baseExpandedIds}
        isDropdownOpen={true}
        onDropdownToggle={handleDropdownToggle}
      />
    );

    isDropdownOpenMatcher(container, true, handleDropdownToggle, null);

    await user.click(getField(container));
    isDropdownOpenMatcher(container, true, handleDropdownToggle, false);

    rerender(
      <TreeMultiSelect
        data={baseTreeNodeData}
        selectedIds={baseSelectedIds}
        expandedIds={baseExpandedIds}
        isDropdownOpen={false}
        onDropdownToggle={handleDropdownToggle}
      />
    );
    user = userEvent.setup();
    isDropdownOpenMatcher(container, false, handleDropdownToggle, null);

    await user.click(getField(container));
    isDropdownOpenMatcher(container, false, handleDropdownToggle, true);
  });
});

describe('TreeMultiSelect component: dropdownHeight prop', () => {
  it('tests component with default dropdownHeight', async () => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={baseTreeNodeData} selectedIds={baseSelectedIds} expandedIds={baseExpandedIds}/>
    );

    await user.click(getField(container));

    const dropdown = getDropdown(container);
    expect(dropdown).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(dropdown);
    expect(computedStyles.maxHeight).toEqual('300px');
  });

  it.each([[100], [200], [400]])('tests component when dropdownHeight={%s}', async (dropdownHeight) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect
        data={baseTreeNodeData}
        selectedIds={baseSelectedIds}
        expandedIds={baseExpandedIds}
        dropdownHeight={dropdownHeight}
      />
    );

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
    counts: number[]
  ): void => {
    expect(getListItems(container).length).toBe(counts[overscan]);
  };

  it.each([[0], [1], [2]])('tests component when overscan={%s}', async (overscan) => {
    const user: UserEvent = userEvent.setup();

    const {container} = render(
      <TreeMultiSelect data={getTreeNodeData([])} overscan={overscan === 1 ? undefined : overscan}/>
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
      <TreeMultiSelect
        data={baseTreeNodeData}
        defaultSelectedIds={baseSelectedIds}
        defaultExpandedIds={baseExpandedIds}
        isVirtualized={isVirtualized ? undefined : isVirtualized}
      />
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
      <TreeMultiSelect data={getTreeNodeData([])}/>
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
      <TreeMultiSelect data={getTreeNodeData([])} components={{Footer: {component: CustomFooter}}}/>
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
        data={getTreeNodeData([])}
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
        data={getTreeNodeData([])}
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
        data={getTreeNodeData([])}
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
      <TreeMultiSelect data={getTreeNodeData([])} components={{Footer: {component: CustomFooter}}}/>
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
      <TreeMultiSelect data={getTreeNodeData([])} selectedIds={['1', '7', '10']}/>
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
      <TreeMultiSelect
        data={getTreeNodeData([])}
        selectedIds={['1', '7', '10']}
        keyboardConfig={{field: {loopLeft: true}}}
      />
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
      <TreeMultiSelect
        data={getTreeNodeData([])}
        selectedIds={['1', '7', '10']}
        keyboardConfig={{field: {loopRight: true}}}
      />
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
        data={getTreeNodeData([])}
        selectedIds={['7', '10', '11']}
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
        data={getTreeNodeData([])}
        selectedIds={['7', '10', '11']}
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
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
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
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
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
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
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
          data={baseTreeNodeData}
          selectedIds={baseSelectedIds}
          expandedIds={baseExpandedIds}
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
        data={baseTreeNodeData}
        selectedIds={baseSelectedIds}
        expandedIds={baseExpandedIds}
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
        data={getTreeNodeData(['4'])}
        defaultExpandedIds={['1', '2']}
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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10, handleSelectAllChange);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);
  });

  it('tests nodes state behavior when click disabled and unselected node', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['4', '10'])}
        expandedIds={['1', '2']}
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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 9, 9, handleSelectAllChange);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);
  });

  it('tests nodes state behavior when deep inner node is disabled and selected', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['4'])}
        defaultSelectedIds={['4']}
        defaultExpandedIds={['1', '2']}
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 6);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 2, 2);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 2, 2);

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
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 13, handleSelectAllChange);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1, handleSelectAllChange);
  });

  it('tests nodes state behavior when parent inner node is disabled and one its child is selected', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData(['2', '3', '4'])}
        defaultSelectedIds={['4']}
        defaultExpandedIds={['1', '2']}
        withSelectAll
        isVirtualized={false}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    await user.click(getField(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

    await user.click(getListItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 1));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 2));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getListItem(container, 3));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10, handleSelectAllChange);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1, handleSelectAllChange);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10, handleSelectAllChange);

    await user.click(getListItem(container, 4));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 9, 9);

    await user.click(getStickyItem(container, 0));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10, handleSelectAllChange);

    await user.click(getFieldClear(container));
    itemsStateMatcher(container, [
      {index: 0, state: 'partial'},
      {index: 1, state: 'unselected'},
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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);
  });

  it('tests nodes state behavior when deep inner nodes are changing', async () => {
    const user: UserEvent = userEvent.setup();

    const handleSelectAllChange = jest.fn();
    const {container} = render(
      <TreeMultiSelect
        data={getTreeNodeData([])}
        expandedIds={['11', '12', '13']}
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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 2, 2);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 4);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 2, 2);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 16, handleSelectAllChange);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 12, 12);

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
    selectAllMatcher(container, SelectionAggregateState.PARTIAL, 11, 11);

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
    selectAllMatcher(container, SelectionAggregateState.ALL, 8, 16, handleSelectAllChange);

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
    selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);
  });

  it('tests nodes state behavior when deep inner node is disabled and unselected and all other descendants are selected',
    async () => {
      const user: UserEvent = userEvent.setup();

      const handleSelectAllChange = jest.fn();
      const {container} = render(
        <TreeMultiSelect
          data={getTreeNodeData(['3'])}
          defaultSelectedIds={['4', '5', '6']}
          defaultExpandedIds={['1', '2']}
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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

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
      selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0);

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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);

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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 10, 10, handleSelectAllChange);

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
      selectAllMatcher(container, SelectionAggregateState.NONE, 0, 0, handleSelectAllChange);

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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 1, 1);

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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 2, 2);

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
      selectAllMatcher(container, SelectionAggregateState.PARTIAL, 3, 3);
    });
});

describe('TreeMultiSelect component: imperative API', () => {
  it('tests sync imperative API', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        ref={rtmsRef}
        data={getTreeNodeData([])}
        defaultSelectedIds={baseSelectedIds}
        defaultExpandedIds={baseExpandedIds}
        withSelectAll={true}
        isVirtualized={false}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onSelectAllChange={handleSelectAllChange}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);

    await act(async () => rtmsRef.current!.closeDropdown());
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, false);

    await act(async () => rtmsRef.current!.toggleDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);

    await act(async () => rtmsRef.current!.toggleDropdown());
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, false);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);

    await act(async () => rtmsRef.current!.selectAll());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 8, 21, handleSelectAllChange);

    await act(async () => rtmsRef.current!.deselectAll());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0, handleSelectAllChange);

    await act(async () => rtmsRef.current!.toggleAllSelection());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 8, 21, handleSelectAllChange);

    await act(async () => rtmsRef.current!.toggleAllSelection());
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0, handleSelectAllChange);

    await act(async () => rtmsRef.current!.closeDropdown());
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, false);

    await act(async () => rtmsRef.current!.selectAll());
    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 8, 21, handleSelectAllChange);

    await act(async () => rtmsRef.current!.closeDropdown());
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, false);

    await act(async () => rtmsRef.current!.deselectAll());
    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0, handleSelectAllChange);

    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expansionMatcher(['1', '2', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    await act(async () => rtmsRef.current!.collapseNode('1'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expansionMatcher(['2', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await user.keyboard('j');
    expect(getFieldInput(container)).toHaveValue('j');
    expect(rtmsRef.current!.getState().inputValue).toEqual('j');
    expansionMatcher(['1', '2', '11', '36'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);

    await act(async () => rtmsRef.current!.collapseNode('1'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expansionMatcher(['2', '11', '36'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.expandNode('1'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expansionMatcher(['1', '2', '11', '36'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await user.keyboard('a');
    expect(getFieldInput(container)).toHaveValue('ja');
    expect(rtmsRef.current!.getState().inputValue).toEqual('ja');
    expansionMatcher(['1', '11', '36'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);

    await user.keyboard('{Control>}a{Backspace}');
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    expansionMatcher(['2', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);

    await act(async () => rtmsRef.current!.collapseNode('2'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expansionMatcher(['11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.focusFirstItem(DROPDOWN_PREFIX));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(selectAllVirtualFocusId);

    await act(async () => rtmsRef.current!.focusNextItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));

    await act(async () => rtmsRef.current!.toggleNodeExpansion());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));
    expansionMatcher(['1', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.toggleNodeExpansion('2'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));
    expansionMatcher(['1', '2', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.focusPrevItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(selectAllVirtualFocusId);

    await act(async () => rtmsRef.current!.focusNextItem(buildVirtualFocusId(DROPDOWN_PREFIX, '1')));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));

    await act(async () => rtmsRef.current!.collapseNode());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));
    expansionMatcher(['1', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.expandNode());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));
    expansionMatcher(['1', '2', '11', '12', '40'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);

    await act(async () => rtmsRef.current!.focusFirstItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(selectAllVirtualFocusId);

    await act(async () => rtmsRef.current!.focusPrevItem(buildVirtualFocusId(DROPDOWN_PREFIX, '2')));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));

    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    await act(async () => rtmsRef.current!.selectNode());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));
    selectionMatcher(['1', '2', '3', '4', '5', '6'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);

    await act(async () => rtmsRef.current!.deselectNode('4'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));
    selectionMatcher(['3', '5', '6'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);

    await act(async () => rtmsRef.current!.selectNode('4'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '1'));
    selectionMatcher(['1', '2', '3', '4', '5', '6'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);

    await act(async () => rtmsRef.current!.focusNextItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));

    await act(async () => rtmsRef.current!.deselectNode());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));
    selectionMatcher(['5', '6'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 2, 2);

    await act(async () => rtmsRef.current!.focusLastItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '43'));

    await act(async () => rtmsRef.current!.toggleNodeSelection());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '43'));
    selectionMatcher(['5', '6', '43'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 3, 3);

    await act(async () => rtmsRef.current!.toggleNodeSelection('6'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '43'));
    selectionMatcher(['5', '43'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 2, 2);

    await act(async () => rtmsRef.current!.focusFirstItem(FIELD_PREFIX));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(FIELD_PREFIX, '5'));

    await act(async () => rtmsRef.current!.toggleNodeSelection('6'));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(FIELD_PREFIX, '5'));
    selectionMatcher(['5', '6', '43'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 3, 3);

    await act(async () => rtmsRef.current!.focusNextItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(FIELD_PREFIX, '6'));

    await act(async () => rtmsRef.current!.focusLastItem());
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(clearAllVirtualFocusId);

    await act(async () => rtmsRef.current!.focusLastItem(DROPDOWN_PREFIX));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '43'));

    await act(async () => rtmsRef.current!.focusLastItem(FIELD_PREFIX));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(clearAllVirtualFocusId);

    await act(async () => rtmsRef.current!.focusNextItem(buildVirtualFocusId(DROPDOWN_PREFIX, '1')));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(DROPDOWN_PREFIX, '2'));

    await act(async () => rtmsRef.current!.focusFirstItem(FIELD_PREFIX));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(buildVirtualFocusId(FIELD_PREFIX, '5'));

    await act(async () => rtmsRef.current!.focusNextItem(buildVirtualFocusId(FIELD_PREFIX, '43')));
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);

    const jsNode = rtmsRef.current!.getById('1');
    expect(jsNode).not.toBeUndefined();
    expect(jsNode).not.toBeNull();

    expect(jsNode.label).toEqual('JavaScript');

    const springNode = rtmsRef.current!.getById('12');
    expect(springNode).not.toBeUndefined();
    expect(springNode).not.toBeNull();

    expect(springNode.label).toEqual('Spring');

    const notExistNode = rtmsRef.current!.getById('123');
    expect(notExistNode).toBeUndefined();
  });

  it('tests imperative loadData empty', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();
    const handleLoadData = jest.fn();

    const {container} = render(
      <TreeMultiSelect
        ref={rtmsRef}
        data={[{id: '0', label: '0', children: [{id: '0.0', label: '0.0'}]}, {id: '1', label: '1'}]}
        defaultExpandedIds={['0']}
        withSelectAll
        isVirtualized={false}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onSelectAllChange={handleSelectAllChange}
        onLoadData={handleLoadData}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    expect(handleLoadData).not.toHaveBeenCalled();
    expect(getListItems(container).length).toBe(3);
    expansionMatcher(['0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.loadData());
    expect(handleLoadData).toHaveBeenCalledTimes(1);
    handleLoadData.mockClear();
    expect(getListItems(container).length).toBe(3);
    expansionMatcher(['0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.selectNode('0'));
    expect(handleLoadData).not.toHaveBeenCalled();
    expect(getListItems(container).length).toBe(3);
    expansionMatcher(['0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 2);

    await act(async () => rtmsRef.current!.loadData());
    expect(handleLoadData).toHaveBeenCalledTimes(1);
    handleLoadData.mockClear();
    expect(getListItems(container).length).toBe(3);
    expansionMatcher(['0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 2);
  });

  it('tests imperative loadData basic', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <LoadDataTestWrapper
        ref={rtmsRef}
        handleDropdownToggle={handleDropdownToggle}
        handleNodeChange={handleNodeChange}
        handleNodeToggle={handleNodeToggle}
        handleSelectAllChange={handleSelectAllChange}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await act(async () => rtmsRef.current!.loadData());
    noDataTextMatcher(container, NO_DATA_TEXT, false);
    expect(getListItems(container).length).toBe(6);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.selectAll());
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 2, 6, handleSelectAllChange);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(12);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 2, 6);

    await act(async () => rtmsRef.current!.selectAll());
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 4, 12, handleSelectAllChange);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(18);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 4, 12);
  });

  it('tests imperative loadData expandedIds', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <LoadDataTestWrapper
        ref={rtmsRef}
        handleDropdownToggle={handleDropdownToggle}
        handleNodeChange={handleNodeChange}
        handleNodeToggle={handleNodeToggle}
        handleSelectAllChange={handleSelectAllChange}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await act(async () => rtmsRef.current!.loadData());
    noDataTextMatcher(container, NO_DATA_TEXT, false);
    expect(getListItems(container).length).toBe(6);
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.selectAll());
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 2, 6, handleSelectAllChange);

    await act(async () => rtmsRef.current!.toggleNodeExpansion('0'));
    expect(getListItems(container).length).toBe(4);
    expansionMatcher(['1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 2, 4);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(10);
    expansionMatcher(['1', '2', '3'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 2, 4);

    await act(async () => rtmsRef.current!.selectAll());
    expansionMatcher(['1', '2', '3'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 4, 10, handleSelectAllChange);

    await act(async () => rtmsRef.current!.toggleNodeExpansion('3'));
    expect(getListItems(container).length).toBe(8);
    expansionMatcher(['1', '2'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 4, 8);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(14);
    expansionMatcher(['1', '2', '4', '5'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 4, 8);

    await act(async () => rtmsRef.current!.toggleNodeExpansion('3'));
    expect(getListItems(container).length).toBe(16);
    expansionMatcher(['1', '2', '3', '4', '5'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 4, 10);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(22);
    expansionMatcher(['1', '2', '3', '4', '5', '6', '7'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 4, 10);
  });

  it('tests imperative loadData selectedIds', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();

    const {container} = render(
      <LoadDataTestWrapper
        ref={rtmsRef}
        handleDropdownToggle={handleDropdownToggle}
        handleNodeChange={handleNodeChange}
        handleNodeToggle={handleNodeToggle}
        handleSelectAllChange={handleSelectAllChange}
        withSelectedLoadedData
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    noDataTextMatcher(container, NO_DATA_TEXT, true);

    await act(async () => rtmsRef.current!.loadData());
    noDataTextMatcher(container, NO_DATA_TEXT, false);
    expect(getListItems(container).length).toBe(6);
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0', '0.0', '0.1', '1', '1.0', '1.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 2, 6);

    await act(async () => rtmsRef.current!.deselectNode('0.0'));
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0.1', '1', '1.0', '1.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 2, 4);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(12);
    expansionMatcher(['0', '1', '2', '3'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 4, 10);

    await act(async () => rtmsRef.current!.deselectNode('3'));
    expansionMatcher(['0', '1', '2', '3'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['0.1', '1', '1.0', '1.1', '2', '2.0', '2.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 3, 7);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(18);
    expansionMatcher(['0', '1', '2', '3', '4', '5'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(
      ['0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '4', '4.0', '4.1', '5', '5.0', '5.1'],
      rtmsRef.current!.getState().selectedIds,
      handleNodeChange,
      0
    );
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 5, 13);

    await act(async () => rtmsRef.current!.toggleAllSelection());
    expect(getListItems(container).length).toBe(18);
    expansionMatcher(['0', '1', '2', '3', '4', '5'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(
      ['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1', '4', '4.0', '4.1', '5', '5.0', '5.1'],
      rtmsRef.current!.getState().selectedIds,
      handleNodeChange,
      0
    );
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 6, 18, handleSelectAllChange);

    await act(async () => rtmsRef.current!.loadData());
    expect(getListItems(container).length).toBe(24);
    expansionMatcher(['0', '1', '2', '3', '4', '5', '6', '7'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(
      ['0', '0.0', '0.1', '1', '1.0', '1.1', '2', '2.0', '2.1', '3', '3.0', '3.1', '4', '4.0', '4.1', '5', '5.0', '5.1', '6', '6.0', '6.1', '7', '7.0', '7.1'],
      rtmsRef.current!.getState().selectedIds,
      handleNodeChange,
      0
    );
    selectAllFullMatcher(container, SelectionAggregateState.ALL, rtmsRef.current!.getState().selectionAggregateState, 8, 24);
  });
});

describe('TreeMultiSelect component: onLoadChildren prop', () => {
  it('tests onLoadChildren basic', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();
    const handleLoadChildrenMock = jest.fn();

    let withChildren = true;

    const handleLoadChildren = (id: string): Promise<TreeNode[]> => {
      handleLoadChildrenMock(id);
      return new Promise((resolve) => {
        const loadedChildren = generateRandomTreeNodesWithHasChildren(2, withChildren, id);
        if (!withChildren) {
          loadedChildren.forEach(child => {
            const childChildren: TreeNode[] = [];
            for (let i = 0; i < loadedChildren.length; i++) {
              childChildren.push({id: `${child.id}.${i}`, label: randomString(20), hasChildren: true});
            }
            child.children = childChildren;
          });
        }
        resolve(loadedChildren);
      });
    };

    const {container} = render(
      <TreeMultiSelect
        ref={rtmsRef}
        data={generateRandomTreeNodesWithHasChildren(2, true)}
        withSelectAll={true}
        isVirtualized={false}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onSelectAllChange={handleSelectAllChange}
        onLoadChildren={handleLoadChildren}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    expect(getListItems(container).length).toBe(2);
    expansionMatcher([], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.expandNode('0'));
    expect(getListItems(container).length).toBe(4);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.expandNode('1'));
    expect(getListItems(container).length).toBe(6);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.selectNode('1.0'));
    expect(getListItems(container).length).toBe(6);
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['1.0'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 1);

    await act(async () => rtmsRef.current!.expandNode('1.0'));
    expect(getListItems(container).length).toBe(8);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0', '1', '1.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 3);

    await act(async () => rtmsRef.current!.collapseNode('1.0'));
    expect(getListItems(container).length).toBe(6);
    expect(handleLoadChildrenMock).not.toHaveBeenCalled();
    expansionMatcher(['0', '1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 1);

    await act(async () => rtmsRef.current!.expandNode('1.0'));
    expect(getListItems(container).length).toBe(8);
    expect(handleLoadChildrenMock).not.toHaveBeenCalled();
    expansionMatcher(['0', '1', '1.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 3);

    await act(async () => rtmsRef.current!.expandNode('1.0.0'));
    expect(getListItems(container).length).toBe(10);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0', '1', '1.0', '1.0.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.0.0', '1.0.0.1', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 5);

    withChildren = false;
    await act(async () => rtmsRef.current!.expandNode('0.0'));
    expect(getListItems(container).length).toBe(12);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0', '0.0', '1', '1.0', '1.0.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.0.0', '1.0.0.1', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 5);

    await act(async () => rtmsRef.current!.expandNode('0.0.0'));
    expect(getListItems(container).length).toBe(14);
    expect(handleLoadChildrenMock).not.toHaveBeenCalled();
    expansionMatcher(['0', '0.0', '0.0.0', '1', '1.0', '1.0.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.0.0', '1.0.0.1', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 5);

    await act(async () => rtmsRef.current!.expandNode('0.0.0.0'));
    expect(getListItems(container).length).toBe(16);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['0', '0.0', '0.0.0', '0.0.0.0', '1', '1.0', '1.0.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.0.0', '1.0.0.1', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 5);
  });

  it('tests onLoadChildren controlled selectedIds', async () => {
    const user: UserEvent = userEvent.setup();

    const rtmsRef = createRef<TreeMultiSelectHandle>();

    const handleDropdownToggle = jest.fn();
    const handleNodeChange = jest.fn();
    const handleNodeToggle = jest.fn();
    const handleSelectAllChange = jest.fn();
    const handleLoadChildrenMock = jest.fn();

    const {container} = render(
      <LoadChildrenTestWrapper
        ref={rtmsRef}
        handleDropdownToggle={handleDropdownToggle}
        handleNodeChange={handleNodeChange}
        handleNodeToggle={handleNodeToggle}
        handleSelectAllChange={handleSelectAllChange}
        handleLoadChildren={handleLoadChildrenMock}
        selectedIds={['1.0']}
      />
    );

    expect(rtmsRef.current).not.toBeNull();

    await user.keyboard('{tab}');
    expect(container.contains(document.activeElement)).toBeTruthy();
    expect(getRootContainer(container)).toHaveClass('focused');
    expect(rtmsRef.current!.getState().virtualFocusId).toEqual(inputVirtualFocusId);
    expect(rtmsRef.current!.getState().inputValue).toEqual('');
    isDropdownOpenFullMatcher(container, false, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, null);

    await act(async () => rtmsRef.current!.openDropdown());
    isDropdownOpenFullMatcher(container, true, rtmsRef.current!.getState().isDropdownOpen, handleDropdownToggle, true);
    expect(getListItems(container).length).toBe(2);
    expansionMatcher([], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.expandNode('1'));
    expect(getListItems(container).length).toBe(4);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher([], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.NONE, rtmsRef.current!.getState().selectionAggregateState, 0, 0);

    await act(async () => rtmsRef.current!.selectNode('1.0'));
    expect(getListItems(container).length).toBe(4);
    expansionMatcher(['1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 0);
    selectionMatcher(['1.0'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 1);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 1);

    await act(async () => rtmsRef.current!.expandNode('1.0'));
    expect(getListItems(container).length).toBe(6);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['1', '1.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 3);

    await act(async () => rtmsRef.current!.collapseNode('1.0'));
    expect(getListItems(container).length).toBe(4);
    expect(handleLoadChildrenMock).not.toHaveBeenCalled();
    expansionMatcher(['1'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 1);

    await act(async () => rtmsRef.current!.expandNode('1.0'));
    expect(getListItems(container).length).toBe(6);
    expect(handleLoadChildrenMock).not.toHaveBeenCalled();
    expansionMatcher(['1', '1.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 3);

    await act(async () => rtmsRef.current!.expandNode('1.0.0'));
    expect(getListItems(container).length).toBe(8);
    expect(handleLoadChildrenMock).toHaveBeenCalledTimes(1);
    handleLoadChildrenMock.mockClear();
    expansionMatcher(['1', '1.0', '1.0.0'], rtmsRef.current!.getState().expandedIds, handleNodeToggle, 1);
    selectionMatcher(['1.0', '1.0.0', '1.0.1'], rtmsRef.current!.getState().selectedIds, handleNodeChange, 0);
    selectAllFullMatcher(container, SelectionAggregateState.PARTIAL, rtmsRef.current!.getState().selectionAggregateState, 1, 3);
  });
});
