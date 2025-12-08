import {TreeNode} from './types';

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

  public handleSearch = (searchValue: string): void => {
    if (searchValue) {
      if (this.name?.toLowerCase().includes(searchValue.toLowerCase())) {
        this.filtered = true;
        if (this.hasChildren()) {
          //  this.searchExpanded = true;
        }
        this.forEachAncestor(this, ancestor => {
          ancestor.filtered = true;
          // ancestor.searchExpanded = true;
        });
        this.matched = true;
      } else {
        // this.searchExpanded = false;
        this.matched = false;
        this.filtered = false;
      }
    } else {
      this.resetSearch();
    }
  };

  public resetSearch = (): void => {
    // this.searchExpanded = false;
    this.matched = false;
    this.filtered = true;
  };

  private forEachAncestor = (node: Node, callback: (ancestor: Node) => void): void => {
    const parentNode = node.parent;
    if (parentNode) {
      callback(parentNode);
      this.forEachAncestor(parentNode, callback);
    }
  };
}
