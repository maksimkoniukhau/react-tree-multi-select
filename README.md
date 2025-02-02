# React Tree Multi Select

**react-tree-multi-select** is a fast, highly customizable and feature-rich component that combines **tree select**, **multi-select** and simple **select** functionality into a single versatile solution.

See [documentation website](https://maksimkoniukhau.github.io/react-tree-multi-select/) for documentation and live examples.

## Installation
You can install react-tree-multi-select via npm:

```
npm install react-tree-multi-select
```

## Usage
Basic usage

```js
import React, {FC} from 'react';
import {CheckedState, TreeNode, TreeMultiSelect} from 'react-tree-multi-select';

export const ReactTreeMultiSelectApp: FC = () => {
  
  const data: TreeNode[] = [
    {
      label: 'label1',
      name: 'name1',
      children: [
        {
          label: 'child11-label',
          name: 'child11-name'
        },
        {
          label: 'child12-label',
          name: 'child12-name'
        }
      ]
    },
    {
      label: 'label2',
      name: 'name2',
      children: [
        {
          label: 'child21-label',
          name: 'child21-name'
        },
        {
          label: 'child22-label',
          name: 'child22-name'
        }
      ]
    },
    {
      label: 'label3',
      name: 'name3'
    }
  ];
  
  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedNodes:', selectedNodes);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedNodes:', expandedNodes);
  };

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined): void => {
    console.log('handleClearAll selectedNodes:', selectedNodes);
    console.log('handleClearAll selectAllCheckedState:', selectAllCheckedState);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState): void => {
    console.log('handleSelectAllChange selectedNodes:', selectedNodes);
    console.log('handleSelectAllChange selectAllCheckedState:', selectAllCheckedState);
  };

  return (
    <TreeMultiSelect
      id="my-id"
      className="custom-class"
      data={data}
      withSelectAll
      onNodeChange={handleNodeChange}
      onNodeToggle={handleNodeToggle}
      onClearAll={handleClearAll}
      onSelectAllChange={handleSelectAllChange}
    />
  );
});
```

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/maksimkoniukhau/react-tree-multi-select/blob/main/LICENSE) file for details.
