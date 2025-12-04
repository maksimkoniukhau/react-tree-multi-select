import {TreeNode, Type} from './types';
import {SelectionState} from './innerTypes';
import {PATH_DELIMITER} from './constants';
import {convertTreeArrayToFlatArray} from './utils/nodesUtils';
import {Node} from './Node';

export class NodesManager {

  private _type: Type;

  private _nodeMap: Map<string, Node>;

  // original tree structure
  private _roots: Node[];

  // flat structure
  private _nodes: Node[];

  private _selectionState: SelectionState;

  constructor(data: TreeNode[], type: Type, searchValue: string) {
    this.initialize(data, type, searchValue);
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get selectionState(): SelectionState {
    return this._selectionState;
  }

  public areAllEffectivelySelected = (): boolean => {
    return this._roots.every(root => root.effectivelySelected);
  };

  public getSize = (): number => {
    return this._nodes.length;
  };

  public getDisplayed = (isSearchMode: boolean): Node[] => {
    return this._nodes.filter(node => node.isDisplayed(isSearchMode));
  };

  public getSelected = (): Node[] => {
    return this._nodes.filter(node => node.selected);
  };

  public getExpanded = (): Node[] => {
    return this._nodes.filter(node => node.expanded);
  };

  public isAnyHasChildren = (): boolean => {
    return this._nodes.some(node => node.hasChildren());
  };

  public isAnySelectedExcludingDisabled = (): boolean => {
    return this._nodes
      .filter(node => !node.disabled)
      .some(node => node.selected);
  };

  public deselectAll = (): void => {
    this._nodes.forEach(node => node.handleUnselect(this._type));
  };

  public setAllSelected = (select: boolean): void => {
    this._nodes.forEach(node => {
      if (select) {
        node.handleSelect(this._type);
      } else {
        node.handleUnselect(this._type);
      }
    });
  };

  public syncSelectedIds = (propsSelectedIds: Set<string>): void => {
    this._nodes.forEach(node => {
      node.setExplicitSelection(propsSelectedIds.has(node.id));
    });
    this._roots.forEach(node => node.computeSelectionState(node, this._type));

    this._selectionState = this.computeSelectionState(propsSelectedIds);
  };

  private computeSelectionState = (propsSelectedIds: Set<string>): SelectionState => {
    if (this._type === Type.TREE_SELECT) {
      return this.computeHierarchicalSelectionState(propsSelectedIds);
    } else {
      return this.computeFlatSelectionState(propsSelectedIds);
    }
  };

  private computeFlatSelectionState = (propsSelectedIds: Set<string>): SelectionState => {
    return {
      selectedIds: new Set(propsSelectedIds),
      effectivelySelectedIds: new Set(propsSelectedIds),
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  private computeHierarchicalSelectionState = (propsSelectedIds: Set<string>): SelectionState => {
    const allSelectedIds = new Set<string>();
    const allEffectivelySelectedIds = new Set<string>();
    const allPartiallySelectedIds = new Set<string>();
    const allSomeDescendantSelectedIds = new Set<string>();

    for (const root of this._roots) {
      const nodesSelectionState = this.computeRootHierarchicalSelectionState(root, propsSelectedIds);
      for (const id of nodesSelectionState.selectedIds) {
        allSelectedIds.add(id);
      }
      for (const id of nodesSelectionState.effectivelySelectedIds) {
        allEffectivelySelectedIds.add(id);
      }
      for (const id of nodesSelectionState.partiallySelectedIds) {
        allPartiallySelectedIds.add(id);
      }
      for (const id of nodesSelectionState.someDescendantSelectedIds) {
        allSomeDescendantSelectedIds.add(id);
      }
    }
    return {
      selectedIds: allSelectedIds,
      effectivelySelectedIds: allEffectivelySelectedIds,
      partiallySelectedIds: allPartiallySelectedIds,
      someDescendantSelectedIds: allSomeDescendantSelectedIds
    };
  };

  private computeRootHierarchicalSelectionState = (root: Node, propsSelectedIds: Set<string>): SelectionState => {
    const selectedIds = new Set<string>;
    const effectivelySelectedIds = new Set<string>;
    const partiallySelectedIds = new Set<string>;
    const someDescendantSelectedIds = new Set<string>;

    function computeHierarchicalSelection(node: Node, newSelectedIds: Set<string>): void {
      const children = node.children ?? [];

      for (const child of children) {
        computeHierarchicalSelection(child, newSelectedIds);
      }

      const selected = newSelectedIds.has(node.id);

      if (selected) {
        selectedIds.add(node.id);
      }

      if (children.length === 0) {
        if (selected || node.disabled) {
          effectivelySelectedIds.add(node.id);
        }
      } else {
        const someDescendantSelected = node.children
          .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
        const allChildrenEffectivelySelected = node.children
          .every(child => effectivelySelectedIds.has(child.id));
        const allChildrenSelected = node.children.every(child => selectedIds.has(child.id));

        if (allChildrenEffectivelySelected) {
          effectivelySelectedIds.add(node.id);
        }
        if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
          partiallySelectedIds.add(node.id);
        }
        if (someDescendantSelected) {
          someDescendantSelectedIds.add(node.id);
        }
      }
    }

    computeHierarchicalSelection(root, propsSelectedIds);

    return {selectedIds, effectivelySelectedIds, partiallySelectedIds, someDescendantSelectedIds};
  };

  public syncExpandedIds = (expandedIds: Set<string>, isSearchMode: boolean): void => {
    this._nodes.forEach(node => {
      node.handleExpand(isSearchMode, expandedIds.has(node.id));
    });
  };

  public handleSearch = (value: string): void => {
    this._nodes.forEach(node => node.handleSearch(value));
  };

  public resetSearch = (): void => {
    this._nodes.forEach(node => node.resetSearch());
  };

  public setSelected = (node: Node, select: boolean): void => {
    if (this._type === Type.SELECT) {
      const selectedNodes = this.getSelected();
      if (selectedNodes.length > 0 && selectedNodes.every(selectedNode => selectedNode.disabled)) {
        return;
      }
      selectedNodes.forEach(node => node.handleUnselect(this._type));
    }
    if (select) {
      node.handleSelect(this._type);
    } else {
      node.handleUnselect(this._type);
    }
  };

  public computeSelected = (node: Node, select: boolean): SelectionState => {
    if (node.disabled) {
      return this.selectionState;
    }
    if (this._type === Type.SELECT) {
      const selectedIds = this.selectionState.selectedIds;
      if (selectedIds.size > 0 && selectedIds.values().every(id => this._nodeMap.get(id)?.disabled)) {
        return this.selectionState;
      }
      return {
        selectedIds: select ? new Set(node.id) : new Set(),
        effectivelySelectedIds: select ? new Set(node.id) : new Set(),
        partiallySelectedIds: new Set(),
        someDescendantSelectedIds: new Set()
      };
    } else {
      if (select) {
        return this.computeSelect(node);
      } else {
        return this.computeDeselect(node);
      }
    }
  };

  private computeSelect = (node: Node): SelectionState => {
    if (node.disabled) {
      return this.selectionState;
    }
    if (this._type === Type.TREE_SELECT) {
      return this.computeTreeNodeSelected(node, true);
    } else {
      return {
        selectedIds: new Set(this.selectionState.selectedIds).add(node.id),
        effectivelySelectedIds: new Set(this.selectionState.effectivelySelectedIds).add(node.id),
        partiallySelectedIds: new Set(),
        someDescendantSelectedIds: new Set()
      };
    }
  };

  private computeDeselect = (node: Node): SelectionState => {
    if (node.disabled) {
      return this.selectionState;
    }
    if (this._type === Type.TREE_SELECT) {
      return this.computeTreeNodeSelected(node, false);
    } else {
      const newSelectedIds = new Set(this.selectionState.selectedIds);
      newSelectedIds.delete(node.id);
      const newEffectivelySelectedIds = new Set(this.selectionState.effectivelySelectedIds);
      newEffectivelySelectedIds.delete(node.id);
      return {
        selectedIds: newEffectivelySelectedIds,
        effectivelySelectedIds: newEffectivelySelectedIds,
        partiallySelectedIds: new Set(),
        someDescendantSelectedIds: new Set()
      };
    }
  };

  private computeTreeNodeSelected = (node: Node, select: boolean): SelectionState => {
    const newSelectedIds = new Set(this.selectionState.selectedIds);
    this.setExplicitSelectedSubtree(node, newSelectedIds, select);
    this.setExplicitSelectedAncestors(node, newSelectedIds, select);
    return this.computeSelectionState(newSelectedIds);
  };

  private setExplicitSelectedSubtree = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    for (const child of node.children) {
      this.setExplicitSelectedSubtree(child, selectedIds, select);
    }
    if (!node.disabled) {
      if (select) {
        selectedIds.add(node.id);
      } else {
        selectedIds.delete(node.id);
      }
    }
  };

  private setExplicitSelectedAncestors = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    const parentNode = node.parent;
    if (parentNode) {
      const allChildrenSelected = parentNode.children.every(child => selectedIds.has(child.id));
      if (select) {
        if (allChildrenSelected) {
          selectedIds.add(parentNode.id);
        }
      } else {
        if (!allChildrenSelected) {
          selectedIds.delete(parentNode.id);
        }
      }
      this.setExplicitSelectedAncestors(parentNode, selectedIds, select);
    }
  };

  public handleExpand = (node: Node, isSearchMode: boolean, expand: boolean): void => {
    node.handleExpand(isSearchMode, expand);
  };

  public findById = (id: string): Node | undefined => {
    return this._nodeMap.get(id);
  };

  private initialize = (data: TreeNode[], type: Type, searchValue: string) => {
    this._type = type;
    this._nodeMap = new Map<string, Node>();
    this._roots = [];
    this._nodes = [];

    data.forEach((treeNode, index) => {
      const node = this.mapTreeNodeToNode(treeNode, index.toString(), null, this._nodeMap);
      this._roots.push(node);
    });

    this._nodes = this._roots;

    if (this._type === Type.TREE_SELECT || this._type === Type.TREE_SELECT_FLAT) {
      this._nodes = convertTreeArrayToFlatArray(this._roots);
    }
    this._nodes.forEach(node => {
      node.handleSearch(searchValue);
    });
  };

  private mapTreeNodeToNode = (
    treeNode: TreeNode,
    path: string,
    parentId: string | null,
    nodeMap: Map<string, Node>
  ): Node => {
    const children = treeNode.children?.map((child, index) => {
      return this.mapTreeNodeToNode(child, `${path}${PATH_DELIMITER}${index}`, null, nodeMap);
    }) || [];

    const id = treeNode.id;
    const skipDropdownVirtualFocus = treeNode.skipDropdownVirtualFocus ?? false;
    const childrenIds = children.map(child => child.id);

    const node: Node = new Node(
      nodeMap,
      path,
      id,
      treeNode.label,
      skipDropdownVirtualFocus,
      parentId,
      childrenIds,
      path.split(PATH_DELIMITER).length - 1,
      treeNode.disabled ?? false,
      treeNode
    );

    // After creating current Node, assign its parent to all children
    children.forEach(child => child.parentId = node.id);

    nodeMap.set(id, node);

    return node;
  };
}
