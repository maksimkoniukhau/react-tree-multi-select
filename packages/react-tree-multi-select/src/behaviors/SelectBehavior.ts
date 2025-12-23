import {SelectionState} from '../innerTypes';
import {NodesBehavior} from './NodesBehavior';
import {Node} from '../Node';

export class SelectBehavior implements NodesBehavior {

  syncSelected(selectedIds: Set<string>): SelectionState {
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
    nodeMap: Map<string, Node>
  ): SelectionState {
    if (node.disabled) {
      return selectionState;
    }
    const selectedIds = selectionState.selectedIds;
    if (selectedIds.size > 0 && selectedIds.values().every(id => nodeMap.get(id)?.disabled)) {
      return selectionState;
    } else {
      return {
        selectedIds: select ? new Set([node.id]) : new Set(),
        effectivelySelectedIds: select ? new Set([node.id]) : new Set(),
        partiallySelectedIds: new Set(),
        someDescendantSelectedIds: new Set()
      };
    }
  };

  computeAllSelected(
    select: boolean,
    selectionState: SelectionState,
    _roots: Node[],
    nodeMap: Map<string, Node>
  ): SelectionState {
    if (select) {
      return selectionState;
    } else {
      const selectedIds = selectionState.selectedIds;
      if (selectedIds.size > 0 && selectedIds.values().every(id => nodeMap.get(id)?.disabled)) {
        return selectionState;
      } else {
        return {
          selectedIds: new Set(),
          effectivelySelectedIds: new Set(),
          partiallySelectedIds: new Set(),
          someDescendantSelectedIds: new Set()
        };
      }
    }
  };
}
