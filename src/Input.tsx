import React, {FC, RefObject} from 'react';

import {INPUT_PLACEHOLDER} from './constants';

export interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  inputPlaceholder: string;
  value: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFC: FC<InputProps> = (props) => {

  const {
    inputRef,
    inputPlaceholder = INPUT_PLACEHOLDER,
    value = '',
    onChangeInput
  } = props;

  return (
    <input
      ref={inputRef}
      value={value}
      placeholder={inputPlaceholder}
      className="rts-input"
      onChange={onChangeInput}
    />
  );
};

export const Input = React.memo(InputFC);
