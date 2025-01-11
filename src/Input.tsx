import React, {FC, HTMLProps, memo, RefObject} from 'react';

export interface InputProps extends HTMLProps<HTMLInputElement> {
  inputPlaceholder: string;
  value: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hidden?: boolean;
}

export const Input: FC<InputProps> = memo((props) => {

  const {
    inputPlaceholder,
    value = '',
    onChangeInput,
    hidden,
    className,
    ...rest
  } = props;

  const inputClasses = `rts-input` + (className ? ` ${className}` : '');

  return (
    <div className="rts-input-container">{hidden ? (
      <input className="rts-input-hidden"/>
    ) : (
      <input
        {...rest}
        value={value}
        placeholder={inputPlaceholder}
        className={inputClasses}
        onChange={onChangeInput}
      />
    )}</div>
  );
});
