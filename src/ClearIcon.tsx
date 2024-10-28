import React, {FC} from 'react';

import {preventDefaultOnMouseEvent} from './utils';

export interface ClearIconProps {
  focused: boolean;
  onClick: (e: React.MouseEvent<Element>) => void;
}

export const ClearIcon: FC<ClearIconProps> = (props) => {

  const {focused, onClick} = props;

  const handleClick = (e: React.MouseEvent<Element>): void => {
    onClick(e);
  };

  const clearAllClasses = `rts-icon-container rts-clear-icon-container${focused ? ' focused' : ''}`;

  return (
    <div
      className={clearAllClasses}
      onClick={handleClick}
      // needed for staying focus on input
      onMouseDown={preventDefaultOnMouseEvent}
    >
      <svg className="rts-clear-icon" viewBox="0 0 320 512">
        <path
          d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
      </svg>
    </div>
  );
};
