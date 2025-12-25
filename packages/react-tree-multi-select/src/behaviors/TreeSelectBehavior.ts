import {SelectionState} from '../innerTypes';
import {HierarchicalBehavior} from './HierarchicalBehavior';
import {Node} from '../Node';

export class TreeSelectBehavior extends HierarchicalBehavior {

  syncSelected(selectedIds: Set<string>, roots: Node[]): SelectionState {
    const allSelectedIds = new Set<string>();
    const allEffectivelySelectedIds = new Set<string>();
    const allPartiallySelectedIds = new Set<string>();
    const allSomeDescendantSelectedIds = new Set<string>();

    for (const root of roots) {
      const nodesSelectionState = this.computeRootSelectionState(root, selectedIds);
      for (const id of nodesSelectionState.selectedIds) {
        allSelectedIds.add(id);
      }
      for (const id of nodesSelectionState.effectivelySelectedIds) {
        allEffectivelySelectedIds.add(id);
      }
      for (const id of nodesSelectionState.partiallySelectedIds) {
        allPartiallySelectedIds.add(id);
      }
      for (const id of nodesSelectionState.someDescendantSelectedIds) {
        allSomeDescendantSelectedIds.add(id);
      }
    }
    return {
      selectedIds: allSelectedIds,
      effectivelySelectedIds: allEffectivelySelectedIds,
      partiallySelectedIds: allPartiallySelectedIds,
      someDescendantSelectedIds: allSomeDescendantSelectedIds
    };
  };

  private computeRootSelectionState = (root: Node, propsSelectedIds: Set<string>): SelectionState => {
    const selectedIds = new Set<string>();
    const effectivelySelectedIds = new Set<string>();
    const partiallySelectedIds = new Set<string>();
    const someDescendantSelectedIds = new Set<string>();

    function computeHierarchicalSelection(node: Node, newSelectedIds: Set<string>): void {
      const children = node.children ?? [];

      for (const child of children) {
        computeHierarchicalSelection(child, newSelectedIds);
      }

      const selected = newSelectedIds.has(node.id);

      if (selected) {
        selectedIds.add(node.id);
      }

      if (children.length === 0) {
        if (selected || node.disabled) {
          effectivelySelectedIds.add(node.id);
        }
      } else {
        const someDescendantSelected = node.children
          .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
        const allChildrenEffectivelySelected = node.children
          .every(child => effectivelySelectedIds.has(child.id));
        const allChildrenSelected = node.children.every(child => selectedIds.has(child.id));

        if (allChildrenEffectivelySelected) {
          effectivelySelectedIds.add(node.id);
        }
        if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
          partiallySelectedIds.add(node.id);
        }
        if (someDescendantSelected) {
          someDescendantSelectedIds.add(node.id);
        }
      }
    }

    computeHierarchicalSelection(root, propsSelectedIds);

    return {selectedIds, effectivelySelectedIds, partiallySelectedIds, someDescendantSelectedIds};
  };

  computeSelected(node: Node, select: boolean, selectionState: SelectionState): SelectionState {
    if (node.disabled) {
      return selectionState;
    }
    const selectedIds = new Set(selectionState.selectedIds);
    const effectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set(selectionState.partiallySelectedIds);
    const someDescendantSelectedIds = new Set(selectionState.someDescendantSelectedIds);

    this.setSelectedSubtree(node, selectedIds, select);
    this.setSelectedAncestors(node, selectedIds, select);

    const setHierarchicalSelected = (node: Node): void => {
      const children = node.children ?? [];

      for (const child of children) {
        setHierarchicalSelected(child);
      }

      const selected = selectedIds.has(node.id);

      if (children.length === 0) {
        if (selected || node.disabled) {
          effectivelySelectedIds.add(node.id);
        } else {
          effectivelySelectedIds.delete(node.id);
        }
      } else {
        const someDescendantSelected = children
          .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
        const allChildrenEffectivelySelected = children
          .every(child => effectivelySelectedIds.has(child.id));
        const allChildrenSelected = children.every(child => selectedIds.has(child.id));

        if (allChildrenEffectivelySelected) {
          effectivelySelectedIds.add(node.id);
        } else {
          effectivelySelectedIds.delete(node.id);
        }
        if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
          partiallySelectedIds.add(node.id);
        } else {
          partiallySelectedIds.delete(node.id);
        }
        if (someDescendantSelected) {
          someDescendantSelectedIds.add(node.id);
        } else {
          someDescendantSelectedIds.delete(node.id);
        }
      }
    };

    setHierarchicalSelected(this.getRoot(node));

    return {selectedIds, effectivelySelectedIds, partiallySelectedIds, someDescendantSelectedIds};
  };

  private setSelectedSubtree = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    const children = node.children ?? [];

    for (const child of children) {
      this.setSelectedSubtree(child, selectedIds, select);
    }

    if (!node.disabled) {
      if (children.length === 0) {
        if (select) {
          selectedIds.add(node.id);
        } else {
          selectedIds.delete(node.id);
        }
      } else {
        const allChildrenSelected = children.every(child => selectedIds.has(child.id));
        if (select && allChildrenSelected) {
          selectedIds.add(node.id);
        } else {
          selectedIds.delete(node.id);
        }
      }
    }
  };

  private setSelectedAncestors = (node: Node, selectedIds: Set<string>, select: boolean): void => {
    const parentNode = node.parent;
    if (parentNode) {
      if (!parentNode.disabled) {
        const allChildrenSelected = parentNode.children.every(child => selectedIds.has(child.id));
        if (select && allChildrenSelected) {
          selectedIds.add(parentNode.id);
        } else {
          selectedIds.delete(parentNode.id);
        }
      }
      this.setSelectedAncestors(parentNode, selectedIds, select);
    }
  };

  private getRoot = (node: Node): Node => {
    const getNodeRoot = (node: Node): Node => {
      if (node.parent) {
        return getNodeRoot(node.parent);
      }
      return node;
    };
    return getNodeRoot(node);
  };

  computeAllSelected(select: boolean, selectionState: SelectionState, roots: Node[]): SelectionState {
    const selectedIds = new Set(selectionState.selectedIds);
    const effectivelySelectedIds = new Set(selectionState.effectivelySelectedIds);
    const partiallySelectedIds = new Set<string>(selectionState.partiallySelectedIds);
    const someDescendantSelectedIds = new Set<string>(selectionState.someDescendantSelectedIds);

    const setAllSelected = (root: Node, select: boolean): void => {
      const setHierarchicalSelected = (node: Node): void => {
        const children = node.children ?? [];

        for (const child of children) {
          setHierarchicalSelected(child);
        }

        if (children.length === 0) {
          if (!node.disabled) {
            if (select) {
              selectedIds.add(node.id);
            } else {
              selectedIds.delete(node.id);
            }
          }
          const selected = selectedIds.has(node.id);
          if (selected || node.disabled) {
            effectivelySelectedIds.add(node.id);
          } else {
            effectivelySelectedIds.delete(node.id);
          }
          partiallySelectedIds.delete(node.id);
          someDescendantSelectedIds.delete(node.id);
        } else {
          const someDescendantSelected = children
            .some(child => selectedIds.has(child.id) || someDescendantSelectedIds.has(child.id));
          const allChildrenEffectivelySelected = children
            .every(child => effectivelySelectedIds.has(child.id));
          const allChildrenSelected = children.every(child => selectedIds.has(child.id));

          if (!node.disabled) {
            if (select && allChildrenSelected) {
              selectedIds.add(node.id);
            } else {
              selectedIds.delete(node.id);
            }
          }

          if (allChildrenEffectivelySelected) {
            effectivelySelectedIds.add(node.id);
          } else {
            effectivelySelectedIds.delete(node.id);
          }
          if (!node.disabled && !allChildrenSelected && someDescendantSelected) {
            partiallySelectedIds.add(node.id);
          } else {
            partiallySelectedIds.delete(node.id);
          }
          if (someDescendantSelected) {
            someDescendantSelectedIds.add(node.id);
          } else {
            someDescendantSelectedIds.delete(node.id);
          }
        }
      };
      setHierarchicalSelected(root);
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
