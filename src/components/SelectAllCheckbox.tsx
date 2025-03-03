import React, {FC, memo} from 'react';
import {SelectAllCheckboxProps, SelectAllCheckboxType} from '../types';

export interface SelectAllCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {
  const {checked, partial} = props.componentProps;

  const checkboxClasses = `rtms-checkbox${checked ? ' selected' : partial ? ' partial' : ''}`;

  return (
    <div {...props.componentAttributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});

interface SelectAllCheckboxWrapperProps {
  selectAllCheckbox: SelectAllCheckboxType<any>;
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckboxWrapper: FC<SelectAllCheckboxWrapperProps> = memo((props) => {
  const {selectAllCheckbox, checked, partial} = props;

  const className = `rtms-select-all-checkbox${checked ? ' selected' : partial ? ' partial' : ''}`;

  return (
    <selectAllCheckbox.component
      componentAttributes={{className}}
      componentProps={{checked, partial}}
      customProps={selectAllCheckbox.props}
    />
  );
});
