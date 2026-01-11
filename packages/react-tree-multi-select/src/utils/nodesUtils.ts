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

export const filterChips = (type: Type, nodes: Node[], selectedIds: Set<string>): Node[] => {
  return type === Type.TREE_SELECT
    ? nodes.filter(node => selectedIds.has(node.id)
      && (!node.parent || !selectedIds.has(node.parent.id)))
    : nodes.filter(node => selectedIds.has(node.id));
};

export const getOrderedIds = (setIds: Set<string>, nodesManager: NodesManager): string[] => {
  return nodesManager.nodes.filter(node => setIds.has(node.id)).map(node => node.id);
};

export const calculateSelectionAggregateState = (
  selectedIds: string[],
  effectivelySelectedIds: string[],
  allNodes: Node[]
): SelectionAggregateState => {
  if (allNodes.length === 0) {
    return SelectionAggregateState.NONE;
  }
  if (selectedIds.length === allNodes.length) {
    return SelectionAggregateState.ALL;
  }
  if (effectivelySelectedIds.length === allNodes.length) {
    return SelectionAggregateState.EFFECTIVE_ALL;
  }
  return selectedIds.length > 0 ? SelectionAggregateState.PARTIAL : SelectionAggregateState.NONE;
};

export const normalizeSelectedIds = (selectedIds: string[] = [], type: Type) => {
  return type === Type.SINGLE_SELECT ? selectedIds.slice(0, 1) : selectedIds;
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
