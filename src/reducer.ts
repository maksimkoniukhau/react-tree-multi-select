import {CheckedState} from './types';
import {Node} from './Node';

export interface DataChangePayload {
  nodes: Node[];
  displayedNodes: Node[];
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface InputChangePayload {
  searchValue: string;
  displayedNodes: Node[];
}

export interface NodeChangePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface SelectAllChangePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface ChipDeletePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface ClearAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface NodeTogglePayload {
  displayedNodes: Node[];
}

export interface ResetPayload {
  searchValue: string;
}

export enum ActionType {
  DATA_CHANGE,
  INPUT_CHANGE,
  NODE_CHANGE,
  SELECT_ALL_CHANGE,
  CHIP_DELETE,
  CLEAR_ALL,
  NODE_TOGGLE,
  RESET
}

export type Payload = DataChangePayload
  | InputChangePayload
  | NodeChangePayload
  | SelectAllChangePayload
  | ChipDeletePayload
  | ClearAllPayload
  | NodeTogglePayload
  | ResetPayload;

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface State {
  nodes: Node[];
  displayedNodes: Node[];
  selectedNodes: Node[];
  searchValue: string;
  selectAllCheckedState: CheckedState;
}

export const initialState: State = {
  nodes: [],
  displayedNodes: [],
  selectedNodes: [],
  searchValue: '',
  selectAllCheckedState: CheckedState.UNSELECTED
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.DATA_CHANGE:
    case ActionType.INPUT_CHANGE:
    case ActionType.NODE_CHANGE:
    case ActionType.SELECT_ALL_CHANGE:
    case ActionType.CHIP_DELETE:
    case ActionType.CLEAR_ALL:
    case ActionType.NODE_TOGGLE: {
      return {
        ...state,
        ...action.payload
      };
    }
    case ActionType.RESET: {
      const payload = action.payload as ResetPayload;
      state.nodes.forEach(node => {
        node.searchExpanded = false;
        node.matched = false;
        node.filtered = true;
      });
      const displayedNodes = state.nodes
        .filter(node => node.isDisplayed(false));

      return {
        ...state,
        ...payload,
        displayedNodes
      };
    }
    default:
      return state;
  }
};
