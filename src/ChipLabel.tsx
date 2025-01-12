import React, {FC, memo} from 'react';
import {ChipLabelProps} from './models';

export interface ChipLabelOwnProps {
  label: string;
}

export const ChipLabel: FC<ChipLabelProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>{props.componentProps.label}</div>
  );
});
