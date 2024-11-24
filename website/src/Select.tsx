import React, {FC, memo} from 'react';

export interface SelectProps {
  label: string;
  options: { name: string; value: string }[];
  onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = memo(({label, options, onChange}) => {

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <div className="select-container">
      <label>{label}</label>
      <select className="select" onChange={handleOptionChange}>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>{option.name}</option>
        ))}
      </select>
    </div>
  );
});
