import {SelectionState} from '../innerTypes';
import {Node} from '../Node';

export interface NodesBehavior {

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
}
