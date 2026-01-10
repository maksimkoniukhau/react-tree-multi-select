import React, {FC, memo} from 'react';
import {InnerComponents} from '../innerTypes';
import {NodeContainerWrapper} from './NodeContainer';
import {NodeToggleWrapper} from './NodeToggle';
import {NodeCheckboxWrapper} from './NodeCheckbox';
import {NodeLabelWrapper} from './NodeLabel';
import {SpinnerWrapper} from './Spinner';

export interface NodeWrapperProps {
  components: InnerComponents;
  id: string;
  depth: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  loaded: boolean;
  indentation: boolean;
  withToggle: boolean;
  withCheckbox: boolean;
  onNodeChange: (id: string) => (event: React.MouseEvent) => void;
  onNodeToggle: (id: string) => (event: React.MouseEvent) => void;
}

export const NodeWrapper: FC<NodeWrapperProps> = memo((props) => {
  const {
    components,
    id,
    depth,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    loaded,
    indentation,
    withToggle,
    withCheckbox,
    onNodeChange,
    onNodeToggle
  } = props;

  return (
    <NodeContainerWrapper
      nodeContainer={components.NodeContainer}
      id={id}
      depth={depth}
      label={label}
      disabled={disabled}
      selected={selected}
      partial={partial}
      expanded={expanded}
      focused={focused}
      matched={matched}
      indentation={indentation}
      onClick={onNodeChange}
    >
      {withToggle && (
        loaded ? (
          <SpinnerWrapper spinner={components.Spinner}/>
        ) : (
          <NodeToggleWrapper
            nodeToggle={components.NodeToggle}
            id={id}
            expanded={expanded}
            onClick={onNodeToggle}
          />
        )
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
