import React, {FC, memo} from 'react';
import {SelectAllCheckboxProps, SelectAllCheckboxType} from '../types';

export interface SelectAllCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {
  const {checked, partial} = props.ownProps;

  const checkboxClasses = `rtms-checkbox${checked ? ' selected' : partial ? ' partial' : ''}`;

  return (
    <div {...props.attributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});

interface SelectAllCheckboxWrapperProps {
  selectAllCheckbox: SelectAllCheckboxType;
  checked: boolean;
  partial: boolean;
}

export const SelectAllCheckboxWrapper: FC<SelectAllCheckboxWrapperProps> = memo((props) => {
  const {selectAllCheckbox, checked, partial} = props;

  const className = `rtms-select-all-checkbox${checked ? ' selected' : partial ? ' partial' : ''}`;

  return (
    <selectAllCheckbox.component
      attributes={{className}}
      ownProps={{checked, partial}}
      customProps={selectAllCheckbox.props}
    />
  );
});
