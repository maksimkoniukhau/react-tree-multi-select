import React, {FC} from 'react';
import {NoMatchesProps} from '../types';

export interface NoMatchesOwnProps {
  label: string;
}

export const NoMatches: FC<NoMatchesProps> = (props) => {

  return (
    <div {...props.componentAttributes}>
      <span className="rts-label">
         {props.componentProps.label}
      </span>
    </div>
  );
};
