import React, {FC, memo} from 'react';
import {ChipLabelProps, ChipLabelType} from '../types';

export interface ChipLabelOwnProps {
  label: string;
}

export const ChipLabel: FC<ChipLabelProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>{props.componentProps.label}</div>
  );
});

interface ChipLabelWrapperProps {
  chipLabel: ChipLabelType<any>;
  label: string;
}

export const ChipLabelWrapper: FC<ChipLabelWrapperProps> = memo(({chipLabel, label}) => {
  return (
    <chipLabel.component
      componentAttributes={{className: 'rtms-label'}}
      componentProps={{label}}
      customProps={chipLabel.props}
    />
  );
});
