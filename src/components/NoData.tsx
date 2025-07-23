import React, {FC, memo} from 'react';
import {NoDataProps, NoDataType} from '../types';

export const NoData: FC<NoDataProps> = (props) => {
  return (
    <div {...props.attributes}>
      <span className="rtms-label">
         {props.ownProps.label}
      </span>
    </div>
  );
};

interface NoDataWrapperProps {
  noData: NoDataType;
  label: string;
}

export const NoDataWrapper: FC<NoDataWrapperProps> = memo(({noData, label}) => {
  return (
    <noData.component
      attributes={{className: "rtms-no-data"}}
      ownProps={{label}}
      customProps={noData.props}
    />
  );
});
