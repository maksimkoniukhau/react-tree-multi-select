import './styles/tree-multi-select.scss';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {
  CLEAR_ALL_SUFFIX,
  DROPDOWN_PREFIX,
  FIELD_PREFIX,
  FOOTER_SUFFIX,
  INPUT_SUFFIX,
  SELECT_ALL_SUFFIX,
  SelectionAggregateState,
  TreeMultiSelectHandle,
  TreeMultiSelectProps,
  TreeNode,
  Type,
  VirtualFocusId
} from './types';
import {InnerComponents, NullableVirtualFocusId} from './innerTypes';
import {DEFAULT_DROPDOWN_MAX_HEIGHT, INPUT_PLACEHOLDER, NO_DATA_TEXT, NO_MATCHES_TEXT, OVERSCAN} from './constants';
import {areSetsEqual, classNames, getFieldFocusableElement} from './utils/commonUtils';
import {
  calculateSelectionAggregateState,
  filterChips,
  getOrderedIds,
  normalizeExpandedIds,
  normalizeSelectedIds
} from './utils/nodesUtils';
import {getKeyboardConfig, shouldRenderSelectAll} from './utils/componentUtils';
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
import {DropdownContainer} from './components/Dropdown';

export const TreeMultiSelect = forwardRef(
  <T extends TreeNode<T>>(
    props: TreeMultiSelectProps<T>,
    ref: React.Ref<TreeMultiSelectHandle<T>>
  ) => {
    const {
      data,
      type = Type.TREE_SELECT,
      selectedIds: propsSelectedIds,
      defaultSelectedIds,
      expandedIds: propsExpandedIds,
      defaultExpandedIds,
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
      isDropdownOpen: propsIsDropdownOpen,
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
      onDropdownLastItemReached,
      onLoadData,
      onLoadChildren
    } = props;

    const treeMultiSelectRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLDivElement>(null);
    const fieldInputRef = useRef<HTMLInputElement>(null);
    const dropdownInputRef = useRef<HTMLInputElement>(null);

    const isComponentFocused = useRef<boolean>(false);

    const nodesManager = useRef<NodesManager<T>>(null!);
    if (!nodesManager.current) {
      nodesManager.current = new NodesManager<T>([], type, '');
    }

    const isDropdownOpenControlled = propsIsDropdownOpen !== undefined;
    const isSelectedIdsControlled = propsSelectedIds !== undefined;
    const isExpandedIdsControlled = propsExpandedIds !== undefined;

    const [selectedIds, setSelectedIds] = useState<string[]>(
      () => normalizeSelectedIds(isSelectedIdsControlled ? propsSelectedIds : defaultSelectedIds, type)
    );
    const [expandedIds, setExpandedIds] = useState<string[]>(
      () => normalizeExpandedIds(isExpandedIdsControlled ? propsExpandedIds : defaultExpandedIds, type)
    );
    const [loadedIds, setLoadedIds] = useState<Set<string>>(() => new Set());
    const [displayedNodes, setDisplayedNodes] = useState<Node[]>([]);
    const [selectionAggregateState, setSelectionAggregateState] = useState<SelectionAggregateState>(
      SelectionAggregateState.NONE
    );
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
      if (isDropdownOpenControlled) {
        setIsDropdownOpen(propsIsDropdownOpen);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsIsDropdownOpen]);

    const isAnyNodeDisplayed = displayedNodes.length > 0;
    const isAnyNodeSelected = selectedIds.length > 0;

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
      if (!isDropdownOpenControlled) {
        setIsDropdownOpen(isOpen);
      }
      onDropdownToggle?.(isOpen);
    }, [isDisabled, isDropdownOpenControlled, onDropdownToggle]);

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
    }, [selectedIds]);

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
      const virtualFocusElement = treeMultiSelectRef.current?.querySelector(
        `[data-rtms-virtual-focus-id='${virtualFocusId}']`
      );
      if (!virtualFocusElement) {
        return;
      }
      virtualFocusElement.classList.add('focused');
      return () => virtualFocusElement.classList.remove('focused');
    }, [virtualFocusId]);

    useEffect(() => {
      nodesManager.current = new NodesManager<T>(data, type, searchValue);
      nodesManager.current.syncSelectedIds(new Set(normalizeSelectedIds(selectedIds, type)));
      nodesManager.current.syncExpandedIds(new Set(normalizeExpandedIds(expandedIds, type)), isSearchMode);

      const newDisplayedNodes = nodesManager.current.getDisplayed(
        isSearchMode, nodesManager.current.expansionState
      );
      const newSelectionAggregateState = calculateSelectionAggregateState(
        [...nodesManager.current.selectionState.selectedIds],
        [...nodesManager.current.selectionState.effectivelySelectedIds],
        nodesManager.current.nodes
      );

      setSelectedIds(getOrderedIds(nodesManager.current.selectionState.selectedIds, nodesManager.current));
      setDisplayedNodes(newDisplayedNodes);
      setSelectionAggregateState(newSelectionAggregateState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, type]);

    useEffect(() => {
      if (isSelectedIdsControlled) {
        const prevSelectedIds = new Set(selectedIds);
        const newSelectedIds = new Set(normalizeSelectedIds(propsSelectedIds, type));
        if (areSetsEqual(prevSelectedIds, newSelectedIds)) {
          return;
        }
        nodesManager.current.syncSelectedIds(newSelectedIds);
        const newSelectionAggregateState = calculateSelectionAggregateState(
          [...nodesManager.current.selectionState.selectedIds],
          [...nodesManager.current.selectionState.effectivelySelectedIds],
          nodesManager.current.nodes
        );
        setSelectedIds(getOrderedIds(nodesManager.current.selectionState.selectedIds, nodesManager.current));
        setSelectionAggregateState(newSelectionAggregateState);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsSelectedIds]);

    useEffect(() => {
      if (isExpandedIdsControlled) {
        const prevExpandedIds = new Set(expandedIds);
        const newExpandedIds = new Set(normalizeExpandedIds(propsExpandedIds, type));
        if (areSetsEqual(prevExpandedIds, newExpandedIds)) {
          return;
        }
        nodesManager.current.syncExpandedIds(newExpandedIds, isSearchMode);
        setExpandedIds(getOrderedIds(
          isSearchMode
            ? nodesManager.current.expansionState.searchExpandedIds
            : nodesManager.current.expansionState.expandedIds,
          nodesManager.current
        ));
        setDisplayedNodes(nodesManager.current.getDisplayed(isSearchMode, nodesManager.current.expansionState));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsExpandedIds]);

    const resetState = useCallback(() => {
      if (isDisabled) {
        return;
      }
      if (isDropdownOpen || isSearchMode || virtualFocusId) {
        nodesManager.current.resetSearch();
        const newDisplayedNodes = nodesManager.current.getDisplayed(false, nodesManager.current.expansionState);
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

    const callClearAllHandler = useCallback(
      (selectionAggregateState: SelectionAggregateState, selectedIds: string[]): void => {
        if (onClearAll) {
          onClearAll(selectedIds, selectionAggregateState);
        }
      },
      [onClearAll]
    );

    const handleDeleteAllRef = useRef<(event: React.MouseEvent | React.KeyboardEvent) => void>(null);
    handleDeleteAllRef.current = (event: React.MouseEvent | React.KeyboardEvent): void => {
      if (isDisabled) {
        return;
      }
      event.preventDefault();

      const selectionState = nodesManager.current.computeAllSelected(false, !isSelectedIdsControlled);
      const newSelectedIds = getOrderedIds(selectionState.selectedIds, nodesManager.current);
      const newSelectionAggregateState = calculateSelectionAggregateState(
        newSelectedIds, [...selectionState.effectivelySelectedIds], nodesManager.current.nodes
      );
      if (!isSelectedIdsControlled) {
        setSelectedIds(newSelectedIds);
        setSelectionAggregateState(newSelectionAggregateState);
        setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));
      }
      callClearAllHandler(newSelectionAggregateState, newSelectedIds);
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

      const newDisplayedNodes = nodesManager.current.getDisplayed(Boolean(value), nodesManager.current.expansionState);

      setDisplayedNodes(newDisplayedNodes);
      setSearchValue(value);
      setVirtualFocusId(findFieldVirtualFocusId(buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX)));
    };

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
      handleInputChangeRef.current?.(event);
    }, []);

    const callSelectAllChangeHandler = useCallback(
      (selectionAggregateState: SelectionAggregateState, selectedIds: string[]): void => {
        if (onSelectAllChange) {
          onSelectAllChange(selectedIds, selectionAggregateState);
        }
      },
      [onSelectAllChange]
    );

    const setAllSelectedRef = useRef<(selectAll: boolean) => void>(null);
    setAllSelectedRef.current = (selectAll: boolean): void => {
      if (isDisabled) {
        return;
      }
      if (!(type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT)) {
        return;
      }

      const selectionState = nodesManager.current.computeAllSelected(selectAll, !isSelectedIdsControlled);
      const newSelectedIds = getOrderedIds(selectionState.selectedIds, nodesManager.current);
      const newSelectionAggregateState = calculateSelectionAggregateState(
        newSelectedIds, [...selectionState.effectivelySelectedIds], nodesManager.current.nodes
      );
      if (!isSelectedIdsControlled) {
        setSelectedIds(newSelectedIds);
        setSelectionAggregateState(newSelectionAggregateState);
      }
      callSelectAllChangeHandler(newSelectionAggregateState, newSelectedIds);
    };

    const setAllSelected = useCallback((selectAll: boolean): void => {
      setAllSelectedRef.current?.(selectAll);
    }, []);

    const toggleAllSelectionRef = useRef<() => void>(null);
    toggleAllSelectionRef.current = (): void => {
      if (isDisabled) {
        return;
      }
      const shouldBeUnselected = nodesManager.current.areAllEffectivelySelected();
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

    const callNodeToggleHandler = useCallback((toggledNode: Node, expandedIds: string[]): void => {
      if (onNodeToggle) {
        const toggledTreeNode = toggledNode.initTreeNode;
        onNodeToggle(toggledTreeNode, expandedIds);
      }
    }, [onNodeToggle]);

    const callNodeChangeHandler = useCallback((changedNode: Node, selectedIds: string[]): void => {
      if (onNodeChange && !changedNode.disabled) {
        const changedTreeNode = changedNode.initTreeNode;
        onNodeChange(changedTreeNode, selectedIds);
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

    const applyNodeSelectedRef = useRef<(id: string, select: boolean) => void>(null);
    applyNodeSelectedRef.current = (id: string, select: boolean): void => {
      if (isDisabled) {
        return;
      }
      const node = nodesManager.current.findById(id);
      if (!node) {
        return;
      }

      const selectionState = nodesManager.current.computeSelected(node, select, !isSelectedIdsControlled);
      const newSelectedIds = getOrderedIds(selectionState.selectedIds, nodesManager.current);
      const newSelectionAggregateState = calculateSelectionAggregateState(
        newSelectedIds, [...selectionState.effectivelySelectedIds], nodesManager.current.nodes
      );
      if (!isSelectedIdsControlled) {
        setSelectedIds(newSelectedIds);
        setSelectionAggregateState(newSelectionAggregateState);
      }
      callNodeChangeHandler(node, newSelectedIds);
    };

    const applyNodeSelected = useCallback((id: string, select: boolean): void => {
      applyNodeSelectedRef.current?.(id, select);
    }, []);

    const setNodeSelectedRef = useRef<(id: string, select: boolean) => void>(null);
    setNodeSelectedRef.current = (id: string, select: boolean): void => {
      if (isDisabled) {
        return;
      }
      const node = nodesManager.current.findById(id);
      if (!node || node.disabled || nodesManager.current.selectionState.effectivelySelectedIds.has(node.id) === select) {
        return;
      }

      applyNodeSelected(node.id, select);
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
      if (!node || node.disabled
        || (type === Type.SINGLE_SELECT && nodesManager.current.selectionState.effectivelySelectedIds.has(node.id))) {
        return;
      }

      if (nodesManager.current.selectionState.effectivelySelectedIds.has(node.id)) {
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
    setNodeExpandedRef.current = async (id: string, expand: boolean): Promise<void> => {
      if (isDisabled) {
        return;
      }
      const node = nodesManager.current.findById(id);
      if (!(type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT) || !node || !node.canExpand()
        || ((isSearchMode && nodesManager.current.expansionState.searchExpandedIds.has(node.id) === expand)
          || (!isSearchMode && nodesManager.current.expansionState.expandedIds.has(node.id) === expand))) {
        return;
      }
      if (loadedIds.has(node.id)) {
        return;
      }

      const expansionState = nodesManager.current.computeExpanded(node, expand, isSearchMode, !isExpandedIdsControlled);
      const newExpandedIds = getOrderedIds(
        isSearchMode ? expansionState.searchExpandedIds : expansionState.expandedIds,
        nodesManager.current
      );
      if (!isExpandedIdsControlled) {
        setExpandedIds(newExpandedIds);
        setDisplayedNodes(nodesManager.current.getDisplayed(isSearchMode, expansionState));
      }
      callNodeToggleHandler(node, newExpandedIds);

      if (!node.hasLoadedChildren() && node.hasChildren && !node.hasLoaded && !loadedIds.has(node.id)) {
        setLoadedIds(prev => {
          const next = new Set(prev);
          next.add(node.id);
          return next;
        });
        try {
          const newChildren = await onLoadChildren?.(node.id) ?? [];
          nodesManager.current.appendChildren(node, newChildren, searchValue);

          if (
            newChildren.length > 0
            && !isSelectedIdsControlled
            && nodesManager.current.selectionState.selectedIds.has(node.id)
          ) {
            applyNodeSelected(node.id, true);
          }
        } finally {
          setLoadedIds(prev => {
            const next = new Set(prev);
            next.delete(node.id);
            return next;
          });
        }
        setDisplayedNodes(nodesManager.current.getDisplayed(isSearchMode, nodesManager.current.expansionState));
      }
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
        ? !nodesManager.current.expansionState.searchExpandedIds.has(node.id)
        : !nodesManager.current.expansionState.expandedIds.has(node.id);
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
            const chipId = filterChips(nodesManager.current)
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

    const handleLoadData = async (): Promise<void> => {
      const newData = await onLoadData?.();
      if (!newData || newData.length === 0) {
        return;
      }
      nodesManager.current.appendData(newData, searchValue);
      const newDisplayedNodes = nodesManager.current.getDisplayed(isSearchMode, nodesManager.current.expansionState);
      setDisplayedNodes(newDisplayedNodes);
    };

    useImperativeHandle(ref, (): TreeMultiSelectHandle<T> => ({
      getState: () => ({
        selectionAggregateState,
        inputValue: searchValue,
        isDropdownOpen,
        virtualFocusId
      }),
      getById: (id: string) => nodesManager.current.findById(id)?.initTreeNode,
      loadData: async () => await handleLoadData(),
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

    const dataRtmsType = useMemo(() => type.toLowerCase().replaceAll('_', '-'), [type]);
    const rootClasses = useMemo(() => {
      return classNames('rtms-tree-multi-select', isDisabled && 'disabled', className);
    }, [isDisabled, className]);

    return (
      <div
        data-rtms-type={dataRtmsType}
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
          nodesManager={nodesManager.current}
          selectedIds={selectedIds}
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
            displayedNodes={displayedNodes}
            selectedIds={selectedIds}
            expandedIds={expandedIds}
            loadedIds={loadedIds}
            isAnyCanExpand={nodesManager.current.isAnyCanExpand()}
            isSearchable={isSearchable}
            withDropdownInput={withDropdownInput}
            inputPlaceholder={inputPlaceholder}
            searchValue={searchValue}
            showSelectAll={showSelectAll}
            selectionAggregateState={selectionAggregateState}
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
