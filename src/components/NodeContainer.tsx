import React, {CSSProperties, FC, memo, ReactNode} from 'react';
import {NodeContainerProps, NodeContainerType} from '../types';
import {Node} from '../Node';

export const NodeContainer: FC<NodeContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface NodeContainerWrapperProps {
  nodeContainer: NodeContainerType;
  node: Node;
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
  indentation: boolean;
  onNodeChange: (node: Node) => (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const NodeContainerWrapper: FC<NodeContainerWrapperProps> = memo((props) => {
  const {
    nodeContainer,
    node,
    label,
    disabled,
    selected,
    partial,
    expanded,
    focused,
    matched,
    indentation,
    onNodeChange,
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
        style: {
          '--rtms-list-item-depth': node.depth,
          '--rtms-list-item-indentation': indentation ? 1 : 0
        } as CSSProperties,
        className,
        onClick: onNodeChange(node)
      }}
      ownProps={{label, disabled, selected, partial, expanded, focused, matched}}
      customProps={nodeContainer.props}
    >
      {children}
    </nodeContainer.component>
  );
});
