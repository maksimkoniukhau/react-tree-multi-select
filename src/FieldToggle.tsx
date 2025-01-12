import React, {FC, memo} from 'react';
import {ComponentProps} from './models';

export interface FieldToggleProps {
  expanded: boolean;
}

export const FieldToggle: FC<ComponentProps<FieldToggleProps>> = memo((props) => {

  return (
    <div {...props.rootAttributes}>
      <svg className="rts-field-toggle-icon" viewBox="0 0 448 512">
        <path
          d="M224 397.3l22.6-22.6 160-160L429.3 192 384 146.7l-22.6 22.6L224 306.7 86.6 169.4 64 146.7 18.7 192l22.6 22.6 160 160L224 397.3z"/>
      </svg>
    </div>
  );
});
