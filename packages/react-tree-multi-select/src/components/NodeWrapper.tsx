import React, {FC, memo} from 'react';
import {InnerComponents} from '../innerTypes';
import {NodeContainerWrapper} from './NodeContainer';
import {NodeToggleWrapper} from './NodeToggle';
import {NodeCheckboxWrapper} from './NodeCheckbox';
import {NodeLabelWrapper} from './NodeLabel';

export interface NodeWrapperProps {
  components: InnerComponents;
  path: string;
  depth: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  indentation: boolean;
  withToggle: boolean;
  withCheckbox: boolean;
  onNodeChange: (path: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (path: string) => (event: React.MouseEvent) => void;
}

export const NodeWrapper: FC<NodeWrapperProps> = memo((props) => {
  const {
    components,
    path,
    depth,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    indentation,
    withToggle,
    withCheckbox,
    onNodeChange,
    onNodeToggle
  } = props;

  return (
    <NodeContainerWrapper
      nodeContainer={components.NodeContainer}
      path={path}
      depth={depth}
      label={label}
      disabled={disabled}
      selected={selected}
      partial={partial}
      expanded={expanded}
      focused={focused}
      matched={matched}
      indentation={indentation}
      onNodeChange={onNodeChange}
    >
      {withToggle && (
        <NodeToggleWrapper
          nodeToggle={components.NodeToggle}
          path={path}
          expanded={expanded}
          onNodeToggle={onNodeToggle}
        />
      )}
      {withCheckbox && (
        <NodeCheckboxWrapper
          nodeCheckbox={components.NodeCheckbox}
          checked={selected}
          partial={partial}
          disabled={disabled}
        />
      )}
      <NodeLabelWrapper nodeLabel={components.NodeLabel} label={label}/>
    </NodeContainerWrapper>
  );
});
