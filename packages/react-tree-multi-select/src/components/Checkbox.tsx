import React, {FC, memo} from 'react';
import {classNames} from '../utils/commonUtils';

interface CheckboxProps {
  checked: boolean;
  partial: boolean;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = memo((props) => {
  const {checked, partial, disabled} = props;

  const className = classNames('rtms-checkbox', disabled && 'disabled', checked ? 'selected' : partial && 'partial');

  return (
    <div className={className}>
      {checked ? (
        <svg viewBox="0 0 640 640">
          <path
            d="m531.59,116.21c14.52,10.67 27.92,38.37 17.36,53.05l-259.91,355c-10.66,11.9 -24.37,11.59 -33.91,12.41c-9.54,0.82 -26.9,-0.72 -33.61,-7.49l-126.91,-130.3c-12.69,-12.83 -7.61,-43.91 5.08,-56.74c19.8,-20.01 46.5,-21.03 59.19,-8.21l87.82,71.31l222.34,-286.98c10.56,-14.67 37.97,-24.11 62.64,-2.15l-0.1,0.1z"
          />
        </svg>
      ) : partial ? (
        <svg viewBox="0 0 640 640">
          <path
            d="m91,320c0,-29.32 14.62,-53 32.71,-53l392.57,0c18.1,0 32.71,23.68 32.71,53c0,29.32 -14.62,53 -32.71,53l-392.57,0c-18.1,0 -32.71,-23.68 -32.71,-53z"
          />
        </svg>
      ) : null}
    </div>
  );
});
