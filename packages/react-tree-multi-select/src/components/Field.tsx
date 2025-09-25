import React, {FC, memo, RefObject} from 'react';
import {FieldProps, Type} from '../types';
import {InnerComponents} from '../innerTypes';
import {CLEAR_ALL, FIELD} from '../constants';
import {filterChips} from '../utils/nodesUtils';
import {isFocused} from '../utils/focusUtils';
import {Node} from '../Node';
import {ChipWrapper} from './ChipWrapper';
import {InputWrapper} from './Input';
import {FieldClearWrapper} from './FieldClear';
import {FieldToggleWrapper} from './FieldToggle';

export const Field: FC<FieldProps> = memo((props) => {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
});

interface FieldContainerProps {
  fieldRef: RefObject<HTMLDivElement | null>;
  fieldInputRef: RefObject<HTMLInputElement | null>;
  type: Type;
  selectedNodes: Node[];
  showDropdown: boolean;
  withClearAll: boolean;
  showClearAll: boolean;
  withChipClear: boolean;
  focusedElement: string;
  isSearchable: boolean;
  inputPlaceholder: string;
  searchValue: string;
  withDropdownInput: boolean;
  dropdownMounted: boolean;
  components: InnerComponents;
  componentDisabled: boolean;
  onMouseDown: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChipClick: (path: string) => (event: React.MouseEvent) => void;
  onChipDelete: (path: string) => (event: React.MouseEvent) => void;
  onDeleteAll: (event: React.MouseEvent) => void;
}

export const FieldContainer: FC<FieldContainerProps> = memo((props) => {
  const {
    fieldRef,
    fieldInputRef,
    type,
    selectedNodes,
    showDropdown,
    withClearAll,
    showClearAll,
    withChipClear,
    focusedElement,
    isSearchable,
    inputPlaceholder,
    searchValue,
    withDropdownInput,
    dropdownMounted,
    components,
    componentDisabled,
    onMouseDown,
    onClick,
    onInputChange,
    onChipClick,
    onChipDelete,
    onDeleteAll
  } = props;

  return (
    <components.Field.component
      attributes={{
        ref: fieldRef,
        className: `rtms-field${componentDisabled ? ' disabled' : ''}`,
        onClick,
        onMouseDown
      }}
      ownProps={{type, showDropdown, withClearAll, componentDisabled}}
      customProps={components.Field.props}
    >
      <div className="rtms-field-content">
        {filterChips(selectedNodes, type)
          .map(node => (
            <ChipWrapper
              key={node.path}
              components={components}
              path={node.path}
              label={node.name}
              focused={isFocused(node.path, FIELD, focusedElement)}
              disabled={node.disabled}
              withChipClear={withChipClear}
              onChipClick={onChipClick}
              onChipDelete={onChipDelete}
              componentDisabled={componentDisabled}
            />
          ))}
        {withDropdownInput || !isSearchable ? (
          <input
            tabIndex={withDropdownInput && showDropdown && dropdownMounted ? -1 : 0}
            className="rtms-input-hidden"
            disabled={componentDisabled}
            readOnly
          />
        ) : (
          <InputWrapper
            input={components.Input}
            inputRef={fieldInputRef}
            placeholder={inputPlaceholder}
            value={searchValue}
            onChange={onInputChange}
            componentDisabled={componentDisabled}
          />
        )}
      </div>
      <div className="rtms-actions">
        {showClearAll && (
          <FieldClearWrapper
            fieldClear={components.FieldClear}
            focused={isFocused(CLEAR_ALL, FIELD, focusedElement)}
            onClick={onDeleteAll}
            componentDisabled={componentDisabled}
          />
        )}
        <FieldToggleWrapper
          fieldToggle={components.FieldToggle}
          expanded={showDropdown}
          componentDisabled={componentDisabled}
        />
      </div>
    </components.Field.component>
  );
});
