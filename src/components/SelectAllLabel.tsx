import React, {FC, memo} from 'react';
import {SelectAllLabelProps, SelectAllLabelType} from '../types';

export interface SelectAllLabelOwnProps {
  label: string;
}

export const SelectAllLabel: FC<SelectAllLabelProps> = memo((props) => {
  return (
    <div {...props.attributes}>{props.ownProps.label}</div>
  );
});

interface SelectAllLabelWrapperProps {
  selectAllLabel: SelectAllLabelType<any>;
  label: string;
}

export const SelectAllLabelWrapper: FC<SelectAllLabelWrapperProps> = memo(({selectAllLabel, label}) => {
  return (
    <selectAllLabel.component
      attributes={{className: "rtms-label"}}
      ownProps={{label}}
      customProps={selectAllLabel.props}
    />
  );
});
