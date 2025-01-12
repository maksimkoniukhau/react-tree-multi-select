import React, {FC, memo} from 'react';
import {ComponentProps} from './models';

export interface ChipProps {
  focused: boolean;
  disabled: boolean;
}

export const Chip: FC<ComponentProps<ChipProps>> = memo((props) => {

  return (
    <div {...props.rootAttributes}>
      {props.children}
    </div>
  );
});
