import React, {FC, memo} from 'react';
import {ComponentProps, Type} from './models';
import {Node} from './Node';

export interface FieldProps {
  type: Type;
  selectedNodes: Node[];
  showDropdown: boolean;
  withClearAll: boolean;
}

export const Field: FC<ComponentProps<FieldProps, any>> = memo((props) => {

  return (
    <div {...props.rootAttributes}>
      {props.children}
    </div>
  );
});
