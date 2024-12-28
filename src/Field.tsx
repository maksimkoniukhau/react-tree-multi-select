import React, {FC, memo, ReactNode, RefObject, useRef} from 'react';

import {CLEAR_ALL} from './constants';
import {filterChips, isAnyExcludingDisabledSelected, preventDefaultOnMouseEvent} from './utils';
import {CustomComponents, Type} from './models';
import {Node} from './Node';
import {Chip} from './Chip';
import {FieldClear} from './FieldClear';
import {FieldExpand} from './FieldExpand';

export interface FieldProps {
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

  const fieldRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (!customComponents?.field) {
      inputRef?.current?.focus();
      e.preventDefault();
    }
  };

  const fieldClasses = 'rts-field' + (customComponents?.field ? ' rts-field-custom' : '');

  return (
    <div
      ref={fieldRef}
      className={fieldClasses}
      onClick={onClickField}
      onMouseDown={handleMouseDown}
    >
      {customComponents?.field ? (
        customComponents.field
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
