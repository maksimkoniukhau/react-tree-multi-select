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

  get initTreeNode(): TreeNode {
    return this._initTreeNode;
  }

  public hasChildren = (): boolean => {
    return this.children?.length > 0;
  };
}
