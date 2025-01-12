import React, {FC, memo} from 'react';
import {ComponentProps, Type} from './models';

export interface FieldProps {
  type: Type;
  showDropdown: boolean;
  withClearAll: boolean;
}

export const Field: FC<ComponentProps<FieldProps>> = memo((props) => {

  return (
    <div {...props.rootAttributes}>
      {props.children}
    </div>
  );
});
