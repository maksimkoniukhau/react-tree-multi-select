import React, {FC, HTMLInputTypeAttribute, memo} from 'react';

export interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
}

export const Input: FC<InputProps> = memo(({label, value, onChange, type = 'text'}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className="input-container">
      <label>{label}</label>
      <input type={type} className="input" value={value} onChange={handleChange}/>
    </div>
  );
});
