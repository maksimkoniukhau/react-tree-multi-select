import {TreeNode} from '../types';
import {ExpansionState, SelectionState} from '../innerTypes';
import {Node} from '../Node';

export interface NodesBehavior {

  mapTreeNodeToNode(treeNode: TreeNode, depth: number, parentId: string | null, nodeMap: Map<string, Node>): Node;

  syncSelected(selectedIds: Set<string>, roots: Node[]): SelectionState;

  computeSelected(
    node: Node,
    select: boolean,
    selectionState: SelectionState,
    nodeMap: Map<string, Node>
  ): SelectionState;

  computeAllSelected(
    select: boolean,
    selectionState: SelectionState,
    roots: Node[],
    nodeMap: Map<string, Node>
  ): SelectionState;

  syncExpanded(expandedIds: Set<string>, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState;

  computeExpanded(node: Node, expand: boolean, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState;
}
