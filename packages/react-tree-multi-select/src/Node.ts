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
  private _effectivelySelected: boolean;
  private _partiallySelected: boolean;
  private _expanded: boolean;
  private _searchExpanded: boolean;
  private _matched: boolean;
  private _filtered: boolean;

  // shallow copy of original TreeNode with actual selected/expanded/disabled props
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
    expanded: boolean,
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
    this._expanded = expanded;
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
    this._initTreeNode.selected = value || false;
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

  get expanded(): boolean {
    return this._expanded;
  }

  private set expanded(value: boolean) {
    this._expanded = value || false;
    this._initTreeNode.expanded = value || false;
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
        this.changeTreeNode(this, true, type);
        this.changeAncestors(this, true, type);
      } else {
        this.selected = true;
        this.effectivelySelected = true;
        this.partiallySelected = false;
      }
    }
  };

  public handleUnselect = (type: Type): void => {
    if (!this.disabled) {
      if (type === Type.TREE_SELECT) {
        this.changeTreeNode(this, false, type);
        this.changeAncestors(this, false, type);
      } else {
        this.selected = false;
        this.effectivelySelected = false;
        this.partiallySelected = false;
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

  public handleEffectivelySelected = (type: Type): void => {
    this.effectivelySelected = this.isNodeEffectivelySelected(this, type);
  };

  private isNodeEffectivelySelected = (node: Node, type: Type): boolean => {
    return node.selected || (type === Type.TREE_SELECT && this.isTreeNodeEffectivelySelected(node));
  };

  private isTreeNodeEffectivelySelected = (node: Node): boolean => {
    if (node.disabled) {
      return true;
    }
    if (!node.hasChildren()) {
      return node.selected;
    }
    for (const child of node.children) {
      if (!this.isTreeNodeEffectivelySelected(child)) {
        return false;
      }
    }
    return true;
  };

  private changeTreeNode = (node: Node, select: boolean, type: Type): void => {
    if (node.disabled) {
      return;
    }
    if (select === node.effectivelySelected) {
      return;
    }
    if (node.hasChildren()) {
      node.children.forEach(child => this.changeTreeNode(child, select, type));
    }
    this.updateTreeNodeSelectedState(node, select, type);
  };

  private changeAncestors = (node: Node, select: boolean, type: Type): void => {
    const parentNode = node.parent;
    if (parentNode) {
      this.updateTreeNodeSelectedState(parentNode, select, type);
      this.changeAncestors(parentNode, select, type);
    }
  };

  private updateTreeNodeSelectedState = (node: Node, select: boolean, type: Type): void => {
    const allChildrenSelected = !node.hasChildren() || this.areAllChildrenSelected(node);
    const anyChildSelected = node.hasChildren() && this.isAnyChildSelectedOrPartiallySelected(node);
    node.selected = select ? allChildrenSelected : false;
    node.effectivelySelected = this.isNodeEffectivelySelected(node, type);
    node.partiallySelected = !allChildrenSelected && anyChildSelected;
  };

  private areAllChildrenSelected = (node: Node): boolean => {
    return node.children.every(child => child.selected);
  };

  private isAnyChildSelectedOrPartiallySelected = (node: Node): boolean => {
    return node.children.some(child => child.selected || child.partiallySelected);
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
