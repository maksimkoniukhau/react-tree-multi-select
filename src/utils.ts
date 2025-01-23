import React, {RefObject} from 'react';
import {Node} from './Node';
import {Type} from './types';

const fillArrayFromTreeArray = (treeArray: Node[], nodeArray: Node[]): void => {
  treeArray?.forEach(node => {
    nodeArray.push(node);
    if (node.children.length) {
      fillArrayFromTreeArray(node.children, nodeArray);
    }
  });
};

export const convertTreeArrayToFlatArray = (treeArray: Node[]): Node[] => {
  const nodeArray: Node[] = [];
  fillArrayFromTreeArray(treeArray, nodeArray);
  return nodeArray;
};

export const areAllExcludingDisabledSelected = (nodes: Node[]): boolean => {
  return nodes
    .filter(node => !node.disabled)
    .every(node => node.selected);
};

export const isAnyExcludingDisabledSelected = (nodes: Node[]): boolean => {
  return nodes
    .filter(node => !node.disabled)
    .some(node => node.selected);
};

export const isAnyHasChildren = (nodes: Node[]): boolean => {
  return nodes.some(node => node.hasChildren());
};

export const filterChips = (nodes: Node[], type: Type): Node[] => {
  return type === Type.MULTI_SELECT_TREE
    ? nodes.filter(node => node.selected && !node.parent?.selected)
    : nodes.filter(node => node.selected);
};

export const typeToClassName = (type: Type): string => {
  return `rts-${type.toLowerCase().replaceAll('_', '-')}`;
};

export const preventDefaultOnMouseEvent = (e: React.MouseEvent): void => {
  e.preventDefault();
};

export const getFieldFocusableElement = (fieldRef: RefObject<HTMLDivElement>): HTMLElement | null => {
  const focusableElements = getKeyboardFocusableElements(fieldRef?.current);
  return focusableElements.find(element => element.tagName === 'INPUT') || focusableElements[0] || fieldRef?.current;
};

/**
 * Gets keyboard-focusable html elements within a specified html element
 * @param {HTMLElement} htmlElement
 * @returns {Array<HTMLElement>}
 */
export const getKeyboardFocusableElements = (htmlElement: HTMLElement | null): HTMLElement[] => {
  return Array.from(htmlElement?.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])') || [])
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) as HTMLElement[];
};
