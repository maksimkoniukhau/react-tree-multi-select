import React, {FC, memo, ReactNode, RefObject} from 'react';

import {CLEAR_ALL} from './constants';
import {
  filterChips,
  getFieldFocusableElement,
  isAnyExcludingDisabledSelected,
  preventDefaultOnMouseEvent
} from './utils';
import {Components, CustomComponents, Type} from './models';
import {Node} from './Node';
import {getComponents} from './componentsUtils';

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
  components?: Components;
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
    customComponents,
    components: renderComponents,
  } = props;

  const handleClick = (e: React.MouseEvent): void => {
    const fieldFocusableElement = getFieldFocusableElement(customComponents, fieldRef, inputRef);
    fieldFocusableElement?.focus();
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!e.defaultPrevented) {
      onClickField(e);
    }
  };

  const handleClickChip = (node: Node) => (e: React.MouseEvent): void => {
    // defaultPrevented is on click chip clear icon
    if (!e.defaultPrevented) {
      e.preventDefault();
      onClickChip(node)(e);
    }
  };

  const handleClickChipClear = (node: Node) => (e: React.MouseEvent): void => {
    e.preventDefault();
    onDeleteNode(node)(e);
  };

  const handleClickFieldClear = (e: React.MouseEvent): void => {
    e.preventDefault();
    onDeleteAll(e);
  };

  const components = getComponents(renderComponents);

  return (
    <div
      ref={fieldRef}
      className="rts-field"
      onClick={handleClick}
      onMouseDown={preventDefaultOnMouseEvent}
    >
      {customComponents?.Field ? (
        <customComponents.Field.component {...customComponents.Field.props}/>
      ) : (
        <>
          <div
            className="rts-field-content"
            // needed for staying focus on input
            onMouseDown={preventDefaultOnMouseEvent}
          >
            {filterChips(selectedNodes, type)
              .map(node => (
                <components.Chip.component
                  key={node.path}
                  rootAttributes={{
                    className: `rts-chip${node.disabled ? ' disabled' : ''}${focusedFieldElement === node.path ? ' focused' : ''}`,
                    onClick: handleClickChip(node),
                    // needed for staying focus on input
                    onMouseDown: preventDefaultOnMouseEvent
                  }}
                  componentProps={{
                    focused: focusedFieldElement === node.path,
                    disabled: node.disabled,
                  }}
                  ownProps={components.Chip.props}
                >
                  <components.ChipLabel.component
                    rootAttributes={{className: 'rts-label'}}
                    componentProps={{label: node.name}}
                    ownProps={components.ChipLabel.props}
                  />
                  {!node.disabled &&
                      <components.ChipClear.component
                          rootAttributes={{className: 'rts-chip-clear', onClick: handleClickChipClear(node)}}
                          componentProps={{}}
                          ownProps={components.ChipClear.props}
                      />}
                </components.Chip.component>
              ))}
            {input}
          </div>
          <div className="rts-actions">
            {withClearAll && isAnyExcludingDisabledSelected(nodes) && (
              <components.FieldClear.component
                rootAttributes={{
                  className: `rts-field-clear${focusedFieldElement === CLEAR_ALL ? ' focused' : ''}`,
                  onClick: handleClickFieldClear,
                  // needed for staying focus on input
                  onMouseDown: preventDefaultOnMouseEvent
                }}
                componentProps={{focused: focusedFieldElement === CLEAR_ALL}}
                ownProps={components.FieldClear.props}
              />
            )}
            <components.FieldToggle.component
              rootAttributes={{
                className: `rts-field-toggle${showDropdown ? ' expanded' : ''}`,
                // needed for staying focus on input
                onMouseDown: preventDefaultOnMouseEvent
              }}
              componentProps={{expanded: showDropdown}}
              ownProps={components.FieldToggle.props}
            />
          </div>
        </>
      )}
    </div>
  );
});
