import React, {FC, memo} from 'react';
import {ChipProps} from './models';

export interface ChipOwnProps {
  focused: boolean;
  disabled: boolean;
}

export const Chip: FC<ChipProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});
