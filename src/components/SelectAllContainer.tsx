import React, {FC, memo, ReactNode} from 'react';
import {CheckedState, SelectAllContainerProps, SelectAllContainerType} from '../types';

export interface SelectAllContainerOwnProps {
  label: string;
  checkedState: CheckedState;
  focused: boolean;
}

export const SelectAllContainer: FC<SelectAllContainerProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});

interface SelectAllContainerWrapperProps {
  selectAllContainer: SelectAllContainerType<any>;
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
  const containerClasses = `rtms-header-item${selectedClass}${focused ? ' focused' : ''}`;

  return (
    <selectAllContainer.component
      componentAttributes={{className: containerClasses, onClick}}
      componentProps={{label, checkedState, focused}}
      customProps={selectAllContainer.props}
    >
      {children}
    </selectAllContainer.component>
  );
});
