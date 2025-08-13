import React, {FC, HTMLInputTypeAttribute, memo, useState} from 'react';

export interface InputProps {
  label: string;
  initValue: string | number;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
}

export const Input: FC<InputProps> = memo(({label, initValue, onChange, type = 'text'}) => {

  const [value, setValue] = useState<string | number>(initValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="input-container">
      <label>{label}</label>
      <input type={type} className="input" value={value} onChange={handleChange}/>
    </div>
  );
});
