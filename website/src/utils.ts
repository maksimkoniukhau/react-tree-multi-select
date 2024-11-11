import {TreeNode} from '../../src';
import {Option, options, OptionTreeNode} from './data';

export interface RandomTreeNode extends TreeNode {
  id?: number;
  name?: string;
  description?: string;
  customString?: string;
}

const mapOptionsToTreeNodes = (opts: Option[]): OptionTreeNode[] => {
  return opts.map(option => {
    const treeNode: OptionTreeNode = {
      option,
      label: option.name,
      selected: option.id === 6 || option.id === 8 || option.id === 3 || option.id === 15 || option.id === 18 || option.id === 28,
      expanded: option.id === 1 || option.id === 2 || option.id === 11 || option.id === 12,
      disabled: option.id === 2 || option.id === 7 || option.id === 18
    };
    if (option.children.length) {
      treeNode.children = mapOptionsToTreeNodes(option.children);
    }
    return treeNode;
  });
};

const getOptionTreeNodeData = (): OptionTreeNode[] => {
  return mapOptionsToTreeNodes(options);
};

// min and max included
const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

const randomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const generateData = (amount: number): RandomTreeNode[] => {
  const res: RandomTreeNode[] = [];
  for (let i = 0; i < amount; i++) {
    const id = randomIntFromInterval(1, 110000);
    res.push({
      id,
      description: randomString(7),
      customString: randomString(10),
      label: randomString(30),
      selected: id === 34876 || id === 87659 || id === 95486,
      expanded: true,
      children: []
    });
  }
  return res;
};

const generateBigTreeNodeData = (): RandomTreeNode[] => {
  const data: RandomTreeNode[] = generateData(50);
  data.forEach(dat => {
    const data1 = generateData(10);
    data1.forEach(dat1 => {
      const data2 = generateData(5);
      data2.forEach(dat2 => {
        const data3 = generateData(4);
        data3.forEach(dat3 => {
          const data4 = generateData(3);
          data4.forEach(dat4 => {
            dat4.children = generateData(2);
          });
          dat3.children = data4;
        });
        dat2.children = data3;
      });
      dat1.children = data2;
    });
    dat.children = data1;
  });

  return data;
};

export const optionTreeNodeData: OptionTreeNode[] = getOptionTreeNodeData();

export const bigTreeNodeData: RandomTreeNode[] = generateBigTreeNodeData();
