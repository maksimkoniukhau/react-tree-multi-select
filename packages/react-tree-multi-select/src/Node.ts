import {TreeNode} from './types';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export class Node<T extends TreeNode = any> {

  private _nodeMap: Map<string, Node<T>>;

  private readonly _id: string;
  private readonly _name: string;
  private readonly _skipDropdownVirtualFocus: boolean;
  private readonly _parentId: string | null;
  private _children: Node<T>[];
  private readonly _hasChildren: boolean;
  private _hasLoaded: boolean;
  private readonly _depth: number;
  private readonly _disabled: boolean;

  // original TreeNode
  private readonly _initTreeNode: T;

  constructor(
    nodeMap: Map<string, Node<T>>,
    id: string,
    name: string,
    skipDropdownVirtualFocus: boolean,
    parentId: string | null,
    children: Node<T>[],
    hasChildren: boolean,
    depth: number,
    disabled: boolean,
    initTreeNode: T
  ) {
    this._nodeMap = nodeMap;
    this._id = id;
    this._name = name ?? '';
    this._skipDropdownVirtualFocus = skipDropdownVirtualFocus;
    this._parentId = parentId;
    this._children = children;
    this._hasChildren = hasChildren;
    this._hasLoaded = false;
    this._depth = depth;
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

  get parent(): Node<T> | null {
    if (!this._parentId) {
      return null;
    }
    return this._nodeMap.get(this._parentId) ?? null;
  }

  get children(): Node<T>[] {
    return this._children;
  }

  set children(children: Node<T>[]) {
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

  get initTreeNode(): T {
    return this._initTreeNode;
  }

  public hasLoadedChildren = (): boolean => {
    return this.children.length > 0;
  };

  public canExpand = (): boolean => {
    return this.hasLoadedChildren() || (this.hasChildren && !this.hasLoaded);
  };
}
