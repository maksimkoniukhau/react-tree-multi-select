import {TreeNode} from 'react-tree-multi-select';
import {treeNodes} from './data';

const buildTreeNodes = (treeNodes: TreeNode[], disabled: string[] = []): TreeNode[] => {
  return treeNodes.map(treeNode => {
    const result: TreeNode = {
      ...treeNode,
      disabled: disabled.some(v => v === treeNode.id)
    };
    if (treeNode.children?.length) {
      result.children = buildTreeNodes(treeNode.children, disabled);
    }
    return result;
  });
};

export const getTreeNodeData = (disabled?: boolean): TreeNode[] => {
  const disabledIndexes = disabled ? ['2', '3', '4', '7', '8', '9', '18', '35', '40', '41', '42', '43'] : [];
  return getTreeNodeDataNum(disabledIndexes);
};

export const getTreeNodeDataNum = (disabled?: string[]): TreeNode[] => {
  return buildTreeNodes(treeNodes, disabled);
};

export const getBaseSelectedIds = (): string[] => {
  return ['3', '6', '7', '8', '9', '18', '23', '28', '29', '30', '31', '32', '41'];
};

export const getBaseExpandedIds = (): string[] => {
  return ['1', '2', '11', '12', '40'];
};

export const getTreeNodesWithHasChildren = (count: number): TreeNode[] => {
  return generateRandomTreeNodesWithHasChildren(count, true);
};

export const randomNumber = (min: number, max: number): number => {
  return Math.ceil(Math.random() * (max - min) + min);
};

export const randomString = (length: number): string => {
  let result = '';
  const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(randomNumber(0, charactersLength));
    counter += 1;
  }
  return result;
};

export const generateRandomTreeNodeData = (
  count: number, depth: number, startCount: number = 0, parentPath: string = ''
): TreeNode[] => {
  const hasChildren = depth > 0;
  const res: TreeNode[] = [];
  for (let i = startCount; i < startCount + count; i++) {
    const delimiter = parentPath ? '.' : '';
    const path = parentPath + delimiter + `${i}`;
    res.push({
      id: path,
      label: `${path} - ${randomString(20)}`,
      children: hasChildren ? generateRandomTreeNodeData(count, depth - 1, 0, path) : []
    });
  }
  return res;
};

export const generateRandomTreeNodesWithHasChildren = (
  count: number, hasChildren: boolean, parentPath: string = ''
): TreeNode[] => {
  const res: TreeNode[] = [];
  for (let i = 0; i < count; i++) {
    const delimiter = parentPath ? '.' : '';
    const path = parentPath + delimiter + `${i}`;
    res.push({
      id: path,
      label: `${path} - ${randomString(20)}`,
      hasChildren
    });
  }
  return res;
};

const generateData = (count: number, depth: string): TreeNode[] => {
  let nextCount = count > 10 ? 50 : count;
  switch (nextCount) {
    case 50:
      nextCount = 10;
      break;
    case 10:
      nextCount = 5;
      break;
    case 5:
      nextCount = 4;
      break;
    case 4:
      nextCount = 3;
      break;
    case 3:
      nextCount = 2;
      break;
    default:
      nextCount = 0;
  }
  const res: TreeNode[] = [];
  for (let i = 0; i < count; i++) {
    const id = count > 10 ? `${i}` : `${depth}.${i}`;
    res.push({
      id,
      label: `${id} - ${randomString(20)}`,
      children: nextCount === 0 ? [] : generateData(nextCount, id)
    });
  }
  return res;
};

export const countData = (data: TreeNode[]): number => {
  let count = 0;
  data.forEach(d => {
    count++;
    if (d?.children?.length) {
      count = count + countData(d.children);
    }
  });
  return count;
};

const fillArrayWithExpandedIds = (data: TreeNode[], expandedIds: string[]): void => {
  data?.forEach(node => {
    if (node.children?.length) {
      expandedIds.push(node.id);
      fillArrayWithExpandedIds(node.children, expandedIds);
    }
  });
};

export const getAllExpandedIds = (data: TreeNode[]): string[] => {
  const expandedIds: string[] = [];
  fillArrayWithExpandedIds(data, expandedIds);
  return expandedIds;
};

const generateLargeTreeNodeData = (rootCount: number): {
  data: TreeNode[],
  expandedIds: string[],
  count: number
} => {
  const data = generateData(rootCount, '0');
  return {data, expandedIds: getAllExpandedIds(data), count: countData(data)};
};

export const largeTreeNodeData25: {
  data: TreeNode[],
  expandedIds: string[],
  count: number
} = generateLargeTreeNodeData(25);
export const largeTreeNodeData50: {
  data: TreeNode[],
  expandedIds: string[],
  count: number
} = generateLargeTreeNodeData(50);

export const fetchFakeService = (
  page: number, totalPage: number, delay: number
): Promise<{ data: TreeNode[], expandedIds: string[], nextPage: number | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = 5;
      const newData = generateRandomTreeNodeData(count, 2, page * count);
      resolve({data: newData, expandedIds: getAllExpandedIds(newData), nextPage: page === totalPage ? null : page + 1});
    }, delay);
  });
};

export const fetchFakeChildren = (
  parentId: string, count: number, hasChildren: boolean, delay: number
): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateRandomTreeNodesWithHasChildren(count, hasChildren, parentId));
    }, delay);
  });
};
