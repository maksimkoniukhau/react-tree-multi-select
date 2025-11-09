import React, {FC, memo, ReactNode} from 'react';
import {ChipContainerProps, ChipContainerType, FIELD_PREFIX} from '../types';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const ChipContainer: FC<ChipContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface ChipContainerWrapperProps {
  chipContainer: ChipContainerType;
  id: string
  label: string;
  focused: boolean;
  disabled: boolean;
  onClick: (id: string) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
  withChipClear: boolean;
  children: ReactNode;
}

export const ChipContainerWrapper: FC<ChipContainerWrapperProps> = memo((props) => {
  const {chipContainer, id, label, focused, disabled, onClick, componentDisabled, withChipClear, children} = props;

  return (
    <chipContainer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(id, FIELD_PREFIX),
        className: `rtms-chip${disabled ? ' disabled' : ''}${focused ? ' focused' : ''}`,
        onClick: onClick(id)
      }}
      ownProps={{label, focused, disabled, componentDisabled, withChipClear}}
      customProps={chipContainer.props}
    >
      {children}
    </chipContainer.component>
  );
});
