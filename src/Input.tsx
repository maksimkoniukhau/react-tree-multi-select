import React, {FC, memo, RefObject} from 'react';

export interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  inputPlaceholder: string;
  value: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: FC<InputProps> = memo((props) => {

  const {
    inputRef,
    inputPlaceholder,
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
});
