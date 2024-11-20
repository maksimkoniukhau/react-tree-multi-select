import './tree-select.scss';

import React, {useCallback, useEffect, useReducer, useRef} from 'react';

import {CLEAR_ALL, INPUT, INPUT_PLACEHOLDER, PATH_DELIMITER, SELECT_ALL} from './constants';
import {areAllExcludingDisabledSelected, convertTreeArrayToFlatArray, filterChips, isAnyHasChildren} from './utils';
import {CheckedState, TreeNode, Type} from './models';
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
  ToggleAllPayload,
  ToggleDropdownPayload,
  TogglePayload,
  UnselectAllPayload,
  UnselectPayload
} from './reducer';
import {Field} from './Field';
import {Dropdown} from './Dropdown';
import {Node} from './Node';

export interface TreeSelectProps {
  data: TreeNode[];
  type?: Type;
  id?: string;
  className?: string;
  inputPlaceholder?: string;
  withClearAll?: boolean;
  withSelectAll?: boolean;
  onNodeChange?: (node: TreeNode, selectedNodes: TreeNode[]) => void;
  onNodeToggle?: (node: TreeNode, expandedNodes: TreeNode[]) => void;
  onClearAll?: (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]) => void;
  onSelectAllChange?: (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]) => void;
}

export const TreeSelect: React.FC<TreeSelectProps> = (props) => {
  const {
    data = [],
    type = Type.MULTI_SELECT_TREE,
    id = '',
    className = '',
    inputPlaceholder = INPUT_PLACEHOLDER,
    withClearAll = true,
    withSelectAll = false,
    onNodeChange,
    onNodeToggle,
    onClearAll,
    onSelectAllChange
  } = props;

  const treeSelectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nodeMapRef = useRef<Map<string, Node>>(new Map());

  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);

  const dispatchToggleDropdown = (showDropdown: boolean): void => {
    dispatch({
      type: ActionType.TOGGLE_DROPDOWN,
      payload: {showDropdown} as ToggleDropdownPayload
    });
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
      nodePath.split(PATH_DELIMITER).length,
      expanded,
      initTreeNode
    );

    node.children = children.map((child, idx) => mapTreeNodeToNode(child, idx.toString(), node));

    nodeMapRef.current.set(nodePath, node);

    return node;
  };

  const getSelectAllCheckedState = (selectedNodes: Node[], allNodes: Node[]): CheckedState => {
    return selectedNodes.length === allNodes.length
      ? CheckedState.SELECTED
      : selectedNodes.length === 0
        ? CheckedState.UNSELECTED
        : CheckedState.PARTIAL;
  };

  useEffect(() => {
    const nodeTree: Node[] = [];
    data.forEach((treeNode, index) => {
      nodeTree.push(mapTreeNodeToNode(treeNode, index.toString(), null));
    });

    const nodes = convertTreeArrayToFlatArray(nodeTree);

    nodes.forEach(node => {
      if (node.initTreeNode.selected) {
        // handleSelect (not handleToggle) should be used!!!
        node.handleSelect(type);
      }
    });
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
        selectAllCheckedState: getSelectAllCheckedState(selectedNodes, nodes)
      } as InitPayload
    });
  }, [data]);

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

  const handleClickField = (e: React.MouseEvent<Element>): void => {
    dispatchToggleDropdown(!state.showDropdown);
  };

  const callClearAllHandler = (selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onClearAll) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onClearAll(selectAllCheckedState, selectedTreeNodes);
    }
  };

  const handleDeleteAll = useCallback((e: React.MouseEvent<Element> | React.KeyboardEvent<Element>): void => {
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
        displayedNodes
      } as ChangeInputPayload
    });
  }, [state.nodes]);

  const callSelectAllChangeHandler = (selectAllCheckedState: CheckedState, selectedNodes: Node[]): void => {
    if (onSelectAllChange) {
      const selectedTreeNodes = selectedNodes.map(node => node.toTreeNode());
      onSelectAllChange(selectAllCheckedState, selectedTreeNodes);
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

  const handleChangeSelectAll = (e: React.MouseEvent<Element>): void => {
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

  const handleClickChip = useCallback((node: Node) => (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>): void => {
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

  }, [state.displayedNodes, state.showDropdown]);

  const handleDeleteNode = useCallback((node: Node) => (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>): void => {
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

  const handleToggleNode = useCallback((node: Node) => (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>): void => {
    node.handleToggle(type);

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
  }, [state]);

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

  const handleClickExpandNode = useCallback((node: Node) => (e: React.MouseEvent<Element>): void => {
    const expand = state.searchValue
      ? !node.searchExpanded
      : !node.expanded;
    handleExpandNode(node, expand);
  }, [state]);

  const handleKeyDownExpandNode = (expand: boolean): void => {
    if (state.showDropdown && state.focusedElement && state.focusedElement !== SELECT_ALL) {
      const node = nodeMapRef.current.get(state.focusedElement);
      if (node?.hasChildren()) {
        handleExpandNode(node, expand);
      }
    }
  };

  const getFirstFocusedElement = (): string => {
    let focusedEl = '';
    if (withSelectAll) {
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
      if (index === 0 && withSelectAll) {
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

  const handleComponentKeyDown = (e: React.KeyboardEvent<Element>): void => {
    switch (e.key) {
      case 'ArrowLeft':
        if (!state.focusedFieldElement && state.focusedElement) {
          handleKeyDownExpandNode(false);
        } else if (!state.searchValue) {
          dispatch({
            type: ActionType.FOCUS_FIELD_ELEMENT,
            payload: {
              focusedFieldElement: getPrevFocusedFieldElement()
            } as FocusFieldElementPayload
          });
        }
        if (state.focusedElement) {
          e.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (!state.focusedFieldElement && state.focusedElement) {
          handleKeyDownExpandNode(true);
        } else if (!state.searchValue) {
          dispatch({
            type: ActionType.FOCUS_FIELD_ELEMENT,
            payload: {
              focusedFieldElement: getNextFocusedFieldElement()
            } as FocusFieldElementPayload
          });
        }
        if (state.focusedElement) {
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (state.showDropdown) {
          dispatch({
            type: ActionType.FOCUS_ELEMENT,
            payload: {
              focusedElement: getPrevFocusedElement()
            } as FocusElementPayload
          });
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (state.showDropdown) {
          dispatch({
            type: ActionType.FOCUS_ELEMENT,
            payload: {
              focusedElement: getNextFocusedElement()
            } as FocusElementPayload
          });
        }
        e.preventDefault();
        break;
      case 'Enter':
        if (!state.focusedElement) {
          const chipNode = filterChips(state.selectedNodes, type)
            ?.find(node => node.path === state.focusedFieldElement);
          if (chipNode) {
            // @ts-ignore
            handleClickChip(chipNode)(e);
          } else {
            dispatchToggleDropdown(!state.showDropdown);
          }
        } else if (state.showDropdown) {
          if (state.focusedElement === SELECT_ALL) {
            handleSelectAllNodes();
          } else {
            // @ts-ignore
            handleToggleNode(nodeMapRef.current?.get(state.focusedElement))(e);
          }
        }
        e.preventDefault();
        break;
      case 'Backspace':
        if (!state.searchValue && state.focusedFieldElement && state.focusedFieldElement !== INPUT) {
          if (state.focusedFieldElement === CLEAR_ALL) {
            handleDeleteAll(e);
          } else {
            // @ts-ignore
            handleDeleteNode(nodeMapRef.current?.get(state.focusedFieldElement))(e);
          }
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

  const containerClasses = 'rts-tree-select'
    + (!isAnyHasChildren(state.nodes) ? ' simple-select' : '')
    + (className ? ` ${className}` : '');

  useOnClickOutside(treeSelectRef, handleOutsideEvent);

  return (
    <div ref={treeSelectRef} id={id} className={containerClasses} onKeyDown={handleComponentKeyDown}>
      <Field
        inputRef={inputRef}
        type={type}
        nodes={state.nodes}
        selectedNodes={state.selectedNodes}
        showDropdown={state.showDropdown}
        withClearAll={withClearAll}
        inputPlaceholder={inputPlaceholder}
        searchValue={state.searchValue}
        focusedFieldElement={state.focusedFieldElement}
        onClickField={handleClickField}
        onChangeInput={handleChangeInput}
        onClickChip={handleClickChip}
        onDeleteNode={handleDeleteNode}
        onDeleteAll={handleDeleteAll}
      />
      {state.showDropdown ? (
        <Dropdown
          nodeMap={nodeMapRef.current}
          nodesAmount={state.nodes.length}
          displayedNodes={state.displayedNodes}
          searchValue={state.searchValue}
          withSelectAll={withSelectAll}
          selectAllCheckedState={state.selectAllCheckedState}
          focusedElement={state.focusedElement}
          onChangeSelectAll={handleChangeSelectAll}
          onToggleNode={handleToggleNode}
          onClickExpandNode={handleClickExpandNode}
        />
      ) : null}
    </div>
  );
};
