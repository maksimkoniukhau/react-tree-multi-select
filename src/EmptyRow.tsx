import React, {FC} from 'react';

export interface EmptyRowProps {
  label: string;
}

export const EmptyRow: FC<EmptyRowProps> = ({label}) => {

  return (
    <div className="rts-empty-row-container">
      <span className="rts-empty-row">
        {label}
      </span>
    </div>
  );
};
