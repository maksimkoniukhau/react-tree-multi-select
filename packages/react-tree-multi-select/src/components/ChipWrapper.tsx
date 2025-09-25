import React, {FC, memo} from 'react';
import {InnerComponents} from '../innerTypes';
import {ChipContainerWrapper} from './ChipContainer';
import {ChipLabelWrapper} from './ChipLabel';
import {ChipClearWrapper} from './ChipClear';

interface ChipWrapperProps {
  components: InnerComponents;
  path: string;
  label: string;
  focused: boolean;
  disabled: boolean;
  withChipClear: boolean;
  onChipClick: (path: string) => (event: React.MouseEvent) => void;
  onChipDelete: (path: string) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
}

export const ChipWrapper: FC<ChipWrapperProps> = memo((props) => {
  const {
    components,
    path,
    label,
    focused,
    disabled,
    withChipClear,
    onChipClick,
    onChipDelete,
    componentDisabled
  } = props;

  return (
    <ChipContainerWrapper
      chipContainer={components.ChipContainer}
      path={path}
      label={label}
      focused={focused}
      disabled={disabled}
      onClick={onChipClick}
      componentDisabled={componentDisabled}
      withChipClear={withChipClear}
    >
      <ChipLabelWrapper chipLabel={components.ChipLabel} label={label} componentDisabled={componentDisabled}/>
      {withChipClear && !disabled && (
        <ChipClearWrapper
          chipClear={components.ChipClear}
          path={path}
          onClick={onChipDelete}
          componentDisabled={componentDisabled}
        />
      )}
    </ChipContainerWrapper>
  );
});
