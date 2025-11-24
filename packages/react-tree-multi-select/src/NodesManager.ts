import {TreeNode, Type} from './types';
import {convertTreeArrayToFlatArray, mapTreeNodeToNode} from './utils/nodesUtils';
import {Node} from './Node';

export class NodesManager {

  private _type: Type;

  private _nodeMap: Map<string, Node>;

  // shallow copy of data with actual selected/expanded/disabled props
  private _copiedData: TreeNode[];

  // original tree structure
  private _roots: Node[];

  // flat structure
  private _nodes: Node[];

  constructor(data: TreeNode[], type: Type, searchValue: string) {
    this.initialize(data, type, searchValue);
  }

  get copiedData(): TreeNode[] {
    return this._copiedData;
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  private initialize = (data: TreeNode[], type: Type, searchValue: string) => {
    this._type = type;
    this._nodeMap = new Map<string, Node>();
    this._copiedData = [];
    this._roots = [];
    this._nodes = [];
    data.forEach((treeNode, index) => {
      const node = mapTreeNodeToNode(treeNode, index.toString(), null, this._nodeMap);
      this._roots.push(node);
      this._copiedData.push(node.initTreeNode);
    });

    this._nodes = this._roots;

    if (this._type === Type.TREE_SELECT || this._type === Type.TREE_SELECT_FLAT) {
      this._nodes = convertTreeArrayToFlatArray(this._roots);
    }
    if (this._type === Type.TREE_SELECT || this._type === Type.TREE_SELECT_FLAT || this._type === Type.MULTI_SELECT) {
      this._nodes.forEach(node => {
        if (node.initTreeNode.selected) {
          node.handleSelect(this._type);
        }
      });
    }
    if (this._type === Type.SELECT) {
      const lastSelectedNode = this._nodes.findLast(node => node.initTreeNode.selected);
      if (lastSelectedNode) {
        lastSelectedNode.handleSelect(this._type);
      }
    }
    // disabled should be processed in separate cycle after selected,
    // because disabled node initially might be selected!!!
    this._nodes.forEach(node => {
      if (node.initTreeNode.disabled) {
        node.handleDisable(this._type);
      }
      node.handleSearch(searchValue);
    });

    // effectivelySelected should be processed in separate cycle after disabled
    this._nodes.forEach(node => {
      node.handleEffectivelySelected(this._type);
    });
  };

  public isEffectivelySelected = (): boolean => {
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

  public handleSearch = (value: string): void => {
    this._nodes.forEach(node => node.handleSearch(value));
  };

  public resetSearch = (): void => {
    this._nodes.forEach(node => node.resetSearch());
  };

  public findById = (id: string): Node | undefined => {
    return this._nodeMap.get(id);
  };
}
