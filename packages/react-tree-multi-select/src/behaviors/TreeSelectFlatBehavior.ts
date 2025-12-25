import {SelectionState} from '../innerTypes';
import {HierarchicalBehavior} from './HierarchicalBehavior';
import {Node} from '../Node';

export class TreeSelectFlatBehavior extends HierarchicalBehavior {

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
