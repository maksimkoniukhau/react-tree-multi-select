import React, {FC, memo, ReactNode, RefObject} from 'react';
import {FieldProps, FieldType, Type} from '../types';

export interface FieldOwnProps {
  type: Type;
  showDropdown: boolean;
  withClearAll: boolean;
  componentDisabled: boolean;
}

export const Field: FC<FieldProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  );
});

interface FieldWrapperProps {
  field: FieldType<any>;
  fieldRef: RefObject<HTMLDivElement | null>;
  type: Type;
  showDropdown: boolean;
  withClearAll: boolean;
  onMouseDown: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  componentDisabled: boolean;
  children: ReactNode;
}

export const FieldWrapper: FC<FieldWrapperProps> = memo((props) => {
  const {field, fieldRef, type, showDropdown, withClearAll, onMouseDown, onClick, componentDisabled, children} = props;

  return (
    <field.component
      componentAttributes={{
        ref: fieldRef,
        className: `rtms-field${componentDisabled ? ' disabled' : ''}`,
        onClick,
        onMouseDown
      }}
      componentProps={{type, showDropdown, withClearAll, componentDisabled}}
      customProps={field.props}
    >
      {children}
    </field.component>
  );
});
