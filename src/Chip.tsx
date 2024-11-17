import React, {FC} from 'react';
import {preventDefaultOnMouseEvent} from './utils';

export interface ChipProps {
  label: string;
  focused: boolean;
  disabled: boolean;
  onClickElement: (e: React.MouseEvent<Element>) => void;
  onClickIcon: (e: React.MouseEvent<Element>) => void;
}

export const Chip: FC<ChipProps> = (props) => {

  const {label, focused, disabled, onClickElement, onClickIcon} = props;

  const handleClickElement = (e: React.MouseEvent<Element>): void => {
    // defaultPrevented is on click chip clear icon
    if (!e.defaultPrevented) {
      e.preventDefault();
      onClickElement && onClickElement(e);
    }
  };

  const handleClickIcon = (e: React.MouseEvent<Element>): void => {
    e.preventDefault();
    onClickIcon && onClickIcon(e);
  };

  const disabledFocusedClasses = `${disabled ? ' disabled' : ''}${focused ? ' focused' : ''}`;
  const chipClasses = `rts-chip${disabledFocusedClasses}`;

  return (
    <div
      className={chipClasses}
      onClick={handleClickElement}
      onMouseDown={preventDefaultOnMouseEvent}
    >
      <span className="rts-label">{label}</span>
      {!disabled && <svg className="rts-chip-clear-icon" viewBox="0 0 512 512" onClick={handleClickIcon}>
          <path
              d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>
      </svg>}
    </div>
  );
};
