export const getRootContainer = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rts-tree-select') as HTMLElement;
};

export const getField = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rts-field') as HTMLElement;
};

export const getDropdown = (container: HTMLElement): HTMLElement => {
  return container.querySelector('.rts-dropdown') as HTMLElement;
};
