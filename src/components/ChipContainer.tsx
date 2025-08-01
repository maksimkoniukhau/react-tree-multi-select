import React, {FC, memo, ReactNode} from 'react';
import {ChipContainerProps, ChipContainerType} from '../types';
import {preventDefaultOnMouseEvent} from '../utils/commonUtils';
import {Node} from '../Node';

export const ChipContainer: FC<ChipContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface ChipContainerWrapperProps {
  chipContainer: ChipContainerType;
  node: Node;
  label: string;
  focused: boolean;
  disabled: boolean;
  onClick: (node: Node) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
  withChipClear: boolean;
  children: ReactNode;
}

export const ChipContainerWrapper: FC<ChipContainerWrapperProps> = memo((props) => {
  const {chipContainer, node, label, focused, disabled, onClick, componentDisabled, withChipClear, children} = props;

  return (
    <chipContainer.component
      attributes={{
        className: `rtms-chip${disabled ? ' disabled' : ''}${focused ? ' focused' : ''}`,
        onClick: onClick(node),
        // needed for staying focus on input
        onMouseDown: preventDefaultOnMouseEvent
      }}
      ownProps={{label, focused, disabled, componentDisabled, withChipClear}}
      customProps={chipContainer.props}
    >
      {children}
    </chipContainer.component>
  );
});
