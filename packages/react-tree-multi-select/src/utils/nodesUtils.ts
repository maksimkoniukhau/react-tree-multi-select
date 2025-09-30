import {CheckedState, TreeNode, Type} from '../types';
import {PATH_DELIMITER} from '../constants';
import {Node} from '../Node';

export const mapTreeNodeToNode = (
  treeNode: TreeNode,
  path: string,
  parent: Node | null,
  nodeMap: Map<string, Node>
): Node => {
  const parentPath = parent?.path || '';
  const delimiter = parentPath ? PATH_DELIMITER : '';
  const nodePath = parentPath + delimiter + path;
  const children: TreeNode[] = treeNode.children || [];
  const expanded = Boolean(children.length && treeNode.expanded);

  const initTreeNode = Object.assign(Object.create(Object.getPrototypeOf(treeNode)), treeNode);

  const node: Node = new Node(
    nodePath,
    treeNode.label,
    parent,
    nodePath.split(PATH_DELIMITER).length - 1,
    expanded,
    initTreeNode
  );

  node.children = children.map((child, index) => mapTreeNodeToNode(child, index.toString(), node, nodeMap));
  node.initTreeNode.children = treeNode.children && node.children.map(child => child.initTreeNode);

  nodeMap.set(nodePath, node);

  return node;
};

const fillArrayFromTreeArray = (treeArray: Node[], nodeArray: Node[]): void => {
  treeArray?.forEach(node => {
    nodeArray.push(node);
    if (node.children.length) {
      fillArrayFromTreeArray(node.children, nodeArray);
    }
  });
};

export const convertTreeArrayToFlatArray = (treeArray: Node[]): Node[] => {
  const nodeArray: Node[] = [];
  fillArrayFromTreeArray(treeArray, nodeArray);
  return nodeArray;
};

export const areAllExcludingDisabledSelected = (nodes: Node[], type: Type): boolean => {
  return nodes
    .filter(node => !node.disabled)
    .every(node => node.shouldBeUnselected(type));
};

export const isAnyExcludingDisabledSelected = (nodes: Node[]): boolean => {
  return nodes
    .filter(node => !node.disabled)
    .some(node => node.selected);
};

export const isAnyHasChildren = (nodes: Node[]): boolean => {
  return nodes.some(node => node.hasChildren());
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
