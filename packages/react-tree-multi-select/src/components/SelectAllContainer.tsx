import React, {FC, memo, ReactNode} from 'react';
import {
  DROPDOWN_PREFIX,
  SELECT_ALL_SUFFIX,
  SelectAllContainerProps,
  SelectAllContainerType,
  SelectionAggregateState
} from '../types';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const SelectAllContainer: FC<SelectAllContainerProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface SelectAllContainerWrapperProps {
  selectAllContainer: SelectAllContainerType;
  label: string;
  selectionAggregateState: SelectionAggregateState;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: ReactNode;
}

export const SelectAllContainerWrapper: FC<SelectAllContainerWrapperProps> = memo((props) => {
  const {selectAllContainer, label, selectionAggregateState, focused, onClick, children} = props;

  const selectedClass = selectionAggregateState === SelectionAggregateState.ALL
    ? ' selected'
    : selectionAggregateState === SelectionAggregateState.NONE
      ? ''
      : ' partial';
  const containerClasses = `rtms-sticky-item${selectedClass}${focused ? ' focused' : ''}`;

  return (
    <selectAllContainer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX),
        className: containerClasses,
        onClick
      }}
      ownProps={{label, selectionAggregateState, focused}}
      customProps={selectAllContainer.props}
    >
      {children}
    </selectAllContainer.component>
  );
});
