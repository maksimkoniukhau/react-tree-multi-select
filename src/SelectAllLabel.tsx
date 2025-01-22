import React, {FC, memo} from 'react';
import {SelectAllLabelProps} from './models';

export interface SelectAllLabelOwnProps {
  label: string;
}

export const SelectAllLabel: FC<SelectAllLabelProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>{props.componentProps.label}</div>
  );
});
