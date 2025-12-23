import {SelectionState} from '../innerTypes';
import {NodesBehavior} from './NodesBehavior';
import {Node} from '../Node';

export class MultiSelectBehavior implements NodesBehavior {

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
}
