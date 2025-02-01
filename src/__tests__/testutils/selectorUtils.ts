export const getRootContainer = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-tree-multi-select') as HTMLElement;
};

export const getField = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-field') as HTMLElement;
};

export const getDropdown = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rtms-dropdown') as HTMLElement;
};
