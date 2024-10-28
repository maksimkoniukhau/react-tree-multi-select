import React, {FC, RefObject} from 'react';

import {INPUT_PLACEHOLDER} from './constants';

export interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  inputPlaceholder: string;
  value: string;
  onClickInput: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFC: FC<InputProps> = (props) => {

  const {
    inputRef,
    inputPlaceholder = INPUT_PLACEHOLDER,
    value = '',
    onClickInput,
    onChangeInput
  } = props;

  return (
    <input
      ref={inputRef}
      value={value}
      placeholder={inputPlaceholder}
      className="rts-input"
      onClick={onClickInput}
      onChange={onChangeInput}
    />
  );
};

export const Input = React.memo(InputFC);
