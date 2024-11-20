import {INPUT} from './constants';
import {CheckedState} from './models';
import {Node} from './Node';

export interface InitPayload {
  nodes: Node[];
  displayedNodes: Node[];
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface ToggleDropdownPayload {
  showDropdown: boolean;
}

export interface ChangeInputPayload {
  searchValue: string;
  displayedNodes: Node[];
}

export interface ClickChipPayload {
  showDropdown: boolean;
  focusedFieldElement: string;
  focusedElement: string;
}

export interface TogglePayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedElement: string;
}

export interface ToggleAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
  focusedElement: string;
}

export interface UnselectPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface UnselectAllPayload {
  selectedNodes: Node[];
  selectAllCheckedState: CheckedState;
}

export interface ExpandPayload {
  displayedNodes: Node[];
  focusedElement: string;
}

export interface FocusElementPayload {
  focusedElement: string;
}

export interface FocusFieldElementPayload {
  focusedFieldElement: string;
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
  CHANGE_INPUT,
  CLICK_CHIP,
  TOGGLE,
  TOGGLE_ALL,
  UNSELECT,
  UNSELECT_ALL,
  EXPAND,
  FOCUS_ELEMENT,
  FOCUS_FIELD_ELEMENT,
  RESET
}

export type Payload = InitPayload
  | ToggleDropdownPayload
  | ChangeInputPayload
  | ClickChipPayload
  | TogglePayload
  | ToggleAllPayload
  | UnselectPayload
  | UnselectAllPayload
  | ExpandPayload
  | FocusElementPayload
  | FocusFieldElementPayload
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
    case ActionType.TOGGLE_DROPDOWN: {
      const payload = action.payload as ToggleDropdownPayload;
      return {
        ...state,
        ...payload,
        focusedElement: !payload.showDropdown ? '' : state.focusedElement
      };
    }
    case ActionType.CHANGE_INPUT: {
      const payload = action.payload as ChangeInputPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: INPUT,
        focusedElement: ''
      };
    }
    case ActionType.CLICK_CHIP: {
      const payload = action.payload as ClickChipPayload;
      return {
        ...state,
        ...payload
      };
    }
    case ActionType.TOGGLE: {
      const payload = action.payload as TogglePayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: ''
      };
    }
    case ActionType.TOGGLE_ALL: {
      const payload = action.payload as ToggleAllPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: ''
      };
    }
    case ActionType.UNSELECT: {
      const payload = action.payload as UnselectPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: INPUT,
        focusedElement: ''
      };
    }
    case ActionType.UNSELECT_ALL: {
      const payload = action.payload as UnselectAllPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: INPUT,
        focusedElement: ''
      };
    }
    case ActionType.EXPAND: {
      const payload = action.payload as ExpandPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: ''
      };
    }
    case ActionType.FOCUS_ELEMENT: {
      const payload = action.payload as FocusElementPayload;
      return {
        ...state,
        ...payload,
        focusedFieldElement: payload.focusedElement
          ? ''
          : state.focusedFieldElement
      };
    }
    case ActionType.FOCUS_FIELD_ELEMENT: {
      const payload = action.payload as FocusFieldElementPayload;
      return {
        ...state,
        ...payload,
        focusedElement: payload.focusedFieldElement
          ? ''
          : state.focusedElement
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
