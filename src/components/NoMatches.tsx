import React, {FC, memo} from 'react';
import {NoMatchesProps, NoMatchesType} from '../types';

export interface NoMatchesOwnProps {
  label: string;
}

export const NoMatches: FC<NoMatchesProps> = (props) => {
  return (
    <div {...props.attributes}>
      <span className="rtms-label">
         {props.ownProps.label}
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
      attributes={{className: "rtms-no-matches"}}
      ownProps={{label}}
      customProps={noMatches.props}
    />
  );
});
