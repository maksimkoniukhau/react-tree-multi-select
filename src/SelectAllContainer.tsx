import React, {FC, memo} from 'react';
import {CheckedState, SelectAllContainerProps} from './types';

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
