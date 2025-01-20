import React, {FC, memo} from 'react';
import {NodeContainerProps} from './models';

export interface NodeContainerOwnProps {
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
}

export const NodeContainer: FC<NodeContainerProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});
