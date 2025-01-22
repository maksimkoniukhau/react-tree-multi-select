import React, {FC, memo} from 'react';
import {ChipContainerProps} from './models';

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
