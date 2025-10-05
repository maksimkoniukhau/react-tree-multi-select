[![NPM Version](https://img.shields.io/npm/v/react-tree-multi-select)](https://npmjs.com/package/react-tree-multi-select)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/maksimkoniukhau/react-tree-multi-select/install-build-test.yml?logo=github&label=test)](https://github.com/maksimkoniukhau/react-tree-multi-select/actions?query=workflow%3Ainstall-build-test+)
[![codecov](https://codecov.io/gh/maksimkoniukhau/react-tree-multi-select/graph/badge.svg?token=5J7J6RSZWG)](https://codecov.io/gh/maksimkoniukhau/react-tree-multi-select)

# React Tree Multi Select

**react-tree-multi-select** is a fast, highly customizable and feature-rich component that combines **tree select**, **multi-select** and simple **select** functionality into a single versatile solution.

See [documentation website](https://react-tree-multi-select.vercel.app/) for documentation and live examples.

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

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[], data: TreeNode[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedNodes:', selectedNodes);
    console.log('handleNodeChange data:', data);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[], data: TreeNode[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedNodes:', expandedNodes);
    console.log('handleNodeToggle data:', data);
  };

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined, data: TreeNode[]): void => {
    console.log('handleClearAll selectedNodes:', selectedNodes);
    console.log('handleClearAll selectAllCheckedState:', selectAllCheckedState);
    console.log('handleClearAll data:', data);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState, data: TreeNode[]): void => {
    console.log('handleSelectAllChange selectedNodes:', selectedNodes);
    console.log('handleSelectAllChange selectAllCheckedState:', selectAllCheckedState);
    console.log('handleSelectAllChange data:', data);
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

## Support
If you find my work helpful, you can support me by buying me a coffee. Thank you for your support!

<a href="https://www.buymeacoffee.com/maksimk" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
