import {TreeNode, Type} from './types';

export class Node {

  private _path: string;
  private _name: string;
  private _parent: Node | null;
  private _children: Node[];
  private _depth: number;
  private _disabled: boolean;
  private _selected: boolean;
  private _partiallySelected: boolean;
  private _allNotDisabledChildrenSelected: boolean;
  private _expanded: boolean;
  private _searchExpanded: boolean;
  private _matched: boolean;
  private _filtered: boolean;

  // flat ordered array of this node ancestors
  private _ancestors: Node[];
  // flat ordered array of this node descendants
  private _descendants: Node[];
  // shallow copy of original TreeNode with actual selected/expanded/disabled props
  private _initTreeNode: TreeNode;

  constructor(path: string, name: string, parent: Node | null, depth: number, expanded: boolean, initTreeNode: TreeNode) {
    this._path = path || '';
    this._name = name || '';
    this._parent = parent || null;
    this._children = [];
    this._depth = depth || 0;
    this._disabled = false;
    this._selected = false;
    this._partiallySelected = false;
    this._allNotDisabledChildrenSelected = false;
    this._expanded = expanded || false;
    this._searchExpanded = false;
    this._matched = false;
    this._filtered = true;
    this._initTreeNode = initTreeNode;
  }

  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value || '';
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value || '';
  }

  get parent(): Node | null {
    return this._parent;
  }

  set parent(value: Node | null) {
    this._parent = value;
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

  set depth(value: number) {
    this._depth = value || 0;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value || false;
    this._initTreeNode.disabled = value || false;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value || false;
    this._initTreeNode.selected = value || false;
  }

  get partiallySelected(): boolean {
    return this._partiallySelected;
  }

  set partiallySelected(value: boolean) {
    this._partiallySelected = value || false;
  }

  get allNotDisabledChildrenSelected(): boolean {
    return this._allNotDisabledChildrenSelected;
  }

  set allNotDisabledChildrenSelected(value: boolean) {
    this._allNotDisabledChildrenSelected = value || false;
  }

  get expanded(): boolean {
    return this._expanded;
  }

  set expanded(value: boolean) {
    this._expanded = value || false;
    this._initTreeNode.expanded = value || false;
  }

  get searchExpanded(): boolean {
    return this._searchExpanded;
  }

  set searchExpanded(value: boolean) {
    this._searchExpanded = value || false;
  }

  get matched(): boolean {
    return this._matched;
  }

  set matched(value: boolean) {
    this._matched = value || false;
  }

  get filtered(): boolean {
    return this._filtered;
  }

  set filtered(value: boolean) {
    this._filtered = value || false;
  }

  get ancestors(): Node[] {
    if (this._ancestors) {
      return this._ancestors;
    }
    this.ancestors = this.getAllAncestors();
    return this._ancestors;
  }

  set ancestors(value: Node[]) {
    this._ancestors = value || [];
  }

  get descendants(): Node[] {
    if (this._descendants) {
      return this._descendants;
    }
    this.descendants = this.getAllDescendants();
    return this._descendants;
  }

  set descendants(value: Node[]) {
    this._descendants = value || [];
  }

  get initTreeNode(): TreeNode {
    return this._initTreeNode;
  }

  set initTreeNode(value: TreeNode) {
    this._initTreeNode = value;
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
    this.disabled = true;
    if (type === Type.TREE_SELECT) {
      this.descendants.forEach(descendant => descendant.disabled = true);
    }
  };

  public handleSelect = (type: Type): void => {
    if (!this.disabled) {
      if (type === Type.TREE_SELECT) {
        this.selectTreeNode(this);
        this.selectAncestors(this);
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
        this.unselectTreeNode(this);
        this.unselectAncestors(this);
      } else {
        this.selected = false;
        this.partiallySelected = false;
        this.allNotDisabledChildrenSelected = false;
      }
    }
  };

  public handleChange = (type: Type): void => {
    if (!this.disabled) {
      if (this.shouldBeUnselected(type)) {
        this.handleUnselect(type);
      } else {
        this.handleSelect(type);
      }
    }
  };

  public shouldBeUnselected = (type: Type): boolean => {
    return this.selected || (type === Type.TREE_SELECT && this.allNotDisabledChildrenSelected);
  };

  public handleSearch = (searchValue: string): void => {
    if (searchValue) {
      if (this.name?.toLowerCase().includes(searchValue.toLowerCase())) {
        this.filtered = true;
        if (this.hasChildren()) {
          this.searchExpanded = true;
        }
        this.ancestors.forEach(node => {
          node.filtered = true;
          node.searchExpanded = true;
        });
        this.matched = true;
      } else {
        this.searchExpanded = false;
        this.matched = false;
        this.filtered = false;
      }
    } else {
      this.searchExpanded = false;
      this.matched = false;
      this.filtered = true;
    }
  };

  public isDisplayed = (isSearchMode: boolean): boolean => {
    return this.filtered && this.isVisible(isSearchMode);
  };

  private isVisible = (isSearchMode: boolean): boolean => {
    if (!this.parent) {
      return true;
    }
    return !this.ancestors.some(ancestor => isSearchMode
      ? !ancestor.searchExpanded
      : !ancestor.expanded);
  };

  private getAllAncestors = (): Node[] => {
    const ancestors: Node[] = [];
    this.addAncestors(this.parent, ancestors);
    return ancestors;
  };

  private addAncestors = (node: Node | null, ancestors: Node[]): void => {
    if (node) {
      ancestors.push(node);
      if (node.parent) {
        this.addAncestors(node.parent, ancestors);
      }
    }
  };

  private getAllDescendants = (): Node[] => {
    const descendants: Node[] = [];
    this.addDescendants(this, descendants, false);
    return descendants;
  };

  private addDescendants = (node: Node, descendants: Node[], add: boolean): void => {
    if (add) {
      descendants.push(node);
    }
    if (node.hasChildren()) {
      node.children.forEach(child => this.addDescendants(child, descendants, true));
    }
  };

  private selectTreeNode = (node: Node): void => {
    if (node.disabled) {
      return;
    }
    if (node.hasChildren()) {
      node.children.forEach(child => this.selectTreeNode(child));
    }
    this.updateTreeNodeSelectedState(node, true);
  };

  private unselectTreeNode = (node: Node): void => {
    if (node.disabled) {
      return;
    }
    if (node.hasChildren()) {
      node.children.forEach(child => this.unselectTreeNode(child));
    }
    this.updateTreeNodeSelectedState(node, false);
  };

  private selectAncestors = (node: Node): void => {
    const parentNode = node.parent;
    if (parentNode) {
      this.updateTreeNodeSelectedState(parentNode, true);
      this.selectAncestors(parentNode);
    }
  };

  private unselectAncestors = (node: Node): void => {
    const parentNode = node.parent;
    if (parentNode) {
      this.updateTreeNodeSelectedState(parentNode, false);
      this.unselectAncestors(parentNode);
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
}
