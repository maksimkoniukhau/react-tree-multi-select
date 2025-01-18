import React, {FC, memo} from 'react';
import {NodeLabelProps} from './models';

export interface NodeLabelOwnProps {
  label: string;
}

export const NodeLabel: FC<NodeLabelProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>{props.componentProps.label}</div>
  );
});
