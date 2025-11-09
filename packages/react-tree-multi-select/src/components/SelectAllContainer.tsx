import React, {FC, memo, ReactNode} from 'react';
import {
  CheckedState,
  DROPDOWN_PREFIX,
  SELECT_ALL_SUFFIX,
  SelectAllContainerProps,
  SelectAllContainerType
} from '../types';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const SelectAllContainer: FC<SelectAllContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface SelectAllContainerWrapperProps {
  selectAllContainer: SelectAllContainerType;
  label: string;
  checkedState: CheckedState;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const SelectAllContainerWrapper: FC<SelectAllContainerWrapperProps> = memo((props) => {
  const {selectAllContainer, label, checkedState, focused, onClick, children} = props;

  const selectedClass = checkedState === CheckedState.SELECTED
    ? ' selected'
    : checkedState === CheckedState.PARTIAL
      ? ' partial'
      : '';
  const containerClasses = `rtms-sticky-item${selectedClass}${focused ? ' focused' : ''}`;

  return (
    <selectAllContainer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(SELECT_ALL_SUFFIX, DROPDOWN_PREFIX),
        className: containerClasses,
        onClick
      }}
      ownProps={{label, checkedState, focused}}
      customProps={selectAllContainer.props}
    >
      {children}
    </selectAllContainer.component>
  );
});
