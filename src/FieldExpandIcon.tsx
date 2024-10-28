import React, {FC} from 'react';

export interface FieldExpandIconProps {
  expanded: boolean;
}

export const FieldExpandIcon: FC<FieldExpandIconProps> = ({expanded}) => {

  const iconClasses = `rts-field-expand-icon${expanded ? ' expanded' : ''}`;

  return (
    <div
      className="rts-icon-container"
    >
      <svg className={iconClasses} viewBox="0 0 448 512">
        <path
          d="M224 397.3l22.6-22.6 160-160L429.3 192 384 146.7l-22.6 22.6L224 306.7 86.6 169.4 64 146.7 18.7 192l22.6 22.6 160 160L224 397.3z"/>
      </svg>
    </div>
  );
};
