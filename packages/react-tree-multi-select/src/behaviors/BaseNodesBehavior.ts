import {TreeNode} from '../types';
import {ExpansionState, SelectionState} from '../innerTypes';
import {NodesBehavior} from './NodesBehavior';
import {Node} from '../Node';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export abstract class BaseNodesBehavior<T extends TreeNode<T> = any> implements NodesBehavior<T> {

  mapTreeNodeToNode = (
    treeNode: T,
    depth: number,
    parentId: string | null,
    nodeMap: Map<string, Node>,
    treeNodeMap: Map<string, T>
  ): Node => {
    return this.createNode(treeNode.id, treeNode, depth, parentId, nodeMap, treeNodeMap);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syncSelected(selectedIds: Set<string>, _roots: Node[]): SelectionState {
    return {
      selectedIds: new Set(selectedIds),
      effectivelySelectedIds: new Set(selectedIds),
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  computeSelected(
    node: Node,
    select: boolean,
    selectionState: SelectionState,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _nodeMap: Map<string, Node>
  ): SelectionState {
    if (node.disabled) {
      return selectionState;
    }
    const newSelectedIds = new Set(selectionState.selectedIds);
    const newEffectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    if (select) {
      newSelectedIds.add(node.id);
      newEffectivelySelectedIds.add(node.id);
    } else {
      newSelectedIds.delete(node.id);
      newEffectivelySelectedIds.delete(node.id);
    }
    return {
      selectedIds: newSelectedIds,
      effectivelySelectedIds: newEffectivelySelectedIds,
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  abstract computeAllSelected(
    select: boolean,
    selectionState: SelectionState,
    roots: Node[],
    nodeMap: Map<string, Node>
  ): SelectionState;

  syncExpanded(_expandedIds: Set<string>, _isSearchMode: boolean, expansionState: ExpansionState): ExpansionState {
    return expansionState;
  };

  computeExpanded(
    _node: Node,
    _expand: boolean,
    _isSearchMode: boolean,
    expansionState: ExpansionState
  ): ExpansionState {
    return expansionState;
  };

  protected createNode(
    id: string,
    treeNode: T,
    depth: number,
    parentId: string | null,
    nodeMap: Map<string, Node>,
    treeNodeMap: Map<string, T>,
    children: Node[] = []
  ): Node {
    const node: Node = new Node(
      treeNodeMap,
      nodeMap,
      id,
      treeNode.label,
      treeNode.skipDropdownVirtualFocus ?? false,
      parentId,
      children,
      treeNode.hasChildren ?? false,
      depth,
      treeNode.disabled ?? false
    );

    treeNodeMap.set(id, treeNode);
    nodeMap.set(id, node);
    return node;
  };
}
