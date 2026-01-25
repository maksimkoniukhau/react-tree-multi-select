import React, {forwardRef, useState} from 'react';
import {SelectionAggregateState, TreeMultiSelect, TreeMultiSelectHandle, TreeNode} from '../../index';
import {generateRandomTreeNodesWithHasChildren, getAllSelectedIds} from '../testutils/dataUtils';

interface LoadChildrenTestWrapperProps {
  handleDropdownToggle: jest.Mock;
  handleNodeChange: jest.Mock;
  handleNodeToggle: jest.Mock;
  handleSelectAllChange: jest.Mock;
  handleLoadChildren: jest.Mock;
  selectedIds: string[];
}

export const LoadChildrenTestWrapper = forwardRef<TreeMultiSelectHandle, LoadChildrenTestWrapperProps>((props, ref) => {
  const {
    handleDropdownToggle,
    handleNodeChange: handleNodeChangeProps,
    handleNodeToggle: handleNodeToggleProps,
    handleSelectAllChange: handleSelectAllChangeProps,
    handleLoadChildren: handleLoadChildrenProps,
    selectedIds: selectedIdsProps
  } = props;

  const [data] = useState<TreeNode[]>(generateRandomTreeNodesWithHasChildren(2, true));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);

  const handleNodeChange = (node: TreeNode, selectedIds: string[]): void => {
    handleNodeChangeProps(node, selectedIds);
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (node: TreeNode, expandedIds: string[],): void => {
    handleNodeToggleProps(node, expandedIds);
    setExpandedIds(expandedIds);
  };

  const handleSelectAllChange = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    handleSelectAllChangeProps(selectedIds, selectionAggregateState);
    setSelectedIds(selectedIds);
  };

  const handleLoadChildren = (id: string): Promise<TreeNode[]> => {
    handleLoadChildrenProps(id);
    return new Promise((resolve) => {
      setTimeout(() => {
        const loadedChildren = generateRandomTreeNodesWithHasChildren(2, true, id);
        if (selectedIdsProps.includes(id)) {
          setSelectedIds(prev => [...prev, ...getAllSelectedIds(loadedChildren)]);
        }
        resolve(loadedChildren);
      }, 0);
    });
  };

  return (
    <TreeMultiSelect
      ref={ref}
      data={data}
      selectedIds={selectedIds}
      expandedIds={expandedIds}
      withSelectAll={true}
      isVirtualized={false}
      onDropdownToggle={handleDropdownToggle}
      onNodeChange={handleNodeChange}
      onNodeToggle={handleNodeToggle}
      onSelectAllChange={handleSelectAllChange}
      onLoadChildren={handleLoadChildren}
    />
  );
});
