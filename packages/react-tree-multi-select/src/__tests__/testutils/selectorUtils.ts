export const getRootContainer = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-tree-multi-select') as HTMLElement;
};

export const getField = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-field') as HTMLElement;
};

export const getChipContainers = (container: HTMLElement): HTMLElement[] => {
  return Array.from(getField(container).querySelectorAll('.rtms-chip')) as HTMLElement[];
};

export const getChipContainer = (container: HTMLElement, index: number): HTMLElement => {
  return getChipContainers(container)[index];
};

export const getChipLabel = (container: HTMLElement, index: number): HTMLElement => {
  return getChipContainers(container)[index].querySelector('.rtms-label') as HTMLElement;
};

export const getChipClears = (container: HTMLElement): HTMLElement[] => {
  return Array.from(getField(container).querySelectorAll('.rtms-chip-clear')) as HTMLElement[];
};

export const getChipClear = (container: HTMLElement, index: number): HTMLElement => {
  return getChipContainers(container)[index].querySelector('.rtms-chip-clear') as HTMLElement;
};

export const getFieldInput = (container: HTMLElement): HTMLElement => {
  return getField(container).querySelector('.rtms-input') as HTMLElement;
};

export const getHiddenInput = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-input-hidden') as HTMLElement;
};

export const getFieldClear = (container: HTMLElement): HTMLElement => {
  return getField(container).querySelector('.rtms-field-clear') as HTMLElement;
};

export const getFieldToggle = (container: HTMLElement): HTMLElement => {
  return getField(container).querySelector('.rtms-field-toggle') as HTMLElement;
};

export const getDropdown = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-dropdown') as HTMLElement;
};

export const getDropdownListOuter = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-dropdown-list-outer') as HTMLElement;
};


export const getDropdownInput = (container: HTMLElement): HTMLElement => {
  return getDropdown(container).querySelector('.rtms-input') as HTMLElement;
};

export const getStickyItems = (container: HTMLElement): HTMLElement[] => {
  return Array.from(getDropdown(container).querySelectorAll('.rtms-sticky-item')) as HTMLElement[];
};

export const getStickyItem = (container: HTMLElement, index: number): HTMLElement => {
  return getStickyItems(container)[index];
};

export const getListItems = (container: HTMLElement): HTMLElement[] => {
  return Array.from(getDropdown(container).querySelectorAll('.rtms-list-item')) as HTMLElement[];
};

export const getListItem = (container: HTMLElement, index: number): HTMLElement => {
  return getListItems(container)[index];
};

export const getNodeToggle = (container: HTMLElement, index: number): HTMLElement => {
  return getListItems(container)[index].querySelector('.rtms-node-toggle') as HTMLElement;
};
