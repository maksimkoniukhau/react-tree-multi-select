import {TreeNode} from 'react-tree-multi-select';
import {Option, options, OptionTreeNode} from '@/data';

export interface RandomTreeNode extends TreeNode {
  id: string;
  description?: string;
}

const mapOptionsToTreeNodes = (
  opts: Option[], selected?: boolean, expanded?: boolean, disabled?: boolean
): OptionTreeNode[] => {
  return opts.map(option => {
    const treeNode: OptionTreeNode = {
      option,
      label: option.name,
      selected: selected
        && (option.id === 6 || option.id === 7 || option.id === 3 || option.id === 18 || option.id === 23 || option.id === 28 || option.id === 29 || option.id === 41),
      expanded: expanded
        && (option.id === 1 || option.id === 2 || option.id === 11 || option.id === 12 || option.id === 40),
      disabled: disabled
        && (option.id === 2 || option.id === 7 || option.id === 18 || option.id === 34 || option.id === 35 || option.id === 40)
    };
    if (option.children.length) {
      treeNode.children = mapOptionsToTreeNodes(option.children, selected, expanded, disabled);
    }
    return treeNode;
  });
};

export const getTreeNodeData = (selected?: boolean, expanded?: boolean, disabled?: boolean): OptionTreeNode[] => {
  return mapOptionsToTreeNodes(options, selected, expanded, disabled);
};

export const randomNumber = (min: number, max: number): number => {
  return Math.ceil(Math.random() * (max - min) + min);
};

export const randomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(randomNumber(0, charactersLength));
    counter += 1;
  }
  return result;
};

export const generateRandomTreeNodeData = (
  amount: number, depth: number, startCount: number = 0, parentPath: string = ''
): RandomTreeNode[] => {
  const hasChildren = depth > 0;
  const res: RandomTreeNode[] = [];
  for (let i = startCount; i < startCount + amount; i++) {
    const delimiter = parentPath ? '.' : '';
    const path = parentPath + delimiter + `${i}`;
    res.push({
      id: path,
      description: randomString(7),
      label: `${path} - ${randomString(20)}`,
      expanded: hasChildren,
      children: hasChildren ? generateRandomTreeNodeData(amount, depth - 1, 0, path) : []
    });
  }
  return res;
};

const generateData = (amount: number, depth: string): RandomTreeNode[] => {
  let nextAmount = amount > 10 ? 50 : amount;
  switch (nextAmount) {
    case 50:
      nextAmount = 10;
      break;
    case 10:
      nextAmount = 5;
      break;
    case 5:
      nextAmount = 4;
      break;
    case 4:
      nextAmount = 3;
      break;
    case 3:
      nextAmount = 2;
      break;
    default:
      nextAmount = 0;
  }
  const res: RandomTreeNode[] = [];
  for (let i = 0; i < amount; i++) {
    const id = amount > 10 ? `${i}` : `${depth}.${i}`;
    res.push({
      id,
      description: randomString(7),
      label: `${id} - ${randomString(20)}`,
      selected: id === '1' || id === '5.5.3' || id === '10.3',
      expanded: nextAmount > 0,
      children: nextAmount === 0 ? [] : generateData(nextAmount, id)
    });
  }
  return res;
};

const countData = (data: TreeNode[]): number => {
  let count = 0;
  data.forEach(d => {
    count++;
    if (d?.children?.length) {
      count = count + countData(d.children);
    }
  });
  return count;
};

const generateLargeTreeNodeData = (rootAmount: number): { data: RandomTreeNode[], amount: number } => {
  const data = generateData(rootAmount, '0');
  return {data, amount: countData(data)};
};

export const largeTreeNodeData30: { data: RandomTreeNode[], amount: number } = generateLargeTreeNodeData(30);
export const largeTreeNodeData50: { data: RandomTreeNode[], amount: number } = generateLargeTreeNodeData(50);

export const fetchFakeService = (
  page: number,
  totalPage: number,
  delay: number
): Promise<{ data: RandomTreeNode[], nextPage: number | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const amount = 5;
      const newData = generateRandomTreeNodeData(amount, 2, page * amount);
      resolve({data: newData, nextPage: page === totalPage ? null : page + 1});
    }, delay);
  });
};
