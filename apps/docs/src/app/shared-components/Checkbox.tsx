import React, {FC, memo} from 'react';

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = memo(({label, checked, onChange}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked);
  };

  return (
    <div className="checkbox-container">
      <input type="checkbox" className="checkbox" checked={checked} onChange={handleChange}/>
      <label>{label}</label>
    </div>
  );
});
