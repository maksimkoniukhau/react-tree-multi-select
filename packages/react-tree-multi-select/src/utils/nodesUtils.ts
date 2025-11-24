import {CheckedState, Type} from '../types';
import {Node} from '../Node';

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
