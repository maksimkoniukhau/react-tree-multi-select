import {TreeNode} from './types';

export class Node {

  private _nodeMap: Map<string, Node>;

  private readonly _id: string;
  private readonly _name: string;
  private readonly _skipDropdownVirtualFocus: boolean;
  private _parentId: string | null;
  private _children: Node[];
  private readonly _hasChildren: boolean;
  private _hasLoaded: boolean;
  private readonly _depth: number;
  private readonly _disabled: boolean;

  // original TreeNode
  private readonly _initTreeNode: TreeNode;

  constructor(
    nodeMap: Map<string, Node>,
    id: string,
    name: string,
    skipDropdownVirtualFocus: boolean,
    parentId: string | null,
    children: Node[],
    hasChildren: boolean,
    depth: number,
    disabled: boolean,
    initTreeNode: TreeNode
  ) {
    this._nodeMap = nodeMap;
    this._id = id;
    this._name = name ?? '';
    this._skipDropdownVirtualFocus = skipDropdownVirtualFocus;
    this._parentId = parentId;
    this._children = children ?? [];
    this._hasChildren = hasChildren;
    this._hasLoaded = false;
    this._depth = depth || 0;
    this._disabled = disabled;
    this._initTreeNode = initTreeNode;
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
    return this._children;
  }

  set children(children: Node[]) {
    this._children = children;
  }

  get hasChildren(): boolean {
    return this._hasChildren;
  }

  get hasLoaded(): boolean {
    return this._hasLoaded;
  }

  set hasLoaded(hasLoaded: boolean) {
    this._hasLoaded = hasLoaded;
  }

  get depth(): number {
    return this._depth;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get initTreeNode(): TreeNode {
    return this._initTreeNode;
  }

  public hasLoadedChildren = (): boolean => {
    return this.children.length > 0;
  };

  public canExpand = (): boolean => {
    return this.hasLoadedChildren() || (this.hasChildren && !this.hasLoaded);
  };
}
