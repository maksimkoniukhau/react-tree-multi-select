import React, {FC, memo} from 'react';

import {Node} from './Node';
import {NodeExpand} from './NodeExpand';
import {Checkbox} from './Checkbox';

export interface NodeRowProps {
  node: Node;
  focused: boolean;
  expanded: boolean;
  showNodeExpand: boolean;
  showNodeCheckbox: boolean;
  onToggleNode: (e: React.MouseEvent<Element>) => void;
  onClickExpandIcon: (e: React.MouseEvent<Element>) => void;
}

export const NodeRow: FC<NodeRowProps> = memo((props) => {

  const {
    node,
    focused,
    expanded,
    showNodeExpand,
    showNodeCheckbox,
    onToggleNode,
    onClickExpandIcon
  } = props;

  const expandIconWidth = showNodeExpand && node.hasChildren() ? 1 : 0;
  const checkboxWidth = showNodeCheckbox ? 0 : 1;
  const pL = node.deep - checkboxWidth - expandIconWidth;

  const getNodeRowClasses = (): string => {
    const disabledClass = node.disabled ? ' disabled' : '';
    const selectedClass = node.selected ? ' selected' : node.partiallySelected ? ' partial' : '';
    const expandedClass = node.expanded ? ' expanded' : '';
    const focusedClass = focused ? ' focused' : '';
    const matchedClass = node.matched ? ' matched' : '';
    const plClass = ` pl-${pL}`;
    return `rts-list-item${disabledClass}${selectedClass}${expandedClass}${focusedClass}${matchedClass}${plClass}`;
  };

  return (
    <div className={getNodeRowClasses()}>
      {(showNodeExpand && node.hasChildren()) && (
        <NodeExpand expanded={expanded} onClick={onClickExpandIcon}/>
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
