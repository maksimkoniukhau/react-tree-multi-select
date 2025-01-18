import React, {FC, memo} from 'react';
import {CheckedState} from './models';
import {SelectAllCheckbox} from './SelectAllCheckbox';

export interface SelectAllProps {
  label: string;
  checkedState: CheckedState;
  focused: boolean;
  onChange: (e: React.MouseEvent) => void;
}

export const SelectAll: FC<SelectAllProps> = memo((props) => {

  const {label, checkedState, focused, onChange} = props;

  const selected = checkedState === CheckedState.SELECTED;
  const partial = checkedState === CheckedState.PARTIAL;

  const selectedClass = selected ? ' selected' : partial ? ' partial' : '';
  const focusedClass = focused ? ' focused' : '';
  const selectAllClasses = `rts-header-item${selectedClass}${focusedClass}`;

  return (
    <div className={selectAllClasses}>
      <div className="rts-select-all" onClick={onChange}>
        <SelectAllCheckbox checked={selected} partial={partial}/>
        <span className="rts-label">{label}</span>
      </div>
    </div>
  );
});
