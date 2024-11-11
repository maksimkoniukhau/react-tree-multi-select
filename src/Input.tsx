import React, {FC, RefObject} from 'react';

export interface InputProps {
  inputRef: RefObject<HTMLInputElement>;
  inputPlaceholder: string;
  value: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFC: FC<InputProps> = (props) => {

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
};

export const Input = React.memo(InputFC);
