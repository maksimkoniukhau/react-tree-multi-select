import {TreeNode, Type} from './types';
import {ExpansionState, SearchingState, SelectionState} from './innerTypes';
import {convertTreeArrayToFlatArray} from './utils/nodesUtils';
import {NodesBehavior} from './behaviors/NodesBehavior';
import {SingleSelectBehavior} from './behaviors/SingleSelectBehavior';
import {MultiSelectBehavior} from './behaviors/MultiSelectBehavior';
import {TreeSelectFlatBehavior} from './behaviors/TreeSelectFlatBehavior';
import {TreeSelectBehavior} from './behaviors/TreeSelectBehavior';
import {Node} from './Node';

export class NodesManager {

  private _type: Type;

  private _nodesBehavior: NodesBehavior;

  private _nodeMap: Map<string, Node>;

  // original tree structure
  private _roots: Node[];

  // flat structure
  private _nodes: Node[];

  private _selectionState: SelectionState;

  private _expansionState: ExpansionState;

  private _searchingState: SearchingState;

  constructor(data: TreeNode[], type: Type, searchValue: string) {
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
    this._nodesBehavior = this.createBehavior(type);
    this.appendData(data, searchValue);
  }

  get type(): Type {
    return this._type;
  }

  private get nodesBehavior(): NodesBehavior {
    return this._nodesBehavior;
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
      const newSearchingState = {
        matchedIds: new Set<string>(),
        filteredIds: new Set<string>()
      };
      this.nodes.forEach(node => {
        if (node.name?.toLowerCase().includes(searchValue.toLowerCase())) {
          newSearchingState.matchedIds.add(node.id);
          newSearchingState.filteredIds.add(node.id);
          if (node.hasLoadedChildren()) {
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

  public appendData = (data: TreeNode[], searchValue: string): void => {
    const roots: Node[] = [];
    data.forEach(treeNode => {
      const node = this.nodesBehavior.mapTreeNodeToNode(treeNode, 0, null, this.nodeMap);
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

  public appendChildren = (parentNode: Node, children: TreeNode[], searchValue: string): void => {
    parentNode.hasLoaded = true;

    if (children?.length > 0) {
      parentNode.children = children.map(treeNode => (
        this.nodesBehavior.mapTreeNodeToNode(treeNode, parentNode.depth + 1, parentNode.id, this.nodeMap)
      ));

      this._nodes = convertTreeArrayToFlatArray(this.roots);
      this.handleSearch(searchValue);
    }
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

  private createBehavior = (type: Type): NodesBehavior => {
    switch (type) {
      case Type.SELECT:
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
