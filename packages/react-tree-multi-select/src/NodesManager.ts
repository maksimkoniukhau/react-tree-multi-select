import {TreeNode, Type} from './types';
import {ExpansionState, SearchingState, SelectionState} from './innerTypes';
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

  private _expansionState: ExpansionState;

  private _searchingState: SearchingState;

  constructor(data: TreeNode[], type: Type, searchValue: string) {
    this.initialize(data, type, searchValue);
  }

  get type(): Type {
    return this._type;
  }

  private get nodeMap(): Map<string, Node> {
    return this._nodeMap;
  }

  private get roots(): Node[] {
    return this._roots;
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get selectionState(): SelectionState {
    return this._selectionState;
  }

  get expansionState(): ExpansionState {
    return this._expansionState;
  }

  get searchingState(): SearchingState {
    return this._searchingState;
  }

  public findById = (id: string): Node | undefined => {
    return this.nodeMap.get(id);
  };

  public syncSelectedIds = (selectedIds: Set<string>): void => {
    this._selectionState = this.computeSelectionState(selectedIds);
  };

  public syncExpandedIds = (expandedIds: Set<string>, isSearchMode: boolean): void => {
    this._expansionState = this.computeExpansionState(expandedIds, isSearchMode);
  };

  public areAllEffectivelySelected = (): boolean => {
    return this.roots.every(root => this.selectionState.effectivelySelectedIds.has(root.id));
  };

  public getSize = (): number => {
    return this.nodes.length;
  };

  public getDisplayed = (isSearchMode: boolean, expansionState: ExpansionState): Node[] => {
    return this.nodes.filter(node => this.isDisplayed(node, isSearchMode, expansionState));
  };

  private isDisplayed = (node: Node, isSearchMode: boolean, expansionState: ExpansionState): boolean => {
    return this.searchingState.filteredIds.has(node.id) && this.isVisible(node, isSearchMode, expansionState);
  };

  private isVisible = (node: Node, isSearchMode: boolean, expansionState: ExpansionState): boolean => {
    if (!node.parent) {
      return true;
    }
    return this.everyAncestor(
      node,
      ancestor => isSearchMode
        ? expansionState.searchExpandedIds.has(ancestor.id)
        : expansionState.expandedIds.has(ancestor.id)
    );
  };

  public isAnyHasChildren = (): boolean => {
    return this.nodes.some(node => node.hasChildren());
  };

  public isAnySelectedExcludingDisabled = (): boolean => {
    return this.nodes
      .filter(node => !node.disabled)
      .some(node => this.selectionState.selectedIds.has(node.id));
  };

  public handleSearch = (searchValue: string): void => {
    if (searchValue) {
      const newSearchExpandedIds = new Set<string>();
      const newSearchingState = {
        matchedIds: new Set<string>(),
        filteredIds: new Set<string>()
      };
      this.nodes.forEach(node => {
        if (node.name?.toLowerCase().includes(searchValue.toLowerCase())) {
          newSearchingState.matchedIds.add(node.id);
          newSearchingState.filteredIds.add(node.id);
          if (node.hasChildren()) {
            newSearchExpandedIds.add(node.id);
          }
          this.forEachAncestor(node, ancestor => {
            newSearchingState.filteredIds.add(ancestor.id);
            newSearchExpandedIds.add(ancestor.id);
          });
        }
      });
      this.expansionState.searchExpandedIds = newSearchExpandedIds;
      this._searchingState = newSearchingState;
    } else {
      this.resetSearch();
    }
  };

  public resetSearch = (): void => {
    const newSearchingState = {
      matchedIds: new Set<string>(),
      filteredIds: new Set<string>()
    }
    this.nodes.forEach(node => {
      newSearchingState.filteredIds.add(node.id);
    });
    this.expansionState.searchExpandedIds = new Set();
    this._searchingState = newSearchingState;
  };

  private computeExpansionState = (expandedIds: Set<string>, isSearchMode: boolean): ExpansionState => {
    const newExpandedIds = isSearchMode ? new Set(this.expansionState.expandedIds) : new Set(expandedIds);
    const newSearchExpandedIds = isSearchMode ? new Set(expandedIds) : new Set(this.expansionState.searchExpandedIds);
    return {
      expandedIds: newExpandedIds,
      searchExpandedIds: newSearchExpandedIds
    };
  };

  public computeExpanded = (node: Node, expand: boolean, isSearchMode: boolean, sync: boolean = false): ExpansionState => {
    const newExpandedIds = new Set(this.expansionState.expandedIds);
    const newSearchExpandedIds = new Set(this.expansionState.searchExpandedIds);
    const newExpansionState = {
      expandedIds: newExpandedIds,
      searchExpandedIds: newSearchExpandedIds
    };
    if (node.hasChildren()) {
      if (isSearchMode) {
        if (expand) {
          newSearchExpandedIds.add(node.id);
        } else {
          newSearchExpandedIds.delete(node.id);
        }
      } else {
        if (expand) {
          newExpandedIds.add(node.id);
        } else {
          newExpandedIds.delete(node.id);
        }
      }
    }
    if (sync) {
      this._expansionState = newExpansionState;
    }
    return newExpansionState;
  };

  private computeSelectionState = (propsSelectedIds: Set<string>): SelectionState => {
    if (this.type === Type.TREE_SELECT) {
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

    for (const root of this.roots) {
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
    const selectedIds = new Set<string>();
    const effectivelySelectedIds = new Set<string>();
    const partiallySelectedIds = new Set<string>();
    const someDescendantSelectedIds = new Set<string>();

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

  public computeAllSelected = (select: boolean, sync: boolean = false): SelectionState => {
    let newSelectionState: SelectionState;
    if (this.type === Type.TREE_SELECT) {
      newSelectionState = this.computeHierarchicalAllSelected(select);
    } else {
      newSelectionState = this.computeFlatAllSelected(select);
    }
    if (sync) {
      this._selectionState = newSelectionState;
    }
    return newSelectionState;
  };

  private computeFlatAllSelected = (select: boolean): SelectionState => {
    const selectedIds = new Set(this.selectionState.selectedIds);
    const effectivelySelectedIds = new Set(this.selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set<string>();
    const someDescendantSelectedIds = new Set<string>();

    const setAllSelected = (root: Node, select: boolean): void => {
      const setSelectAll = (node: Node): void => {
        const children = node.children ?? [];
        for (const child of children) {
          setSelectAll(child);
        }
        if (!node.disabled) {
          if (select) {
            selectedIds.add(node.id);
            effectivelySelectedIds.add(node.id);
          } else {
            selectedIds.delete(node.id);
            effectivelySelectedIds.delete(node.id);
          }
        }
      };
      setSelectAll(root);
    };

    for (const root of this.roots) {
      setAllSelected(root, select);
    }

    return {
      selectedIds,
      effectivelySelectedIds,
      partiallySelectedIds,
      someDescendantSelectedIds
    };
  };

  private computeHierarchicalAllSelected = (select: boolean): SelectionState => {
    const selectedIds = new Set(this.selectionState.selectedIds);
    const effectivelySelectedIds = new Set(this.selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set<string>(this.selectionState.partiallySelectedIds);
    const someDescendantSelectedIds = new Set<string>(this.selectionState.someDescendantSelectedIds);

    const setAllSelected = (root: Node, select: boolean): void => {
      const setHierarchicalSelected = (node: Node): void => {
        const children = node.children ?? [];

        for (const child of children) {
          setHierarchicalSelected(child);
        }

        if (children.length === 0) {
          if (!node.disabled) {
            if (select) {
              selectedIds.add(node.id);
            } else {
              selectedIds.delete(node.id);
            }
          }
          const selected = selectedIds.has(node.id);
          if (selected || node.disabled) {
            effectivelySelectedIds.add(node.id);
          } else {
            effectivelySelectedIds.delete(node.id);
          }
          partiallySelectedIds.delete(node.id);
          someDescendantSelectedIds.delete(node.id);
        } else {
          const someDescendantSelected = children
            .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
          const allChildrenEffectivelySelected = children
            .every(child => effectivelySelectedIds.has(child.id));
          const allChildrenSelected = children.every(child => selectedIds.has(child.id));

          if (!node.disabled) {
            if (select && allChildrenSelected) {
              selectedIds.add(node.id);
            } else {
              selectedIds.delete(node.id);
            }
          }

          if (allChildrenEffectivelySelected) {
            effectivelySelectedIds.add(node.id);
          } else {
            effectivelySelectedIds.delete(node.id);
          }
          if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
            partiallySelectedIds.add(node.id);
          } else {
            partiallySelectedIds.delete(node.id);
          }
          if (someDescendantSelected) {
            someDescendantSelectedIds.add(node.id);
          } else {
            someDescendantSelectedIds.delete(node.id);
          }
        }
      };
      setHierarchicalSelected(root);
    };

    for (const root of this.roots) {
      setAllSelected(root, select);
    }

    return {
      selectedIds,
      effectivelySelectedIds,
      partiallySelectedIds,
      someDescendantSelectedIds
    };
  };

  public computeSelected = (node: Node, select: boolean, sync: boolean = false): SelectionState => {
    let newSelectionState: SelectionState;
    if (node.disabled) {
      newSelectionState = this.selectionState;
    } else {
      if (this.type === Type.SELECT) {
        const selectedIds = this.selectionState.selectedIds;
        if (selectedIds.size > 0 && selectedIds.values().every(id => this.nodeMap.get(id)?.disabled)) {
          newSelectionState = this.selectionState;
        } else {
          newSelectionState = {
            selectedIds: select ? new Set(node.id) : new Set(),
            effectivelySelectedIds: select ? new Set(node.id) : new Set(),
            partiallySelectedIds: new Set(),
            someDescendantSelectedIds: new Set()
          };
        }
      } else {
        if (select) {
          newSelectionState = this.computeSelect(node);
        } else {
          newSelectionState = this.computeDeselect(node);
        }
      }
    }
    if (sync) {
      this._selectionState = newSelectionState;
    }
    return newSelectionState;
  };

  private computeSelect = (node: Node): SelectionState => {
    if (node.disabled) {
      return this.selectionState;
    }
    if (this.type === Type.TREE_SELECT) {
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
    if (this.type === Type.TREE_SELECT) {
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
    const selectedIds = new Set(this.selectionState.selectedIds);
    const effectivelySelectedIds = new Set(this.selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set(this.selectionState.partiallySelectedIds);
    const someDescendantSelectedIds = new Set(this.selectionState.someDescendantSelectedIds);

    this.setSelectedSubtree(node, selectedIds, select);
    this.setSelectedAncestors(node, selectedIds, select);

    const setHierarchicalSelected = (node: Node): void => {
      const children = node.children ?? [];

      for (const child of children) {
        setHierarchicalSelected(child);
      }

      const selected = selectedIds.has(node.id);

      if (children.length === 0) {
        if (selected || node.disabled) {
          effectivelySelectedIds.add(node.id);
        } else {
          effectivelySelectedIds.delete(node.id);
        }
      } else {
        const someDescendantSelected = children
          .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
        const allChildrenEffectivelySelected = children
          .every(child => effectivelySelectedIds.has(child.id));
        const allChildrenSelected = children.every(child => selectedIds.has(child.id));

        if (allChildrenEffectivelySelected) {
          effectivelySelectedIds.add(node.id);
        } else {
          effectivelySelectedIds.delete(node.id);
        }
        if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
          partiallySelectedIds.add(node.id);
        } else {
          partiallySelectedIds.delete(node.id);
        }
        if (someDescendantSelected) {
          someDescendantSelectedIds.add(node.id);
        } else {
          someDescendantSelectedIds.delete(node.id);
        }
      }
    };

    setHierarchicalSelected(this.getRoot(node));

    return {selectedIds, effectivelySelectedIds, partiallySelectedIds, someDescendantSelectedIds};
  };

  private setSelectedSubtree = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    const children = node.children ?? [];

    for (const child of children) {
      this.setSelectedSubtree(child, selectedIds, select);
    }

    if (!node.disabled) {
      if (children.length === 0) {
        if (select) {
          selectedIds.add(node.id);
        } else {
          selectedIds.delete(node.id);
        }
      } else {
        const allChildrenSelected = children.every(child => selectedIds.has(child.id));
        if (select && allChildrenSelected) {
          selectedIds.add(node.id);
        } else {
          selectedIds.delete(node.id);
        }
      }
    }
  };

  private setSelectedAncestors = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    const parentNode = node.parent;
    if (parentNode) {
      if (!parentNode.disabled) {
        const allChildrenSelected = parentNode.children.every(child => selectedIds.has(child.id));
        if (select && allChildrenSelected) {
          selectedIds.add(parentNode.id);
        } else {
          selectedIds.delete(parentNode.id);
        }
      }
      this.setSelectedAncestors(parentNode, selectedIds, select);
    }
  };

  private getRoot = (node: Node): Node => {
    const getNodeRoot = (node: Node): Node => {
      if (node.parent) {
        return getNodeRoot(node.parent);
      }
      return node;
    };
    return getNodeRoot(node);
  };

  private initialize = (data: TreeNode[], type: Type, searchValue: string) => {
    this._type = type;
    this._nodeMap = new Map<string, Node>();
    this._roots = [];
    this._nodes = [];
    this._selectionState = {
      selectedIds: new Set<string>(),
      effectivelySelectedIds: new Set<string>(),
      partiallySelectedIds: new Set<string>(),
      someDescendantSelectedIds: new Set<string>()
    };
    this._expansionState = {
      expandedIds: new Set<string>(),
      searchExpandedIds: new Set<string>()
    };
    this._searchingState = {
      matchedIds: new Set<string>(),
      filteredIds: new Set<string>()
    };

    data.forEach((treeNode, index) => {
      const node = this.mapTreeNodeToNode(treeNode, index.toString(), null, this.nodeMap);
      this.roots.push(node);
    });

    if (this.type === Type.TREE_SELECT || this.type === Type.TREE_SELECT_FLAT) {
      this._nodes = convertTreeArrayToFlatArray(this.roots);
    } else {
      this._nodes = this.roots;
    }
    this.handleSearch(searchValue);
  };

  public appendData = (data: TreeNode[], searchValue: string) => {
    const roots: Node[] = [];
    data.forEach((treeNode, index) => {
      const node = this.mapTreeNodeToNode(treeNode, index.toString(), null, this.nodeMap);
      roots.push(node);
    });

    this.roots.push(...roots);

    if (this.type === Type.TREE_SELECT || this.type === Type.TREE_SELECT_FLAT) {
      this.nodes.push(...convertTreeArrayToFlatArray(roots));
    } else {
      this._nodes = this.roots;
    }
    this.handleSearch(searchValue);
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

    const node: Node = new Node(
      nodeMap,
      id,
      treeNode.label,
      skipDropdownVirtualFocus,
      parentId,
      children,
      path.split(PATH_DELIMITER).length - 1,
      treeNode.disabled ?? false,
      treeNode
    );

    // After creating current Node, assign its parent to all children
    children.forEach(child => child.parentId = node.id);

    nodeMap.set(id, node);

    return node;
  };

  private everyAncestor = (node: Node, predicate: (ancestor: Node) => boolean): boolean => {
    const parentNode = node.parent;
    if (!parentNode) {
      return true;
    }
    return predicate(parentNode) && this.everyAncestor(parentNode, predicate);
  };

  private forEachAncestor = (node: Node, callback: (ancestor: Node) => void): void => {
    const parentNode = node.parent;
    if (parentNode) {
      callback(parentNode);
      this.forEachAncestor(parentNode, callback);
    }
  };
}
