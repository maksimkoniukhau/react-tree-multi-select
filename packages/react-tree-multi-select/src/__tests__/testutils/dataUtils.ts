import {TreeNode} from '../../index';

export const treeNodes: TreeNode[] = [
  {
    id: '1',
    label: 'JavaScript',
    children: [
      {
        id: '2',
        label: 'React',
        children: [
          {
            id: '3',
            label: 'React.js',
            children: []
          },
          {
            id: '4',
            label: 'React Native',
            children: []
          }
        ]
      },
      {
        id: '5',
        label: 'Vue',
        children: []
      },
      {
        id: '6',
        label: 'Angular',
        children: []
      }
    ]
  },
  {
    id: '7',
    label: 'HTML',
    children: [
      {
        id: '8',
        label: 'HTML4',
        children: []
      },
      {
        id: '9',
        label: 'HTML5',
        children: []
      }
    ]
  },
  {
    id: '10',
    label: 'XML',
    children: []
  },
  {
    id: '11',
    label: 'Java',
    children: [
      {
        id: '12',
        label: 'Spring',
        children: [
          {
            id: '13',
            label: 'Spring 4',
            children: [
              {
                id: '14',
                label: 'Spring 4.0',
                children: []
              },
              {
                id: '15',
                label: 'Spring 4.1',
                children: []
              },
              {
                id: '16',
                label: 'Spring 4.2',
                children: []
              }
            ]
          },
          {
            id: '17',
            label: 'Spring 5',
            children: [
              {
                id: '18',
                label: 'Spring 5.0',
                children: []
              },
              {
                id: '19',
                label: 'Spring 5.1',
                children: []
              },
              {
                id: '20',
                label: 'Spring 5.2',
                children: []
              }
            ]
          },
          {
            id: '21',
            label: 'Spring 6',
            children: [
              {
                id: '22',
                label: 'Spring 6.0',
                children: []
              },
              {
                id: '23',
                label: 'Spring 6.1',
                children: []
              },
              {
                id: '24',
                label: 'Spring 6.2',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '25',
        label: 'Micronaut',
        children: [
          {
            id: '26',
            label: 'Micronaut 3.5.0',
            children: []
          },
          {
            id: '27',
            label: 'Micronaut 4.0.0',
            children: []
          },
          {
            id: '28',
            label: 'Micronaut 4.6.0',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '29',
    label: 'Go',
    children: [
      {
        id: '30',
        label: 'Gin',
        children: []
      },
      {
        id: '31',
        label: 'Echo',
        children: []
      },
      {
        id: '32',
        label: 'Beego',
        children: []
      }
    ]
  },
  {
    id: '33',
    label: 'SQL',
    children: [
      {
        id: '34',
        label: 'MySQL',
        children: []
      },
      {
        id: '35',
        label: 'PostgreSQL',
        children: []
      }
    ]
  },
  {
    id: '36',
    label: 'Python',
    children: [
      {
        id: '37',
        label: 'Django',
        children: []
      },
      {
        id: '38',
        label: 'Flask',
        children: []
      },
      {
        id: '39',
        label: 'Web2py',
        children: []
      }
    ]
  }
  ,
  {
    id: '40',
    label: 'Rust',
    children: [
      {
        id: '41',
        label: 'Actix Web',
        children: []
      },
      {
        id: '42',
        label: 'Rocket',
        children: []
      },
      {
        id: '43',
        label: 'Warp',
        children: []
      }
    ]
  }
];

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

const fillArrayWithSelectedIds = (data: TreeNode[], selectedIds: string[]): void => {
  data?.forEach(node => {
    selectedIds.push(node.id);
    if (node.children?.length) {
      fillArrayWithSelectedIds(node.children, selectedIds);
    }
  });
};

export const getAllSelectedIds = (data: TreeNode[]): string[] => {
  const selectedIds: string[] = [];
  fillArrayWithSelectedIds(data, selectedIds);
  return selectedIds;
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

export const baseSelectedIds = ['3', '6', '7', '8', '9', '18', '23', '28', '29', '30', '31', '32', '41'];

export const baseExpandedIds = ['1', '2', '11', '12', '40'];

export const baseDisabledIds = ['2', '3', '4', '7', '8', '9', '18', '35', '40', '41', '42', '43'];

export const getBaseTreeNodeData = (): TreeNode[] => {
  return buildTreeNodes(treeNodes, baseDisabledIds);
};

export const getTreeNodeData = (disabled?: string[]): TreeNode[] => {
  return buildTreeNodes(treeNodes, disabled);
};

export const baseTreeNodeData = getBaseTreeNodeData();
