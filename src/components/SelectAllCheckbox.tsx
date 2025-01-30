import React, {FC, memo} from 'react';
import {SelectAllCheckboxProps} from '../types';

export interface SelectAllCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {

  const {checked, partial} = props.componentProps;

  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const checkboxClasses = `rts-checkbox${checkedClass}`;

  return (
    <div {...props.componentAttributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});
