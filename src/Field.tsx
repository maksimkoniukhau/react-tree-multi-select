import React, {FC, RefObject, useRef} from 'react';

import {CLEAR_ALL} from './constants';
import {filterChips, isAnyExcludingDisabledSelected} from './utils';
import {Type} from './models';
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
  onClickField: (e: React.MouseEvent<Element>) => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickChip: (node: Node) => (e: React.MouseEvent<Element>) => void;
  onDeleteNode: (node: Node) => (e: React.MouseEvent<Element>) => void;
  onDeleteAll: (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => void;
}

export const Field: FC<FieldProps> = (props) => {

  const {
    inputRef,
    type = Type.MULTISELECT_TREE,
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
    onDeleteAll
  } = props;

  const fieldRef = useRef<HTMLDivElement>(null);

  const handleClickField = (e: React.MouseEvent<Element>): void => {
    inputRef?.current?.focus();
    // defaultPrevented is on click clear icons
    if (!e.defaultPrevented) {
      e.preventDefault();
      onClickField(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    fieldRef?.current?.classList?.add('focused');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    fieldRef?.current?.classList?.remove('focused');
  };

  return (
    <div
      ref={fieldRef}
      className="rts-field"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleClickField}
    >
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
    </div>
  );
};
