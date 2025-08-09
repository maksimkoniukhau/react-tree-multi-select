import React, {FC, memo} from 'react';
import {Type} from '../types';
import {InnerComponents} from '../innerTypes';
import {Node} from '../Node';
import {NodeToggleWrapper} from './NodeToggle';
import {NodeCheckboxWrapper} from './NodeCheckbox';
import {NodeLabelWrapper} from './NodeLabel';
import {NodeContainerWrapper} from './NodeContainer';

export interface NodeWrapperProps {
  components: InnerComponents;
  type: Type;
  node: Node;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  indentation: boolean;
  onNodeChange: (node: Node) => (event: React.MouseEvent) => void;
  onNodeToggle: (node: Node) => (event: React.MouseEvent) => void;
}

export const NodeWrapper: FC<NodeWrapperProps> = memo((props) => {
  const {
    components,
    type,
    node,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    indentation,
    onNodeChange,
    onNodeToggle
  } = props;

  return (
    <NodeContainerWrapper
      nodeContainer={components.NodeContainer}
      node={node}
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
      {type !== Type.MULTI_SELECT && type !== Type.SELECT && node.hasChildren() && (
        <NodeToggleWrapper
          nodeToggle={components.NodeToggle}
          node={node}
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
