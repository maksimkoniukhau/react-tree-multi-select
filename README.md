[![NPM Version](https://img.shields.io/npm/v/react-tree-multi-select)](https://npmjs.com/package/react-tree-multi-select)

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
      children: [
        {
          label: 'child11-label'
        },
        {
          label: 'child12-label'
        }
      ]
    },
    {
      label: 'label2',
      children: [
        {
          label: 'child21-label'
        },
        {
          label: 'child22-label'
        }
      ]
    },
    {
      label: 'label3'
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
