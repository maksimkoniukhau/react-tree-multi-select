import './styles/tree-multi-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {
  CLEAR_ALL,
  DEFAULT_OPTIONS_CONTAINER_HEIGHT,
  DROPDOWN,
  FIELD,
  FOOTER,
  INPUT,
  INPUT_PLACEHOLDER,
  NO_DATA,
  NO_MATCHES,
  SELECT_ALL
} from './constants';
import {debounce, getFieldFocusableElement} from './utils/commonUtils';
import {
  areAllExcludingDisabledSelected,
  convertTreeArrayToFlatArray,
  filterChips,
  getSelectAllCheckedState,
  isAnyExcludingDisabledSelected,
  isAnyHasChildren,
  mapTreeNodeToNode
} from './utils/nodesUtils';
import {getKeyboardConfig, shouldRenderSelectAll, typeToClassName} from './utils/componentUtils';
import {getComponents, hasCustomFooterComponent} from './utils/componentsUtils';
import {
  buildFocusedElement,
  extractPathFromFocusedElement,
  isFocused,
  isFocusedElementInDropdown,
  isFocusedElementInField
} from './utils/focusUtils';
import {CheckedState, Components, FooterConfig, KeyboardConfig, TreeNode, Type} from './types';
import {InnerComponents} from './innerTypes';
import {useOnClickOutside} from './hooks/useOnClickOutside';
import {
  ActionType,
  ChipClickPayload,
  ChipDeletePayload,
  ClearAllPayload,
  DataChangePayload,
  FieldClickPayload,
  FocusPayload,
  initialState,
  InputChangePayload,
  NodeChangePayload,
  NodeTogglePayload,
  reducer,
  ResetPayload,
  SelectAllChangePayload,
  ToggleDropdownPayload
} from './reducer';
import {Dropdown} from './Dropdown';
import {Node} from './Node';
import {FieldToggleWrapper} from './components/FieldToggle';
import {FieldClearWrapper} from './components/FieldClear';
import {FieldWrapper} from './components/Field';
import {InputWrapper} from './components/Input';
import {ChipWrapper} from './components/ChipWrapper';

export interface TreeMultiSelectProps {
  data: TreeNode[];
  type?: Type;
  id?: string;
  className?: string;
  inputPlaceholder?: string;
  noDataText?: string;
  noMatchesText?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  withChipClear?: boolean;
  withClearAll?: boolean;
  withSelectAll?: boolean;
  withDropdownInput?: boolean;
  closeDropdownOnNodeChange?: boolean;
  dropdownHeight?: number;
  footerConfig?: FooterConfig;
  keyboardConfig?: KeyboardConfig;
  components?: Components;
  onNodeChange?: (node: TreeNode, selectedNodes: TreeNode[]) => void;
  onNodeToggle?: (node: TreeNode, expandedNodes: TreeNode[]) => void;
  onClearAll?: (selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void;
  onSelectAllChange?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  /**
   * Callback triggered when the last item in the dropdown is rendered.
   * This is useful for implementing infinite scrolling or lazy loading.
   *
   * Note: The callback is invoked when the last item (including overscan)
   * is rendered, not based on actual scroll position.
   *
   * By default, the dropdown overscans 2 items above and below the visible area.
   *
   * @param inputValue - The current search input value.
   * @param displayedNodes - An array of TreeNode objects currently displayed in the dropdown.
   */
  onDropdownLastItemReached?: (inputValue: string, displayedNodes: TreeNode[]) => void;
}

export const TreeMultiSelect: FC<TreeMultiSelectProps> = (props) => {
  const {
    data = [],
    type = Type.TREE_SELECT,
    id = '',
    className = '',
    inputPlaceholder = INPUT_PLACEHOLDER,
    noDataText = NO_DATA,
    noMatchesText = NO_MATCHES,
    isDisabled = false,
    isSearchable = true,
    withChipClear = true,
    withClearAll = true,
    withSelectAll = false,
    withDropdownInput = false,
    closeDropdownOnNodeChange = false,
    dropdownHeight = DEFAULT_OPTIONS_CONTAINER_HEIGHT,
    footerConfig,
    keyboardConfig: propsKeyboardConfig,
    components: propsComponents,
    onNodeChange,
    onNodeToggle,
    onClearAll,
    onSelectAllChange,
    onFocus,
    onBlur,
    onDropdownLastItemReached
  } = props;

  const treeMultiSelectRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const fieldInputRef = useRef<HTMLInputElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);

  const isComponentFocused = useRef<boolean>(false);
  const isDropdownInputFocused = useRef<boolean>(false);
  const isOutsideClicked = useRef<boolean>(false);
  const dropdownUnmountedOnClickOutside = useRef<boolean>(false);

  const nodeMapRef = useRef<Map<string, Node>>(new Map<string, Node>());

  const [state, dispatch] = useReducer(reducer, initialState);

  // Store components in state to avoid async rendering issues (e.g., flickering)
  // when both data and the Footer (e.g., its text) component update simultaneously during infinite scroll or pagination.
  const [components, setComponents] = useState<InnerComponents>(getComponents(propsComponents));

  useEffect(() => {
    setComponents(getComponents(propsComponents));
  }, [propsComponents]);

  const isAnyNodeDisplayed = state.displayedNodes.length > 0;

  const isSearchMode = Boolean(state.searchValue);

  const showClearAll = withClearAll && isAnyExcludingDisabledSelected(state.nodes);

  const showSelectAll = shouldRenderSelectAll(type, state.displayedNodes, isSearchMode, withSelectAll);

  const hasCustomFooter = useMemo(() => {
    return hasCustomFooterComponent(components.Footer.component);
  }, [components.Footer.component]);

  const showFooterWhenSearching = useMemo(() => {
    return footerConfig?.showWhenSearching !== undefined
      ? footerConfig.showWhenSearching
      : false;
  }, [footerConfig]);

  const showFooterWhenNoItems = useMemo(() => {
    return footerConfig?.showWhenNoItems !== undefined
      ? footerConfig.showWhenNoItems
      : false;
  }, [footerConfig]);

  const showFooter = useMemo(() => {
    return hasCustomFooter
      && (isAnyNodeDisplayed || showFooterWhenNoItems) && (!isSearchMode || showFooterWhenSearching);
  }, [showFooterWhenSearching, showFooterWhenNoItems, hasCustomFooter, isAnyNodeDisplayed, isSearchMode]);

  const keyboardConfig = getKeyboardConfig(propsKeyboardConfig);

  const dispatchToggleDropdown = (showDropdown: boolean): void => {
    dispatch({
      type: ActionType.TOGGLE_DROPDOWN,
      payload: {
        showDropdown,
        focusedElement: !showDropdown && isFocusedElementInDropdown(state.focusedElement) ? '' : state.focusedElement
      } as ToggleDropdownPayload
    });
  };

  const dispatchFocus = useCallback((focusedElement: string): void => {
    dispatch({
      type: ActionType.FOCUS,
      payload: {
        focusedElement,
      } as FocusPayload
    });
  }, []);

  useEffect(() => {
    nodeMapRef.current = new Map<string, Node>();
    const nodeTree: Node[] = [];
    data.forEach((treeNode, index) => {
      nodeTree.push(mapTreeNodeToNode(treeNode, index.toString(), null, nodeMapRef.current));
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
      node.handleSearch(state.searchValue);
    });

    const displayedNodes = nodes.filter(node => node.isDisplayed(isSearchMode));
    const selectedNodes = nodes.filter(node => node.selected);

    let focusedElement = '';
    if (isFocusedElementInField(state.focusedElement)) {
      if (isFocused(INPUT, FIELD, state.focusedElement)
        || (isFocused(CLEAR_ALL, FIELD, state.focusedElement) && showClearAll)) {
        focusedElement = state.focusedElement;
      } else {
        const chipNodes = filterChips(selectedNodes, type);
        const current = chipNodes.find(node => isFocused(node.path, FIELD, state.focusedElement));
        focusedElement = current ? state.focusedElement : '';
      }
    }
    if (isFocusedElementInDropdown(state.focusedElement)) {
      if ((isFocused(SELECT_ALL, DROPDOWN, state.focusedElement)
          && shouldRenderSelectAll(type, displayedNodes, isSearchMode, withSelectAll))
        || (isFocused(FOOTER, DROPDOWN, state.focusedElement) && showFooter)) {
        focusedElement = state.focusedElement;
      } else {
        const current = displayedNodes.find(node => isFocused(node.path, DROPDOWN, state.focusedElement));
        focusedElement = current ? state.focusedElement : '';
      }
    }

    dispatch({
      type: ActionType.DATA_CHANGE,
      payload: {
        nodes,
        displayedNodes,
        selectedNodes,
        focusedElement,
        selectAllCheckedState: getSelectAllCheckedState(selectedNodes, nodes)
      } as DataChangePayload
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  const handleOutsideEvent = () => {
    if (isDisabled) {
      return;
    }
    if (isComponentFocused.current) {
      isOutsideClicked.current = true;
    }
    if (state.showDropdown || isSearchMode || state.focusedElement) {
      dispatch({
        type: ActionType.RESET,
        payload: {
          showDropdown: false,
          searchValue: '',
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

  const getDropdownFocusableElements = useCallback((): string[] => {
    const focusableElements: string[] = [];
    if (showSelectAll) {
      focusableElements.push(buildFocusedElement(SELECT_ALL, DROPDOWN));
    }
    focusableElements.push(...state.displayedNodes.map(node => buildFocusedElement(node.path, DROPDOWN)));
    if (showFooter) {
      focusableElements.push(buildFocusedElement(FOOTER, DROPDOWN));
    }
    return focusableElements;
  }, [state.displayedNodes, showSelectAll, showFooter]);

  const getNextFocusedElement = useCallback((focusedElement: string): string => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0) {
      return '';
    }
    if (!isFocusedElementInDropdown(focusedElement)) {
      return dropdownFocusableElements[0];
    }
    const currentIndex = dropdownFocusableElements.indexOf(focusedElement);
    if (currentIndex === dropdownFocusableElements.length - 1) {
      return keyboardConfig.dropdown.loopDown
        ? dropdownFocusableElements[0]
        : focusedElement;
    } else {
      return dropdownFocusableElements[currentIndex + 1];
    }
  }, [getDropdownFocusableElements, keyboardConfig.dropdown.loopDown]);

  const getPrevFocusedElement = useCallback((focusedElement: string): string => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0 || !isFocusedElementInDropdown(focusedElement)) {
      return '';
    }
    const currentIndex = dropdownFocusableElements.indexOf(focusedElement);
    if (currentIndex === 0) {
      return keyboardConfig.dropdown.loopUp
        ? dropdownFocusableElements[dropdownFocusableElements.length - 1]
        : focusedElement;
    } else {
      return dropdownFocusableElements[currentIndex - 1];
    }
  }, [getDropdownFocusableElements, keyboardConfig.dropdown.loopUp]);

  const getFocusedFieldElements = useCallback((): string[] => {
    const focusableElements: string[] = [];
    focusableElements.push(...filterChips(state.selectedNodes, type).map(node => buildFocusedElement(node.path, FIELD)));
    focusableElements.push(buildFocusedElement(INPUT, FIELD));
    if (showClearAll) {
      focusableElements.push(buildFocusedElement(CLEAR_ALL, FIELD));
    }
    return focusableElements;
  }, [state.selectedNodes, type, showClearAll]);

  const getNextFocusedFieldElement = useCallback((focusedFieldElement: string): string => {
    const fieldFocusableElements = getFocusedFieldElements();
    if (!isFocusedElementInField(focusedFieldElement)) {
      return fieldFocusableElements[fieldFocusableElements.length - 1];
    }
    const currentIndex = fieldFocusableElements.indexOf(focusedFieldElement);
    if (currentIndex === fieldFocusableElements.length - 1) {
      return keyboardConfig.field.loopRight
        ? fieldFocusableElements[0]
        : focusedFieldElement;
    } else {
      return fieldFocusableElements[currentIndex + 1];
    }
  }, [getFocusedFieldElements, keyboardConfig.field.loopRight]);

  const getPrevFocusedFieldElement = useCallback((focusedFieldElement: string): string => {
    const fieldFocusableElements = getFocusedFieldElements();
    if (!isFocusedElementInField(focusedFieldElement)) {
      return fieldFocusableElements.length > 1
        ? fieldFocusableElements[fieldFocusableElements.indexOf(buildFocusedElement(INPUT, FIELD)) - 1]
        : buildFocusedElement(INPUT, FIELD);
    }
    const currentIndex = fieldFocusableElements.indexOf(focusedFieldElement);
    if (currentIndex === 0) {
      return keyboardConfig.field.loopLeft
        ? fieldFocusableElements[fieldFocusableElements.length - 1]
        : focusedFieldElement;
    } else {
      return fieldFocusableElements[currentIndex - 1];
    }
  }, [getFocusedFieldElements, keyboardConfig.field.loopLeft]);

  const handleFieldClick = useCallback((event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    focusFieldElement();
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!event.defaultPrevented) {
      dispatch({
        type: ActionType.FIELD_CLICK,
        payload: {
          showDropdown: !state.showDropdown,
          focusedElement: buildFocusedElement(INPUT, FIELD)
        } as FieldClickPayload
      });
    }
  }, [state.showDropdown, isDisabled]);

  const callClearAllHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onClearAll) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onClearAll(selectedTreeNodes, type !== Type.SELECT ? selectAllCheckedState : undefined);
    }
  }, [onClearAll, type]);

  const handleDeleteAll = useCallback((event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    event.preventDefault();
    state.nodes.forEach(node => node.handleUnselect(type));
    const selectedNodes = state.nodes.filter(node => node.selected);
    const selectAllCheckedState = getSelectAllCheckedState(selectedNodes, state.nodes);
    dispatch({
      type: ActionType.CLEAR_ALL,
      payload: {
        selectedNodes,
        selectAllCheckedState,
        focusedElement: buildFocusedElement(INPUT, FIELD)
      } as ClearAllPayload
    });

    callClearAllHandler(selectAllCheckedState, selectedNodes);
  }, [state.nodes, type, callClearAllHandler, isDisabled]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    if (isDisabled) {
      return;
    }
    const value = event.currentTarget.value;

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
        focusedElement: buildFocusedElement(INPUT, FIELD)
      } as InputChangePayload
    });
  }, [state.nodes, isDisabled]);

  const callSelectAllChangeHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState);
    }
  }, [onSelectAllChange]);

  const handleSelectAllChange = useCallback((): void => {
    if (isDisabled) {
      return;
    }
    const shouldBeUnselected = state.selectAllCheckedState === CheckedState.SELECTED
      || (state.selectAllCheckedState === CheckedState.PARTIAL && areAllExcludingDisabledSelected(state.nodes));
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
        focusedElement: buildFocusedElement(SELECT_ALL, DROPDOWN)
      } as SelectAllChangePayload
    });

    callSelectAllChangeHandler(selectAllCheckedState, selectedNodes);
  }, [state.selectAllCheckedState, state.nodes, type, callSelectAllChangeHandler, isDisabled]);

  const callNodeToggleHandler = useCallback((toggledNode: Node, expandedNodes: Node[]): void => {
    if (onNodeToggle) {
      const toggledTreeNode = toggledNode.toTreeNode();
      const expandedTreeNodes = expandedNodes.map(node => node.toTreeNode());
      onNodeToggle(toggledTreeNode, expandedTreeNodes);
    }
  }, [onNodeToggle]);

  const callNodeChangeHandler = useCallback((changedNode: Node, selectedNodes: Node[]): void => {
    if (onNodeChange && !changedNode.disabled) {
      const changedTreeNode = changedNode.toTreeNode();
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onNodeChange(changedTreeNode, selectedTreeNodes);
    }
  }, [onNodeChange]);

  const handleChipClick = useCallback((node: Node) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click chip clear icon
    if (!event.defaultPrevented) {
      event.preventDefault();
      dispatch({
        type: ActionType.CHIP_CLICK,
        payload: {
          showDropdown: !state.showDropdown,
          focusedElement: buildFocusedElement(node.path, FIELD)
        } as ChipClickPayload
      });
    }
  }, [state.showDropdown, isDisabled]);

  const handleNodeDelete = useCallback((node: Node) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    if (!withChipClear || isDisabled) {
      return;
    }
    event.preventDefault();
    if (!node.disabled) {
      const prevFocusedFieldElement = getPrevFocusedFieldElement(state.focusedElement);
      const newFocusedFieldElement = (prevFocusedFieldElement === state.focusedElement) || (event.type === 'click')
        ? buildFocusedElement(INPUT, FIELD)
        : prevFocusedFieldElement;
      node.handleUnselect(type);
      const selectedNodes = state.nodes.filter(node => node.selected);

      dispatch({
        type: ActionType.CHIP_DELETE,
        payload: {
          selectedNodes,
          selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes),
          focusedElement: newFocusedFieldElement
        } as ChipDeletePayload
      });

      callNodeChangeHandler(node, selectedNodes);
    }
  }, [withChipClear, state.nodes, state.focusedElement, type, callNodeChangeHandler, isDisabled, getPrevFocusedFieldElement]);

  const handleNodeChange = useCallback((node: Node) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click expand node icon
    if (!event.defaultPrevented) {
      if (!node.disabled) {
        if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
          node.handleChange(type);
        }
        if (type === Type.SELECT) {
          state.selectedNodes.forEach(node => node.handleUnselect(type));
          node.handleSelect(type);
        }

        const selectedNodes = state.nodes.filter(node => node.selected);

        dispatch({
          type: ActionType.NODE_CHANGE,
          payload: {
            selectedNodes,
            selectAllCheckedState: getSelectAllCheckedState(selectedNodes, state.nodes),
            focusedElement: closeDropdownOnNodeChange
              ? buildFocusedElement(INPUT, FIELD)
              : buildFocusedElement(node.path, DROPDOWN),
            showDropdown: closeDropdownOnNodeChange ? false : state.showDropdown
          } as NodeChangePayload
        });

        callNodeChangeHandler(node, selectedNodes);
      } else {
        dispatchFocus(buildFocusedElement(node.path, DROPDOWN));
      }
    }
  }, [state.nodes, state.selectedNodes, state.showDropdown, type, closeDropdownOnNodeChange, callNodeChangeHandler, isDisabled, dispatchFocus]);

  const handleNodeToggle = useCallback((node: Node, expand: boolean): void => {
    node.handleExpand(isSearchMode, expand);

    const displayedNodes = state.nodes
      .filter(node => node.isDisplayed(isSearchMode));

    dispatch({
      type: ActionType.NODE_TOGGLE,
      payload: {
        displayedNodes,
        focusedElement: buildFocusedElement(node.path, DROPDOWN)
      } as NodeTogglePayload
    });

    callNodeToggleHandler(node, state.nodes.filter(node => node.expanded));
  }, [state.nodes, isSearchMode, callNodeToggleHandler]);

  const handleNodeToggleOnClick = useCallback((node: Node) => (event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    event.preventDefault();
    const expand = isSearchMode
      ? !node.searchExpanded
      : !node.expanded;
    handleNodeToggle(node, expand);
  }, [isSearchMode, handleNodeToggle, isDisabled]);

  const handleNodeToggleOnKeyDown = (expand: boolean): void => {
    if (isDisabled) {
      return;
    }
    if (state.showDropdown && isFocusedElementInDropdown(state.focusedElement)) {
      const node = nodeMapRef.current.get(extractPathFromFocusedElement(state.focusedElement));
      if (node?.hasChildren()
        && !((isSearchMode && node?.searchExpanded === expand) || (!isSearchMode && node?.expanded === expand))) {
        handleNodeToggle(node, expand);
      }
    }
  };

  const handleFooterClick = useCallback((event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    event.preventDefault();
    dispatchFocus(buildFocusedElement(FOOTER, DROPDOWN));
  }, [isDisabled, dispatchFocus]);

  const handleComponentKeyDown = (event: React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (isFocusedElementInDropdown(state.focusedElement)) {
          handleNodeToggleOnKeyDown(false);
        } else if (!isSearchMode) {
          dispatchFocus(getPrevFocusedFieldElement(state.focusedElement));
        }
        if (isFocusedElementInDropdown(state.focusedElement)) {
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (isFocusedElementInDropdown(state.focusedElement)) {
          handleNodeToggleOnKeyDown(true);
        } else if (!isSearchMode) {
          dispatchFocus(getNextFocusedFieldElement(state.focusedElement));
        }
        if (isFocusedElementInDropdown(state.focusedElement)) {
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (state.showDropdown && isFocusedElementInDropdown(state.focusedElement)) {
          const prevFocusedElement = getPrevFocusedElement(state.focusedElement);
          if (prevFocusedElement !== state.focusedElement) {
            dispatchFocus(prevFocusedElement);
          }
        } else {
          dispatchToggleDropdown(!state.showDropdown);
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (state.showDropdown) {
          const nextFocusedElement = getNextFocusedElement(state.focusedElement);
          if (nextFocusedElement !== state.focusedElement) {
            dispatchFocus(nextFocusedElement);
          }
        } else {
          dispatchToggleDropdown(!state.showDropdown);
        }
        event.preventDefault();
        break;
      case 'Enter':
        if (!isFocusedElementInDropdown(state.focusedElement)) {
          const chipNode = filterChips(state.selectedNodes, type)
            ?.find(node => isFocused(node.path, FIELD, state.focusedElement));
          if (chipNode) {
            handleChipClick(chipNode)(event);
          } else {
            dispatchToggleDropdown(!state.showDropdown);
          }
        } else if (state.showDropdown) {
          if (isFocused(SELECT_ALL, DROPDOWN, state.focusedElement)) {
            handleSelectAllChange();
          } else {
            const focusedNode = nodeMapRef.current.get(extractPathFromFocusedElement(state.focusedElement));
            if (focusedNode) {
              handleNodeChange(focusedNode)(event);
            }
          }
        }
        event.preventDefault();
        break;
      case 'Backspace':
        if (!isSearchMode && isFocusedElementInField(state.focusedElement) && !isFocused(INPUT, FIELD, state.focusedElement)) {
          if (isFocused(CLEAR_ALL, FIELD, state.focusedElement)) {
            handleDeleteAll(event);
          } else {
            const focusedNode = nodeMapRef.current.get(extractPathFromFocusedElement(state.focusedElement));
            if (focusedNode) {
              handleNodeDelete(focusedNode)(event);
            }
          }
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (state.showDropdown) {
          dispatchToggleDropdown(false);
          event.preventDefault();
        }
        break;
      case 'Tab':
        if (state.showDropdown) {
          dispatchToggleDropdown(false);
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleComponentFocus = (event: React.FocusEvent): void => {
    if (isDisabled) {
      return;
    }
    if (!isComponentFocused.current) {
      isComponentFocused.current = true;
      treeMultiSelectRef?.current?.classList?.add('focused');
      onFocus?.(event);
    }
  };

  const handleComponentBlur = (event: React.FocusEvent): void => {
    if (isDisabled) {
      return;
    }
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

  const handleComponentMouseDown = useCallback((event: React.MouseEvent) => {
    if (isDisabled) {
      event.preventDefault();
    }
  }, [isDisabled]);

  const handleFieldMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.target !== fieldInputRef?.current) {
      // needed for staying focus on input
      event.preventDefault();
    }
  }, [fieldInputRef]);

  const handleDropdownLastItemReached = useCallback(() => {
    onDropdownLastItemReached?.(state.searchValue, state.displayedNodes.map(node => node.toTreeNode()));
  }, [onDropdownLastItemReached, state.searchValue, state.displayedNodes]);

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
  const rootClasses = `rtms-tree-multi-select ${typeClassName} ${isDisabled ? ' disabled' : ''}`
    + (className ? ` ${className}` : '');

  useOnClickOutside(treeMultiSelectRef, handleOutsideEvent);

  return (
    <div
      ref={treeMultiSelectRef}
      id={id}
      className={rootClasses}
      onFocus={handleComponentFocus}
      onBlur={handleComponentBlur}
      onKeyDown={handleComponentKeyDown}
      onMouseDown={handleComponentMouseDown}
    >
      <FieldWrapper
        field={components.Field}
        fieldRef={fieldRef}
        type={type}
        showDropdown={state.showDropdown}
        withClearAll={withClearAll}
        onMouseDown={handleFieldMouseDown}
        onClick={handleFieldClick}
        componentDisabled={isDisabled}
      >
        <div className="rtms-field-content">
          {filterChips(state.selectedNodes, type)
            .map(node => (
              <ChipWrapper
                key={node.path}
                components={components}
                node={node}
                focused={isFocused(node.path, FIELD, state.focusedElement)}
                withChipClear={withChipClear}
                onChipClick={handleChipClick}
                onChipDelete={handleNodeDelete}
                componentDisabled={isDisabled}
              />
            ))}
          {withDropdownInput || !isSearchable ? (
            <input className="rtms-input-hidden" readOnly/>
          ) : (
            <InputWrapper
              input={components.Input}
              inputRef={fieldInputRef}
              placeholder={inputPlaceholder}
              value={state.searchValue}
              onChange={handleInputChange}
              componentDisabled={isDisabled}
            />
          )}
        </div>
        <div className="rtms-actions">
          {showClearAll && (
            <FieldClearWrapper
              fieldClear={components.FieldClear}
              focused={isFocused(CLEAR_ALL, FIELD, state.focusedElement)}
              onClick={handleDeleteAll}
              componentDisabled={isDisabled}
            />
          )}
          <FieldToggleWrapper
            fieldToggle={components.FieldToggle}
            expanded={state.showDropdown}
            componentDisabled={isDisabled}
          />
        </div>
      </FieldWrapper>
      {
        state.showDropdown ? (
          <Dropdown
            type={type}
            nodeMap={nodeMapRef.current}
            nodesAmount={state.nodes.length}
            displayedNodes={state.displayedNodes}
            isAnyHasChildren={isAnyHasChildren(state.nodes)}
            searchValue={state.searchValue}
            showSelectAll={showSelectAll}
            selectAllCheckedState={state.selectAllCheckedState}
            focusedElement={state.focusedElement}
            noDataText={noDataText}
            noMatchesText={noMatchesText}
            dropdownHeight={dropdownHeight}
            showFooter={showFooter}
            onSelectAllChange={handleSelectAllChange}
            onNodeChange={handleNodeChange}
            onNodeToggle={handleNodeToggleOnClick}
            onFooterClick={handleFooterClick}
            input={withDropdownInput && isSearchable ? (
              <InputWrapper
                input={components.Input}
                inputRef={dropdownInputRef}
                placeholder={inputPlaceholder}
                value={state.searchValue}
                onChange={handleInputChange}
                componentDisabled={isDisabled}
              />
            ) : null}
            inputRef={dropdownInputRef}
            onLastItemReached={handleDropdownLastItemReached}
            onUnmount={handleDropdownUnmount}
            components={components}
            onListItemRender={debouncedHandleListItemRender}
          />
        ) : null
      }
    </div>
  )
    ;
};
