import {TreeNode, Type} from './types';
import {PATH_DELIMITER} from './constants';
import {convertTreeArrayToFlatArray} from './utils/nodesUtils';
import {Node} from './Node';

export class NodesManager {

  private _type: Type;

  private _nodeMap: Map<string, Node>;

  // original tree structure
  private _roots: Node[];

  // flat structure
  private _nodes: Node[];

  constructor(data: TreeNode[], type: Type, searchValue: string) {
    this.initialize(data, type, searchValue);
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  public areAllEffectivelySelected = (): boolean => {
    return this._roots.every(root => root.effectivelySelected);
  };

  public getSize = (): number => {
    return this._nodes.length;
  };

  public getDisplayed = (isSearchMode: boolean): Node[] => {
    return this._nodes.filter(node => node.isDisplayed(isSearchMode));
  };

  public getSelected = (): Node[] => {
    return this._nodes.filter(node => node.selected);
  };

  public getExpanded = (): Node[] => {
    return this._nodes.filter(node => node.expanded);
  };

  public isAnyHasChildren = (): boolean => {
    return this._nodes.some(node => node.hasChildren());
  };

  public isAnySelectedExcludingDisabled = (): boolean => {
    return this._nodes
      .filter(node => !node.disabled)
      .some(node => node.selected);
  };

  public deselectAll = (): void => {
    this._nodes.forEach(node => node.handleUnselect(this._type));
  };

  public setAllSelected = (select: boolean): void => {
    this._nodes.forEach(node => {
      if (select) {
        node.handleSelect(this._type);
      } else {
        node.handleUnselect(this._type);
      }
    });
  };

  public syncSelectedIds = (selectedIds: Set<string>): void => {
    this._nodes.forEach(node => {
      node.setExplicitSelection(selectedIds.has(node.id));
    });
    this._roots.forEach(node => node.computeSelectionState(node, this._type));
  };

  public syncExpandedIds = (expandedIds: Set<string>, isSearchMode: boolean): void => {
    this._nodes.forEach(node => {
      node.handleExpand(isSearchMode, expandedIds.has(node.id));
    });
  };

  public handleSearch = (value: string): void => {
    this._nodes.forEach(node => node.handleSearch(value));
  };

  public resetSearch = (): void => {
    this._nodes.forEach(node => node.resetSearch());
  };

  public setSelected = (node: Node, select: boolean): void => {
    if (this._type === Type.SELECT) {
      const selectedNodes = this.getSelected();
      if (selectedNodes.length > 0 && selectedNodes.every(selectedNode => selectedNode.disabled)) {
        return;
      }
      selectedNodes.forEach(node => node.handleUnselect(this._type));
    }
    if (select) {
      node.handleSelect(this._type);
    } else {
      node.handleUnselect(this._type);
    }
  };

  public handleExpand = (node: Node, isSearchMode: boolean, expand: boolean): void => {
    node.handleExpand(isSearchMode, expand);
  };

  public findById = (id: string): Node | undefined => {
    return this._nodeMap.get(id);
  };

  private initialize = (data: TreeNode[], type: Type, searchValue: string) => {
    this._type = type;
    this._nodeMap = new Map<string, Node>();
    this._roots = [];
    this._nodes = [];

    data.forEach((treeNode, index) => {
      const node = this.mapTreeNodeToNode(treeNode, index.toString(), null, this._nodeMap);
      this._roots.push(node);
    });

    this._nodes = this._roots;

    if (this._type === Type.TREE_SELECT || this._type === Type.TREE_SELECT_FLAT) {
      this._nodes = convertTreeArrayToFlatArray(this._roots);
    }
    this._nodes.forEach(node => {
      node.handleSearch(searchValue);
    });
  };

  private mapTreeNodeToNode = (
    treeNode: TreeNode,
    path: string,
    parentId: string | null,
    nodeMap: Map<string, Node>
  ): Node => {
    const children = treeNode.children?.map((child, index) => {
      return this.mapTreeNodeToNode(child, `${path}${PATH_DELIMITER}${index}`, null, nodeMap);
    }) || [];

    const id = treeNode.id;
    const skipDropdownVirtualFocus = treeNode.skipDropdownVirtualFocus ?? false;
    const childrenIds = children.map(child => child.id);

    const node: Node = new Node(
      nodeMap,
      path,
      id,
      treeNode.label,
      skipDropdownVirtualFocus,
      parentId,
      childrenIds,
      path.split(PATH_DELIMITER).length - 1,
      treeNode.disabled ?? false,
      treeNode
    );

    // After creating current Node, assign its parent to all children
    children.forEach(child => child.parentId = node.id);

    nodeMap.set(id, node);

    return node;
  };
}
