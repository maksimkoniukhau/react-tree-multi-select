import React, {FC, memo} from 'react';
import {NodeCheckboxProps} from '../types';

export interface NodeCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export const NodeCheckbox: FC<NodeCheckboxProps> = memo((props) => {

  const {checked, partial, disabled} = props.componentProps;

  const disabledClass = disabled ? ' disabled' : '';
  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const checkboxClasses = `rtms-checkbox${disabledClass}${checkedClass}`;

  return (
    <div {...props.componentAttributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});
