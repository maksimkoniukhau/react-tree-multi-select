import React, {FC, memo, RefObject} from 'react';
import {FIELD_PREFIX, INPUT_SUFFIX, InputProps, InputType} from '../types';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const Input: FC<InputProps> = memo((props) => {
  return (
    <input {...props.attributes}/>
  );
});

interface InputWrapperProps {
  input: InputType;
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  componentDisabled: boolean;
  location: 'FIELD' | 'DROPDOWN';
}

export const InputWrapper: FC<InputWrapperProps> = memo((props) => {
  const {input, inputRef, placeholder, value, onChange, componentDisabled, location} = props;

  return (
    <input.component
      attributes={{
        ...(location === 'FIELD' && {'data-rtms-virtual-focus-id': buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)}),
        ref: inputRef,
        className: "rtms-input",
        placeholder,
        value,
        onChange,
        disabled: componentDisabled,
      }}
      ownProps={{placeholder, value, disabled: componentDisabled}}
      customProps={input.props}
    />
  );
});
