import '@testing-library/jest-dom';

import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent, {UserEvent} from '@testing-library/user-event';
import {TreeSelect} from '../index';
import {getBaseTreeNodeData} from './testutils/dataUtils';
import {getDropdown, getField, getRootContainer} from './testutils/selectorUtils';

const treeNodeData = getBaseTreeNodeData();

describe('TreeSelect component base', () => {
  it('renders component', () => {
    render(<TreeSelect data={treeNodeData}/>);

    const chip = screen.getByText(/Angular/i);
    expect(chip).toBeInTheDocument();
  });
});

describe('TreeSelect component focus/blur', () => {
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
      expect(getRootContainer(container)).toHaveClass('focused');
    } else {
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

  const user: UserEvent = userEvent.setup();

  it.each([[false], [true]])(`focus/blur component when withDropdownInput={%s} (click)`, async (withDropdownInput) => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    const {container} = render(
      <TreeSelect data={treeNodeData} onFocus={handleFocus} onBlur={handleBlur} withDropdownInput={withDropdownInput}/>
    );

    expect(getRootContainer(container)).toBeInTheDocument();
    focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.click(getField(container));
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.click(getField(container));
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.click(document.body);
    focusBlurMatcher(container, false, false, handleFocus, 1, handleBlur, 1);

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

    await user.click(getField(container));
    focusBlurMatcher(container, true, false, handleFocus, 2, handleBlur, 1);

    await user.click(getField(container));
    focusBlurMatcher(container, true, true, handleFocus, 2, handleBlur, 1);

    await user.click(document.body);
    focusBlurMatcher(container, false, false, handleFocus, 2, handleBlur, 2);
  });

  it.each([[false], [true]])(`focus/blur component when withDropdownInput={%s} (click)`, async (withDropdownInput) => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    const {container} = render(
      <TreeSelect data={treeNodeData} onFocus={handleFocus} onBlur={handleBlur} withDropdownInput={withDropdownInput}/>
    );

    expect(getRootContainer(container)).toBeInTheDocument();
    focusBlurMatcher(container, false, false, handleFocus, 0, handleBlur, 0);

    await user.keyboard('{tab}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{enter}');
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{arrowup}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{arrowdown}');
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{tab}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{arrowup}');
    focusBlurMatcher(container, true, true, handleFocus, 1, handleBlur, 0);

    await user.keyboard('{escape}');
    focusBlurMatcher(container, true, false, handleFocus, 1, handleBlur, 0);

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
});
