import React, {FC, memo} from 'react';
import {CheckedState} from '../types';
import {InnerComponents} from '../innerTypes';
import {SelectAllContainerWrapper} from './SelectAllContainer';
import {SelectAllCheckboxWrapper} from './SelectAllCheckbox';
import {SelectAllLabelWrapper} from './SelectAllLabel';

export interface SelectAllWrapperProps {
  components: InnerComponents;
  label: string;
  checkedState: CheckedState;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const SelectAllWrapper: FC<SelectAllWrapperProps> = memo((props) => {
  const {components, label, checkedState, focused, onClick} = props;

  return (
    <SelectAllContainerWrapper
      selectAllContainer={components.SelectAllContainer}
      label={label}
      checkedState={checkedState}
      focused={focused}
      onClick={onClick}
    >
      <SelectAllCheckboxWrapper
        selectAllCheckbox={components.SelectAllCheckbox}
        checked={checkedState === CheckedState.SELECTED}
        partial={checkedState === CheckedState.PARTIAL}
      />
      <SelectAllLabelWrapper selectAllLabel={components.SelectAllLabel} label={label}/>
    </SelectAllContainerWrapper>
  );
});
