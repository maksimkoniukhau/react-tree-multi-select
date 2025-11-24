import './styles/tree-multi-select.scss';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {
  CheckedState,
  CLEAR_ALL_SUFFIX,
  DROPDOWN_PREFIX,
  FIELD_PREFIX,
  FOOTER_SUFFIX,
  INPUT_SUFFIX,
  SELECT_ALL_SUFFIX,
  TreeMultiSelectHandle,
  TreeMultiSelectProps,
  Type,
  VirtualFocusId
} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {DEFAULT_DROPDOWN_MAX_HEIGHT, INPUT_PLACEHOLDER, NO_DATA_TEXT, NO_MATCHES_TEXT, OVERSCAN} from './constants';
import {getFieldFocusableElement} from './utils/commonUtils';
import {filterChips, getSelectAllCheckedState} from './utils/nodesUtils';
import {getKeyboardConfig, shouldRenderSelectAll, typeToClassName} from './utils/componentUtils';
import {getComponents, hasCustomFooterComponent} from './utils/componentsUtils';
import {
  buildVirtualFocusId,
  extractElementId,
  isVirtualFocusInDropdown,
  isVirtualFocusInField
} from './utils/focusUtils';
import {NodesManager} from './NodesManager';
import {Node} from './Node';
import {FieldContainer} from './components/Field';
import {DropdownContainer} from './DropdownContainer';

export const TreeMultiSelect = forwardRef<TreeMultiSelectHandle, TreeMultiSelectProps>((props, ref) => {
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
    dropdownHeight = DEFAULT_DROPDOWN_MAX_HEIGHT,
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

  const nodesManager = useRef<NodesManager>(new NodesManager([], type, ''));

  const [displayedNodes, setDisplayedNodes] = useState<Node[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectAllCheckedState, setSelectAllCheckedState] = useState<CheckedState>(CheckedState.UNSELECTED);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [virtualFocusId, setVirtualFocusId] = useState<NullableVirtualFocusId>(null);
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

  const showClearAll = withClearAll && nodesManager.current.isAnySelectedExcludingDisabled();

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
      focusableElements.push(buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX));
    }
    focusableElements.push(...displayedNodes
      .filter(node => !node.skipDropdownVirtualFocus)
      .map(node => buildVirtualFocusId(DROPDOWN_PREFIX, node.id)));
    if (showFooter) {
      focusableElements.push(buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX));
    }
    return focusableElements;
  }, [displayedNodes, showSelectAll, showFooter]);

  const findDropdownVirtualFocusId = useCallback((virtualFocusId: VirtualFocusId): NullableVirtualFocusId => {
    return dropdownVirtualFocusIds.find(id => id === virtualFocusId) ?? null;
  }, [dropdownVirtualFocusIds]);

  const toggleDropdown = useCallback((isOpen: boolean): void => {
    if (isDisabled) {
      return;
    }
    if (openDropdown === undefined) {
      setIsDropdownOpen(isOpen);
    }
    onDropdownToggle?.(isOpen);
  }, [isDisabled, openDropdown, onDropdownToggle]);

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
          ?? fieldVirtualFocusIds.find(id => id === buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX))
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
        return fieldVirtualFocusIds.find(id => id === buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX))
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
    nodesManager.current = new NodesManager(data, type, searchValue);

    const newDisplayedNodes = nodesManager.current.getDisplayed(isSearchMode);
    const newSelectedNodes = nodesManager.current.getSelected();
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodesManager.current.nodes);

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
      nodesManager.current.resetSearch();
      const newDisplayedNodes = nodesManager.current.getDisplayed(false);
      setDisplayedNodes(newDisplayedNodes);
      toggleDropdown(false);
      setVirtualFocusId(null);
      setSearchValue('');
    }
  }, [isDisabled, isDropdownOpen, isSearchMode, virtualFocusId, toggleDropdown]);

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
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));
  };

  const handleFieldClick = useCallback((event: React.MouseEvent): void => {
    handleFieldClickRef.current?.(event);
  }, []);

  const callClearAllHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onClearAll) {
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onClearAll(selectedTreeNodes,
        type !== Type.SELECT ? selectAllCheckedState : undefined,
        nodesManager.current.copiedData);
    }
  }, [onClearAll, type]);

  const handleDeleteAllRef = useRef<(event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleDeleteAllRef.current = (event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    event.preventDefault();
    nodesManager.current.deselectAll();
    const newSelectedNodes = nodesManager.current.getSelected();
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodesManager.current.nodes);

    setSelectedNodes(newSelectedNodes);
    setSelectAllCheckedState(newSelectAllCheckedState);
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));

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

    nodesManager.current.handleSearch(value);

    const newDisplayedNodes = nodesManager.current.getDisplayed(Boolean(value));

    setDisplayedNodes(newDisplayedNodes);
    setSearchValue(value);
    setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));
  };

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    handleInputChangeRef.current?.(event);
  }, []);

  const callSelectAllChangeHandler = useCallback((selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onSelectAllChange(selectedTreeNodes, selectAllCheckedState, nodesManager.current.copiedData);
    }
  }, [onSelectAllChange]);

  const setAllSelectedRef = useRef<(selectAll: boolean) => void>(null);
  setAllSelectedRef.current = (selectAll: boolean): void => {
    if (isDisabled) {
      return;
    }
    if (!(type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT)) {
      return;
    }
    nodesManager.current.setAllSelected(selectAll);

    const newSelectedNodes = nodesManager.current.getSelected();
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodesManager.current.nodes);

    setSelectedNodes(newSelectedNodes);
    setSelectAllCheckedState(newSelectAllCheckedState);

    callSelectAllChangeHandler(newSelectAllCheckedState, newSelectedNodes);
  };

  const setAllSelected = useCallback((selectAll: boolean): void => {
    setAllSelectedRef.current?.(selectAll);
  }, []);

  const toggleAllSelectionRef = useRef<() => void>(null);
  toggleAllSelectionRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    const shouldBeUnselected = selectAllCheckedState === CheckedState.SELECTED
      || (selectAllCheckedState === CheckedState.PARTIAL && nodesManager.current.isEffectivelySelected());
    setAllSelected(!shouldBeUnselected);
  };

  const toggleAllSelection = useCallback((): void => {
    toggleAllSelectionRef.current?.();
  }, []);

  const handleSelectAllChangeRef = useRef<() => void>(null);
  handleSelectAllChangeRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX)) ?? prev);
    toggleAllSelection();
  };

  const handleSelectAllChange = useCallback((): void => {
    handleSelectAllChangeRef.current?.();
  }, []);

  const callNodeToggleHandler = useCallback((toggledNode: Node, expandedNodes: Node[]): void => {
    if (onNodeToggle) {
      const toggledTreeNode = toggledNode.initTreeNode;
      const expandedTreeNodes = expandedNodes.map(node => node.initTreeNode);
      onNodeToggle(toggledTreeNode, expandedTreeNodes, nodesManager.current.copiedData);
    }
  }, [onNodeToggle]);

  const callNodeChangeHandler = useCallback((changedNode: Node, selectedNodes: Node[]): void => {
    if (onNodeChange && !changedNode.disabled) {
      const changedTreeNode = changedNode.initTreeNode;
      const selectedTreeNodes = selectedNodes.map(node => node.initTreeNode);
      onNodeChange(changedTreeNode, selectedTreeNodes, nodesManager.current.copiedData);
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
    const node = nodesManager.current.findById(id);
    if (!node) {
      return;
    }
    event.preventDefault();
    toggleDropdown(!isDropdownOpen);
    setVirtualFocusId(prev => findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, node.id)) ?? prev);
  };

  const handleChipClick = useCallback((id: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleChipClickRef.current?.(id, event);
  }, []);

  const setNodeSelectedRef = useRef<(id: string, select: boolean) => void>(null);
  setNodeSelectedRef.current = (id: string, select: boolean): void => {
    if (isDisabled) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!node || node.disabled || node.effectivelySelected === select) {
      return;
    }

    if (type === Type.SELECT) {
      selectedNodes.forEach(node => node.handleUnselect(type));
    }
    if (select) {
      node.handleSelect(type);
    } else {
      node.handleUnselect(type);
    }

    const newSelectedNodes = nodesManager.current.getSelected();
    const newSelectAllCheckedState = getSelectAllCheckedState(newSelectedNodes, nodesManager.current.nodes);
    setSelectedNodes(newSelectedNodes);
    setSelectAllCheckedState(newSelectAllCheckedState);

    callNodeChangeHandler(node, newSelectedNodes);
  };

  const setNodeSelected = useCallback((id: string, select: boolean): void => {
    setNodeSelectedRef.current?.(id, select);
  }, []);

  const toggleNodeSelectionRef = useRef<(id: string) => void>(null);
  toggleNodeSelectionRef.current = (id: string): void => {
    if (isDisabled) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!node || node.disabled) {
      return;
    }

    if (node.effectivelySelected) {
      setNodeSelected(node.id, false);
    } else {
      setNodeSelected(node.id, true);
    }
  };

  const toggleNodeSelection = useCallback((id: string): void => {
    toggleNodeSelectionRef.current?.(id);
  }, []);

  const handleNodeDeleteRef = useRef<(id: string, event: React.MouseEvent | React.KeyboardEvent) => void>(null);
  handleNodeDeleteRef.current = (id: string, event: React.MouseEvent | React.KeyboardEvent): void => {
    if (isDisabled || !withChipClear) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!node || node.disabled) {
      return;
    }
    event.preventDefault();
    const prevFieldVirtualFocusId = getPrevFieldVirtualFocusId(virtualFocusId);
    const newFieldVirtualFocusId = (prevFieldVirtualFocusId === virtualFocusId) || (event.type === 'click')
      ? findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX))
      : prevFieldVirtualFocusId;
    setVirtualFocusId(newFieldVirtualFocusId);
    setNodeSelected(node.id, false);
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
    const node = nodesManager.current.findById(id);
    if (!node) {
      return;
    }
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(DROPDOWN_PREFIX, node.id)) ?? prev);
    if (!node.disabled) {
      toggleNodeSelection(node.id);
      toggleDropdown(closeDropdownOnNodeChange ? false : isDropdownOpen);
    }
  };

  const handleNodeChange = useCallback((id: string) => (event: React.MouseEvent | React.KeyboardEvent): void => {
    handleNodeChangeRef.current?.(id, event);
  }, []);

  const setNodeExpandedRef = useRef<(id: string, expand: boolean) => void>(null);
  setNodeExpandedRef.current = (id: string, expand: boolean): void => {
    if (isDisabled) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!(type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT) || !node || !node.hasChildren()
      || ((isSearchMode && node.searchExpanded === expand) || (!isSearchMode && node.expanded === expand))) {
      return;
    }

    node.handleExpand(isSearchMode, expand);

    const newDisplayedNodes = nodesManager.current.getDisplayed(isSearchMode);
    setDisplayedNodes(newDisplayedNodes);

    callNodeToggleHandler(node, nodesManager.current.getExpanded());
  };

  const setNodeExpanded = useCallback((id: string, expand: boolean): void => {
    setNodeExpandedRef.current?.(id, expand);
  }, []);

  const toggleNodeExpansionRef = useRef<(id: string) => void>(null);
  toggleNodeExpansionRef.current = (id: string): void => {
    if (isDisabled) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!node) {
      return;
    }

    const expand = isSearchMode
      ? !node.searchExpanded
      : !node.expanded;
    setNodeExpanded(node.id, expand);
  };

  const toggleNodeExpansion = useCallback((id: string): void => {
    toggleNodeExpansionRef.current?.(id);
  }, []);

  const handleNodeToggleOnClickRef = useRef<(id: string, event: React.MouseEvent) => void>(null);
  handleNodeToggleOnClickRef.current = (id: string, event: React.MouseEvent): void => {
    if (isDisabled) {
      return;
    }
    const node = nodesManager.current.findById(id);
    if (!node) {
      return;
    }
    event.preventDefault();
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(DROPDOWN_PREFIX, node.id)) ?? prev);
    toggleNodeExpansion(node.id);
  };

  const handleNodeToggleOnClick = useCallback((id: string) => (event: React.MouseEvent): void => {
    handleNodeToggleOnClickRef.current?.(id, event);
  }, []);

  const handleFooterClickRef = useRef<() => void>(null);
  handleFooterClickRef.current = (): void => {
    if (isDisabled) {
      return;
    }
    setVirtualFocusId(prev => findDropdownVirtualFocusId(buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX)) ?? prev);
  };

  const handleFooterClick = useCallback((): void => {
    handleFooterClickRef.current?.();
  }, []);

  const handleComponentClick = (): void => {
    if (!isComponentFocused.current) {
      focusComponentElement();
    }
  };

  const handleComponentKeyDown = (event: React.KeyboardEvent): void => {
    if (isDisabled) {
      return;
    }
    if (onKeyDown?.(event)) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setNodeExpanded(extractElementId(virtualFocusId), false);
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => {
              if (!prev) {
                const fieldVirtualFocusIds = getFieldVirtualFocusIds();
                if (fieldVirtualFocusIds.length === 0) {
                  return prev;
                }
                const inputVirtualFocusId = buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX);
                const inputIndex = fieldVirtualFocusIds.indexOf(inputVirtualFocusId);
                return inputIndex === -1
                  ? fieldVirtualFocusIds[fieldVirtualFocusIds.length - 1]
                  : inputIndex === 0 ? inputVirtualFocusId : fieldVirtualFocusIds[inputIndex - 1];
              }
              return getPrevFieldVirtualFocusId(prev) ?? prev;
            });
          }
        }
        break;
      case 'ArrowRight':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          setNodeExpanded(extractElementId(virtualFocusId), true);
          if (isSearchMode) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!isSearchMode || (withDropdownInput && !isDropdownOpen)) {
            setVirtualFocusId(prev => getNextFieldVirtualFocusId(prev)
              ?? getFirstFieldVirtualFocusId()
              ?? prev);
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
            ?.find(node => buildVirtualFocusId(FIELD_PREFIX, node.id) === virtualFocusId)
            ?.id;
          if (chipId) {
            handleChipClick(chipId)(event);
          } else {
            toggleDropdown(!isDropdownOpen);
          }
        } else {
          if (buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX) === virtualFocusId) {
            handleSelectAllChange();
          } else {
            handleNodeChange(extractElementId(virtualFocusId))(event);
          }
        }
        event.preventDefault();
        break;
      case 'Backspace':
        if (!isSearchMode && isVirtualFocusInField(virtualFocusId)
          && buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX) !== virtualFocusId) {
          if (buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX) === virtualFocusId) {
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
        setVirtualFocusId(prev => prev ?? findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));
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

  useImperativeHandle(ref, (): TreeMultiSelectHandle => ({
    getState: () => ({
      allNodesSelectionState: selectAllCheckedState,
      inputValue: searchValue,
      isDropdownOpen,
      virtualFocusId
    }),
    openDropdown: () => toggleDropdown(true),
    closeDropdown: () => toggleDropdown(false),
    toggleDropdown: () => toggleDropdown(!isDropdownOpen),
    selectAll: () => setAllSelected(true),
    deselectAll: () => setAllSelected(false),
    toggleAllSelection: () => toggleAllSelection(),
    expandNode: (id?: string) => {
      const nodeId = id ?? (isVirtualFocusInDropdown(virtualFocusId) ? extractElementId(virtualFocusId) : undefined);
      if (nodeId) {
        setNodeExpanded(nodeId, true);
      }
    },
    collapseNode: (id?: string) => {
      const nodeId = id ?? (isVirtualFocusInDropdown(virtualFocusId) ? extractElementId(virtualFocusId) : undefined);
      if (nodeId) {
        setNodeExpanded(nodeId, false);
      }
    },
    toggleNodeExpansion: (id?: string) => {
      const nodeId = id ?? (isVirtualFocusInDropdown(virtualFocusId) ? extractElementId(virtualFocusId) : undefined);
      if (nodeId) {
        toggleNodeExpansion(nodeId);
      }
    },
    selectNode: (id?: string) => setNodeSelected(id ?? extractElementId(virtualFocusId), true),
    deselectNode: (id?: string) => setNodeSelected(id ?? extractElementId(virtualFocusId), false),
    toggleNodeSelection: (id?: string) => toggleNodeSelection(id ?? extractElementId(virtualFocusId)),
    focusFirstItem: (region?: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX) => {
      if (region) {
        setVirtualFocusId(region === FIELD_PREFIX ? getFirstFieldVirtualFocusId() : getFirstDropdownVirtualFocusId());
      } else {
        setVirtualFocusId(prev => isVirtualFocusInField(prev)
          ? getFirstFieldVirtualFocusId()
          : isVirtualFocusInDropdown(prev) ? getFirstDropdownVirtualFocusId() : prev);
      }
    },
    focusLastItem: (region?: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX) => {
      if (region) {
        setVirtualFocusId(region === FIELD_PREFIX ? getLastFieldVirtualFocusId() : getLastDropdownVirtualFocusId());
      } else {
        setVirtualFocusId(prev => isVirtualFocusInField(prev)
          ? getLastFieldVirtualFocusId()
          : isVirtualFocusInDropdown(prev) ? getLastDropdownVirtualFocusId() : prev);
      }
    },
    focusPrevItem: (virtualFocusId?: VirtualFocusId) => {
      setVirtualFocusId(prev => {
        const focusId = virtualFocusId ?? prev;
        return isVirtualFocusInField(focusId)
          ? getPrevFieldVirtualFocusId(focusId)
          : isVirtualFocusInDropdown(focusId)
            ? getPrevDropdownVirtualFocusId(focusId)
            : prev
      });
    },
    focusNextItem: (virtualFocusId?: VirtualFocusId) => {
      setVirtualFocusId(prev => {
        const focusId = virtualFocusId ?? prev;
        return isVirtualFocusInField(focusId)
          ? getNextFieldVirtualFocusId(focusId)
          : isVirtualFocusInDropdown(focusId)
            ? getNextDropdownVirtualFocusId(focusId)
            : prev
      });
    }
  }));

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
          nodesManager={nodesManager.current}
          nodesAmount={nodesManager.current.getSize()}
          displayedNodes={displayedNodes}
          selectedNodes={selectedNodes}
          isAnyHasChildren={nodesManager.current.isAnyHasChildren()}
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
});
