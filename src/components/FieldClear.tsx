import React, {FC, memo} from 'react';
import {FieldClearProps, FieldClearType} from '../types';
import {preventDefaultOnMouseEvent} from '../utils/commonUtils';

export const FieldClear: FC<FieldClearProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      <svg className="rtms-field-clear-icon" viewBox="0 0 384 512">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
      </svg>
    </div>
  );
});

interface FieldClearWrapperProps {
  fieldClear: FieldClearType;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
  componentDisabled: boolean;
}

export const FieldClearWrapper: FC<FieldClearWrapperProps> = memo((props) => {
  const {fieldClear, focused, onClick, componentDisabled} = props;

  return (
    <fieldClear.component
      attributes={{
        className: `rtms-field-clear${focused ? ' focused' : ''}${componentDisabled ? ' disabled' : ''}`,
        onClick,
        // needed for staying focus on input
        onMouseDown: preventDefaultOnMouseEvent
      }}
      ownProps={{focused, componentDisabled}}
      customProps={fieldClear.props}
    />
  );
});
