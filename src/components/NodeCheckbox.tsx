import React, {FC, memo} from 'react';
import {NodeCheckboxProps, NodeCheckboxType} from '../types';

export interface NodeCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export const NodeCheckbox: FC<NodeCheckboxProps> = memo((props) => {
  const {checked, partial, disabled} = props.ownProps;

  const disabledClass = disabled ? ' disabled' : '';
  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const checkboxClasses = `rtms-checkbox${disabledClass}${checkedClass}`;

  return (
    <div {...props.attributes}>
      <span className={checkboxClasses}/>
    </div>
  );
});

interface NodeCheckboxWrapperProps {
  nodeCheckbox: NodeCheckboxType<any>;
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export const NodeCheckboxWrapper: FC<NodeCheckboxWrapperProps> = memo((props) => {
  const {nodeCheckbox, checked, partial, disabled} = props;

  const disabledClass = disabled ? ' disabled' : '';
  const checkedClass = checked ? ' selected' : partial ? ' partial' : '';
  const className = `rtms-node-checkbox${disabledClass}${checkedClass}`;

  return (
    <nodeCheckbox.component
      attributes={{className}}
      ownProps={{checked, partial, disabled}}
      customProps={nodeCheckbox.props}
    />
  );
});
