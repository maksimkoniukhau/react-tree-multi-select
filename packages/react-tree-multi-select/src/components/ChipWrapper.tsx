import React, {FC, memo} from 'react';
import {InnerComponents} from '../innerTypes';
import {ChipContainerWrapper} from './ChipContainer';
import {ChipLabelWrapper} from './ChipLabel';
import {ChipClearWrapper} from './ChipClear';

interface ChipWrapperProps {
  components: InnerComponents;
  id: string;
  label: string;
  focused: boolean;
  disabled: boolean;
  withChipClear: boolean;
  onChipClick: (id: string) => (event: React.MouseEvent) => void;
  onChipDelete: (id: string) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
}

export const ChipWrapper: FC<ChipWrapperProps> = memo((props) => {
  const {
    components,
    id,
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
      id={id}
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
          id={id}
          onClick={onChipDelete}
          componentDisabled={componentDisabled}
        />
      )}
    </ChipContainerWrapper>
  );
});
