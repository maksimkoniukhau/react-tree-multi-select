import React, {FC, memo, ReactNode} from 'react';
import {
  DROPDOWN_PREFIX,
  SELECT_ALL_SUFFIX,
  SelectAllContainerProps,
  SelectAllContainerType,
  SelectionAggregateState
} from '../types';
import {classNames} from '../utils/commonUtils';
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

  const selected = selectionAggregateState === SelectionAggregateState.ALL;
  const partial = selectionAggregateState === SelectionAggregateState.EFFECTIVE_ALL
    || selectionAggregateState === SelectionAggregateState.PARTIAL;

  const className = classNames(
    'rtms-sticky-item',
    selected ? 'selected' : partial && 'partial',
    focused && 'focused'
  );

  return (
    <selectAllContainer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX),
        className,
        onClick
      }}
      ownProps={{label, selectionAggregateState, focused}}
      customProps={selectAllContainer.props}
    >
      {children}
    </selectAllContainer.component>
  );
});
