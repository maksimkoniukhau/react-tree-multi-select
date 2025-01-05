import React, {FC, memo} from 'react';

import {Node} from './Node';
import {NodeToggle} from './NodeToggle';
import {Checkbox} from './Checkbox';

export interface NodeRowProps {
  node: Node;
  focused: boolean;
  expanded: boolean;
  showNodeToggle: boolean;
  showNodeCheckbox: boolean;
  indentation: boolean;
  onToggleNode: (e: React.MouseEvent) => void;
  onClickExpandIcon: (e: React.MouseEvent) => void;
}

export const NodeRow: FC<NodeRowProps> = memo((props) => {

  const {
    node,
    focused,
    expanded,
    showNodeToggle,
    showNodeCheckbox,
    indentation,
    onToggleNode,
    onClickExpandIcon
  } = props;

  const getNodeRowClasses = (): string => {
    const disabledClass = node.disabled ? ' disabled' : '';
    const selectedClass = node.selected ? ' selected' : node.partiallySelected ? ' partial' : '';
    const expandedClass = node.expanded ? ' expanded' : '';
    const focusedClass = focused ? ' focused' : '';
    const matchedClass = node.matched ? ' matched' : '';
    const plClass = ` pl-${node.deep + (indentation ? 1 : 0)}`;
    return `rts-list-item${disabledClass}${selectedClass}${expandedClass}${focusedClass}${matchedClass}${plClass}`;
  };

  return (
    <div className={getNodeRowClasses()}>
      {showNodeToggle && (
        <NodeToggle expanded={expanded} onClick={onClickExpandIcon}/>
      )}
      <div className="rts-node" onClick={onToggleNode}>
        {showNodeCheckbox && (
          <Checkbox checked={node.selected} partial={node.partiallySelected} disabled={node.disabled}/>
        )}
        <span className="rts-label">
           {node.name}
        </span>
      </div>
    </div>
  );
});
