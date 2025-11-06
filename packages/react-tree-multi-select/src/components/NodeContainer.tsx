import React, {CSSProperties, FC, HTMLProps, memo, ReactNode} from 'react';
import {DROPDOWN_PREFIX, NodeContainerProps, NodeContainerType} from '../types';
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

  const disabledClass = disabled ? ' disabled' : '';
  const selectedClass = selected ? ' selected' : partial ? ' partial' : '';
  const expandedClass = expanded ? ' expanded' : '';
  const focusedClass = focused ? ' focused' : '';
  const matchedClass = matched ? ' matched' : '';
  const className = `rtms-list-item${disabledClass}${selectedClass}${expandedClass}${focusedClass}${matchedClass}`;

  return (
    <nodeContainer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(id, DROPDOWN_PREFIX),
        style: {
          '--rtms-list-item-depth': depth,
          '--rtms-list-item-indentation': indentation ? 1 : 0
        } as CSSProperties,
        className,
        onClick: onClick(id)
      } as HTMLProps<HTMLDivElement>}
      ownProps={{label, disabled, selected, partial, expanded, focused, matched}}
      customProps={nodeContainer.props}
    >
      {children}
    </nodeContainer.component>
  );
});
