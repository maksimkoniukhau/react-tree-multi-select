import React, {FC, memo, useState} from 'react';

export interface CheckboxProps {
  label: string;
  initChecked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = memo(({label, initChecked, onChange}) => {

  const [checked, setChecked] = useState<boolean>(initChecked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(e.target.checked);
    onChange(e.target.checked);
  };

  return (
    <div className="checkbox-container">
      <input type="checkbox" className="checkbox" checked={checked} onChange={handleChange}/>
      <label>{label}</label>
    </div>
  );
});
