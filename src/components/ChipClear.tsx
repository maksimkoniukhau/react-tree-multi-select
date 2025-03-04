import React, {FC, memo} from 'react';
import {ChipClearProps, ChipClearType} from '../types';
import {Node} from '../Node';

export interface ChipClearOwnProps {
}

export const ChipClear: FC<ChipClearProps> = memo((props) => {
  return (
    <div {...props.componentAttributes}>
      {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
      <svg className="rtms-chip-clear-icon" viewBox="0 0 512 512">
        <path
          d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
      </svg>
    </div>
  );
});

interface ChipClearWrapperProps {
  chipClear: ChipClearType<any>;
  node: Node;
  onClick: (node: Node) => (event: React.MouseEvent) => void;
}

export const ChipClearWrapper: FC<ChipClearWrapperProps> = memo(({chipClear, node, onClick}) => {
  return (
    <chipClear.component
      componentAttributes={{className: 'rtms-chip-clear', onClick: onClick(node)}}
      componentProps={{}}
      customProps={chipClear.props}
    />
  );
});
