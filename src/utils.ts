import React from 'react';
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
