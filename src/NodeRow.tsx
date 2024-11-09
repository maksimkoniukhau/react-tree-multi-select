import React, {FC} from 'react';

import {Node} from './Node';
import {NodeExpand} from './NodeExpand';
import {Checkbox} from './Checkbox';

export interface NodeRowProps {
  node: Node;
  focused: boolean;
  expanded: boolean;
  onToggleNode: (e: React.MouseEvent<Element>) => void;
  onClickExpandIcon: (e: React.MouseEvent<Element>) => void;
}

const NodeRowFC: FC<NodeRowProps> = (props) => {

  const {
    node,
    focused,
    expanded,
    onToggleNode,
    onClickExpandIcon
  } = props;

  const expandIconWidth = node.hasChildren() ? 1 : 0;
  const pL = node.deep - expandIconWidth;

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
      {node.hasChildren() && (
        <NodeExpand expanded={expanded} onClick={onClickExpandIcon}/>
      )}
      <div className="rts-node" onClick={onToggleNode}>
        <Checkbox checked={node.selected} partial={node.partiallySelected} disabled={node.disabled}/>
        <span className="rts-label">
           {node.name}
        </span>
      </div>
    </div>
  );
};

export const NodeRow = React.memo(NodeRowFC);
