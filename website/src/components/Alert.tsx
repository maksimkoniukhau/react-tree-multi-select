import React, {FC, memo, ReactNode} from 'react';

export interface AlertProps {
  type: 'important' | 'note';
  text: ReactNode;
}

export const Alert: FC<AlertProps> = memo(({type, text}) => {

  return (
    <div className={`alert ${type}`}>
      <b>{type.toUpperCase()}</b>
      <span>{text}</span>
    </div>
  );
});
