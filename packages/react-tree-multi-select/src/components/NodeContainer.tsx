import React, {CSSProperties, FC, memo, ReactNode} from 'react';
import {DROPDOWN_PREFIX, NodeContainerProps, NodeContainerType} from '../types';
import {classNames} from '../utils/commonUtils';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const NodeContainer: FC<NodeContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface NodeContainerWrapperProps {
  nodeContainer: NodeContainerType;
  id: string;
  depth: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  indentation: boolean;
  onClick: (id: string) => (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const NodeContainerWrapper: FC<NodeContainerWrapperProps> = memo((props) => {
  const {
    nodeContainer,
    id,
    depth,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    indentation,
    onClick,
    children
  } = props;

  const className = classNames(
    'rtms-list-item',
    disabled && 'disabled',
    selected ? 'selected' : partial && 'partial',
    expanded && 'expanded',
    focused && 'focused',
    matched && 'matched'
  );

  return (
    <nodeContainer.component
      attributes={{
        style: {
          '--rtms-list-item-depth': depth,
          '--rtms-list-item-indentation': indentation ? 1 : 0
        } as CSSProperties,
        className,
        'data-rtms-virtual-focus-id': buildVirtualFocusId(DROPDOWN_PREFIX, id),
        onClick: onClick(id)
      }}
      ownProps={{label, disabled, selected, partial, expanded, focused, matched}}
      customProps={nodeContainer.props}
    >
      {children}
    </nodeContainer.component>
  );
});
