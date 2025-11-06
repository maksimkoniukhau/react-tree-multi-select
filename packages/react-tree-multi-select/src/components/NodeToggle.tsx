import React, {FC, memo} from 'react';
import {NodeToggleProps, NodeToggleType} from '../types';

export const NodeToggle: FC<NodeToggleProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      <svg className="rtms-node-toggle-icon" viewBox={props.ownProps.expanded ? '0 0 448 512' : '0 0 320 512'}>
        {props.ownProps.expanded ? (
          <path
            d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
        ) : (
          <path
            d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
        )}
      </svg>
    </div>
  );
});

interface NodeToggleWrapperProps {
  nodeToggle: NodeToggleType;
  id: string;
  expanded: boolean;
  onClick: (id: string) => (event: React.MouseEvent) => void;
}

export const NodeToggleWrapper: FC<NodeToggleWrapperProps> = memo(({nodeToggle, id, expanded, onClick}) => {
  return (
    <nodeToggle.component
      attributes={{
        className: `rtms-node-toggle${expanded ? ' expanded' : ''}`,
        onClick: onClick(id)
      }}
      ownProps={{expanded}}
      customProps={nodeToggle.props}
    />
  );
});
