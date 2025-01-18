import React, {FC, memo} from 'react';

export interface SelectAllCheckboxProps {
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {

  const {checked, partial} = props;

  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const checkboxClasses = `rts-checkbox${checkedClass}`;

  return (
    <span className={checkboxClasses}/>
  );
});
