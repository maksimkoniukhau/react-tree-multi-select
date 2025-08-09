import React, {FC, memo} from 'react';
import {ChipLabelProps, ChipLabelType} from '../types';

export const ChipLabel: FC<ChipLabelProps> = memo((props) => {
  return (
    <div {...props.attributes}>{props.ownProps.label}</div>
  );
});

interface ChipLabelWrapperProps {
  chipLabel: ChipLabelType;
  label: string;
  componentDisabled: boolean;
}

export const ChipLabelWrapper: FC<ChipLabelWrapperProps> = memo(({chipLabel, label, componentDisabled}) => {
  return (
    <chipLabel.component
      attributes={{className: 'rtms-label'}}
      ownProps={{label, componentDisabled}}
      customProps={chipLabel.props}
    />
  );
});
