import React, {FC, memo} from 'react';
import {NoMatchesProps, NoMatchesType} from '../types';

export interface NoMatchesOwnProps {
  label: string;
}

export const NoMatches: FC<NoMatchesProps> = (props) => {
  return (
    <div {...props.componentAttributes}>
      <span className="rtms-label">
         {props.componentProps.label}
      </span>
    </div>
  );
};

interface NoMatchesWrapperProps {
  noMatches: NoMatchesType<any>;
  label: string;
}

export const NoMatchesWrapper: FC<NoMatchesWrapperProps> = memo(({noMatches, label}) => {
  return (
    <noMatches.component
      componentAttributes={{className: "rtms-no-matches"}}
      componentProps={{label}}
      customProps={noMatches.props}
    />
  );
});
