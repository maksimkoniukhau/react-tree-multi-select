import {TreeNode} from '../types';
import {ExpansionState, SelectionState} from '../innerTypes';
import {Node} from '../Node';

export interface NodesBehavior<T extends TreeNode<T>> {

  mapTreeNodeToNode(
    treeNode: T,
    depth: number,
    parentId: string | null,
    nodeMap: Map<string, Node<T>>,
    treeNodeMap: Map<string, T>
  ): Node<T>;

  syncSelected(selectedIds: Set<string>, roots: Node<T>[]): SelectionState;

  computeSelected(
    node: Node<T>,
    select: boolean,
    selectionState: SelectionState,
    nodeMap: Map<string, Node<T>>
  ): SelectionState;

  computeAllSelected(
    select: boolean,
    selectionState: SelectionState,
    roots: Node<T>[],
    nodeMap: Map<string, Node<T>>
  ): SelectionState;

  syncExpanded(expandedIds: Set<string>, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState;

  computeExpanded(node: Node<T>, expand: boolean, isSearchMode: boolean, expansionState: ExpansionState): ExpansionState;
}
