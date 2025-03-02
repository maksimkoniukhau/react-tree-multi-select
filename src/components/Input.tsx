import React, {FC, memo, RefObject} from 'react';
import {InputProps, InputType} from '../types';

export interface InputOwnProps {
  placeholder: string;
  value: string;
}

export const Input: FC<InputProps> = memo((props) => {
  return (
    <input {...props.componentAttributes}/>
  );
});

interface InputWrapperProps {
  input: InputType<any>;
  inputRef: RefObject<HTMLInputElement>;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputWrapper: FC<InputWrapperProps> = memo((props) => {
  const {input, inputRef, placeholder, value, onChange} = props;

  return (
    <input.component
      componentAttributes={{
        ref: inputRef,
        className: "rtms-input",
        placeholder,
        value,
        onChange
      }}
      componentProps={{placeholder, value}}
      customProps={input.props}
    />
  );
});
