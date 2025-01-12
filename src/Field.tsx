import React, {FC, memo} from 'react';
import {FieldProps, Type} from './models';

export interface FieldOwnProps {
  type: Type;
  showDropdown: boolean;
  withClearAll: boolean;
}

export const Field: FC<FieldProps> = memo((props) => {

  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});
