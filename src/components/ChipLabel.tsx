import React, {FC, memo} from 'react';
import {ChipLabelProps, ChipLabelType} from '../types';

export interface ChipLabelOwnProps {
  label: string;
  componentDisabled: boolean;
}

export const ChipLabel: FC<ChipLabelProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>{props.componentProps.label}</div>
  );
});

interface ChipLabelWrapperProps {
  chipLabel: ChipLabelType<any>;
  label: string;
  componentDisabled: boolean;
}

export const ChipLabelWrapper: FC<ChipLabelWrapperProps> = memo(({chipLabel, label, componentDisabled}) => {
  return (
    <chipLabel.component
      componentAttributes={{className: 'rtms-label'}}
      componentProps={{label, componentDisabled}}
      customProps={chipLabel.props}
    />
  );
});
