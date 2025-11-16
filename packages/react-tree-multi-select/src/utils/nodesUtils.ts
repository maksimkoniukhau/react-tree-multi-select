import {CheckedState, TreeNode, Type} from '../types';
import {PATH_DELIMITER} from '../constants';
import {Node} from '../Node';

export const mapTreeNodeToNode = (
  treeNode: TreeNode,
  path: string,
  parent: Node | null,
  nodeMap: Map<string, Node>
): Node => {
  const parentPath = parent?.path ?? '';
  const delimiter = parentPath ? PATH_DELIMITER : '';
  const nodePath = parentPath + delimiter + path;
  const id = treeNode.id ?? nodePath;
  const skipDropdownVirtualFocus = treeNode.skipDropdownVirtualFocus ?? false;
  const children: TreeNode[] = treeNode.children ?? [];
  const expanded = Boolean(children.length && treeNode.expanded);

  const initTreeNode: TreeNode = Object.assign(Object.create(Object.getPrototypeOf(treeNode)), treeNode);

  const node: Node = new Node(
    nodePath,
    id,
    treeNode.label,
    skipDropdownVirtualFocus,
    parent,
    nodePath.split(PATH_DELIMITER).length - 1,
    expanded,
    initTreeNode
  );

  node.children = children.map((child, index) => mapTreeNodeToNode(child, index.toString(), node, nodeMap));
  node.initTreeNode.children = treeNode.children && node.children.map(child => child.initTreeNode);

  nodeMap.set(id, node);

  return node;
};

const fillArrayFromTreeArray = (treeArray: Node[], nodeArray: Node[]): void => {
  treeArray?.forEach(node => {
    nodeArray.push(node);
    if (node.hasChildren()) {
      fillArrayFromTreeArray(node.children, nodeArray);
    }
  });
};

export const convertTreeArrayToFlatArray = (treeArray: Node[]): Node[] => {
  const nodeArray: Node[] = [];
  fillArrayFromTreeArray(treeArray, nodeArray);
  return nodeArray;
};

export const filterChips = (nodes: Node[], type: Type): Node[] => {
  return type === Type.TREE_SELECT
    ? nodes.filter(node => node.selected && !node.parent?.selected)
    : nodes.filter(node => node.selected);
};

export const getSelectAllCheckedState = (selectedNodes: Node[], allNodes: Node[]): CheckedState => {
  return selectedNodes.length === allNodes.length
    ? CheckedState.SELECTED
    : selectedNodes.length === 0
      ? CheckedState.UNSELECTED
      : CheckedState.PARTIAL;
};
