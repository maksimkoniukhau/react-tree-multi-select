import React, {FC} from 'react';

import {CheckedState} from './models';
import {Checkbox} from './Checkbox';

export interface SelectAllProps {
  label: string;
  checkedState: CheckedState;
  focused: boolean;
  onChange: (e: React.MouseEvent<Element>) => void;
}

export const SelectAll: FC<SelectAllProps> = (props) => {

  const {label, checkedState, focused, onChange} = props;

  const selected = checkedState === CheckedState.SELECTED;
  const partial = checkedState === CheckedState.PARTIAL;

  const selectedClass = selected ? ' selected' : partial ? ' partial' : '';
  const focusedClass = focused ? ' focused' : '';
  const selectAllClasses = `rts-header-item${selectedClass}${focusedClass}`;

  return (
    <div className={selectAllClasses}>
      <div className="rts-select-all" onClick={onChange}>
        <Checkbox checked={selected} partial={partial}/>
        <span className="rts-label">{label}</span>
      </div>
    </div>
  );
};
