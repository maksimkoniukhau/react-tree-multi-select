import React, {FC, memo, useState} from 'react';

export interface InputProps {
  label: string;
  initValue: string;
  onChange: (value: string) => void;
}

export const Input: FC<InputProps> = memo(({label, initValue, onChange}) => {

  const [value, setValue] = useState<string>(initValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="input-container">
      <label>{label}</label>
      <input className="input" value={value} onChange={handleChange}/>
    </div>
  );
});
