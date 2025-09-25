import './styles/tree-multi-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CheckedState, TreeMultiSelectProps, TreeNode, Type} from './types';
import {InnerComponents} from './innerTypes';
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
  OVERSCAN,
  SELECT_ALL
} from './constants';
import {getFieldFocusableElement} from './utils/commonUtils';
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
import {useOnClickOutside} from './hooks/useOnClickOutside';
import {Node} from './Node';
import {FieldContainer} from './components/Field';
import {InputWrapper} from './components/Input';
import {Dropdown} from './Dropdown';

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
    openDropdown,
    dropdownHeight = DEFAULT_OPTIONS_CONTAINER_HEIGHT,
    overscan = OVERSCAN,
    isVirtualized = true,
    footerConfig,
    keyboardConfig: propsKeyboardConfig,
    components: propsComponents,
    onDropdownToggle,
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

  const nodeMapRef = useRef<Map<string, Node>>(new Map<string, Node>());

  // shallow copy of data with actual selected/expanded/disabled props
  const copiedData = useRef<TreeNode[]>([]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [displayedNodes, setDisplayedNodes] = useState<Node[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [focusedElement, setFocusedElement] = useState<string>('');
  const [selectAllCheckedState, setSelectAllCheckedState] = useState<CheckedState>(CheckedState.UNSELECTED);
  // Store components in state to avoid async rendering issues (e.g., flickering)
  // when both data and the Footer (e.g., its text) component update simultaneously during infinite scroll or pagination.
  const [components, setComponents] = useState<InnerComponents>(getComponents(propsComponents));

  const [dropdownMounted, setIsDropdownMounted] = useState<boolean>(false);

  useEffect(() => {
    setComponents(getComponents(propsComponents));
  }, [propsComponents]);

  const isAnyNodeDisplayed = displayedNodes.length > 0;
  const isAnyNodeSelected = selectedNodes.length > 0;

  const isSearchMode = Boolean(searchValue);

  const showClearAll = withClearAll && isAnyExcludingDisabledSelected(nodes);

  const showSelectAll = shouldRenderSelectAll(type, displayedNodes, isSearchMode, withSelectAll);

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

  const handleShowDropdown = useCallback((showDropdown: boolean, updateFocusedElement: boolean): void => {
    if (openDropdown !== undefined) {
      onDropdownToggle?.(showDropdown);
    } else {
      setShowDropdown(showDropdown);
      if (updateFocusedElement) {
        setFocusedElement(focusedElement => !showDropdown && isFocusedElementInDropdown(focusedElement) ? '' : focusedElement);
      }
    }
  }, [openDropdown, onDropdownToggle]);

  useEffect(() => {
    if (openDropdown !== undefined) {
      setShowDropdown(openDropdown);
      setFocusedElement(focusedElement => !openDropdown && isFocusedElementInDropdown(focusedElement) ? '' : focusedElement);
    }
  }, [openDropdown]);

  useEffect(() => {
    nodeMapRef.current = new Map<string, Node>();
    const nodeTree: Node[] = [];
    copiedData.current = [];
    data.forEach((treeNode, index) => {
      const node = mapTreeNodeToNode(treeNode, index.toString(), null, nodeMapRef.current);
      nodeTree.push(node);
      copiedData.current.push(node.initTreeNode);
    });

    let newNodes = nodeTree;

    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT) {
      newNodes = convertTreeArrayToFlatArray(nodeTree);
    }
    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
      newNodes.forEach(node => {
        if (node.initTreeNode.selected) {
          // handleSelect (not handleChange) should be used!!!
          node.handleSelect(type);
        }
      });
    }
    if (type === Type.SELECT) {
      const lastSelectedNode = newNodes.findLast(node => node.initTreeNode.selected);
      if (lastSelectedNode) {
        // handleSelect (not handleChange) should be used!!!
        lastSelectedNode.handleSelect(type);
      }
    }
    // disabled should be processed in separate cycle after selected,
    // cause disabled node initially might be selected!!!
    newNodes.forEach(node => {
      if (node.initTreeNode.disabled) {
        node.handleDisable(type);
      }
      node.handleSearch(searchValue);
    });

    const newDisplayedNodes = newNodes.filter(node => node.isDisplayed(isSearchMode));
    const newSelectedNodes = newNodes.filter(node => node.selected);
    let newFocusedElement = '';
    if (isFocusedElementInField(focusedElement)) {
      if (isFocused(INPUT, FIELD, focusedElement)
        || (isFocused(CLEAR_ALL, FIELD, focusedElement) && showClearAll)) {
        newFocusedElement = focusedElement;
      } else {
        const chipNodes = filterChips(newSelectedNodes, type);
        const current = chipNodes.find(node => isFocused(node.path, FIELD, focusedElement));
        newFocusedElement = current ? focusedElement : '';
      }
    }
    if (isFocusedElementInDropdown(focusedElement)) {
      if ((isFocused(SELECT_ALL, DROPDOWN, focusedElement)
          && shouldRenderSelectAll(type, newDisplayedNodes, isSearchMode, withSelectAll))
        || (isFocused(FOOTER, DROPDOWN, focusedElement) && showFooter)) {
        newFocusedElement = focusedElement;
      } else {
        const current = newDisplayedNodes.find(node => isFocused(node.path, DROPDOWN, focusedElement));
        newFocusedElement = current ? focusedElement : '';
      }
    }
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, newNodes);

    setNodes(newNodes);
    setDisplayedNodes(newDisplayedNodes);
    setSelectedNodes(newSelectedNodes);
    setFocusedElement(newFocusedElement);
    setSelectAllCheckedState(newSelectAllCheckedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  const resetState = useCallback(() => {
    if (isDisabled) {
      return;
    }
    if (showDropdown || isSearchMode || focusedElement) {
      nodes.forEach(node => {
        node.searchExpanded = false;
        node.matched = false;
        node.filtered = true;
      });
      const newDisplayedNodes = nodes
        .filter(node => node.isDisplayed(false));
      setDisplayedNodes(newDisplayedNodes);
      handleShowDropdown(false, false);
      setFocusedElement('');
      setSearchValue('');
    }
  }, [isDisabled, showDropdown, isSearchMode, focusedElement, nodes, handleShowDropdown]);

  const handleOutsideEvent = useCallback(() => {
    if (isDisabled) {
      return;
    }
    resetState();
  }, [isDisabled, resetState]);

  const focusComponentElement = (): void => {
    if (dropdownInputRef.current) {
      dropdownInputRef.current?.focus();
    } else {
      getFieldFocusableElement(fieldRef)?.focus();
    }
  };

  const getDropdownFocusableElements = useCallback((): string[] => {
    const focusableElements: string[] = [];
    if (showSelectAll) {
      focusableElements.push(buildFocusedElement(SELECT_ALL, DROPDOWN));
    }
    focusableElements.push(...displayedNodes.map(node => buildFocusedElement(node.path, DROPDOWN)));
    if (showFooter) {
      focusableElements.push(buildFocusedElement(FOOTER, DROPDOWN));
    }
    return focusableElements;
  }, [displayedNodes, showSelectAll, showFooter]);

  const getNextFocusedDropdownElement = useCallback((focusedElement: string): string => {
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

  const getPrevFocusedDropdownElement = useCallback((focusedElement: string): string => {
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

  const getFieldFocusableElements = useCallback((): string[] => {
    const focusableElements: string[] = [];
    focusableElements.push(...filterChips(selectedNodes, type).map(node => buildFocusedElement(node.path, FIELD)));
    focusableElements.push(buildFocusedElement(INPUT, FIELD));
    if (showClearAll) {
      focusableElements.push(buildFocusedElement(CLEAR_ALL, FIELD));
    }
    return focusableElements;
  }, [selectedNodes, type, showClearAll]);

  const getNextFocusedFieldElement = useCallback((focusedFieldElement: string): string => {
    const fieldFocusableElements = getFieldFocusableElements();
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
  }, [getFieldFocusableElements, keyboardConfig.field.loopRight]);

  const getPrevFocusedFieldElement = useCallback((focusedFieldElement: string): string => {
    const fieldFocusableElements = getFieldFocusableElements();
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
  }, [getFieldFocusableElements, keyboardConfig.field.loopLeft]);

  const handleFieldClick = useCallback((event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click field clear icon or chip (or in custom field)
    if (!event.defaultPrevented) {
      handleShowDropdown(!showDropdown, false);
      setFocusedElement(buildFocusedElement(INPUT, FIELD));
    }
  }, [showDropdown, isDisabled, handleShowDropdown]);

  const callClearAllHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onClearAll) {
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onClearAll(selectedTreeNodes, type !== Type.SELECT ? selectAllCheckedState : undefined, copiedData.current);
    }
  }, [onClearAll, type]);

  const handleDeleteAllRef = useRef<(event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleDeleteAllRef.current = (event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    event.preventDefault();
    nodes.forEach(node => node.handleUnselect(type));
    const newSelectedNodes = nodes.filter(node => node.selected);
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

    setSelectedNodes(newSelectedNodes);
    setFocusedElement(buildFocusedElement(INPUT, FIELD));
    setSelectAllCheckedState(newSelectAllCheckedState);

    callClearAllHandler(newSelectAllCheckedState, newSelectedNodes);
  };

  const handleDeleteAll = useCallback((event: React.MouseEvent | React.KeyboardEvent): void => {
    handleDeleteAllRef.current?.(event);
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    if (isDisabled) {
      return;
    }
    const value = event.currentTarget.value;

    nodes.forEach(node => {
      node.handleSearch(value);
    });

    const newDisplayedNodes = nodes
      .filter(node => node.isDisplayed(Boolean(value)));

    setDisplayedNodes(newDisplayedNodes);
    setSearchValue(value);
    setFocusedElement(buildFocusedElement(INPUT, FIELD));
  }, [nodes, isDisabled]);

  const callSelectAllChangeHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState, copiedData.current);
    }
  }, [onSelectAllChange]);

  const handleSelectAllChangeRef = useRef<() => void>(null);
  handleSelectAllChangeRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    const shouldBeUnselected = selectAllCheckedState === CheckedState.SELECTED
      || (selectAllCheckedState === CheckedState.PARTIAL && areAllExcludingDisabledSelected(nodes));
    nodes.forEach(node => {
      if (!node.disabled) {
        node.selected = !shouldBeUnselected;
      }
    });
    // partiallySelected should be processed in separate cycle after selected,
    // cause all nodes should be selected/unselected at first!!!
    nodes.forEach(node => {
      node.handleCheckAndSetPartiallySelected(type);
    });

    const newSelectedNodes = nodes.filter(node => node.selected);
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

    setSelectedNodes(newSelectedNodes);
    setFocusedElement(buildFocusedElement(SELECT_ALL, DROPDOWN));
    setSelectAllCheckedState(newSelectAllCheckedState);

    callSelectAllChangeHandler(newSelectAllCheckedState, newSelectedNodes);
  };

  const handleSelectAllChange = useCallback((): void => {
    handleSelectAllChangeRef.current?.();
  }, []);

  const callNodeToggleHandler = useCallback((toggledNode: Node, expandedNodes: Node[]): void => {
    if (onNodeToggle) {
      const toggledTreeNode = toggledNode.initTreeNode;
      const expandedTreeNodes = expandedNodes.map(node => node.initTreeNode);
      onNodeToggle(toggledTreeNode, expandedTreeNodes, copiedData.current);
    }
  }, [onNodeToggle]);

  const callNodeChangeHandler = useCallback((changedNode: Node, selectedNodes: Node[]): void => {
    if (onNodeChange && !changedNode.disabled) {
      const changedTreeNode = changedNode.initTreeNode;
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onNodeChange(changedTreeNode, selectedTreeNodes, copiedData.current);
    }
  }, [onNodeChange]);

  const handleChipClickRef = useRef<(path: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleChipClickRef.current = (path: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click chip clear icon
    if (!event.defaultPrevented) {
      const node = nodeMapRef.current.get(path);
      if (!node) {
        return;
      }
      event.preventDefault();
      handleShowDropdown(!showDropdown, false);
      setFocusedElement(buildFocusedElement(node.path, FIELD));
    }
  };

  const handleChipClick = useCallback((path: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleChipClickRef.current?.(path, event);
  }, []);

  const handleNodeDeleteRef = useRef<(path: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleNodeDeleteRef.current = (path: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (!withChipClear || isDisabled) {
      return;
    }
    event.preventDefault();
    const node = nodeMapRef.current.get(path);
    if (!node) {
      return;
    }
    if (!node.disabled) {
      const prevFocusedFieldElement = getPrevFocusedFieldElement(focusedElement);
      const newFocusedFieldElement = (prevFocusedFieldElement === focusedElement) || (event.type === 'click')
        ? buildFocusedElement(INPUT, FIELD)
        : prevFocusedFieldElement;
      node.handleUnselect(type);
      const newSelectedNodes = nodes.filter(node => node.selected);
      const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

      setSelectedNodes(newSelectedNodes);
      setFocusedElement(newFocusedFieldElement);
      setSelectAllCheckedState(newSelectAllCheckedState);

      callNodeChangeHandler(node, newSelectedNodes);
    }
  };

  const handleNodeDelete = useCallback((path: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleNodeDeleteRef.current?.(path, event);
  }, []);

  const handleNodeChangeRef = useRef<(path: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleNodeChangeRef.current = (path: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click expand node icon
    if (!event.defaultPrevented) {
      const node = nodeMapRef.current.get(path);
      if (!node) {
        return;
      }
      if (!node.disabled) {
        if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
          node.handleChange(type);
        }
        if (type === Type.SELECT) {
          selectedNodes.forEach(node => node.handleUnselect(type));
          node.handleSelect(type);
        }
        const newSelectedNodes = nodes.filter(node => node.selected);
        const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

        setSelectedNodes(newSelectedNodes);
        handleShowDropdown(closeDropdownOnNodeChange ? false : showDropdown, false);
        setFocusedElement(closeDropdownOnNodeChange
          ? buildFocusedElement(INPUT, FIELD)
          : buildFocusedElement(node.path, DROPDOWN));
        setSelectAllCheckedState(newSelectAllCheckedState);

        callNodeChangeHandler(node, newSelectedNodes);
      } else {
        setFocusedElement(buildFocusedElement(node.path, DROPDOWN));
      }
    }
  };

  const handleNodeChange = useCallback((path: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleNodeChangeRef.current?.(path, event);
  }, []);

  const handleNodeToggle = useCallback((node: Node, expand: boolean): void => {
    node.handleExpand(isSearchMode, expand);

    const newDisplayedNodes = nodes
      .filter(node => node.isDisplayed(isSearchMode));

    setDisplayedNodes(newDisplayedNodes);
    setFocusedElement(buildFocusedElement(node.path, DROPDOWN));

    callNodeToggleHandler(node, nodes.filter(node => node.expanded));
  }, [nodes, isSearchMode, callNodeToggleHandler]);

  const handleNodeToggleOnClickRef = useRef<(path: string, event: React.MouseEvent) => void>(null);
  handleNodeToggleOnClickRef.current = (path: string, event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    const node = nodeMapRef.current.get(path);
    if (!node) {
      return;
    }
    event.preventDefault();
    const expand = isSearchMode
      ? !node.searchExpanded
      : !node.expanded;
    handleNodeToggle(node, expand);
  };

  const handleNodeToggleOnClick = useCallback((path: string) => (event: React.MouseEvent): void => {
    handleNodeToggleOnClickRef.current?.(path, event);
  }, []);

  const handleNodeToggleOnKeyDown = (expand: boolean): void => {
    if (isDisabled) {
      return;
    }
    if (showDropdown && isFocusedElementInDropdown(focusedElement)) {
      const node = nodeMapRef.current.get(extractPathFromFocusedElement(focusedElement));
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
    setFocusedElement(buildFocusedElement(FOOTER, DROPDOWN));
  }, [isDisabled]);

  const handleComponentClick = (): void => {
    if (!isComponentFocused.current) {
      focusComponentElement();
    }
  };

  const handleComponentKeyDown = (event: React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (isFocusedElementInDropdown(focusedElement)) {
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
          handleNodeToggleOnKeyDown(false);
        } else {
          if (!isSearchMode) {
            setFocusedElement(getPrevFocusedFieldElement(focusedElement));
          }
        }
        break;
      case 'ArrowRight':
        if (isFocusedElementInDropdown(focusedElement)) {
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
          handleNodeToggleOnKeyDown(true);
        } else {
          if (!isSearchMode) {
            setFocusedElement(getNextFocusedFieldElement(focusedElement));
          }
        }
        break;
      case 'ArrowUp':
        if (showDropdown && isFocusedElementInDropdown(focusedElement)) {
          setFocusedElement(getPrevFocusedDropdownElement(focusedElement));
        } else {
          handleShowDropdown(!showDropdown, true);
        }
        if (isSearchMode) {
          event.preventDefault(); // Prevent the caret from moving inside the input.
        }
        break;
      case 'ArrowDown':
        if (showDropdown) {
          setFocusedElement(getNextFocusedDropdownElement(focusedElement));
        } else {
          handleShowDropdown(!showDropdown, true);
        }
        if (isSearchMode) {
          event.preventDefault(); // Prevent the caret from moving inside the input.
        }
        break;
      case 'Enter':
        if (!focusedElement || isFocusedElementInField(focusedElement)) {
          const chipPath = filterChips(selectedNodes, type)
            ?.find(node => isFocused(node.path, FIELD, focusedElement))
            ?.path;
          if (chipPath) {
            handleChipClick(chipPath)(event);
          } else {
            handleShowDropdown(!showDropdown, true);
          }
        } else {
          if (isFocused(SELECT_ALL, DROPDOWN, focusedElement)) {
            handleSelectAllChange();
          } else {
            handleNodeChange(extractPathFromFocusedElement(focusedElement))(event);
          }
        }
        event.preventDefault();
        break;
      case 'Backspace':
        if (!isSearchMode && isFocusedElementInField(focusedElement) && !isFocused(INPUT, FIELD, focusedElement)) {
          if (isFocused(CLEAR_ALL, FIELD, focusedElement)) {
            handleDeleteAll(event);
          } else {
            handleNodeDelete(extractPathFromFocusedElement(focusedElement))(event);
          }
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (showDropdown) {
          handleShowDropdown(false, true);
          event.preventDefault();
        }
        break;
      case 'Tab':
        // If the component is the last focusable element in the DOM, pressing Tab won’t shift focus,
        // and `focusin` won’t fire — so useOnClickOutside won’t trigger the reset handler.
        // Manually reset the state in this case.
        resetState();
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
    setTimeout(() => {
      if (!treeMultiSelectRef.current?.contains(document.activeElement) && isComponentFocused.current) {
        isComponentFocused.current = false;
        treeMultiSelectRef?.current?.classList?.remove('focused');
        onBlur?.(event);
      }
    }, 0);
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
    onDropdownLastItemReached?.(searchValue, displayedNodes.map(node => node.initTreeNode));
  }, [onDropdownLastItemReached, searchValue, displayedNodes]);

  const handleDropdownMount = useCallback(() => {
    setIsDropdownMounted(true);
    if (isComponentFocused.current) {
      focusComponentElement();
    }
  }, []);

  const handleDropdownUnmount = useCallback(() => {
    setIsDropdownMounted(false);
    if (!treeMultiSelectRef.current?.contains(document.activeElement) && isComponentFocused.current) {
      focusComponentElement();
    }
  }, []);

  const typeClassName = useMemo(() => typeToClassName(type), [type]);
  const rootClasses = `rtms-tree-multi-select ${typeClassName}${isDisabled ? ' disabled' : ''}`
    + (className ? ` ${className}` : '');

  useOnClickOutside(treeMultiSelectRef, handleOutsideEvent);

  return (
    <div
      ref={treeMultiSelectRef}
      id={id}
      className={rootClasses}
      onFocus={handleComponentFocus}
      onBlur={handleComponentBlur}
      onClick={handleComponentClick}
      onKeyDown={handleComponentKeyDown}
      onMouseDown={handleComponentMouseDown}
    >
      <FieldContainer
        fieldRef={fieldRef}
        fieldInputRef={fieldInputRef}
        type={type}
        selectedNodes={selectedNodes}
        showDropdown={showDropdown}
        withClearAll={withClearAll}
        showClearAll={showClearAll}
        withChipClear={withChipClear}
        focusedElement={isFocusedElementInField(focusedElement) ? focusedElement : ''}
        isSearchable={isSearchable}
        inputPlaceholder={isAnyNodeSelected ? '' : inputPlaceholder}
        searchValue={searchValue}
        withDropdownInput={withDropdownInput}
        dropdownMounted={dropdownMounted}
        onMouseDown={handleFieldMouseDown}
        onClick={handleFieldClick}
        onInputChange={handleInputChange}
        onChipClick={handleChipClick}
        onChipDelete={handleNodeDelete}
        onDeleteAll={handleDeleteAll}
        components={components}
        componentDisabled={isDisabled}
      />
      {showDropdown ? (
        <Dropdown
          type={type}
          nodeMap={nodeMapRef.current}
          nodesAmount={nodes.length}
          displayedNodes={displayedNodes}
          selectedNodes={selectedNodes}
          isAnyHasChildren={isAnyHasChildren(nodes)}
          searchValue={searchValue}
          showSelectAll={showSelectAll}
          selectAllCheckedState={selectAllCheckedState}
          focusedElement={focusedElement}
          noDataText={noDataText}
          noMatchesText={noMatchesText}
          dropdownHeight={dropdownHeight}
          showFooter={showFooter}
          overscan={overscan}
          isVirtualized={isVirtualized}
          onSelectAllChange={handleSelectAllChange}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggleOnClick}
          onFooterClick={handleFooterClick}
          input={withDropdownInput && isSearchable ? (
            <InputWrapper
              input={components.Input}
              inputRef={dropdownInputRef}
              placeholder={inputPlaceholder}
              value={searchValue}
              onChange={handleInputChange}
              componentDisabled={isDisabled}
            />
          ) : null}
          inputRef={dropdownInputRef}
          onLastItemReached={handleDropdownLastItemReached}
          onMount={handleDropdownMount}
          onUnmount={handleDropdownUnmount}
          components={components}
          componentDisabled={isDisabled}
        />
      ) : null}
    </div>
  );
};
