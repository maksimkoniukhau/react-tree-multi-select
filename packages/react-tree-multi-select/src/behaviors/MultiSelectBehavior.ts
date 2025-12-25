import {SelectionState} from '../innerTypes';
import {BaseNodesBehavior} from './BaseNodesBehavior';
import {Node} from '../Node';

export class MultiSelectBehavior extends BaseNodesBehavior {

  computeAllSelected(select: boolean, selectionState: SelectionState, roots: Node[]): SelectionState {
    const selectedIds = new Set(selectionState.selectedIds);
    const effectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set<string>();
    const someDescendantSelectedIds = new Set<string>();

    for (const root of roots) {
      if (!root.disabled) {
        if (select) {
          selectedIds.add(root.id);
          effectivelySelectedIds.add(root.id);
        } else {
          selectedIds.delete(root.id);
          effectivelySelectedIds.delete(root.id);
        }
      }
    }

    return {
      selectedIds,
      effectivelySelectedIds,
      partiallySelectedIds,
      someDescendantSelectedIds
    };
  };
}
