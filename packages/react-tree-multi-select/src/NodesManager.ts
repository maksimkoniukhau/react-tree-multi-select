import {TreeNode, Type} from './types';
import {convertTreeArrayToFlatArray, mapTreeNodeToNode} from './utils/nodesUtils';
import {Node} from './Node';

export class NodesManager {

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

  get nodeMap(): Map<string, Node> {
    return this._nodeMap;
  }

  get copiedData(): TreeNode[] {
    return this._copiedData;
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  private initialize = (data: TreeNode[], type: Type, searchValue: string) => {
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

    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT) {
      this._nodes = convertTreeArrayToFlatArray(this._roots);
    }
    if (type === Type.TREE_SELECT || type === Type.TREE_SELECT_FLAT || type === Type.MULTI_SELECT) {
      this._nodes.forEach(node => {
        if (node.initTreeNode.selected) {
          node.handleSelect(type);
        }
      });
    }
    if (type === Type.SELECT) {
      const lastSelectedNode = this._nodes.findLast(node => node.initTreeNode.selected);
      if (lastSelectedNode) {
        lastSelectedNode.handleSelect(type);
      }
    }
    // disabled should be processed in separate cycle after selected,
    // cause disabled node initially might be selected!!!
    this._nodes.forEach(node => {
      if (node.initTreeNode.disabled) {
        node.handleDisable(type);
      }
      node.handleSearch(searchValue);
    });
  };
}
