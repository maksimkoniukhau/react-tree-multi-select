import React, {FC, memo} from 'react';
import {NodeCheckboxProps, NodeCheckboxType} from '../types';
import {classNames} from '../utils/commonUtils';
import {Checkbox} from './Checkbox';

export const NodeCheckbox: FC<NodeCheckboxProps> = memo((props) => {
  const {checked, partial, disabled} = props.ownProps;

  return (
    <div {...props.attributes}>
      <Checkbox checked={checked} partial={partial} disabled={disabled}/>
    </div>
  );
});

interface NodeCheckboxWrapperProps {
  nodeCheckbox: NodeCheckboxType;
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export const NodeCheckboxWrapper: FC<NodeCheckboxWrapperProps> = memo((props) => {
  const {nodeCheckbox, checked, partial, disabled} = props;

  const className = classNames(
    'rtms-node-checkbox',
    disabled && 'disabled',
    checked ? 'selected' : partial && 'partial'
  );

  return (
    <nodeCheckbox.component
      attributes={{className}}
      ownProps={{checked, partial, disabled}}
      customProps={nodeCheckbox.props}
    />
  );
});
