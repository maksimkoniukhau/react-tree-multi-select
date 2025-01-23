import './tree-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import {CLEAR_ALL, INPUT, INPUT_PLACEHOLDER, NO_MATCHES, PATH_DELIMITER, SELECT_ALL} from './constants';
import {
  areAllExcludingDisabledSelected,
  convertTreeArrayToFlatArray,
  filterChips,
  getFieldFocusableElement,
  isAnyExcludingDisabledSelected,
  isAnyHasChildren,
  preventDefaultOnMouseEvent,
  typeToClassName
} from './utils';
import {getComponents} from './componentsUtils';
import {CheckedState, Components, TreeNode, Type} from './types';
import {useOnClickOutside} from './hooks';
import {
  ActionType,
  ChangeInputPayload,
  ClickChipPayload,
  ExpandPayload,
  FocusElementPayload,
  FocusFieldElementPayload,
  initialState,
  InitPayload,
  reducer,
  ResetPayload,
  ShowSelectAllPayload,
  ToggleAllPayload,
  ToggleDropdownPayload,
  TogglePayload,
  UnselectAllPayload,
  UnselectPayload
} from './reducer';
import {Dropdown} from './Dropdown';
import {Node} from './Node';

export interface TreeSelectProps {
  data: TreeNode[];
  type?: Type;
  id?: string;
  className?: string;
  inputPlaceholder?: string;
  noMatchesText?: string;
  withClearAll?: boolean;
  withSelectAll?: boolean;
  withDropdownInput?: boolean;
  components?: Components;
  onNodeChange?: (node: TreeNode, selectedNodes: TreeNode[]) => void;
  onNodeToggle?: (node: TreeNode, expandedNodes: TreeNode[]) => void;
  onClearAll?: (selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void;
  onSelectAllChange?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

export const TreeSelect: FC<TreeSelectProps> = (props) => {
  const {
    data = [],
    type = Type.MULTI_SELECT_TREE,
    id = '',
    className = '',
    inputPlaceholder = INPUT_PLACEHOLDER,
    noMatchesText = NO_MATCHES,
    withClearAll = true,
    withSelectAll = false,
    withDropdownInput = false,
    components: propsComponents = {},
    onNodeChange,
    onNodeToggle,
    onClearAll,
    onSelectAllChange,
    onFocus,
    onBlur,
  } = props;

  const treeSelectRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const nodeMapRef = useRef<Map<string, Node>>(new Map());

  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);

  const components = useMemo(() => getComponents(propsComponents), [propsComponents]);

  const dispatchToggleDropdown = (showDropdown: boolean): void => {
    dispatch({
      type: ActionType.TOGGLE_DROPDOWN,
      payload: {showDropdown} as ToggleDropdownPayload
    });
  };

  const dispatchFocusElement = (focusedElement: string): void => {
    dispatch({
      type: ActionType.FOCUS_ELEMENT,
      payload: {
        focusedElement
      } as FocusElementPayload
    });
  };

  const dispatchFocusFieldElement = (focusedFieldElement: string): void => {
    dispatch({
      type: ActionType.FOCUS_FIELD_ELEMENT,
      payload: {
        focusedFieldElement
      } as FocusFieldElementPayload
    });
  };

  const getSelectAllCheckedState = (selectedNodes: Node[], allNodes: Node[]): CheckedState => {
    return selectedNodes.length === allNodes.length
      ? CheckedState.SELECTED
      : selectedNodes.length === 0
        ? CheckedState.UNSELECTED
        : CheckedState.PARTIAL;
  };

  const mapTreeNodeToNode = (treeNode: TreeNode, path: string, parent: Node | null): Node => {
    const parentPath = parent?.path || '';
    const delimiter = parentPath ? PATH_DELIMITER : '';
    const nodePath = parentPath + delimiter + path;
    const children: TreeNode[] = treeNode.children || [];
    const expanded = Boolean(children.length && treeNode.expanded);

    const {children: omitChildren, ...initTreeNode} = treeNode;

    const node: Node = new Node(
      nodePath,
      treeNode.label,
      parent,
      nodePath.split(PATH_DELIMITER).length - 1,
      expanded,
      initTreeNode
    );

    node.children = children.map((child, idx) => mapTreeNodeToNode(child, idx.toString(), node));

    nodeMapRef.current.set(nodePath, node);

    return node;
  };

  useEffect(() => {
    const nodeTree: Node[] = [];
    data.forEach((treeNode, index) => {
      nodeTree.push(mapTreeNodeToNode(treeNode, index.toString(), null));
    });

    let nodes = nodeTree;

    if (type === Type.MULTI_SELECT_TREE || type === Type.MULTI_SELECT_TREE_FLAT) {
      nodes = convertTreeArrayToFlatArray(nodeTree);
    }
    if (type === Type.MULTI_SELECT_TREE || type === Type.MULTI_SELECT_TREE_FLAT || type === Type.MULTI_SELECT) {
      nodes.forEach(node => {
        if (node.initTreeNode.selected) {
          // handleSelect (not handleToggle) should be used!!!
          node.handleSelect(type);
        }
      });
    }
    if (type === Type.SELECT) {
      const lastSelectedNode = nodes.findLast(node => node.initTreeNode.selected);
      if (lastSelectedNode) {
        // handleSelect (not handleToggle) should be used!!!
        lastSelectedNode.handleSelect(type);
      }
    }
    // disabled should be processed in separate cycle after selected,
    // cause disabled node initially might be selected!!!
    nodes.forEach(node => {
      if (node.initTreeNode.disabled) {
        node.handleDisable(type);
      }
    });
    const displayedNodes = nodes.filter(node => node.isDisplayed(false));
    const selectedNodes = nodes.filter(node => node.selected);

    dispatch({
      type: ActionType.INIT,
      payload: {
        nodes,
        displayedNodes,
        selectedNodes,
        showSelectAll: type !== Type.SELECT && withSelectAll,
        selectAllCheckedState: getSelectAllCheckedState(selectedNodes, nodes)
      } as InitPayload
    });
  }, [data, type]);

  useEffect(() => {
    if (type !== Type.SELECT) {
      dispatch({
        type: ActionType.SHOW_SELECT_ALL,
        payload: {
          showSelectAll: withSelectAll && !state.searchValue,
        } as ShowSelectAllPayload
      });
    }
  }, [withSelectAll]);

  const handleOutsideEvent = (event: MouseEvent | TouchEvent | FocusEvent) => {
    if (state.showDropdown || state.searchValue || state.focusedFieldElement || state.focusedElement) {
      dispatch({
        type: ActionType.RESET,
        payload: {
          showDropdown: false,
          searchValue: '',
          focusedFieldElement: '',
          focusedElement: ''
        } as ResetPayload
      });
    }
  };

  const handleClickField = useCallback((e: React.MouseEvent): void => {
    getFieldFocusableElement(fieldRef)?.focus();
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!e.defaultPrevented) {
      dispatchToggleDropdown(!state.showDropdown);
    }
  }, [state.showDropdown, fieldRef]);

  const callClearAllHandler = (selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onClearAll) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onClearAll(selectedTreeNodes, type !== Type.SELECT ? selectAllCheckedState : undefined);
    }
  };

  const handleDeleteAll = useCallback((e: React.MouseEvent | React.KeyboardEvent): void => {
    e.preventDefault();
    state.nodes.forEach(node => node.handleUnselect(type));
    const selectedNodes = state.nodes.filter(nod => nod.selected);
    const selectAllCheckedState = getSelectAllCheckedState(selectedNodes, state.nodes);
    dispatch({
      type: ActionType.UNSELECT_ALL,
      payload: {
        selectedNodes,
        selectAllCheckedState
      } as UnselectAllPayload
    });

    callClearAllHandler(selectAllCheckedState, selectedNodes);
  }, [state.nodes, type]);

  const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value;

    state.nodes.forEach(node => {
      node.handleSearch(value);
    });

    const displayedNodes = state.nodes
      .filter(node => node.isDisplayed(Boolean(value)));

    dispatch({
      type: ActionType.CHANGE_INPUT,
      payload: {
        searchValue: value,
        displayedNodes,
        showSelectAll: type !== Type.SELECT && withSelectAll && !Boolean(value)
      } as ChangeInputPayload
    });
  }, [state.nodes, withSelectAll]);

  const callSelectAllChangeHandler = (selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState);
    }
  };

  const handleSelectAllNodes = (): void => {
    const shouldBeUnselected = state.selectAllCheckedState === CheckedState.SELECTED
      || (state.selectAllCheckedState === CheckedState.PARTIAL
        && areAllExcludingDisabledSelected(state.nodes));
    state.nodes.forEach(node => {
      if (!node.disabled) {
        node.selected = !shouldBeUnselected;
      }
    });
    // partiallySelected should be processed in separate cycle after selected,
    // cause all nodes should be selected/unselected at first!!!
    state.nodes.forEach(node => {
      node.handleCheckAndSetPartiallySelected(type);
    });

    const selectedNodes = state.nodes.filter(node => node.selected);
    const selectAllCheckedState = getSelectAllCheckedState(selectedNodes, state.nodes);

    dispatch({
      type: ActionType.TOGGLE_ALL,
      payload: {
        selectedNodes,
        selectAllCheckedState,
        focusedElement: SELECT_ALL
      } as ToggleAllPayload
    });

    callSelectAllChangeHandler(selectAllCheckedState, selectedNodes);
  };

  const handleChangeSelectAll = (e: React.MouseEvent): void => {
    handleSelectAllNodes();
  };

  const callNodeToggleHandler = (toggledNode: Node, expandedNodes: Node[]): void => {
    if (onNodeToggle) {
      const toggledTreeNode = toggledNode.toTreeNode();
      const expandedTreeNodes = expandedNodes.map(node => node.toTreeNode());
      onNodeToggle(toggledTreeNode, expandedTreeNodes);
    }
  };

  const callNodeChangeHandler = (changedNode: Node, selectedNodes: Node[]): void => {
    if (onNodeChange && !changedNode.disabled) {
      const changedTreeNode = changedNode.toTreeNode();
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onNodeChange(changedTreeNode, selectedTreeNodes);
    }
  };

  const handleClickChip = useCallback((node: Node) => (e: React.MouseEvent | React.KeyboardEvent): void => {
    // defaultPrevented is on click chip clear icon
    if (!e.defaultPrevented) {
      e.preventDefault();
      const focusedElementFound = state.displayedNodes.find(displayedNode => displayedNode.path === node.path)
        && !state.showDropdown;
      dispatch({
        type: ActionType.CLICK_CHIP,
        payload: {
          showDropdown: !state.showDropdown,
          focusedFieldElement: state.showDropdown || !focusedElementFound ? node.path : '',
          focusedElement: focusedElementFound ? node.path : ''
        } as ClickChipPayload
      });
    }
  }, [state.displayedNodes, state.showDropdown]);

  const handleDeleteNode = useCallback((node: Node) => (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.preventDefault();
    if (!node.disabled) {
      node.handleUnselect(type);
      const selectedNodes = state.nodes.filter(nod => nod.selected);

      dispatch({
        type: ActionType.UNSELECT,
        payload: {
          selectedNodes,
          selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes)
        } as UnselectPayload
      });

      callNodeChangeHandler(node, selectedNodes);
    }
  }, [state.nodes, type]);

  const handleToggleNode = useCallback((node: Node) => (e: React.MouseEvent | React.KeyboardEvent): void => {
    // defaultPrevented is on click expand node icon
    if (!e.defaultPrevented) {
      if (type === Type.MULTI_SELECT_TREE || type === Type.MULTI_SELECT_TREE_FLAT || type === Type.MULTI_SELECT) {
        node.handleToggle(type);
      }
      if (type === Type.SELECT) {
        if (!node.disabled) {
          state.selectedNodes.forEach(node => node.handleUnselect(type));
          node.handleSelect(type);
        }
      }

      const selectedNodes = node.disabled
        ? state.selectedNodes
        : state.nodes.filter(nod => nod.selected);

      dispatch({
        type: ActionType.TOGGLE,
        payload: {
          selectedNodes,
          selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes),
          focusedElement: node.path
        } as TogglePayload
      });

      callNodeChangeHandler(node, selectedNodes);
    }
  }, [state.nodes, state.selectedNodes, type]);

  const handleExpandNode = (node: Node, expand: boolean): void => {
    node.handleExpand(Boolean(state.searchValue), expand);

    const displayedNodes = state.nodes
      .filter(nod => nod.isDisplayed(Boolean(state.searchValue)));

    dispatch({
      type: ActionType.EXPAND,
      payload: {
        displayedNodes,
        focusedElement: node.path
      } as ExpandPayload
    });

    callNodeToggleHandler(node, state.nodes.filter(nod => nod.expanded));
  };

  const handleClickExpandNode = useCallback((node: Node) => (e: React.MouseEvent): void => {
    e.preventDefault();
    const expand = state.searchValue
      ? !node.searchExpanded
      : !node.expanded;
    handleExpandNode(node, expand);
  }, [state]);

  const handleKeyDownExpandNode = (expand: boolean): void => {
    if (state.showDropdown && state.focusedElement && state.focusedElement !== SELECT_ALL) {
      const node = nodeMapRef.current.get(state.focusedElement);
      if (node?.hasChildren()
        && !((Boolean(state.searchValue) && node?.searchExpanded === expand)
          || (!Boolean(state.searchValue) && node?.expanded === expand))) {
        handleExpandNode(node, expand);
      }
    }
  };

  const getFirstFocusedElement = (): string => {
    let focusedEl = '';
    if (state.showSelectAll) {
      focusedEl = SELECT_ALL;
    } else if (state.displayedNodes.length) {
      focusedEl = state.displayedNodes[0].path;
    }
    return focusedEl;
  };

  const getNextFocusedElement = (): string => {
    if (!state.focusedElement) {
      return getFirstFocusedElement();
    }

    let focusedEl = state.focusedElement;
    if (state.displayedNodes.length) {
      const current = state.displayedNodes.find(node => node.path === state.focusedElement);
      const index = current ? state.displayedNodes.indexOf(current) : -1;
      focusedEl = index === state.displayedNodes.length - 1
        ? getFirstFocusedElement()
        : state.displayedNodes[index + 1].path;
    }

    return focusedEl;
  };

  const getPrevFocusedElement = (): string => {
    if (!state.focusedElement) {
      return '';
    }

    let focusedEl = state.focusedElement;
    if (state.displayedNodes.length) {
      const current = state.displayedNodes.find(node => node.path === state.focusedElement);
      const index = current ? state.displayedNodes.indexOf(current) : state.displayedNodes.length;
      if (index === 0 && state.showSelectAll) {
        focusedEl = SELECT_ALL;
      } else {
        const prev = index === 0
          ? state.displayedNodes[state.displayedNodes.length - 1]
          : state.displayedNodes[index - 1];
        focusedEl = prev.path;
      }
    }

    return focusedEl;
  };

  const getNextFocusedFieldElement = (): string => {
    if (!state.selectedNodes.length) {
      return '';
    }

    if (state.focusedFieldElement === INPUT) {
      return withClearAll ? CLEAR_ALL : INPUT;
    }

    if (state.focusedFieldElement === CLEAR_ALL) {
      return CLEAR_ALL;
    }

    const selectedNodes = filterChips(state.selectedNodes, type);

    const current = selectedNodes.find(node => node.path === state.focusedFieldElement);
    const index = current ? selectedNodes.indexOf(current) : selectedNodes.length - 1;

    return index === selectedNodes.length - 1 ? INPUT : selectedNodes[index + 1].path;
  };

  const getPrevFocusedFieldElement = (): string => {
    if (!state.selectedNodes.length) {
      return '';
    }

    if (state.focusedFieldElement === CLEAR_ALL) {
      return INPUT;
    }

    const selectedNodes = filterChips(state.selectedNodes, type);

    if (state.focusedFieldElement === INPUT) {
      return selectedNodes[selectedNodes.length - 1].path;
    }

    const current = selectedNodes.find(node => node.path === state.focusedFieldElement);
    const index = current ? selectedNodes.indexOf(current) : selectedNodes.length;

    return index !== 0 ? selectedNodes[index - 1].path : state.focusedFieldElement;
  };

  const handleComponentKeyDown = (e: React.KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowLeft':
        if (!state.focusedFieldElement && state.focusedElement) {
          handleKeyDownExpandNode(false);
        } else if (!state.searchValue) {
          dispatchFocusFieldElement(getPrevFocusedFieldElement());
        }
        if (state.focusedElement) {
          e.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (!state.focusedFieldElement && state.focusedElement) {
          handleKeyDownExpandNode(true);
        } else if (!state.searchValue) {
          dispatchFocusFieldElement(getNextFocusedFieldElement());
        }
        if (state.focusedElement) {
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (state.showDropdown && state.focusedElement) {
          dispatchFocusElement(getPrevFocusedElement());
        } else {
          withDropdownInput && state.showDropdown && getFieldFocusableElement(fieldRef)?.focus();
          dispatchToggleDropdown(!state.showDropdown);
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (state.showDropdown) {
          dispatchFocusElement(getNextFocusedElement());
        } else {
          dispatchToggleDropdown(!state.showDropdown);
        }
        e.preventDefault();
        break;
      case 'Enter':
        if (!state.focusedElement) {
          const chipNode = filterChips(state.selectedNodes, type)
            ?.find(node => node.path === state.focusedFieldElement);
          if (chipNode) {
            handleClickChip(chipNode)(e);
          } else {
            withDropdownInput && state.showDropdown && getFieldFocusableElement(fieldRef)?.focus();
            dispatchToggleDropdown(!state.showDropdown);
          }
        } else if (state.showDropdown) {
          if (state.focusedElement === SELECT_ALL) {
            handleSelectAllNodes();
          } else {
            const focusedNode = nodeMapRef.current?.get(state.focusedElement);
            if (focusedNode) {
              handleToggleNode(focusedNode)(e);
            }
          }
        }
        e.preventDefault();
        break;
      case 'Backspace':
        if (!state.searchValue && state.focusedFieldElement && state.focusedFieldElement !== INPUT) {
          if (state.focusedFieldElement === CLEAR_ALL) {
            handleDeleteAll(e);
          } else {
            const focusedNode = nodeMapRef.current?.get(state.focusedFieldElement);
            if (focusedNode) {
              handleDeleteNode(focusedNode)(e);
            }
          }
          e.preventDefault();
        }
        break;
      case 'Escape':
        if (state.showDropdown) {
          withDropdownInput && state.showDropdown && getFieldFocusableElement(fieldRef)?.focus();
          dispatchToggleDropdown(false);
          e.preventDefault();
        }
        break;
      case 'Tab':
        if (state.showDropdown) {
          withDropdownInput && state.showDropdown && getFieldFocusableElement(fieldRef)?.focus();
          dispatchToggleDropdown(false);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const dropdownUnmountedOnClickOutside = useRef<boolean>(false);

  const handleComponentFocus = (event: React.FocusEvent): void => {
    if (event.target === getFieldFocusableElement(fieldRef)) {
      if (!withDropdownInput
        || (withDropdownInput
          && !event.relatedTarget?.classList?.contains('rts-input-dropdown')
          && !dropdownUnmountedOnClickOutside.current)) {
        treeSelectRef?.current?.classList?.add('focused');
        onFocus?.(event);
      }
    }
    dropdownUnmountedOnClickOutside.current = false;
  };

  const handleComponentBlur = (event: React.FocusEvent): void => {
    if (event.target === getFieldFocusableElement(fieldRef)) {
      if (!withDropdownInput
        || (withDropdownInput
          && !event.relatedTarget?.classList?.contains('rts-input-dropdown'))) {
        treeSelectRef?.current?.classList?.remove('focused');
        onBlur?.(event);
      }
    }
  };

  const handleDropdownUnmount = (): void => {
    if (withDropdownInput) {
      const fieldFocusableElement = getFieldFocusableElement(fieldRef);
      if (document.activeElement !== fieldFocusableElement) {
        dropdownUnmountedOnClickOutside.current = true;
        fieldFocusableElement?.focus();
      }
    }
  };

  const typeClassName = useMemo(() => typeToClassName(type), [type]);
  const containerClasses = `rts-tree-select ${typeClassName}` + (className ? ` ${className}` : '');

  useOnClickOutside(treeSelectRef, handleOutsideEvent);

  return (
    <div
      ref={treeSelectRef}
      id={id}
      className={containerClasses}
      onFocus={handleComponentFocus}
      onBlur={handleComponentBlur}
      onKeyDown={handleComponentKeyDown}
    >
      <components.Field.component
        componentAttributes={{
          ref: fieldRef,
          className: "rts-field",
          onClick: handleClickField,
          onMouseDown: preventDefaultOnMouseEvent
        }}
        componentProps={{type, showDropdown: state.showDropdown, withClearAll}}
        customProps={components.Field.props}
      >
        <div
          className="rts-field-content"
          // needed for staying focus on input
          onMouseDown={preventDefaultOnMouseEvent}
        >
          {filterChips(state.selectedNodes, type)
            .map(node => (
              <components.ChipContainer.component
                key={node.path}
                componentAttributes={{
                  className: `rts-chip${node.disabled ? ' disabled' : ''}${state.focusedFieldElement === node.path ? ' focused' : ''}`,
                  onClick: handleClickChip(node),
                  // needed for staying focus on input
                  onMouseDown: preventDefaultOnMouseEvent
                }}
                componentProps={{
                  label: node.name,
                  focused: state.focusedFieldElement === node.path,
                  disabled: node.disabled,
                }}
                customProps={components.ChipContainer.props}
              >
                <components.ChipLabel.component
                  componentAttributes={{className: 'rts-label'}}
                  componentProps={{label: node.name}}
                  customProps={components.ChipLabel.props}
                />
                {!node.disabled &&
                    <components.ChipClear.component
                        componentAttributes={{className: 'rts-chip-clear', onClick: handleDeleteNode(node)}}
                        componentProps={{}}
                        customProps={components.ChipClear.props}
                    />}
              </components.ChipContainer.component>
            ))}
          {withDropdownInput ? (
            <input className="rts-input-hidden"/>
          ) : (
            <components.Input.component
              componentAttributes={{
                className: "rts-input",
                placeholder: inputPlaceholder,
                value: state.searchValue,
                onChange: handleChangeInput
              }}
              componentProps={{placeholder: inputPlaceholder, value: state.searchValue}}
              customProps={components.Input.props}
            />
          )}
        </div>
        <div className="rts-actions">
          {withClearAll && isAnyExcludingDisabledSelected(state.nodes) && (
            <components.FieldClear.component
              componentAttributes={{
                className: `rts-field-clear${state.focusedFieldElement === CLEAR_ALL ? ' focused' : ''}`,
                onClick: handleDeleteAll,
                // needed for staying focus on input
                onMouseDown: preventDefaultOnMouseEvent
              }}
              componentProps={{focused: state.focusedFieldElement === CLEAR_ALL}}
              customProps={components.FieldClear.props}
            />
          )}
          <components.FieldToggle.component
            componentAttributes={{
              className: `rts-field-toggle${state.showDropdown ? ' expanded' : ''}`,
              // needed for staying focus on input
              onMouseDown: preventDefaultOnMouseEvent
            }}
            componentProps={{expanded: state.showDropdown}}
            customProps={components.FieldToggle.props}
          />
        </div>
      </components.Field.component>
      {state.showDropdown ? (
        <Dropdown
          type={type}
          nodeMap={nodeMapRef.current}
          nodesAmount={state.nodes.length}
          displayedNodes={state.displayedNodes}
          isAnyHasChildren={isAnyHasChildren(state.nodes)}
          searchValue={state.searchValue}
          showSelectAll={state.showSelectAll}
          selectAllCheckedState={state.selectAllCheckedState}
          focusedElement={state.focusedElement}
          noMatchesText={noMatchesText}
          onChangeSelectAll={handleChangeSelectAll}
          onToggleNode={handleToggleNode}
          onClickExpandNode={handleClickExpandNode}
          input={withDropdownInput ? (
            <components.Input.component
              componentAttributes={{
                autoFocus: true,
                className: "rts-input",
                placeholder: inputPlaceholder,
                value: state.searchValue,
                onChange: handleChangeInput
              }}
              componentProps={{placeholder: inputPlaceholder, value: state.searchValue}}
              customProps={components.Input.props}
            />
          ) : null}
          onUnmount={handleDropdownUnmount}
          components={components}
        />
      ) : null}
    </div>
  );
};
