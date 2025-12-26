import {SelectionAggregateState, Type} from '../types';
import {NodesManager} from '../NodesManager';
import {Node} from '../Node';

export const convertTreeArrayToFlatArray = (treeArray: Node[]): Node[] => {
  const flatArray: Node[] = [];
  const fillArrayFromTreeArray = (treeArray: Node[]): void => {
    treeArray?.forEach(node => {
      flatArray.push(node);
      if (node.hasLoadedChildren()) {
        fillArrayFromTreeArray(node.children);
      }
    });
  };
  fillArrayFromTreeArray(treeArray);
  return flatArray;
};

export const filterChips = (nodesManager: NodesManager): Node[] => {
  return nodesManager.type === Type.TREE_SELECT
    ? nodesManager.nodes.filter(node => nodesManager.selectionState.selectedIds.has(node.id)
      && (!node.parent || !nodesManager.selectionState.selectedIds.has(node.parent.id)))
    : nodesManager.nodes.filter(node => nodesManager.selectionState.selectedIds.has(node.id));
};

export const getOrderedIds = (setIds: Set<string>, nodesManager: NodesManager): string[] => {
  return nodesManager.nodes.filter(node => setIds.has(node.id)).map(node => node.id);
};

export const getSelectionAggregateState = (
  selectedIds: string[],
  allNodes: Node[]
): SelectionAggregateState => {
  return selectedIds.length === allNodes.length
    ? SelectionAggregateState.ALL
    : selectedIds.length === 0
      ? SelectionAggregateState.NONE
      : SelectionAggregateState.PARTIAL;
};

export const normalizeSelectedIds = (selectedIds: string[] = [], type: Type) => {
  return type === Type.SELECT ? selectedIds.slice(0, 1) : selectedIds;
};

export const normalizeExpandedIds = (expandedIds: string[] = [], type: Type) => {
  switch (type) {
    case Type.TREE_SELECT:
    case Type.TREE_SELECT_FLAT:
      return expandedIds;
    default:
      return [];
  }
};
