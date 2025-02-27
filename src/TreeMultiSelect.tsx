import './styles/tree-multi-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import {
  CLEAR_ALL,
  DEFAULT_OPTIONS_CONTAINER_HEIGHT,
  INPUT,
  INPUT_PLACEHOLDER,
  NO_MATCHES,
  PATH_DELIMITER,
  SELECT_ALL
} from './constants';
import {debounce, getFieldFocusableElement, preventDefaultOnMouseEvent, typeToClassName} from './utils/commonUtils';
import {
  areAllExcludingDisabledSelected,
  convertTreeArrayToFlatArray,
  filterChips,
  isAnyExcludingDisabledSelected,
  isAnyHasChildren
} from './utils/nodesUtils';
import {getComponents} from './utils/componentsUtils';
import {CheckedState, Components, TreeNode, Type} from './types';
import {useOnClickOutside} from './hooks';
import {
  ActionType,
  ChipClickPayload,
  ChipDeletePayload,
  ClearAllPayload,
  FieldClickPayload,
  FocusPayload,
  initialState,
  InitPayload,
  InputChangePayload,
  NodeChangePayload,
  NodeTogglePayload,
  reducer,
  ResetPayload,
  SelectAllChangePayload,
  ShowSelectAllPayload,
  ToggleDropdownPayload
} from './reducer';
import {Dropdown} from './Dropdown';
import {Node} from './Node';

export interface TreeMultiSelectProps {
  data: TreeNode[];
  type?: Type;
  id?: string;
  className?: string;
  inputPlaceholder?: string;
  noMatchesText?: string;
  isSearchable?: boolean;
  withClearAll?: boolean;
  withSelectAll?: boolean;
  withDropdownInput?: boolean;
  closeDropdownOnNodeChange?: boolean;
  dropdownHeight?: number;
  components?: Components;
  onNodeChange?: (node: TreeNode, selectedNodes: TreeNode[]) => void;
  onNodeToggle?: (node: TreeNode, expandedNodes: TreeNode[]) => void;
  onClearAll?: (selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void;
  onSelectAllChange?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

export const TreeMultiSelect: FC<TreeMultiSelectProps> = (props) => {
  const {
    data = [],
    type = Type.TREE_SELECT,
    id = '',
    className = '',
    inputPlaceholder = INPUT_PLACEHOLDER,
    noMatchesText = NO_MATCHES,
    isSearchable = true,
    withClearAll = true,
    withSelectAll = false,
    withDropdownInput = false,
    closeDropdownOnNodeChange = false,
    dropdownHeight = DEFAULT_OPTIONS_CONTAINER_HEIGHT,
    components: propsComponents = {},
    onNodeChange,
    onNodeToggle,
    onClearAll,
    onSelectAllChange,
    onFocus,
    onBlur,
  } = props;

  const treeMultiSelectRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const fieldInputRef = useRef<HTMLInputElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);

  const isComponentFocused = useRef<boolean>(false);
  const isDropdownInputFocused = useRef<boolean>(false);
  const isOutsideClicked = useRef<boolean>(false);
  const dropdownUnmountedOnClickOutside = useRef<boolean>(false);

  const nodeMapRef = useRef<Map<string, Node>>(new Map());

  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);

  const components = useMemo(() => getComponents(propsComponents), [propsComponents]);

  const dispatchToggleDropdown = (showDropdown: boolean): void => {
    dispatch({
      type: ActionType.TOGGLE_DROPDOWN,
      payload: {
        showDropdown,
        focusedElement: !showDropdown ? '' : state.focusedElement
      } as ToggleDropdownPayload
    });
  };

  const dispatchFocus = (focusedFieldElement: string, focusedElement: string): void => {
    dispatch({
      type: ActionType.FOCUS,
      payload: {
        focusedFieldElement,
        focusedElement,
      } as FocusPayload
    });
  };

  const dispatchFocusElement = (focusedElement: string): void => {
    dispatchFocus(focusedElement ? '' : state.focusedFieldElement, focusedElement);
  };

  const dispatchFocusFieldElement = (focusedFieldElement: string): void => {
    dispatchFocus(focusedFieldElement, focusedFieldElement ? '' : state.focusedElement);
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

    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT) {
      nodes = convertTreeArrayToFlatArray(nodeTree);
    }
    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
      nodes.forEach(node => {
        if (node.initTreeNode.selected) {
          // handleSelect (not handleChange) should be used!!!
          node.handleSelect(type);
        }
      });
    }
    if (type === Type.SELECT) {
      const lastSelectedNode = nodes.findLast(node => node.initTreeNode.selected);
      if (lastSelectedNode) {
        // handleSelect (not handleChange) should be used!!!
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
    if (isComponentFocused.current) {
      isOutsideClicked.current = true;
    }
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

  const focusFieldElement = (): void => {
    if (document.activeElement === dropdownInputRef?.current) {
      isDropdownInputFocused.current = true;
    }
    getFieldFocusableElement(fieldRef)?.focus();
  };

  const handleFieldClick = useCallback((e: React.MouseEvent): void => {
    focusFieldElement();
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!e.defaultPrevented) {
      dispatch({
        type: ActionType.FIELD_CLICK,
        payload: {
          showDropdown: !state.showDropdown,
          focusedFieldElement: INPUT,
          focusedElement: ''
        } as FieldClickPayload
      });
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
    const selectedNodes = state.nodes.filter(node => node.selected);
    const selectAllCheckedState = getSelectAllCheckedState(selectedNodes, state.nodes);
    dispatch({
      type: ActionType.CLEAR_ALL,
      payload: {
        selectedNodes,
        selectAllCheckedState,
        focusedFieldElement: INPUT,
        focusedElement: ''
      } as ClearAllPayload
    });

    callClearAllHandler(selectAllCheckedState, selectedNodes);
  }, [state.nodes, type]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value;

    state.nodes.forEach(node => {
      node.handleSearch(value);
    });

    const displayedNodes = state.nodes
      .filter(node => node.isDisplayed(Boolean(value)));

    dispatch({
      type: ActionType.INPUT_CHANGE,
      payload: {
        searchValue: value,
        displayedNodes,
        showSelectAll: type !== Type.SELECT && withSelectAll && !Boolean(value),
        focusedFieldElement: INPUT,
        focusedElement: ''
      } as InputChangePayload
    });
  }, [state.nodes, withSelectAll]);

  const callSelectAllChangeHandler = (selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState);
    }
  };

  const handleSelectAllChange = (event: React.MouseEvent | React.KeyboardEvent): void => {
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
      type: ActionType.SELECT_ALL_CHANGE,
      payload: {
        selectedNodes,
        selectAllCheckedState,
        focusedFieldElement: '',
        focusedElement: SELECT_ALL
      } as SelectAllChangePayload
    });

    callSelectAllChangeHandler(selectAllCheckedState, selectedNodes);
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

  const handleChipClick = useCallback((node: Node) => (e: React.MouseEvent | React.KeyboardEvent): void => {
    // defaultPrevented is on click chip clear icon
    if (!e.defaultPrevented) {
      e.preventDefault();
      dispatch({
        type: ActionType.CHIP_CLICK,
        payload: {
          showDropdown: !state.showDropdown,
          focusedFieldElement: node.path,
          focusedElement: ''
        } as ChipClickPayload
      });
    }
  }, [state.displayedNodes, state.showDropdown]);

  const handleNodeDelete = (node: Node) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    event.preventDefault();
    if (!node.disabled) {
      const prevFocusedFieldElement = getPrevFocusedFieldElement();
      const newFocusedFieldElement = (prevFocusedFieldElement === state.focusedFieldElement) || (event.type === 'click')
        ? INPUT
        : prevFocusedFieldElement;
      node.handleUnselect(type);
      const selectedNodes = state.nodes.filter(nod => nod.selected);

      dispatch({
        type: ActionType.CHIP_DELETE,
        payload: {
          selectedNodes,
          selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes),
          focusedFieldElement: newFocusedFieldElement,
          focusedElement: ''
        } as ChipDeletePayload
      });

      callNodeChangeHandler(node, selectedNodes);
    }
  };

  const handleNodeChange = useCallback((node: Node) => (e: React.MouseEvent | React.KeyboardEvent): void => {
    // defaultPrevented is on click expand node icon
    if (!e.defaultPrevented) {
      if (!node.disabled) {
        if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
          node.handleChange(type);
        }
        if (type === Type.SELECT) {
          state.selectedNodes.forEach(node => node.handleUnselect(type));
          node.handleSelect(type);
        }

        const selectedNodes = state.nodes.filter(nod => nod.selected);

        dispatch({
          type: ActionType.NODE_CHANGE,
          payload: {
            selectedNodes,
            selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes),
            focusedFieldElement: closeDropdownOnNodeChange ? INPUT : '',
            focusedElement: closeDropdownOnNodeChange ? '' : node.path,
            showDropdown: closeDropdownOnNodeChange ? false : state.showDropdown
          } as NodeChangePayload
        });

        callNodeChangeHandler(node, selectedNodes);
      } else {
        dispatchFocusElement(node.path);
      }
    }
  }, [state.nodes, state.selectedNodes, state.showDropdown, type]);

  const handleNodeToggle = (node: Node, expand: boolean): void => {
    node.handleExpand(Boolean(state.searchValue), expand);

    const displayedNodes = state.nodes
      .filter(nod => nod.isDisplayed(Boolean(state.searchValue)));

    dispatch({
      type: ActionType.NODE_TOGGLE,
      payload: {
        displayedNodes,
        focusedFieldElement: '',
        focusedElement: node.path
      } as NodeTogglePayload
    });

    callNodeToggleHandler(node, state.nodes.filter(nod => nod.expanded));
  };

  const handleNodeToggleOnClick = useCallback((node: Node) => (e: React.MouseEvent): void => {
    e.preventDefault();
    const expand = state.searchValue
      ? !node.searchExpanded
      : !node.expanded;
    handleNodeToggle(node, expand);
  }, [state]);

  const handleNodeToggleOnKeyDown = (expand: boolean): void => {
    if (state.showDropdown && state.focusedElement && state.focusedElement !== SELECT_ALL) {
      const node = nodeMapRef.current.get(state.focusedElement);
      if (node?.hasChildren()
        && !((Boolean(state.searchValue) && node?.searchExpanded === expand)
          || (!Boolean(state.searchValue) && node?.expanded === expand))) {
        handleNodeToggle(node, expand);
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
          handleNodeToggleOnKeyDown(false);
        } else if (!state.searchValue) {
          dispatchFocusFieldElement(getPrevFocusedFieldElement());
        }
        if (state.focusedElement) {
          e.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (!state.focusedFieldElement && state.focusedElement) {
          handleNodeToggleOnKeyDown(true);
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
            handleChipClick(chipNode)(e);
          } else {
            dispatchToggleDropdown(!state.showDropdown);
          }
        } else if (state.showDropdown) {
          if (state.focusedElement === SELECT_ALL) {
            handleSelectAllChange(e);
          } else {
            const focusedNode = nodeMapRef.current?.get(state.focusedElement);
            if (focusedNode) {
              handleNodeChange(focusedNode)(e);
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
              handleNodeDelete(focusedNode)(e);
            }
          }
          e.preventDefault();
        }
        break;
      case 'Escape':
        if (state.showDropdown) {
          dispatchToggleDropdown(false);
          e.preventDefault();
        }
        break;
      case 'Tab':
        if (state.showDropdown) {
          dispatchToggleDropdown(false);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleComponentFocus = (event: React.FocusEvent): void => {
    if (!isComponentFocused.current) {
      isComponentFocused.current = true;
      treeMultiSelectRef?.current?.classList?.add('focused');
      onFocus?.(event);
    }
  };

  const handleComponentBlur = (event: React.FocusEvent): void => {
    if (isDropdownInputFocused.current && !dropdownUnmountedOnClickOutside.current) {
      isDropdownInputFocused.current = false;
      return;
    }
    isComponentFocused.current = false;
    isOutsideClicked.current = false;
    dropdownUnmountedOnClickOutside.current = false;
    treeMultiSelectRef?.current?.classList?.remove('focused');
    onBlur?.(event);
  };

  const handleFieldMouseDown = (event: React.MouseEvent) => {
    if (event.target !== fieldInputRef?.current) {
      // needed for staying focus on input
      event.preventDefault();
    }
  };

  const handleDropdownUnmount = (): void => {
    if (withDropdownInput && isSearchable) {
      const fieldFocusableElement = getFieldFocusableElement(fieldRef);
      if (document.activeElement !== fieldFocusableElement) {
        if (isOutsideClicked.current) {
          dropdownUnmountedOnClickOutside.current = true;
        }
        fieldFocusableElement?.focus();
      }
    }
  };

  const handleListItemRender = useCallback(() => {
    if (withDropdownInput && isSearchable && dropdownInputRef?.current && document.activeElement !== dropdownInputRef?.current) {
      isDropdownInputFocused.current = true;
      dropdownInputRef?.current?.focus();
    }
  }, [withDropdownInput, isSearchable, dropdownInputRef]);

  const debouncedHandleListItemRender = debounce(handleListItemRender, 150);

  const typeClassName = useMemo(() => typeToClassName(type), [type]);
  const containerClasses = `rtms-tree-multi-select ${typeClassName}` + (className ? ` ${className}` : '');

  useOnClickOutside(treeMultiSelectRef, handleOutsideEvent);

  return (
    <div
      ref={treeMultiSelectRef}
      id={id}
      className={containerClasses}
      onFocus={handleComponentFocus}
      onBlur={handleComponentBlur}
      onKeyDown={handleComponentKeyDown}
    >
      <components.Field.component
        componentAttributes={{
          ref: fieldRef,
          className: "rtms-field",
          onClick: handleFieldClick,
          onMouseDown: handleFieldMouseDown
        }}
        componentProps={{type, showDropdown: state.showDropdown, withClearAll}}
        customProps={components.Field.props}
      >
        <div className="rtms-field-content">
          {filterChips(state.selectedNodes, type)
            .map(node => (
              <components.ChipContainer.component
                key={node.path}
                componentAttributes={{
                  className: `rtms-chip${node.disabled ? ' disabled' : ''}${state.focusedFieldElement === node.path ? ' focused' : ''}`,
                  onClick: handleChipClick(node),
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
                  componentAttributes={{className: 'rtms-label'}}
                  componentProps={{label: node.name}}
                  customProps={components.ChipLabel.props}
                />
                {!node.disabled &&
                    <components.ChipClear.component
                        componentAttributes={{className: 'rtms-chip-clear', onClick: handleNodeDelete(node)}}
                        componentProps={{}}
                        customProps={components.ChipClear.props}
                    />}
              </components.ChipContainer.component>
            ))}
          {withDropdownInput || !isSearchable ? (
            <input className="rtms-input-hidden" readOnly/>
          ) : (
            <components.Input.component
              componentAttributes={{
                ref: fieldInputRef,
                className: "rtms-input",
                placeholder: inputPlaceholder,
                value: state.searchValue,
                onChange: handleInputChange
              }}
              componentProps={{placeholder: inputPlaceholder, value: state.searchValue}}
              customProps={components.Input.props}
            />
          )}
        </div>
        <div className="rtms-actions">
          {withClearAll && isAnyExcludingDisabledSelected(state.nodes) && (
            <components.FieldClear.component
              componentAttributes={{
                className: `rtms-field-clear${state.focusedFieldElement === CLEAR_ALL ? ' focused' : ''}`,
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
              className: `rtms-field-toggle${state.showDropdown ? ' expanded' : ''}`,
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
          dropdownHeight={dropdownHeight}
          onSelectAllChange={handleSelectAllChange}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggleOnClick}
          input={withDropdownInput && isSearchable ? (
            <components.Input.component
              componentAttributes={{
                ref: dropdownInputRef,
                className: "rtms-input",
                placeholder: inputPlaceholder,
                value: state.searchValue,
                onChange: handleInputChange
              }}
              componentProps={{placeholder: inputPlaceholder, value: state.searchValue}}
              customProps={components.Input.props}
            />
          ) : null}
          inputRef={dropdownInputRef}
          onUnmount={handleDropdownUnmount}
          components={components}
          onListItemRender={debouncedHandleListItemRender}
        />
      ) : null}
    </div>
  );
};
