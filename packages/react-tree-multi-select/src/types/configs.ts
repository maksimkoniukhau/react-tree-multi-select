/**
 * Configuration options for keyboard behavior in the Field component.
 */
export type FieldKeyboardOptions = {
  /**
   * Enables looping when navigating left with the ArrowLeft key.
   * If `true`, pressing ArrowLeft on the first item will move focus to the last item.
   *
   * @default false
   */
  loopLeft?: boolean;

  /**
   * Enables looping when navigating right with the ArrowRight key.
   * If `true`, pressing ArrowRight on the last item will move focus to the first item.
   *
   * @default false
   */
  loopRight?: boolean;
};

/**
 * Configuration options for keyboard behavior in the Dropdown component.
 */
export type DropdownKeyboardOptions = {
  /**
   * Enables looping when navigating upward with the ArrowUp key.
   * If `true`, pressing ArrowUp on the first item will move focus to the last item.
   *
   * @default true
   */
  loopUp?: boolean;

  /**
   * Enables looping when navigating downward with the ArrowDown key.
   * If `true`, pressing ArrowDown on the last item will move focus to the first item.
   *
   * @default true
   */
  loopDown?: boolean;
};

/**
 * Controls keyboard navigation behavior for the component.
 */
export type KeyboardConfig = {
  /**
   * Configuration for the Field component.
   */
  field?: FieldKeyboardOptions;

  /**
   * Configuration for the Dropdown component.
   */
  dropdown?: DropdownKeyboardOptions;
};

/**
 * Controls when the Footer component is rendered in the dropdown.
 */
export type FooterConfig = {
  /**
   * Renders the Footer when the component is in the search mode (when the input contains value).
   *
   * @default false
   */
  showWhenSearching?: boolean;

  /**
   * Renders the Footer when no items are available in the dropdown
   * (takes precedence over `showWhenSearching` if both apply).
   *
   * @default false
   */
  showWhenNoItems?: boolean;
};
