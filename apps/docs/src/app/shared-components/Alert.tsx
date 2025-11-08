import React, {FC, memo, ReactNode} from 'react';

export interface AlertProps {
  type: 'important' | 'note';
  children: ReactNode;
}

export const Alert: FC<AlertProps> = memo(({type, children}) => {

  return (
    <div className={`alert ${type}`}>
      <b>{type.toUpperCase()}</b>
      <span>{children}</span>
    </div>
  );
});
