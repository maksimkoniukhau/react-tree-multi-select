import './styles/tree-multi-select.scss';
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  CheckedState,
  CLEAR_ALL_SUFFIX,
  DROPDOWN_PREFIX,
  FIELD_PREFIX,
  FOOTER_SUFFIX,
  INPUT_SUFFIX,
  KeyboardActions,
  SELECT_ALL_SUFFIX,
  TreeMultiSelectProps,
  TreeNode,
  Type,
  VirtualFocusId
} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {
  DEFAULT_OPTIONS_CONTAINER_HEIGHT,
  INPUT_PLACEHOLDER,
  NO_DATA_TEXT,
  NO_MATCHES_TEXT,
  OVERSCAN
} from './constants';
import {getFieldFocusableElement} from './utils/commonUtils';
import {
  areAllSelectedExcludingDisabled,
  convertTreeArrayToFlatArray,
  filterChips,
  getSelectAllCheckedState,
  isAnyHasChildren,
  isAnySelectedExcludingDisabled,
  mapTreeNodeToNode
} from './utils/nodesUtils';
import {getKeyboardConfig, shouldRenderSelectAll, typeToClassName} from './utils/componentUtils';
import {getComponents, hasCustomFooterComponent} from './utils/componentsUtils';
import {
  buildVirtualFocusId,
  extractElementId,
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
    noDataText = NO_DATA_TEXT,
    noMatchesText = NO_MATCHES_TEXT,
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
    onKeyDown,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [virtualFocusId, setVirtualFocusId] = useState<NullableVirtualFocusId>(null);
  const [selectAllCheckedState, setSelectAllCheckedState] = useState<CheckedState>(CheckedState.UNSELECTED);
  const [dropdownMounted, setIsDropdownMounted] = useState<boolean>(false);
  // Store components in state to avoid async rendering issues (e.g., flickering)
  // when both data and the Footer (e.g., its text) component update simultaneously during infinite scroll or pagination.
  const [components, setComponents] = useState<InnerComponents>(getComponents(propsComponents));

  useEffect(() => {
    setComponents(getComponents(propsComponents));
  }, [propsComponents]);

  useEffect(() => {
    if (openDropdown !== undefined) {
      setIsDropdownOpen(openDropdown);
    }
  }, [openDropdown]);

  const isAnyNodeDisplayed = displayedNodes.length > 0;
  const isAnyNodeSelected = selectedNodes.length > 0;

  const isSearchMode = Boolean(searchValue);

  const showClearAll = withClearAll && isAnySelectedExcludingDisabled(nodes);

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

  const getFieldVirtualFocusIds = (): VirtualFocusId[] => {
    const virtualFocusableElements = Array.from(
      fieldRef.current?.querySelectorAll('[data-rtms-virtual-focus-id]') ?? []
    );
    return virtualFocusableElements
      .map(element => element.getAttribute('data-rtms-virtual-focus-id') as VirtualFocusId)
      .filter(id => id.startsWith(FIELD_PREFIX));
  };

  const findFieldVirtualFocusId = (virtualFocusId: VirtualFocusId): NullableVirtualFocusId => {
    return getFieldVirtualFocusIds().find(id => id === virtualFocusId) ?? null;
  };

  const dropdownVirtualFocusIds: VirtualFocusId[] = useMemo(() => {
    const focusableElements: VirtualFocusId[] = [];
    if (showSelectAll) {
      focusableElements.push(buildVirtualFocusId(SELECT_ALL_SUFFIX, DROPDOWN_PREFIX));
    }
    focusableElements.push(...displayedNodes
      .filter(node => !node.skipDropdownVirtualFocus)
      .map(node => buildVirtualFocusId(node.id, DROPDOWN_PREFIX)));
    if (showFooter) {
      focusableElements.push(buildVirtualFocusId(FOOTER_SUFFIX, DROPDOWN_PREFIX));
    }
    return focusableElements;
  }, [displayedNodes, showSelectAll, showFooter]);

  const findDropdownVirtualFocusId = useCallback((virtualFocusId: VirtualFocusId): NullableVirtualFocusId => {
    return dropdownVirtualFocusIds.find(id => id === virtualFocusId) ?? null;
  }, [dropdownVirtualFocusIds]);

  const toggleDropdown = useCallback((isOpen: boolean): void => {
    if (openDropdown !== undefined) {
      onDropdownToggle?.(isOpen);
    } else {
      setIsDropdownOpen(isOpen);
    }
  }, [openDropdown, onDropdownToggle]);

  useEffect(() => {
    // when dropdownVirtualFocusIds were changed and previously virtually focused element is not present there
    setVirtualFocusId(prev => {
      if (isVirtualFocusInDropdown(prev)) {
        return dropdownVirtualFocusIds.find(id => id === prev) ?? null;
      }
      return prev;
    });
  }, [dropdownVirtualFocusIds]);

  useEffect(() => {
    // when data was changed and previously virtually focused chip is not present in the field
    setVirtualFocusId(prev => {
      if (isVirtualFocusInField(prev)) {
        const fieldVirtualFocusIds = getFieldVirtualFocusIds();
        return fieldVirtualFocusIds.find(id => id === prev)
          ?? fieldVirtualFocusIds.find(id => id === buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX))
          ?? null
      }
      return prev;
    });
  }, [selectedNodes]);

  useEffect(() => {
    // when dropdown was closed and previously virtually focused element was in the dropdown
    setVirtualFocusId(prev => {
      if (!isDropdownOpen && isVirtualFocusInDropdown(prev)) {
        const fieldVirtualFocusIds = getFieldVirtualFocusIds();
        return fieldVirtualFocusIds.find(id => id === buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX))
          ?? fieldVirtualFocusIds[0]
          ?? null;
      }
      return prev;
    });
  }, [isDropdownOpen]);

  useEffect(() => {
    const virtualFocusElement = treeMultiSelectRef.current?.querySelector(`[data-rtms-virtual-focus-id='${virtualFocusId}']`);
    if (!virtualFocusElement) {
      return;
    }
    virtualFocusElement.classList.add('focused');
    return () => virtualFocusElement.classList.remove('focused');
  }, [virtualFocusId]);

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
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, newNodes);

    setNodes(newNodes);
    setDisplayedNodes(newDisplayedNodes);
    setSelectedNodes(newSelectedNodes);
    setSelectAllCheckedState(newSelectAllCheckedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  const resetState = useCallback(() => {
    if (isDisabled) {
      return;
    }
    if (isDropdownOpen || isSearchMode || virtualFocusId) {
      nodes.forEach(node => node.resetSearch());
      const newDisplayedNodes = nodes.filter(node => node.isDisplayed(false));
      setDisplayedNodes(newDisplayedNodes);
      toggleDropdown(false);
      setVirtualFocusId(null);
      setSearchValue('');
    }
  }, [isDisabled, isDropdownOpen, isSearchMode, virtualFocusId, nodes, toggleDropdown]);

  const focusComponentElement = (): void => {
    if (dropdownInputRef.current) {
      dropdownInputRef.current?.focus();
    } else {
      getFieldFocusableElement(fieldRef)?.focus();
    }
  };

  const getFirstDropdownVirtualFocusId = useCallback((): NullableVirtualFocusId => {
    if (dropdownVirtualFocusIds.length === 0) {
      return null;
    }
    return dropdownVirtualFocusIds[0];
  }, [dropdownVirtualFocusIds]);

  const getLastDropdownVirtualFocusId = useCallback((): NullableVirtualFocusId => {
    if (dropdownVirtualFocusIds.length === 0) {
      return null;
    }
    return dropdownVirtualFocusIds[dropdownVirtualFocusIds.length - 1];
  }, [dropdownVirtualFocusIds]);

  const getNextDropdownVirtualFocusId = useCallback((virtualFocusId: NullableVirtualFocusId): NullableVirtualFocusId => {
    if (dropdownVirtualFocusIds.length === 0 || !virtualFocusId || !isVirtualFocusInDropdown(virtualFocusId)) {
      return null;
    }
    const currentIndex = dropdownVirtualFocusIds.indexOf(virtualFocusId);
    if (currentIndex === dropdownVirtualFocusIds.length - 1) {
      return keyboardConfig.dropdown.loopDown
        ? dropdownVirtualFocusIds[0]
        : virtualFocusId;
    } else {
      return dropdownVirtualFocusIds[currentIndex + 1];
    }
  }, [dropdownVirtualFocusIds, keyboardConfig.dropdown.loopDown]);

  const getPrevDropdownVirtualFocusId = useCallback((virtualFocusId: NullableVirtualFocusId): NullableVirtualFocusId => {
    if (dropdownVirtualFocusIds.length === 0 || !virtualFocusId || !isVirtualFocusInDropdown(virtualFocusId)) {
      return null;
    }
    const currentIndex = dropdownVirtualFocusIds.indexOf(virtualFocusId);
    if (currentIndex === 0) {
      return keyboardConfig.dropdown.loopUp
        ? dropdownVirtualFocusIds[dropdownVirtualFocusIds.length - 1]
        : virtualFocusId;
    } else {
      return dropdownVirtualFocusIds[currentIndex - 1];
    }
  }, [dropdownVirtualFocusIds, keyboardConfig.dropdown.loopUp]);

  const getFirstFieldVirtualFocusId = (): NullableVirtualFocusId => {
    const fieldVirtualFocusIds = getFieldVirtualFocusIds();
    if (fieldVirtualFocusIds.length === 0) {
      return null;
    }
    return fieldVirtualFocusIds[0];
  };

  const getLastFieldVirtualFocusId = (): NullableVirtualFocusId => {
    const fieldVirtualFocusIds = getFieldVirtualFocusIds();
    if (fieldVirtualFocusIds.length === 0) {
      return null;
    }
    return fieldVirtualFocusIds[fieldVirtualFocusIds.length - 1];
  };

  const getNextFieldVirtualFocusId = (virtualFocusId: NullableVirtualFocusId): NullableVirtualFocusId => {
    const fieldVirtualFocusIds = getFieldVirtualFocusIds();
    if (fieldVirtualFocusIds.length === 0 || !virtualFocusId || !isVirtualFocusInField(virtualFocusId)) {
      return null;
    }
    const currentIndex = fieldVirtualFocusIds.indexOf(virtualFocusId);
    if (currentIndex === fieldVirtualFocusIds.length - 1) {
      return keyboardConfig.field.loopRight
        ? fieldVirtualFocusIds[0]
        : virtualFocusId;
    } else {
      return fieldVirtualFocusIds[currentIndex + 1];
    }
  };

  const getPrevFieldVirtualFocusId = (virtualFocusId: NullableVirtualFocusId): NullableVirtualFocusId => {
    const fieldVirtualFocusIds = getFieldVirtualFocusIds();
    if (fieldVirtualFocusIds.length === 0 || !virtualFocusId || !isVirtualFocusInField(virtualFocusId)) {
      return null;
    }
    const currentIndex = fieldVirtualFocusIds.indexOf(virtualFocusId);
    if (currentIndex === 0) {
      return keyboardConfig.field.loopLeft
        ? fieldVirtualFocusIds[fieldVirtualFocusIds.length - 1]
        : virtualFocusId;
    } else {
      return fieldVirtualFocusIds[currentIndex - 1];
    }
  };

  const handleFieldClickRef = useRef<(event: React.MouseEvent) => void>(null);
  handleFieldClickRef.current = (event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click FieldClear or Chip (or in custom field)
    if (event.defaultPrevented) {
      return;
    }
    toggleDropdown(!isDropdownOpen);
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)));
  };

  const handleFieldClick = useCallback((event: React.MouseEvent): void => {
    handleFieldClickRef.current?.(event);
  }, []);

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
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)));
    setSelectAllCheckedState(newSelectAllCheckedState);

    callClearAllHandler(newSelectAllCheckedState, newSelectedNodes);
  };

  const handleDeleteAll = useCallback((event: React.MouseEvent | React.KeyboardEvent): void => {
    handleDeleteAllRef.current?.(event);
  }, []);

  const handleInputChangeRef = useRef<(event: React.ChangeEvent<HTMLInputElement>) => void>(null);
  handleInputChangeRef.current = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)));
  };

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    handleInputChangeRef.current?.(event);
  }, []);

  const callSelectAllChangeHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState, copiedData.current);
    }
  }, [onSelectAllChange]);

  const setAllSelected = (selectAll: boolean): void => {
    if (isDisabled) {
      return;
    }
    nodes.forEach(node => {
      if (selectAll) {
        node.handleSelect(type);
      } else {
        node.handleUnselect(type);
      }
    });

    const newSelectedNodes = nodes.filter(node => node.selected);
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

    setSelectedNodes(newSelectedNodes);
    setSelectAllCheckedState(newSelectAllCheckedState);

    callSelectAllChangeHandler(newSelectAllCheckedState, newSelectedNodes);
  };

  const handleSelectAllChangeRef = useRef<() => void>(null);
  handleSelectAllChangeRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    const shouldBeUnselected = selectAllCheckedState === CheckedState.SELECTED
      || (selectAllCheckedState === CheckedState.PARTIAL && areAllSelectedExcludingDisabled(nodes, type));
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(SELECT_ALL_SUFFIX, DROPDOWN_PREFIX)) ?? prev);
    setAllSelected(!shouldBeUnselected);
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

  const handleChipClickRef = useRef<(id: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleChipClickRef.current = (id: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click ChipClear
    if (event.defaultPrevented) {
      return;
    }
    const node = nodeMapRef.current.get(id);
    if (!node) {
      return;
    }
    event.preventDefault();
    toggleDropdown(!isDropdownOpen);
    setVirtualFocusId(prev => findFieldVirtualFocusId(buildVirtualFocusId(node.id, FIELD_PREFIX)) ?? prev);
  };

  const handleChipClick = useCallback((id: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleChipClickRef.current?.(id, event);
  }, []);

  const handleNodeDeleteRef = useRef<(id: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleNodeDeleteRef.current = (id: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (!withChipClear || isDisabled) {
      return;
    }
    const node = nodeMapRef.current.get(id);
    if (!node) {
      return;
    }
    event.preventDefault();
    if (!node.disabled) {
      const prevFieldVirtualFocusId = getPrevFieldVirtualFocusId(virtualFocusId);
      const newFieldVirtualFocusId = (prevFieldVirtualFocusId === virtualFocusId) || (event.type === 'click')
        ? findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX))
        : prevFieldVirtualFocusId;
      node.handleUnselect(type);
      const newSelectedNodes = nodes.filter(node => node.selected);
      const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodes);

      setSelectedNodes(newSelectedNodes);
      setVirtualFocusId(newFieldVirtualFocusId);
      setSelectAllCheckedState(newSelectAllCheckedState);

      callNodeChangeHandler(node, newSelectedNodes);
    }
  };

  const handleNodeDelete = useCallback((id: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleNodeDeleteRef.current?.(id, event);
  }, []);

  const handleNodeChangeRef = useRef<(id: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleNodeChangeRef.current = (id: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    // defaultPrevented is on click NodeToggle
    if (event.defaultPrevented) {
      return;
    }
    const node = nodeMapRef.current.get(id);
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
      toggleDropdown(closeDropdownOnNodeChange ? false : isDropdownOpen);
      setVirtualFocusId(prev => closeDropdownOnNodeChange
        ? findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX))
        : findDropdownVirtualFocusId(buildVirtualFocusId(node.id, DROPDOWN_PREFIX)) ?? prev);
      setSelectAllCheckedState(newSelectAllCheckedState);

      callNodeChangeHandler(node, newSelectedNodes);
    } else {
      setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(node.id, DROPDOWN_PREFIX)) ?? prev);
    }
  };

  const handleNodeChange = useCallback((id: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleNodeChangeRef.current?.(id, event);
  }, []);

  const handleNodeToggle = useCallback((node: Node, expand: boolean): void => {
    node.handleExpand(isSearchMode, expand);

    const newDisplayedNodes = nodes.filter(node => node.isDisplayed(isSearchMode));
    setDisplayedNodes(newDisplayedNodes);

    callNodeToggleHandler(node, nodes.filter(node => node.expanded));
  }, [nodes, isSearchMode, callNodeToggleHandler]);

  const handleNodeToggleOnClickRef = useRef<(id: string, event: React.MouseEvent) => void>(null);
  handleNodeToggleOnClickRef.current = (id: string, event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    const node = nodeMapRef.current.get(id);
    if (!node) {
      return;
    }
    event.preventDefault();
    const expand = isSearchMode
      ? !node.searchExpanded
      : !node.expanded;
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(node.id, DROPDOWN_PREFIX)) ?? prev);
    handleNodeToggle(node, expand);
  };

  const handleNodeToggleOnClick = useCallback((id: string) => (event: React.MouseEvent): void => {
    handleNodeToggleOnClickRef.current?.(id, event);
  }, []);

  const handleNodeToggleOnKeyDown = (expand: boolean): void => {
    if (isDisabled) {
      return;
    }
    if (isDropdownOpen && isVirtualFocusInDropdown(virtualFocusId)) {
      const node = nodeMapRef.current.get(extractElementId(virtualFocusId));
      if (node?.hasChildren()
        && !((isSearchMode && node?.searchExpanded === expand) || (!isSearchMode && node?.expanded === expand))) {
        handleNodeToggle(node, expand);
      }
    }
  };

  const handleFooterClickRef = useRef<() => void>(null);
  handleFooterClickRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(FOOTER_SUFFIX, DROPDOWN_PREFIX)) ?? prev);
  };

  const handleFooterClick = useCallback((): void => {
    handleFooterClickRef.current?.();
  }, []);

  const handleComponentClick = (): void => {
    if (!isComponentFocused.current) {
      focusComponentElement();
    }
  };

  const getActions = (event: React.KeyboardEvent): KeyboardActions => {
    return {
      focusNextItem: () => {
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getNextDropdownVirtualFocusId(prev) ?? prev);
        }
        if (isVirtualFocusInField(virtualFocusId)) {
          setVirtualFocusId(prev => getNextFieldVirtualFocusId(prev) ?? prev);
        }
      },
      focusPrevItem: () => {
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getPrevDropdownVirtualFocusId(prev) ?? prev);
        }
        if (isVirtualFocusInField(virtualFocusId)) {
          setVirtualFocusId(prev => getPrevFieldVirtualFocusId(prev) ?? prev);
        }
      },
      focusFirstItem: () => {
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getFirstDropdownVirtualFocusId() ?? prev);
        }
        if (isVirtualFocusInField(virtualFocusId)) {
          setVirtualFocusId(prev => getFirstFieldVirtualFocusId() ?? prev);
        }
      },
      focusLastItem: () => {
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getLastDropdownVirtualFocusId() ?? prev);
        }
        if (isVirtualFocusInField(virtualFocusId)) {
          setVirtualFocusId(prev => getLastFieldVirtualFocusId() ?? prev);
        }
      },
      focusDropdown: () => {
        setVirtualFocusId(prev => getFirstDropdownVirtualFocusId() ?? prev);
      },
      focusField: () => {
        setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)));
      },
      openDropdown: () => {
        toggleDropdown(true);
      },
      closeDropdown: () => {
        toggleDropdown(false);
      },
      changeSelectAll: () => {
        handleSelectAllChange();
      },
      expandNode: () => {
        handleNodeToggleOnKeyDown(true);
      },
      collapseNode: () => {
        handleNodeToggleOnKeyDown(false);
      },
      changeNode: () => {
        handleNodeChange(extractElementId(virtualFocusId))(event);
      },
      clearNode: () => {
        handleNodeDelete(extractElementId(virtualFocusId))(event);
      },
      clearAll: () => {
        handleDeleteAll(event);
      }
    };
  };

  const handleComponentKeyDown = (event: React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    if (onKeyDown
      && onKeyDown(event, {inputValue: searchValue, isDropdownOpen, virtualFocusId, actions: getActions(event)})) {
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
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => getPrevFieldVirtualFocusId(prev) ?? prev);
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
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => getNextFieldVirtualFocusId(prev) ?? prev);
          }
        }
        break;
      case 'ArrowUp':
        if (isDropdownOpen && isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getPrevDropdownVirtualFocusId(prev) ?? prev);
        } else {
          toggleDropdown(!isDropdownOpen);
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (isDropdownOpen) {
          if (isVirtualFocusInDropdown(virtualFocusId)) {
            setVirtualFocusId(prev => getNextDropdownVirtualFocusId(prev) ?? prev);
          } else {
            setVirtualFocusId(prev => getFirstDropdownVirtualFocusId() ?? prev);
          }
        } else {
          toggleDropdown(!isDropdownOpen);
        }
        event.preventDefault();
        break;
      case 'Home':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getFirstDropdownVirtualFocusId() ?? prev);
          event.preventDefault();
        } else {
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => getFirstFieldVirtualFocusId() ?? prev);
            event.preventDefault();
          }
        }
        break;
      case 'End':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setVirtualFocusId(prev => getLastDropdownVirtualFocusId() ?? prev);
          event.preventDefault();
        } else {
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => getLastFieldVirtualFocusId() ?? prev);
            event.preventDefault();
          }
        }
        break;
      case 'Enter':
        if (!virtualFocusId || isVirtualFocusInField(virtualFocusId)) {
          const chipId = filterChips(selectedNodes, type)
            ?.find(node => isFocused(node.id, FIELD_PREFIX, virtualFocusId))
            ?.id;
          if (chipId) {
            handleChipClick(chipId)(event);
          } else {
            toggleDropdown(!isDropdownOpen);
          }
        } else {
          if (isFocused(SELECT_ALL_SUFFIX, DROPDOWN_PREFIX, virtualFocusId)) {
            handleSelectAllChange();
          } else {
            handleNodeChange(extractElementId(virtualFocusId))(event);
          }
        }
        event.preventDefault();
        break;
      case 'Backspace':
        if (!isSearchMode && isVirtualFocusInField(virtualFocusId) && !isFocused(INPUT_SUFFIX, FIELD_PREFIX, virtualFocusId)) {
          if (isFocused(CLEAR_ALL_SUFFIX, FIELD_PREFIX, virtualFocusId)) {
            handleDeleteAll(event);
          } else {
            handleNodeDelete(extractElementId(virtualFocusId))(event);
          }
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (isDropdownOpen) {
          toggleDropdown(false);
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
      // if component received focus by pressing Tab button, then input should be virtually focused
      setTimeout(() => {
        setVirtualFocusId(prev => prev ?? findFieldVirtualFocusId(buildVirtualFocusId(INPUT_SUFFIX, FIELD_PREFIX)));
      }, 0);
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
        isDropdownOpen={isDropdownOpen}
        withClearAll={withClearAll}
        showClearAll={showClearAll}
        withChipClear={withChipClear}
        virtualFocusId={virtualFocusId}
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
      {isDropdownOpen ? (
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
          virtualFocusId={virtualFocusId}
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
