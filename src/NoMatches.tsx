import React, {FC} from 'react';

export interface NoMatchesProps {
  label: string;
}

export const NoMatches: FC<NoMatchesProps> = ({label}) => {

  return (
    <div className="rts-no-matches">
      <span className="rts-label">
        {label}
      </span>
    </div>
  );
};
