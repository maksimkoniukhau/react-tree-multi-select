import React, {FC, memo} from 'react';
import {ComponentProps} from './models';

export interface ChipLabelProps {
  label: string;
}

export const ChipLabel: FC<ComponentProps<ChipLabelProps>> = memo((props) => {

  return (
    <div {...props.rootAttributes}>{props.componentProps.label}</div>
  );
});
