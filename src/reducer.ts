import {CheckedState} from './types';
import {Node} from './Node';

export interface InitPayload {
  nodes: Node[];
  displayedNodes: Node[];
  selectedNodes: Node[];
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
}

export interface ToggleDropdownPayload {
  showDropdown: boolean;
  focusedElement: string;
}

export interface FieldClickPayload {
  showDropdown: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ShowSelectAllPayload {
  showSelectAll: boolean;
}

export interface InputChangePayload {
  searchValue: string;
  displayedNodes: Node[];
  showSelectAll: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ChipClickPayload {
  showDropdown: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface NodeChangePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface SelectAllChangePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ChipDeletePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ClearAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface NodeTogglePayload {
  displayedNodes: Node[];
  focusedFieldElement: string;
  focusedElement: string;
}

export interface FocusPayload {
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ResetPayload {
  showDropdown: boolean;
  searchValue: string;
  focusedFieldElement: string;
  focusedElement: string;
}

export enum ActionType {
  INIT,
  TOGGLE_DROPDOWN,
  FIELD_CLICK,
  SHOW_SELECT_ALL,
  INPUT_CHANGE,
  CHIP_CLICK,
  NODE_CHANGE,
  SELECT_ALL_CHANGE,
  CHIP_DELETE,
  CLEAR_ALL,
  NODE_TOGGLE,
  FOCUS,
  RESET
}

export type Payload = InitPayload
  | ToggleDropdownPayload
  | FieldClickPayload
  | ShowSelectAllPayload
  | InputChangePayload
  | ChipClickPayload
  | NodeChangePayload
  | SelectAllChangePayload
  | ChipDeletePayload
  | ClearAllPayload
  | NodeTogglePayload
  | FocusPayload
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
  showDropdown: boolean;
  showSelectAll: boolean;

  focusedFieldElement: string;
  focusedElement: string;
  selectAllCheckedState: CheckedState;
}

export const initialState: State = {
  nodes: [],
  displayedNodes: [],
  selectedNodes: [],

  searchValue: '',
  showDropdown: false,
  showSelectAll: false,

  focusedFieldElement: '',
  focusedElement: '',
  selectAllCheckedState: CheckedState.UNSELECTED
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INIT: {
      const payload = action.payload as InitPayload;
      return {
        ...initialState,
        ...payload
      };
    }
    case ActionType.TOGGLE_DROPDOWN:
    case ActionType.FIELD_CLICK:
    case ActionType.SHOW_SELECT_ALL:
    case ActionType.INPUT_CHANGE:
    case ActionType.CHIP_CLICK:
    case ActionType.NODE_CHANGE:
    case ActionType.SELECT_ALL_CHANGE:
    case ActionType.CHIP_DELETE:
    case ActionType.CLEAR_ALL:
    case ActionType.NODE_TOGGLE:
    case ActionType.FOCUS: {
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
