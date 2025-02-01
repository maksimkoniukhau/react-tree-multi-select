import React, {FC, memo} from 'react';
import {NodeToggleProps} from '../types';

export interface NodeToggleOwnProps {
  expanded: boolean;
}

export const NodeToggle: FC<NodeToggleProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>
      {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      <svg className="rtms-node-toggle-icon" viewBox={props.componentProps.expanded ? '0 0 448 512' : '0 0 320 512'}>
        {props.componentProps.expanded ? (
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
