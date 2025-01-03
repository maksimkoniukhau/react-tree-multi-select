import React, {FC, memo, ReactNode, RefObject} from 'react';

import {CLEAR_ALL} from './constants';
import {
  filterChips,
  getFieldFocusableElement,
  isAnyExcludingDisabledSelected,
  preventDefaultOnMouseEvent
} from './utils';
import {CustomComponents, Type} from './models';
import {Node} from './Node';
import {Chip} from './Chip';
import {FieldClear} from './FieldClear';
import {FieldExpand} from './FieldExpand';

export interface FieldProps {
  fieldRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  input: ReactNode;
  type: Type;
  nodes: Node[];
  selectedNodes: Node[];
  showDropdown: boolean;
  withClearAll: boolean;
  focusedFieldElement: string;
  onClickField: (e: React.MouseEvent) => void;
  onClickChip: (node: Node) => (e: React.MouseEvent) => void;
  onDeleteNode: (node: Node) => (e: React.MouseEvent) => void;
  onDeleteAll: (e: React.MouseEvent | React.KeyboardEvent) => void;
  customComponents?: CustomComponents;
}

export const Field: FC<FieldProps> = memo((props) => {

  const {
    fieldRef,
    inputRef,
    input,
    type,
    nodes = [],
    selectedNodes = [],
    showDropdown = false,
    withClearAll = true,
    focusedFieldElement = '',
    onClickField,
    onClickChip,
    onDeleteNode,
    onDeleteAll,
    customComponents
  } = props;

  const handleClick = (e: React.MouseEvent): void => {
    const fieldFocusableElement = getFieldFocusableElement(customComponents, fieldRef, inputRef);
    fieldFocusableElement?.focus();
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!e.defaultPrevented) {
      onClickField(e);
    }
  };

  return (
    <div
      ref={fieldRef}
      className="rts-field"
      onClick={handleClick}
      onMouseDown={preventDefaultOnMouseEvent}
    >
      {customComponents?.Field ? (
        <customComponents.Field.component {...customComponents.Field.props} />
      ) : (
        <>
          <div
            className="rts-field-content"
            // needed for staying focus on input
            onMouseDown={preventDefaultOnMouseEvent}
          >
            {filterChips(selectedNodes, type)
              .map(node => (
                <Chip
                  key={node.path}
                  label={node.name}
                  focused={focusedFieldElement === node.path}
                  disabled={node.disabled}
                  onClickElement={onClickChip(node)}
                  onClickIcon={onDeleteNode(node)}
                />
              ))}
            {input}
          </div>
          <div className="rts-actions">
            {withClearAll && isAnyExcludingDisabledSelected(nodes) && (
              <FieldClear focused={focusedFieldElement === CLEAR_ALL} onClick={onDeleteAll}/>
            )}
            <FieldExpand expanded={showDropdown}/>
          </div>
        </>
      )}
    </div>
  );
});
