import React, {FC, memo} from 'react';
import {NoMatchesProps, NoMatchesType} from '../types';

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
  noMatches: NoMatchesType;
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
