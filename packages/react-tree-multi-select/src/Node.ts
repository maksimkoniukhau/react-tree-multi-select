import {TreeNode, Type} from './types';

export class Node {

  private readonly _path: string;
  private readonly _id: string;
  private readonly _name: string;
  private readonly _skipDropdownVirtualFocus: boolean;
  private readonly _parent: Node | null;
  private _children: Node[];
  private readonly _depth: number;
  private _disabled: boolean;
  private _selected: boolean;
  private _partiallySelected: boolean;
  private _allNotDisabledChildrenSelected: boolean;
  private _expanded: boolean;
  private _searchExpanded: boolean;
  private _matched: boolean;
  private _filtered: boolean;

  // shallow copy of original TreeNode with actual selected/expanded/disabled props
  private readonly _initTreeNode: TreeNode;

  constructor(
    path: string,
    id: string,
    name: string,
    skipDropdownVirtualFocus: boolean,
    parent: Node | null,
    depth: number,
    expanded: boolean,
    initTreeNode: TreeNode
  ) {
    this._path = path ?? '';
    this._id = id;
    this._name = name ?? '';
    this._skipDropdownVirtualFocus = skipDropdownVirtualFocus;
    this._parent = parent;
    this._children = [];
    this._depth = depth || 0;
    this._disabled = false;
    this._selected = false;
    this._partiallySelected = false;
    this._allNotDisabledChildrenSelected = false;
    this._expanded = expanded;
    this._searchExpanded = false;
    this._matched = false;
    this._filtered = true;
    this._initTreeNode = initTreeNode;
    this._initTreeNode.id = id;
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
    return this._parent;
  }

  get children(): Node[] {
    return this._children;
  }

  set children(value: Node[]) {
    this._children = value || [];
  }

  get depth(): number {
    return this._depth;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private set disabled(value: boolean) {
    this._disabled = value || false;
    this._initTreeNode.disabled = value || false;
  }

  get selected(): boolean {
    return this._selected;
  }

  private set selected(value: boolean) {
    this._selected = value || false;
    this._initTreeNode.selected = value || false;
  }

  get partiallySelected(): boolean {
    return this._partiallySelected;
  }

  private set partiallySelected(value: boolean) {
    this._partiallySelected = value || false;
  }

  get allNotDisabledChildrenSelected(): boolean {
    return this._allNotDisabledChildrenSelected;
  }

  private set allNotDisabledChildrenSelected(value: boolean) {
    this._allNotDisabledChildrenSelected = value || false;
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

  public handleDisable = (type: Type): void => {
    if (type === Type.TREE_SELECT) {
      this.disableTreeNode(this);
    } else {
      this.disabled = true;
    }
  };

  public handleSelect = (type: Type): void => {
    if (!this.disabled) {
      if (type === Type.TREE_SELECT) {
        this.changeTreeNode(this, true, type);
        this.changeAncestors(this, true, type);
      } else {
        this.selected = true;
        this.partiallySelected = false;
        this.allNotDisabledChildrenSelected = false;
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
        this.partiallySelected = false;
        this.allNotDisabledChildrenSelected = false;
      }
    }
  };

  public handleChange = (type: Type): void => {
    if (!this.disabled) {
      if (this.isEffectivelySelected(type)) {
        this.handleUnselect(type);
      } else {
        this.handleSelect(type);
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

  public isEffectivelySelected = (type: Type): boolean => {
    return this.isNodeEffectivelySelected(this, type);
  };

  private isNodeEffectivelySelected = (node: Node, type: Type): boolean => {
    return node.selected || (type === Type.TREE_SELECT && node.allNotDisabledChildrenSelected);
  };

  private isUnselected = (node: Node): boolean => {
    return !node.selected && !node.partiallySelected;
  };

  private disableTreeNode = (node: Node): void => {
    node.disabled = true;
    if (node.hasChildren()) {
      node.children.forEach(child => this.disableTreeNode(child));
    }
  };

  private changeTreeNode = (node: Node, select: boolean, type: Type): void => {
    if (node.disabled) {
      return;
    }
    if ((select && this.isNodeEffectivelySelected(node, type)) || (!select && this.isUnselected(node))) {
      return;
    }
    if (node.hasChildren()) {
      node.children.forEach(child => this.changeTreeNode(child, select, type));
    }
    this.updateTreeNodeSelectedState(node, select);
  };

  private changeAncestors = (node: Node, select: boolean, type: Type): void => {
    const parentNode = node.parent;
    if (parentNode) {
      this.updateTreeNodeSelectedState(parentNode, select);
      this.changeAncestors(parentNode, select, type);
    }
  };

  private updateTreeNodeSelectedState = (node: Node, select: boolean): void => {
    const allChildrenSelected = !node.hasChildren() || this.areAllChildrenSelected(node);
    const anyChildSelected = node.hasChildren() && this.isAnyChildSelectedOrPartiallySelected(node);
    node.selected = select ? allChildrenSelected : false;
    node.partiallySelected = !allChildrenSelected && anyChildSelected;
    node.allNotDisabledChildrenSelected = node.hasChildren() && this.areAllExcludingDisabledChildrenSelected(node);
  };

  private areAllChildrenSelected = (node: Node): boolean => {
    return node.children.every(child => child.selected);
  };

  private isAnyChildSelectedOrPartiallySelected = (node: Node): boolean => {
    return node.children.some(child => child.selected || child.partiallySelected);
  };

  private areAllExcludingDisabledChildrenSelected = (node: Node): boolean => {
    return node.children
      .filter(child => !child.disabled)
      .every(child => child.selected || child.allNotDisabledChildrenSelected);
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
