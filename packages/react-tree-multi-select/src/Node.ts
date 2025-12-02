import {TreeNode, Type} from './types';

export class Node {

  private _nodeMap: Map<string, Node>;

  private readonly _path: string;
  private readonly _id: string;
  private readonly _name: string;
  private readonly _skipDropdownVirtualFocus: boolean;
  private _parentId: string | null;
  private _childrenIds: string[];
  private readonly _depth: number;
  private readonly _disabled: boolean;
  private _selected: boolean;
  // Node is effectively selected when all not disabled descendants are selected
  private _effectivelySelected: boolean;
  private _partiallySelected: boolean;
  private _someDescendantSelected: boolean;
  private _expanded: boolean;
  private _searchExpanded: boolean;
  private _matched: boolean;
  private _filtered: boolean;

  // original TreeNode
  private readonly _initTreeNode: TreeNode;

  constructor(
    nodeMap: Map<string, Node>,
    path: string,
    id: string,
    name: string,
    skipDropdownVirtualFocus: boolean,
    parentId: string | null,
    childrenIds: string[],
    depth: number,
    disabled: boolean,
    initTreeNode: TreeNode
  ) {
    this._nodeMap = nodeMap;
    this._path = path ?? '';
    this._id = id;
    this._name = name ?? '';
    this._skipDropdownVirtualFocus = skipDropdownVirtualFocus;
    this._parentId = parentId;
    this._childrenIds = childrenIds;
    this._depth = depth || 0;
    this._disabled = disabled;
    this._selected = false;
    this._effectivelySelected = false;
    this._partiallySelected = false;
    this._someDescendantSelected = false;
    this._expanded = false;
    this._searchExpanded = false;
    this._matched = false;
    this._filtered = true;
    this._initTreeNode = initTreeNode;
  }

  get path(): string {
    return this._path;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get skipDropdownVirtualFocus(): boolean {
    return this._skipDropdownVirtualFocus;
  }

  get parent(): Node | null {
    if (!this._parentId) {
      return null;
    }
    return this._nodeMap.get(this._parentId) ?? null;
  }

  set parentId(parentId: string | null) {
    this._parentId = parentId;
  }

  get children(): Node[] {
    return this._childrenIds
      .map(childId => this._nodeMap.get(childId))
      .filter(node => node !== undefined);
  }

  get depth(): number {
    return this._depth;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get selected(): boolean {
    return this._selected;
  }

  private set selected(value: boolean) {
    this._selected = value || false;
  }

  get effectivelySelected(): boolean {
    return this._effectivelySelected;
  }

  private set effectivelySelected(value: boolean) {
    this._effectivelySelected = value || false;
  }

  get partiallySelected(): boolean {
    return this._partiallySelected;
  }

  private set partiallySelected(value: boolean) {
    this._partiallySelected = value || false;
  }

  get someDescendantSelected(): boolean {
    return this._someDescendantSelected;
  }

  private set someDescendantSelected(value: boolean) {
    this._someDescendantSelected = value || false;
  }

  get expanded(): boolean {
    return this._expanded;
  }

  private set expanded(value: boolean) {
    this._expanded = value || false;
  }

  get searchExpanded(): boolean {
    return this._searchExpanded;
  }

  private set searchExpanded(value: boolean) {
    this._searchExpanded = value || false;
  }

  get matched(): boolean {
    return this._matched;
  }

  private set matched(value: boolean) {
    this._matched = value || false;
  }

  get filtered(): boolean {
    return this._filtered;
  }

  private set filtered(value: boolean) {
    this._filtered = value || false;
  }

  get initTreeNode(): TreeNode {
    return this._initTreeNode;
  }

  public hasChildren = (): boolean => {
    return this.children?.length > 0;
  };

  public setExplicitSelection = (select: boolean): void => {
    this.selected = select;
    this.effectivelySelected = false;
    this.partiallySelected = false;
    this.someDescendantSelected = false;
  };

  public handleExpand = (isSearchMode: boolean, expand: boolean): void => {
    if (this.hasChildren()) {
      if (isSearchMode) {
        this.searchExpanded = expand;
      } else {
        this.expanded = expand;
      }
    }
  };

  public handleSelect = (type: Type): void => {
    if (!this.disabled) {
      if (type === Type.TREE_SELECT) {
        this.changeTreeNode(this, true);
        this.changeAncestors(this, true);
      } else {
        this.selected = true;
        this.effectivelySelected = true;
        this.partiallySelected = false;
        this.someDescendantSelected = false;
      }
    }
  };

  public handleUnselect = (type: Type): void => {
    if (!this.disabled) {
      if (type === Type.TREE_SELECT) {
        this.changeTreeNode(this, false);
        this.changeAncestors(this, false);
      } else {
        this.selected = false;
        this.effectivelySelected = false;
        this.partiallySelected = false;
        this.someDescendantSelected = false;
      }
    }
  };

  public handleSearch = (searchValue: string): void => {
    if (searchValue) {
      if (this.name?.toLowerCase().includes(searchValue.toLowerCase())) {
        this.filtered = true;
        if (this.hasChildren()) {
          this.searchExpanded = true;
        }
        this.forEachAncestor(this, ancestor => {
          ancestor.filtered = true;
          ancestor.searchExpanded = true;
        });
        this.matched = true;
      } else {
        this.searchExpanded = false;
        this.matched = false;
        this.filtered = false;
      }
    } else {
      this.resetSearch();
    }
  };

  public resetSearch = (): void => {
    this.searchExpanded = false;
    this.matched = false;
    this.filtered = true;
  };

  public isDisplayed = (isSearchMode: boolean): boolean => {
    return this.filtered && this.isVisible(isSearchMode);
  };

  private isVisible = (isSearchMode: boolean): boolean => {
    if (!this.parent) {
      return true;
    }
    return this.everyAncestor(this, ancestor => isSearchMode ? ancestor.searchExpanded : ancestor.expanded);
  };

  public computeSelectionState = (node: Node, type: Type): void => {
    if (type === Type.TREE_SELECT) {
      this.computeHierarchicalSelectionState(node);
    } else {
      this.computeFlatSelectionState(node);
    }
  };

  private computeFlatSelectionState = (node: Node): void => {
    const children = node.children ?? [];

    for (const child of children) {
      this.computeFlatSelectionState(child);
    }

    node.effectivelySelected = node.selected;
    node.partiallySelected = false;
    node.someDescendantSelected = false;
  };

  private computeHierarchicalSelectionState = (node: Node): void => {
    const children = node.children ?? [];

    for (const child of children) {
      this.computeHierarchicalSelectionState(child);
    }

    if (children.length === 0) {
      node.effectivelySelected = node.selected || node.disabled;
      node.partiallySelected = false;
      node.someDescendantSelected = false;
      return;
    }

    this.updateTreeNodeSelectedState(node, undefined);
  };

  private changeTreeNode = (node: Node, select: boolean): void => {
    const children = node.children ?? [];

    for (const child of children) {
      this.changeTreeNode(child, select);
    }

    if (children.length === 0) {
      if (!node.disabled) {
        node.selected = select;
      }
      node.partiallySelected = false;
      node.someDescendantSelected = false;
      node.effectivelySelected = node.selected || node.disabled;
      return;
    }

    this.updateTreeNodeSelectedState(node, select);
  };

  private changeAncestors = (node: Node, select: boolean): void => {
    const parentNode = node.parent;
    if (parentNode) {
      this.updateTreeNodeSelectedState(parentNode, select);
      this.changeAncestors(parentNode, select);
    }
  };

  private updateTreeNodeSelectedState = (node: Node, select: boolean | undefined): void => {
    const someDescendantSelected = this.hasSelectedDescendant(node);
    const allChildrenEffectivelySelected = this.areAllChildrenEffectivelySelected(node);
    const allChildrenSelected = this.areAllChildrenSelected(node);

    if (!node.disabled && select !== undefined) {
      node.selected = select && allChildrenSelected;
    }
    node.effectivelySelected = allChildrenEffectivelySelected;
    node.partiallySelected = !node.disabled && !allChildrenSelected && someDescendantSelected;
    node.someDescendantSelected = someDescendantSelected;
  };

  private areAllChildrenSelected = (node: Node): boolean => {
    return node.children.every(child => child.selected);
  };

  private areAllChildrenEffectivelySelected = (node: Node): boolean => {
    return node.children.every(child => child.effectivelySelected);
  };

  private hasSelectedDescendant = (node: Node): boolean => {
    return node.children.some(child => child.selected || child.someDescendantSelected);
  };

  private forEachAncestor = (node: Node, callback: (ancestor: Node) => void): void => {
    const parentNode = node.parent;
    if (parentNode) {
      callback(parentNode);
      this.forEachAncestor(parentNode, callback);
    }
  };

  private everyAncestor = (node: Node, predicate: (ancestor: Node) => boolean): boolean => {
    const parentNode = node.parent;
    if (!parentNode) {
      return true;
    }
    return predicate(parentNode) && this.everyAncestor(parentNode, predicate);
  };
}
