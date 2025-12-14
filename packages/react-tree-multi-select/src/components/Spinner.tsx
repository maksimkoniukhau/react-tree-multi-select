import React, {FC, memo} from 'react';
import {SpinnerProps, SpinnerType} from '../types';

export const Spinner: FC<SpinnerProps> = (props) => {
  return (
    <div {...props.attributes}>
      <span className="rtms-spinner"/>
    </div>
  );
};

interface SpinnerWrapperProps {
  spinner: SpinnerType;
}

export const SpinnerWrapper: FC<SpinnerWrapperProps> = memo(({spinner}) => {
  return (
    <spinner.component
      attributes={{className: "rtms-spinner-container"}}
      ownProps={{}}
      customProps={spinner.props}
    />
  );
});
