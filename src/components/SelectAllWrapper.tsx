import React, {FC, memo} from 'react';
import {SelectAllCheckboxWrapper} from './SelectAllCheckbox';
import {CheckedState} from '../types';
import {SelectAllLabelWrapper} from './SelectAllLabel';
import {SelectAllContainerWrapper} from './SelectAllContainer';
import {InnerComponents} from '../innerTypes';

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
