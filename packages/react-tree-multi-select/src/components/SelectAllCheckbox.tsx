import React, {FC, memo} from 'react';
import {SelectAllCheckboxProps, SelectAllCheckboxType, SelectionAggregateState} from '../types';
import {classNames} from '../utils/commonUtils';
import {Checkbox} from './Checkbox';

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = memo((props) => {
  const {selectionAggregateState} = props.ownProps;

  const checked = selectionAggregateState === SelectionAggregateState.ALL;
  const partial = selectionAggregateState === SelectionAggregateState.EFFECTIVE_ALL
    || selectionAggregateState === SelectionAggregateState.PARTIAL;

  return (
    <div {...props.attributes}>
      <Checkbox checked={checked} partial={partial}/>
    </div>
  );
});

interface SelectAllCheckboxWrapperProps {
  selectAllCheckbox: SelectAllCheckboxType;
  selectionAggregateState: SelectionAggregateState;
}

export const SelectAllCheckboxWrapper: FC<SelectAllCheckboxWrapperProps> = memo((props) => {
  const {selectAllCheckbox, selectionAggregateState} = props;

  const selected = selectionAggregateState === SelectionAggregateState.ALL;
  const partial = selectionAggregateState === SelectionAggregateState.EFFECTIVE_ALL
    || selectionAggregateState === SelectionAggregateState.PARTIAL;

  const className = classNames(
    'rtms-select-all-checkbox',
    selected ? 'selected' : partial && 'partial'
  );

  return (
    <selectAllCheckbox.component
      attributes={{className}}
      ownProps={{selectionAggregateState}}
      customProps={selectAllCheckbox.props}
    />
  );
});
