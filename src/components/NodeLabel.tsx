import React, {FC, memo} from 'react';
import {NodeLabelProps, NodeLabelType} from '../types';

export const NodeLabel: FC<NodeLabelProps> = memo((props) => {
  return (
    <div {...props.attributes}>{props.ownProps.label}</div>
  );
});

interface NodeLabelWrapperProps {
  nodeLabel: NodeLabelType;
  label: string;
}

export const NodeLabelWrapper: FC<NodeLabelWrapperProps> = memo(({nodeLabel, label}) => {
  return (
    <nodeLabel.component
      attributes={{className: "rtms-label"}}
      ownProps={{label}}
      customProps={nodeLabel.props}
    />
  );
});
