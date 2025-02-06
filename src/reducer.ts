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

export interface ClickFieldPayload {
  showDropdown: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ShowSelectAllPayload {
  showSelectAll: boolean;
}

export interface ChangeInputPayload {
  searchValue: string;
  displayedNodes: Node[];
  showSelectAll: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ClickChipPayload {
  showDropdown: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface TogglePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ToggleAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface UnselectPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface UnselectAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface ExpandPayload {
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
  CLICK_FIELD,
  SHOW_SELECT_ALL,
  CHANGE_INPUT,
  CLICK_CHIP,
  TOGGLE,
  TOGGLE_ALL,
  UNSELECT,
  UNSELECT_ALL,
  EXPAND,
  FOCUS,
  RESET
}

export type Payload = InitPayload
  | ToggleDropdownPayload
  | ClickFieldPayload
  | ShowSelectAllPayload
  | ChangeInputPayload
  | ClickChipPayload
  | TogglePayload
  | ToggleAllPayload
  | UnselectPayload
  | UnselectAllPayload
  | ExpandPayload
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
    case ActionType.CLICK_FIELD:
    case ActionType.SHOW_SELECT_ALL:
    case ActionType.CHANGE_INPUT:
    case ActionType.CLICK_CHIP:
    case ActionType.TOGGLE:
    case ActionType.TOGGLE_ALL:
    case ActionType.UNSELECT:
    case ActionType.UNSELECT_ALL:
    case ActionType.EXPAND:
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
