import React, {FC, memo, RefObject} from 'react';
import {InputProps, InputType} from '../types';

export interface InputOwnProps {
  placeholder: string;
  value: string;
  disabled: boolean;
}

export const Input: FC<InputProps> = memo((props) => {
  return (
    <input {...props.attributes}/>
  );
});

interface InputWrapperProps {
  input: InputType<any>;
  inputRef: RefObject<HTMLInputElement>;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  componentDisabled: boolean;
}

export const InputWrapper: FC<InputWrapperProps> = memo((props) => {
  const {input, inputRef, placeholder, value, onChange, componentDisabled} = props;

  return (
    <input.component
      attributes={{
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
