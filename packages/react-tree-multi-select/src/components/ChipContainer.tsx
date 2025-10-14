import React, {FC, memo, ReactNode} from 'react';
import {ChipContainerProps, ChipContainerType} from '../types';

export const ChipContainer: FC<ChipContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface ChipContainerWrapperProps {
  chipContainer: ChipContainerType;
  path: string
  label: string;
  focused: boolean;
  disabled: boolean;
  onClick: (path: string) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
  withChipClear: boolean;
  children: ReactNode;
}

export const ChipContainerWrapper: FC<ChipContainerWrapperProps> = memo((props) => {
  const {chipContainer, path, label, focused, disabled, onClick, componentDisabled, withChipClear, children} = props;

  return (
    <chipContainer.component
      attributes={{
        className: `rtms-chip${disabled ? ' disabled' : ''}${focused ? ' focused' : ''}`,
        onClick: onClick(path)
      }}
      ownProps={{label, focused, disabled, componentDisabled, withChipClear}}
      customProps={chipContainer.props}
    >
      {children}
    </chipContainer.component>
  );
});
