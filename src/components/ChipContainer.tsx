import React, {FC, memo, ReactNode} from 'react';
import {ChipContainerProps, ChipContainerType} from '../types';
import {preventDefaultOnMouseEvent} from '../utils/commonUtils';
import {Node} from '../Node';

export interface ChipContainerOwnProps {
  label: string;
  focused: boolean;
  disabled: boolean;
}

export const ChipContainer: FC<ChipContainerProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});

interface ChipContainerWrapperProps {
  chipContainer: ChipContainerType<any>;
  node: Node;
  label: string;
  focused: boolean;
  disabled: boolean;
  onClick: (node: Node) => (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const ChipContainerWrapper: FC<ChipContainerWrapperProps> = memo((props) => {
  const {chipContainer, node, label, focused, disabled, onClick, children} = props;

  return (
    <chipContainer.component
      componentAttributes={{
        className: `rtms-chip${disabled ? ' disabled' : ''}${focused ? ' focused' : ''}`,
        onClick: onClick(node),
        // needed for staying focus on input
        onMouseDown: preventDefaultOnMouseEvent
      }}
      componentProps={{label, focused, disabled}}
      customProps={chipContainer.props}
    >
      {children}
    </chipContainer.component>
  );
});
