import React, {FC} from 'react';

export interface NodeExpandProps {
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const NodeExpand: FC<NodeExpandProps> = (props) => {

  const {expanded, onClick} = props;

  const nodeExpandClasses = `rts-node-expand${expanded ? ' expanded' : ''}`;

  return (
    <div className={nodeExpandClasses} onClick={onClick}>
      <svg className="rts-node-expand-icon" viewBox="0 0 320 512">
        <path
          d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
      </svg>
    </div>
  );
};
