import {TreeNode, Type} from './types';
import {ExpansionState, SearchState, SelectionState} from './innerTypes';
import {convertTreeArrayToFlatArray} from './utils/nodesUtils';
import {NodesBehavior} from './behaviors/NodesBehavior';
import {SingleSelectBehavior} from './behaviors/SingleSelectBehavior';
import {MultiSelectBehavior} from './behaviors/MultiSelectBehavior';
import {TreeSelectFlatBehavior} from './behaviors/TreeSelectFlatBehavior';
import {TreeSelectBehavior} from './behaviors/TreeSelectBehavior';
import {Node} from './Node';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export class NodesManager<T extends TreeNode<T> = any> {

  private readonly _type: Type;

  private readonly _nodesBehavior: NodesBehavior<T>;

  private readonly _treeNodeMap: Map<string, T>;

  private readonly _nodeMap: Map<string, Node>;
  // original tree structure
  private readonly _roots: Node[];
  // flat structure
  private _nodes: Node[];

  private _selectionState: SelectionState;
  private _expansionState: ExpansionState;
  private _searchState: SearchState;

  constructor(data: T[], type: Type, searchValue: string) {
    this._type = type;
    this._treeNodeMap = new Map<string, T>();
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
    this._searchState = {
      matchedIds: new Set<string>(),
      filteredIds: new Set<string>()
    };
    this._nodesBehavior = this.createBehavior(type);
    this.appendData(data, searchValue);
  }

  get type(): Type {
    return this._type;
  }

  private get nodesBehavior(): NodesBehavior<T> {
    return this._nodesBehavior;
  }

  private get treeNodeMap(): Map<string, T> {
    return this._treeNodeMap as Map<string, T>;
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

  get searchState(): SearchState {
    return this._searchState;
  }

  public getSize = (): number => {
    return this.nodes.length;
  };

  public findById = (id: string): Node | undefined => {
    return this.nodeMap.get(id);
  };

  public areAllEffectivelySelected = (): boolean => {
    return this.roots.every(root => this.selectionState.effectivelySelectedIds.has(root.id));
  };

  public isAnyCanExpand = (): boolean => {
    return this.nodes.some(node => node.canExpand());
  };

  public isAnySelectedExcludingDisabled = (): boolean => {
    return this.nodes
      .filter(node => !node.disabled)
      .some(node => this.selectionState.selectedIds.has(node.id));
  };

  public syncSelectedIds = (selectedIds: Set<string>): void => {
    this._selectionState = this.nodesBehavior.syncSelected(selectedIds, this.roots);
  };

  public computeSelected = (node: Node, select: boolean, sync: boolean): SelectionState => {
    const newSelectionState = this.nodesBehavior.computeSelected(node, select, this.selectionState, this.nodeMap);
    if (sync) {
      this._selectionState = newSelectionState;
    }
    return newSelectionState;
  };

  public computeAllSelected = (select: boolean, sync: boolean): SelectionState => {
    const newSelectionState = this.nodesBehavior.computeAllSelected(select, this.selectionState, this.roots, this.nodeMap);
    if (sync) {
      this._selectionState = newSelectionState;
    }
    return newSelectionState;
  };

  public syncExpandedIds = (expandedIds: Set<string>, isSearchMode: boolean): void => {
    this._expansionState = this.nodesBehavior.syncExpanded(expandedIds, isSearchMode, this.expansionState);
  };

  public computeExpanded = (node: Node, expand: boolean, isSearchMode: boolean, sync: boolean): ExpansionState => {
    const newExpansionState = this.nodesBehavior.computeExpanded(node, expand, isSearchMode, this.expansionState);
    if (sync) {
      this._expansionState = newExpansionState;
    }
    return newExpansionState;
  };

  public handleSearch = (searchValue: string): void => {
    if (searchValue) {
      const newSearchExpandedIds = new Set<string>();
      const newSearchState = {
        matchedIds: new Set<string>(),
        filteredIds: new Set<string>()
      };
      this.nodes.forEach(node => {
        if (node.name?.toLowerCase().includes(searchValue.toLowerCase())) {
          newSearchState.matchedIds.add(node.id);
          newSearchState.filteredIds.add(node.id);
          if (node.hasLoadedChildren()) {
            newSearchExpandedIds.add(node.id);
          }
          this.forEachAncestor(node, ancestor => {
            newSearchState.filteredIds.add(ancestor.id);
            newSearchExpandedIds.add(ancestor.id);
          });
        }
      });
      this.expansionState.searchExpandedIds = newSearchExpandedIds;
      this._searchState = newSearchState;
    } else {
      this.resetSearch();
    }
  };

  public resetSearch = (): void => {
    const newSearchState = {
      matchedIds: new Set<string>(),
      filteredIds: new Set<string>()
    }
    this.nodes.forEach(node => {
      newSearchState.filteredIds.add(node.id);
    });
    this.expansionState.searchExpandedIds = new Set();
    this._searchState = newSearchState;
  };

  public appendData = (data: T[], searchValue: string): void => {
    const roots: Node[] = [];
    data.forEach(treeNode => {
      const node = this.nodesBehavior.mapTreeNodeToNode(treeNode, 0, null, this.nodeMap, this.treeNodeMap);
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

  public appendChildren = (parentNode: Node, children: T[], searchValue: string): void => {
    parentNode.hasLoaded = true;

    if (children?.length > 0) {
      parentNode.children = children.map(treeNode => (
        this.nodesBehavior.mapTreeNodeToNode(
          treeNode,
          parentNode.depth + 1,
          parentNode.id,
          this.nodeMap,
          this.treeNodeMap
        )
      ));

      this._nodes = convertTreeArrayToFlatArray(this.roots);
      this.handleSearch(searchValue);
    }
  };

  public getDisplayed = (isSearchMode: boolean, expansionState: ExpansionState): Node[] => {
    return this.nodes.filter(node => this.isDisplayed(node, isSearchMode, expansionState));
  };

  private isDisplayed = (node: Node, isSearchMode: boolean, expansionState: ExpansionState): boolean => {
    return this.searchState.filteredIds.has(node.id) && this.isVisible(node, isSearchMode, expansionState);
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

  private createBehavior = (type: Type): NodesBehavior<T> => {
    switch (type) {
      case Type.SINGLE_SELECT:
        return new SingleSelectBehavior();
      case Type.MULTI_SELECT:
        return new MultiSelectBehavior();
      case Type.TREE_SELECT_FLAT:
        return new TreeSelectFlatBehavior();
      case Type.TREE_SELECT:
        return new TreeSelectBehavior();
    }
  };
}
