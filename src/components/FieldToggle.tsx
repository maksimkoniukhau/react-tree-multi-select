import React, {FC, memo} from 'react';
import {FieldToggleProps} from '../types';

export interface FieldToggleOwnProps {
  expanded: boolean;
}

export const FieldToggle: FC<FieldToggleProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>
      {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      <svg className="rts-field-toggle-icon" viewBox="0 0 448 512">
        {props.componentProps.expanded ? (
          <path
            d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>

        ) : (
          <path
            d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
        )}
      </svg>
    </div>
  );
});
