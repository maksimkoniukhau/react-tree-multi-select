import React, {FC, memo} from 'react';
import {SelectionAggregateState} from '../types';
import {InnerComponents} from '../innerTypes';
import {SelectAllContainerWrapper} from './SelectAllContainer';
import {SelectAllCheckboxWrapper} from './SelectAllCheckbox';
import {SelectAllLabelWrapper} from './SelectAllLabel';

export interface SelectAllWrapperProps {
  components: InnerComponents;
  label: string;
  selectionAggregateState: SelectionAggregateState;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const SelectAllWrapper: FC<SelectAllWrapperProps> = memo((props) => {
  const {components, label, selectionAggregateState, focused, onClick} = props;

  return (
    <SelectAllContainerWrapper
      selectAllContainer={components.SelectAllContainer}
      label={label}
      selectionAggregateState={selectionAggregateState}
      focused={focused}
      onClick={onClick}
    >
      <SelectAllCheckboxWrapper
        selectAllCheckbox={components.SelectAllCheckbox}
        selectionAggregateState={selectionAggregateState}
      />
      <SelectAllLabelWrapper selectAllLabel={components.SelectAllLabel} label={label}/>
    </SelectAllContainerWrapper>
  );
});
