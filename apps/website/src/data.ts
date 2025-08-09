import {TreeNode} from './treeMultiSelectImport';

export interface OptionTreeNode extends TreeNode {
  option: Option;
}

export interface Option {
  id: number;
  name: string;
  children: Option[];
}

export const options: Option[] = [
  {
    id: 1,
    name: 'JavaScript',
    children: [
      {
        id: 2,
        name: 'React',
        children: [
          {
            id: 3,
            name: 'React.js',
            children: []
          },
          {
            id: 4,
            name: 'React Native',
            children: []
          }
        ]
      },
      {
        id: 5,
        name: 'Vue',
        children: []
      },
      {
        id: 6,
        name: 'Angular',
        children: []
      }
    ]
  },
  {
    id: 7,
    name: 'HTML',
    children: [
      {
        id: 8,
        name: 'HTML4',
        children: []
      },
      {
        id: 9,
        name: 'HTML5',
        children: []
      }
    ]
  },
  {
    id: 10,
    name: 'XML',
    children: []
  },
  {
    id: 11,
    name: 'Java',
    children: [
      {
        id: 12,
        name: 'Spring',
        children: [
          {
            id: 13,
            name: 'Spring 4',
            children: [
              {
                id: 14,
                name: 'Spring 4.0',
                children: []
              },
              {
                id: 15,
                name: 'Spring 4.1',
                children: []
              },
              {
                id: 16,
                name: 'Spring 4.2',
                children: []
              }
            ]
          },
          {
            id: 17,
            name: 'Spring 5',
            children: [
              {
                id: 18,
                name: 'Spring 5.0',
                children: []
              },
              {
                id: 19,
                name: 'Spring 5.1',
                children: []
              },
              {
                id: 20,
                name: 'Spring 5.2',
                children: []
              }
            ]
          },
          {
            id: 21,
            name: 'Spring 6',
            children: [
              {
                id: 22,
                name: 'Spring 6.0',
                children: []
              },
              {
                id: 23,
                name: 'Spring 6.1',
                children: []
              },
              {
                id: 24,
                name: 'Spring 6.2',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 25,
        name: 'Micronaut',
        children: [
          {
            id: 26,
            name: 'Micronaut 3.5.0',
            children: []
          },
          {
            id: 27,
            name: 'Micronaut 4.0.0',
            children: []
          },
          {
            id: 28,
            name: 'Micronaut 4.6.0',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 29,
    name: 'Go',
    children: [
      {
        id: 30,
        name: 'Gin',
        children: []
      },
      {
        id: 31,
        name: 'Echo',
        children: []
      },
      {
        id: 32,
        name: 'Beego',
        children: []
      }
    ]
  },
  {
    id: 33,
    name: 'SQL',
    children: [
      {
        id: 34,
        name: 'MySQL',
        children: []
      },
      {
        id: 35,
        name: 'PostgreSQL',
        children: []
      }
    ]
  },
  {
    id: 36,
    name: 'Python',
    children: [
      {
        id: 37,
        name: 'Django',
        children: []
      },
      {
        id: 38,
        name: 'Flask',
        children: []
      },
      {
        id: 39,
        name: 'Web2py',
        children: []
      }
    ]
  }
  ,
  {
    id: 40,
    name: 'Rust',
    children: [
      {
        id: 41,
        name: 'Actix Web',
        children: []
      },
      {
        id: 42,
        name: 'Rocket',
        children: []
      },
      {
        id: 43,
        name: 'Warp',
        children: []
      }
    ]
  }
];
