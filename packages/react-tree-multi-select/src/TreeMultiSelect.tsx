import './styles/tree-multi-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CheckedState, TreeMultiSelectProps, TreeNode, Type, VirtualFocusId} from './types';
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
  buildVirtualFocusId,
  extractPathFromVirtualFocusId,
  isFocused,
  isVirtualFocusInDropdown,
  isVirtualFocusInField
} from './utils/focusUtils';
import {Node} from './Node';
import {FieldContainer} from './components/Field';
import {DropdownContainer} from './DropdownContainer';

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
  const [virtualFocusId, setVirtualFocusId] = useState<VirtualFocusId | null>(null);
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
    if (!hasCustomFooter) {
      return false;
    }
    if (isAnyNodeDisplayed) {
      return !isSearchMode || showFooterWhenSearching;
    } else {
      return showFooterWhenNoItems;
    }
  }, [showFooterWhenSearching, showFooterWhenNoItems, hasCustomFooter, isAnyNodeDisplayed, isSearchMode]);

  const keyboardConfig = getKeyboardConfig(propsKeyboardConfig);

  const handleShowDropdown = useCallback((showDropdown: boolean, updateVirtualFocusId: boolean): void => {
    if (openDropdown !== undefined) {
      onDropdownToggle?.(showDropdown);
    } else {
      setShowDropdown(showDropdown);
      if (updateVirtualFocusId) {
        setVirtualFocusId(virtualFocusId => !showDropdown && isVirtualFocusInDropdown(virtualFocusId) ? null : virtualFocusId);
      }
    }
  }, [openDropdown, onDropdownToggle]);

  useEffect(() => {
    if (openDropdown !== undefined) {
      setShowDropdown(openDropdown);
      setVirtualFocusId(virtualFocusId => !openDropdown && isVirtualFocusInDropdown(virtualFocusId) ? null : virtualFocusId);
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
    let newVirtualFocusId: VirtualFocusId | null = null;
    if (isVirtualFocusInField(virtualFocusId)) {
      if (isFocused(INPUT, FIELD, virtualFocusId)
        || (isFocused(CLEAR_ALL, FIELD, virtualFocusId) && showClearAll)) {
        newVirtualFocusId = virtualFocusId;
      } else {
        const chipNodes = filterChips(newSelectedNodes, type);
        const current = chipNodes.find(node => isFocused(node.path, FIELD, virtualFocusId));
        newVirtualFocusId = current ? virtualFocusId : null;
      }
    }
    if (isVirtualFocusInDropdown(virtualFocusId)) {
      if ((isFocused(SELECT_ALL, DROPDOWN, virtualFocusId)
          && shouldRenderSelectAll(type, newDisplayedNodes, isSearchMode, withSelectAll))
        || (isFocused(FOOTER, DROPDOWN, virtualFocusId) && showFooter)) {
        newVirtualFocusId = virtualFocusId;
      } else {
        const current = newDisplayedNodes.find(node => isFocused(node.path, DROPDOWN, virtualFocusId));
        newVirtualFocusId = current ? virtualFocusId : null;
      }
    }
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, newNodes);

    setNodes(newNodes);
    setDisplayedNodes(newDisplayedNodes);
    setSelectedNodes(newSelectedNodes);
    setVirtualFocusId(newVirtualFocusId);
    setSelectAllCheckedState(newSelectAllCheckedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  const resetState = useCallback(() => {
    if (isDisabled) {
      return;
    }
    if (showDropdown || isSearchMode || virtualFocusId) {
      nodes.forEach(node => node.resetSearch());
      const newDisplayedNodes = nodes
        .filter(node => node.isDisplayed(false));
      setDisplayedNodes(newDisplayedNodes);
      handleShowDropdown(false, false);
      setVirtualFocusId(null);
      setSearchValue('');
    }
  }, [isDisabled, showDropdown, isSearchMode, virtualFocusId, nodes, handleShowDropdown]);

  const focusComponentElement = (): void => {
    if (dropdownInputRef.current) {
      dropdownInputRef.current?.focus();
    } else {
      getFieldFocusableElement(fieldRef)?.focus();
    }
  };

  const getDropdownFocusableElements = useCallback((): VirtualFocusId[] => {
    const focusableElements: VirtualFocusId[] = [];
    if (showSelectAll) {
      focusableElements.push(buildVirtualFocusId(SELECT_ALL, DROPDOWN));
    }
    focusableElements.push(...displayedNodes.map(node => buildVirtualFocusId(node.path, DROPDOWN)));
    if (showFooter) {
      focusableElements.push(buildVirtualFocusId(FOOTER, DROPDOWN));
    }
    return focusableElements;
  }, [displayedNodes, showSelectAll, showFooter]);

  const getFirstFocusedDropdownElement = useCallback((): VirtualFocusId | null => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0) {
      return null;
    }
    return dropdownFocusableElements[0];
  }, [getDropdownFocusableElements]);

  const getLastFocusedDropdownElement = useCallback((): VirtualFocusId | null => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0) {
      return null;
    }
    return dropdownFocusableElements[dropdownFocusableElements.length - 1];
  }, [getDropdownFocusableElements]);

  const getNextFocusedDropdownElement = useCallback((virtualFocusId: VirtualFocusId | null): VirtualFocusId | null => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0) {
      return null;
    }
    if (!virtualFocusId || !isVirtualFocusInDropdown(virtualFocusId)) {
      return dropdownFocusableElements[0];
    }
    const currentIndex = dropdownFocusableElements.indexOf(virtualFocusId);
    if (currentIndex === dropdownFocusableElements.length - 1) {
      return keyboardConfig.dropdown.loopDown
        ? dropdownFocusableElements[0]
        : virtualFocusId;
    } else {
      return dropdownFocusableElements[currentIndex + 1];
    }
  }, [getDropdownFocusableElements, keyboardConfig.dropdown.loopDown]);

  const getPrevFocusedDropdownElement = useCallback((virtualFocusId: VirtualFocusId | null): VirtualFocusId | null => {
    const dropdownFocusableElements = getDropdownFocusableElements();
    if (dropdownFocusableElements.length === 0 || !virtualFocusId || !isVirtualFocusInDropdown(virtualFocusId)) {
      return null;
    }
    const currentIndex = dropdownFocusableElements.indexOf(virtualFocusId);
    if (currentIndex === 0) {
      return keyboardConfig.dropdown.loopUp
        ? dropdownFocusableElements[dropdownFocusableElements.length - 1]
        : virtualFocusId;
    } else {
      return dropdownFocusableElements[currentIndex - 1];
    }
  }, [getDropdownFocusableElements, keyboardConfig.dropdown.loopUp]);

  const getFieldFocusableElements = useCallback((): VirtualFocusId[] => {
    const focusableElements: VirtualFocusId[] = [];
    focusableElements.push(...filterChips(selectedNodes, type).map(node => buildVirtualFocusId(node.path, FIELD)));
    focusableElements.push(buildVirtualFocusId(INPUT, FIELD));
    if (showClearAll) {
      focusableElements.push(buildVirtualFocusId(CLEAR_ALL, FIELD));
    }
    return focusableElements;
  }, [selectedNodes, type, showClearAll]);

  const getFirstFocusedFieldElement = useCallback((): VirtualFocusId | null => {
    const fieldFocusableElements = getFieldFocusableElements();
    if (fieldFocusableElements.length === 0) {
      return null;
    }
    return fieldFocusableElements[0];
  }, [getFieldFocusableElements]);

  const getLastFocusedFieldElement = useCallback((): VirtualFocusId | null => {
    const fieldFocusableElements = getFieldFocusableElements();
    if (fieldFocusableElements.length === 0) {
      return null;
    }
    return fieldFocusableElements[fieldFocusableElements.length - 1];
  }, [getFieldFocusableElements]);

  const getNextFocusedFieldElement = useCallback((virtualFocusId: VirtualFocusId | null): VirtualFocusId => {
    const fieldFocusableElements = getFieldFocusableElements();
    if (!virtualFocusId || !isVirtualFocusInField(virtualFocusId)) {
      return fieldFocusableElements[fieldFocusableElements.length - 1];
    }
    const currentIndex = fieldFocusableElements.indexOf(virtualFocusId);
    if (currentIndex === fieldFocusableElements.length - 1) {
      return keyboardConfig.field.loopRight
        ? fieldFocusableElements[0]
        : virtualFocusId;
    } else {
      return fieldFocusableElements[currentIndex + 1];
    }
  }, [getFieldFocusableElements, keyboardConfig.field.loopRight]);

  const getPrevFocusedFieldElement = useCallback((virtualFocusId: VirtualFocusId | null): VirtualFocusId => {
    const fieldFocusableElements = getFieldFocusableElements();
    if (!virtualFocusId || !isVirtualFocusInField(virtualFocusId)) {
      return fieldFocusableElements.length > 1
        ? fieldFocusableElements[fieldFocusableElements.indexOf(buildVirtualFocusId(INPUT, FIELD)) - 1]
        : buildVirtualFocusId(INPUT, FIELD);
    }
    const currentIndex = fieldFocusableElements.indexOf(virtualFocusId);
    if (currentIndex === 0) {
      return keyboardConfig.field.loopLeft
        ? fieldFocusableElements[fieldFocusableElements.length - 1]
        : virtualFocusId;
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
      setVirtualFocusId(buildVirtualFocusId(INPUT, FIELD));
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
    setVirtualFocusId(buildVirtualFocusId(INPUT, FIELD));
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
    setVirtualFocusId(buildVirtualFocusId(INPUT, FIELD));
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
      || (selectAllCheckedState === CheckedState.PARTIAL && areAllExcludingDisabledSelected(nodes, type));
    nodes.forEach(node => {
      if (shouldBeUnselected) {
        node.handleUnselect(type);
      } else {
        node.handleSelect(type);
      }
    });

    const newSelectedNodes = nodes.filter(node => node.selected);
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

    setSelectedNodes(newSelectedNodes);
    setVirtualFocusId(buildVirtualFocusId(SELECT_ALL, DROPDOWN));
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
      setVirtualFocusId(buildVirtualFocusId(node.path, FIELD));
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
      const prevFocusedFieldElement = getPrevFocusedFieldElement(virtualFocusId);
      const newFocusedFieldElement = (prevFocusedFieldElement === virtualFocusId) || (event.type === 'click')
        ? buildVirtualFocusId(INPUT, FIELD)
        : prevFocusedFieldElement;
      node.handleUnselect(type);
      const newSelectedNodes = nodes.filter(node => node.selected);
      const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

      setSelectedNodes(newSelectedNodes);
      setVirtualFocusId(newFocusedFieldElement);
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
        setVirtualFocusId(closeDropdownOnNodeChange
          ? buildVirtualFocusId(INPUT, FIELD)
          : buildVirtualFocusId(node.path, DROPDOWN));
        setSelectAllCheckedState(newSelectAllCheckedState);

        callNodeChangeHandler(node, newSelectedNodes);
      } else {
        setVirtualFocusId(buildVirtualFocusId(node.path, DROPDOWN));
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
    setVirtualFocusId(buildVirtualFocusId(node.path, DROPDOWN));

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
    if (showDropdown && isVirtualFocusInDropdown(virtualFocusId)) {
      const node = nodeMapRef.current.get(extractPathFromVirtualFocusId(virtualFocusId));
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
    setVirtualFocusId(buildVirtualFocusId(FOOTER, DROPDOWN));
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
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          handleNodeToggleOnKeyDown(false);
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!isSearchMode || (withDropdownInput && !showDropdown)) {
            setVirtualFocusId(getPrevFocusedFieldElement(virtualFocusId));
          }
        }
        break;
      case 'ArrowRight':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          handleNodeToggleOnKeyDown(true);
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!isSearchMode || (withDropdownInput && !showDropdown)) {
            setVirtualFocusId(getNextFocusedFieldElement(virtualFocusId));
          }
        }
        break;
      case 'ArrowUp':
        if (showDropdown && isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(getPrevFocusedDropdownElement(virtualFocusId));
        } else {
          handleShowDropdown(!showDropdown, true);
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (showDropdown) {
          setVirtualFocusId(getNextFocusedDropdownElement(virtualFocusId));
        } else {
          handleShowDropdown(!showDropdown, true);
        }
        event.preventDefault();
        break;
      case 'Home':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(getFirstFocusedDropdownElement());
          event.preventDefault();
        } else {
          if (!isSearchMode || (withDropdownInput && !showDropdown)) {
            setVirtualFocusId(getFirstFocusedFieldElement());
            event.preventDefault();
          }
        }
        break;
      case 'End':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(getLastFocusedDropdownElement());
          event.preventDefault();
        } else {
          if (!isSearchMode || (withDropdownInput && !showDropdown)) {
            setVirtualFocusId(getLastFocusedFieldElement());
            event.preventDefault();
          }
        }
        break;
      case 'Enter':
        if (!virtualFocusId || isVirtualFocusInField(virtualFocusId)) {
          const chipPath = filterChips(selectedNodes, type)
            ?.find(node => isFocused(node.path, FIELD, virtualFocusId))
            ?.path;
          if (chipPath) {
            handleChipClick(chipPath)(event);
          } else {
            handleShowDropdown(!showDropdown, true);
          }
        } else {
          if (isFocused(SELECT_ALL, DROPDOWN, virtualFocusId)) {
            handleSelectAllChange();
          } else {
            handleNodeChange(extractPathFromVirtualFocusId(virtualFocusId))(event);
          }
        }
        event.preventDefault();
        break;
      case 'Backspace':
        if (!isSearchMode && isVirtualFocusInField(virtualFocusId) && !isFocused(INPUT, FIELD, virtualFocusId)) {
          if (isFocused(CLEAR_ALL, FIELD, virtualFocusId)) {
            handleDeleteAll(event);
          } else {
            handleNodeDelete(extractPathFromVirtualFocusId(virtualFocusId))(event);
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
        resetState();
        onBlur?.(event);
      }
    }, 0);
  };

  const handleComponentMouseDown = (event: React.MouseEvent) => {
    // needed for staying focus on input
    event.preventDefault();
  };

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
        virtualFocusId={isVirtualFocusInField(virtualFocusId) ? virtualFocusId : null}
        isSearchable={isSearchable}
        inputPlaceholder={isAnyNodeSelected ? '' : inputPlaceholder}
        searchValue={searchValue}
        withDropdownInput={withDropdownInput}
        dropdownMounted={dropdownMounted}
        components={components}
        componentDisabled={isDisabled}
        onClick={handleFieldClick}
        onInputChange={handleInputChange}
        onChipClick={handleChipClick}
        onChipDelete={handleNodeDelete}
        onDeleteAll={handleDeleteAll}
      />
      {showDropdown ? (
        <DropdownContainer
          type={type}
          nodeMap={nodeMapRef.current}
          nodesAmount={nodes.length}
          displayedNodes={displayedNodes}
          selectedNodes={selectedNodes}
          isAnyHasChildren={isAnyHasChildren(nodes)}
          isSearchable={isSearchable}
          withDropdownInput={withDropdownInput}
          inputPlaceholder={inputPlaceholder}
          searchValue={searchValue}
          showSelectAll={showSelectAll}
          selectAllCheckedState={selectAllCheckedState}
          virtualFocusId={isVirtualFocusInDropdown(virtualFocusId) ? virtualFocusId : null}
          noDataText={noDataText}
          noMatchesText={noMatchesText}
          dropdownHeight={dropdownHeight}
          showFooter={showFooter}
          overscan={overscan}
          isVirtualized={isVirtualized}
          components={components}
          componentDisabled={isDisabled}
          inputRef={dropdownInputRef}
          onInputChange={handleInputChange}
          onSelectAllChange={handleSelectAllChange}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggleOnClick}
          onFooterClick={handleFooterClick}
          onLastItemReached={handleDropdownLastItemReached}
          onMount={handleDropdownMount}
          onUnmount={handleDropdownUnmount}
        />
      ) : null}
    </div>
  );
};
