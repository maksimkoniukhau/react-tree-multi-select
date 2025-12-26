import React, {FC, memo} from 'react';
import {SelectAllCheckboxProps, SelectAllCheckboxType, SelectionAggregateState} from '../types';

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {
  const {selectionAggregateState} = props.ownProps;

  const selectedClass = selectionAggregateState === SelectionAggregateState.ALL
    ? ' selected'
    : selectionAggregateState === SelectionAggregateState.NONE
      ? ''
      : ' partial';

  const checkboxClasses = `rtms-checkbox${selectedClass}`;

  return (
    <div {...props.attributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});

interface SelectAllCheckboxWrapperProps {
  selectAllCheckbox: SelectAllCheckboxType;
  selectionAggregateState: SelectionAggregateState;
}

export const SelectAllCheckboxWrapper: FC<SelectAllCheckboxWrapperProps> = memo((props) => {
  const {selectAllCheckbox, selectionAggregateState} = props;

  const selectedClass = selectionAggregateState === SelectionAggregateState.ALL
    ? ' selected'
    : selectionAggregateState === SelectionAggregateState.NONE
      ? ''
      : ' partial';

  const className = `rtms-select-all-checkbox${selectedClass}`;

  return (
    <selectAllCheckbox.component
      attributes={{className}}
      ownProps={{selectionAggregateState}}
      customProps={selectAllCheckbox.props}
    />
  );
});
