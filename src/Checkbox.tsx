import React, {FC, memo} from 'react';

export interface CheckboxProps {
  checked: boolean;
  partial?: boolean;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = memo((props) => {

  const {checked, partial, disabled = false} = props;

  const disabledClass = disabled ? ' disabled' : '';
  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const checkboxClasses = `rts-checkbox${disabledClass}${checkedClass}`;

  return (
    <span className={checkboxClasses}/>
  );
});
