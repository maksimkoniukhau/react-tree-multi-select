import React, {FC, memo} from 'react';
import {InnerComponents} from '../innerTypes';
import {Node} from '../Node';
import {ChipLabelWrapper} from './ChipLabel';
import {ChipClearWrapper} from './ChipClear';
import {ChipContainerWrapper} from './ChipContainer';

interface ChipWrapperProps {
  components: InnerComponents;
  node: Node;
  focused: boolean;
  onChipClick: (node: Node) => (event: React.MouseEvent) => void;
  onChipDelete: (node: Node) => (event: React.MouseEvent) => void;
  componentDisabled: boolean;
}

export const ChipWrapper: FC<ChipWrapperProps> = memo((props) => {
  const {components, node, focused, onChipClick, onChipDelete, componentDisabled} = props;

  return (
    <ChipContainerWrapper
      chipContainer={components.ChipContainer}
      node={node}
      label={node.name}
      focused={focused}
      disabled={node.disabled}
      onClick={onChipClick}
      componentDisabled={componentDisabled}
    >
      <ChipLabelWrapper chipLabel={components.ChipLabel} label={node.name} componentDisabled={componentDisabled}/>
      {!node.disabled && (
        <ChipClearWrapper
          chipClear={components.ChipClear}
          node={node}
          onClick={onChipDelete}
          componentDisabled={componentDisabled}
        />
      )}
    </ChipContainerWrapper>
  );
});
