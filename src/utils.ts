import React from 'react';
import {PATH_DELIMITER} from './constants';
import {Node} from './Node';
import {Type} from './models';

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

export const getParentPath = (path: string): string => {
  return path.substring(0, path.lastIndexOf(PATH_DELIMITER));
};

export const getAllAncestorsPaths = (path: string): string[] => {
  if (!path || path.length === 1) {
    return [];
  }
  const parentPaths: string[] = [];
  let parentPath = getParentPath(path);
  while (parentPath) {
    parentPaths.push(parentPath);
    parentPath = getParentPath(parentPath);
  }
  return parentPaths;
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
  return nodes
    .filter(node => node.hasChildren())
    .length > 0;
};

export const filterChips = (nodes: Node[], type: Type): Node[] => {
  return type === Type.MULTISELECT_TREE
    ? nodes.filter(node => node.selected && !node.parent?.selected)
    : nodes.filter(node => node.selected);
};

export const preventDefaultOnMouseEvent = (e: React.MouseEvent<Element>): void => {
  e.preventDefault();
};

/**
 * Gets keyboard-focusable elements within a specified element
 * @param {HTMLElement} [element=document] element
 * @returns {Array}
 */
export const getKeyboardFocusableElements = (element: Element): Element[] => {
  return Array.from(element.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled')
      && !el.getAttribute('aria-hidden'));
};
