import React, {FC, memo, RefObject} from 'react';
import {DROPDOWN_PREFIX, FIELD_PREFIX, INPUT_SUFFIX, InputProps, InputType} from '../types';
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
  region: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX;
}

export const InputWrapper: FC<InputWrapperProps> = memo((props) => {
  const {input, inputRef, placeholder, value, onChange, componentDisabled, region} = props;

  return (
    <input.component
      attributes={{
        ...(region === FIELD_PREFIX && {'data-rtms-virtual-focus-id': buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)}),
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
