import React, {FC, memo} from 'react';

export interface NodeToggleProps {
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const NodeToggle: FC<NodeToggleProps> = memo((props) => {

  const {expanded, onClick} = props;

  const nodeToggleClasses = `rts-node-toggle${expanded ? ' expanded' : ''}`;

  return (
    <div className={nodeToggleClasses} onClick={onClick}>
      <svg className="rts-node-toggle-icon" viewBox={expanded ? '0 0 448 512' : '0 0 320 512'}>
        {expanded ? (
          <path
            d="M224 397.3l22.6-22.6 160-160L429.3 192 384 146.7l-22.6 22.6L224 306.7 86.6 169.4 64 146.7 18.7 192l22.6 22.6 160 160L224 397.3z"/>
        ) : (
          <path
            d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
        )}
      </svg>
    </div>
  );
});
