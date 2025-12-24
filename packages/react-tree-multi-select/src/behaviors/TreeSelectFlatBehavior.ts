import {TreeNode} from '../types';
import {ExpansionState, SelectionState} from '../innerTypes';
import {NodesBehavior} from './NodesBehavior';
import {Node} from '../Node';

export class TreeSelectFlatBehavior implements NodesBehavior {

  mapTreeNodeToNode = (
    treeNode: TreeNode,
    depth: number,
    parentId: string | null,
    nodeMap: Map<string, Node>
  ): Node => {
    const childrenDepth = depth + 1;
    const children = treeNode.children?.map(child => {
      return this.mapTreeNodeToNode(child, childrenDepth, null, nodeMap);
    }) || [];

    const id = treeNode.id;

    const node: Node = new Node(
      nodeMap,
      id,
      treeNode.label,
      treeNode.skipDropdownVirtualFocus ?? false,
      parentId,
      children,
      treeNode.hasChildren ?? false,
      depth,
      treeNode.disabled ?? false,
      treeNode
    );

    // After creating current Node, assign its parent to all children
    children.forEach(child => child.parentId = node.id);

    nodeMap.set(id, node);
    return node;
  };

  syncSelected(selectedIds: Set<string>): SelectionState {
    return {
      selectedIds: new Set(selectedIds),
      effectivelySelectedIds: new Set(selectedIds),
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  computeSelected(node: Node, select: boolean, selectionState: SelectionState): SelectionState {
    if (node.disabled) {
      return selectionState;
    }
    return select ? this.computeSelect(node, selectionState) : this.computeDeselect(node, selectionState);
  };

  private computeSelect = (node: Node, selectionState: SelectionState): SelectionState => {
    return {
      selectedIds: new Set(selectionState.selectedIds).add(node.id),
      effectivelySelectedIds: new Set(selectionState.effectivelySelectedIds).add(node.id),
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  private computeDeselect = (node: Node, selectionState: SelectionState): SelectionState => {
    const newSelectedIds = new Set(selectionState.selectedIds);
    newSelectedIds.delete(node.id);
    const newEffectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    newEffectivelySelectedIds.delete(node.id);
    return {
      selectedIds: newEffectivelySelectedIds,
      effectivelySelectedIds: newEffectivelySelectedIds,
      partiallySelectedIds: new Set(),
      someDescendantSelectedIds: new Set()
    };
  };

  computeAllSelected(select: boolean, selectionState: SelectionState, roots: Node[]): SelectionState {
    const selectedIds = new Set(selectionState.selectedIds);
    const effectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set<string>();
    const someDescendantSelectedIds = new Set<string>();

    const setAllSelected = (root: Node, select: boolean): void => {
      const setSelectAll = (node: Node): void => {
        const children = node.children ?? [];
        for (const child of children) {
          setSelectAll(child);
        }
        if (!node.disabled) {
          if (select) {
            selectedIds.add(node.id);
            effectivelySelectedIds.add(node.id);
          } else {
            selectedIds.delete(node.id);
            effectivelySelectedIds.delete(node.id);
          }
        }
      };
      setSelectAll(root);
    };

    for (const root of roots) {
      setAllSelected(root, select);
    }

    return {
      selectedIds,
      effectivelySelectedIds,
      partiallySelectedIds,
      someDescendantSelectedIds
    };
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
