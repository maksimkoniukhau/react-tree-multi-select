import {TreeNode} from '../types';
import {ExpansionState} from '../innerTypes';
import {BaseNodesBehavior} from './BaseNodesBehavior';
import {Node} from '../Node';

export abstract class HierarchicalBehavior extends BaseNodesBehavior {

  mapTreeNodeToNode = (
    treeNode: TreeNode,
    depth: number,
    parentId: string | null,
    nodeMap: Map<string, Node>
  ): Node => {
    const id = treeNode.id;
    const childrenDepth = depth + 1;
    const children = treeNode.children?.map(child => {
      return this.mapTreeNodeToNode(child, childrenDepth, id, nodeMap);
    }) || [];

    return this.createNode(id, treeNode, depth, parentId, nodeMap, children);
  };

  syncExpanded(expandedIds: Set<string>, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState {
    const newExpandedIds = isSearchMode ? new Set(expansionState.expandedIds) : new Set(expandedIds);
    const newSearchExpandedIds = isSearchMode ? new Set(expandedIds) : new Set(expansionState.searchExpandedIds);
    return {
      expandedIds: newExpandedIds,
      searchExpandedIds: newSearchExpandedIds
    };
  };

  computeExpanded(node: Node, expand: boolean, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState {
    const newExpandedIds = new Set(expansionState.expandedIds);
    const newSearchExpandedIds = new Set(expansionState.searchExpandedIds);
    const newExpansionState = {
      expandedIds: newExpandedIds,
      searchExpandedIds: newSearchExpandedIds
    };
    if (node.canExpand()) {
      if (isSearchMode) {
        if (expand) {
          newSearchExpandedIds.add(node.id);
        } else {
          newSearchExpandedIds.delete(node.id);
        }
      } else {
        if (expand) {
          newExpandedIds.add(node.id);
        } else {
          newExpandedIds.delete(node.id);
        }
      }
    }
    return newExpansionState;
  };
}
