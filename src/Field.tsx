import React, {FC, RefObject, useRef} from 'react';

import {CLEAR_ALL} from './constants';
import {filterChips, isAnyExcludingDisabledSelected} from './utils';
import {CustomComponents, Type} from './models';
import {Node} from './Node';
import {Input} from './Input';
import {Chip} from './Chip';
import {FieldClear} from './FieldClear';
import {FieldExpand} from './FieldExpand';

export interface FieldProps {
  inputRef: RefObject<HTMLInputElement>;
  type: Type;
  nodes: Node[];
  selectedNodes: Node[];
  showDropdown: boolean;
  withClearAll: boolean;
  inputPlaceholder: string;
  searchValue: string;
  focusedFieldElement: string;
  onClickField: (e: React.MouseEvent) => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickChip: (node: Node) => (e: React.MouseEvent) => void;
  onDeleteNode: (node: Node) => (e: React.MouseEvent) => void;
  onDeleteAll: (e: React.MouseEvent | React.KeyboardEvent) => void;
  customComponents?: CustomComponents;
}

export const Field: FC<FieldProps> = (props) => {

  const {
    inputRef,
    type,
    nodes = [],
    selectedNodes = [],
    showDropdown = false,
    withClearAll = true,
    inputPlaceholder,
    searchValue,
    focusedFieldElement = '',
    onClickField,
    onChangeInput,
    onClickChip,
    onDeleteNode,
    onDeleteAll,
    customComponents
  } = props;

  const fieldRef = useRef<HTMLDivElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    fieldRef?.current?.classList?.add('focused');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    fieldRef?.current?.classList?.remove('focused');
  };

  const handleClickField = (e: React.MouseEvent): void => {
    if (!customComponents?.Field) {
      inputRef?.current?.focus();
    }
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!e.defaultPrevented) {
      !customComponents?.Field && e.preventDefault();
      onClickField(e);
    }
  };

  const fieldClasses = 'rts-field' + (customComponents?.Field ? ' rts-field-custom' : '');

  return (
    <div
      ref={fieldRef}
      className={fieldClasses}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleClickField}
    >
      {customComponents?.Field ? (
        <customComponents.Field/>
      ) : (
        <>
          <div className="rts-input-container">
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
            <Input
              inputRef={inputRef}
              inputPlaceholder={inputPlaceholder}
              value={searchValue}
              onChangeInput={onChangeInput}
            />
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
};
