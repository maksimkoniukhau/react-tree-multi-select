import React, {FC, memo, RefObject} from 'react';
import {CLEAR_ALL_SUFFIX, FIELD_PREFIX, FieldProps, Type} from '../types';
import {InnerComponents, NullableVirtualFocusId} from '../innerTypes';
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
  isDropdownOpen: boolean;
  withClearAll: boolean;
  showClearAll: boolean;
  withChipClear: boolean;
  virtualFocusId: NullableVirtualFocusId;
  isSearchable: boolean;
  inputPlaceholder: string;
  searchValue: string;
  withDropdownInput: boolean;
  dropdownMounted: boolean;
  components: InnerComponents;
  componentDisabled: boolean;
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
    isDropdownOpen,
    withClearAll,
    showClearAll,
    withChipClear,
    virtualFocusId,
    isSearchable,
    inputPlaceholder,
    searchValue,
    withDropdownInput,
    dropdownMounted,
    components,
    componentDisabled,
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
        onClick
      }}
      ownProps={{type, showDropdown: isDropdownOpen, withClearAll, componentDisabled}}
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
              focused={isFocused(node.path, FIELD_PREFIX, virtualFocusId)}
              disabled={node.disabled}
              withChipClear={withChipClear}
              onChipClick={onChipClick}
              onChipDelete={onChipDelete}
              componentDisabled={componentDisabled}
            />
          ))}
        {withDropdownInput || !isSearchable ? (
          <input
            tabIndex={withDropdownInput && isDropdownOpen && dropdownMounted ? -1 : 0}
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
            focused={isFocused(CLEAR_ALL_SUFFIX, FIELD_PREFIX, virtualFocusId)}
            onClick={onDeleteAll}
            componentDisabled={componentDisabled}
          />
        )}
        <FieldToggleWrapper
          fieldToggle={components.FieldToggle}
          expanded={isDropdownOpen}
          componentDisabled={componentDisabled}
        />
      </div>
    </components.Field.component>
  );
});
