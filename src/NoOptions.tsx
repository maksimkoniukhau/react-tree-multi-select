import React, {FC} from 'react';

export interface NoOptionsProps {
  label: string;
}

export const NoOptions: FC<NoOptionsProps> = ({label}) => {

  return (
    <div className="rts-no-options">
      <span className="rts-label">
        {label}
      </span>
    </div>
  );
};
