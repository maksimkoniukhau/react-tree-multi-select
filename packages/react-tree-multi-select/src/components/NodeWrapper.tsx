import React, {FC, memo} from 'react';
import {Type} from '../types';
import {InnerComponents} from '../innerTypes';
import {NodeToggleWrapper} from './NodeToggle';
import {NodeCheckboxWrapper} from './NodeCheckbox';
import {NodeLabelWrapper} from './NodeLabel';
import {NodeContainerWrapper} from './NodeContainer';

export interface NodeWrapperProps {
  components: InnerComponents;
  type: Type;
  path: string;
  depth: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  hasChildren: boolean;
  indentation: boolean;
  onNodeChange: (path: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (path: string) => (event: React.MouseEvent) => void;
}

export const NodeWrapper: FC<NodeWrapperProps> = memo((props) => {
  const {
    components,
    type,
    path,
    depth,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    hasChildren,
    indentation,
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
      {type !== Type.MULTI_SELECT && type !== Type.SELECT && hasChildren && (
        <NodeToggleWrapper
          nodeToggle={components.NodeToggle}
          path={path}
          expanded={expanded}
          onNodeToggle={onNodeToggle}
        />
      )}
      {type !== Type.MULTI_SELECT && type !== Type.SELECT && (
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
