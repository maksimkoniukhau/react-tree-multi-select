import React, {forwardRef, useState} from 'react';
import {SelectionAggregateState, TreeMultiSelect, TreeMultiSelectHandle, TreeNode} from '../../index';
import {generateRandomTreeNodeData, getAllExpandedIds, getAllSelectedIds} from '../testutils/dataUtils';

interface LoadDataTestWrapperProps {
  handleDropdownToggle: jest.Mock;
  handleNodeChange: jest.Mock;
  handleNodeToggle: jest.Mock;
  handleSelectAllChange: jest.Mock;
  withSelectedLoadedData?: boolean;
}

export const LoadDataTestWrapper = forwardRef<TreeMultiSelectHandle, LoadDataTestWrapperProps>((props, ref) => {
  const {
    handleDropdownToggle,
    handleNodeChange: handleNodeChangeProps,
    handleNodeToggle: handleNodeToggleProps,
    handleSelectAllChange: handleSelectAllChangeProps,
    withSelectedLoadedData
  } = props;

  const [data] = useState<TreeNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);
  const [page, setPage] = useState<number>(0);

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

  const handleLoadData = async (): Promise<TreeNode[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newData = generateRandomTreeNodeData(2, 1, page * 2);
        setPage(page + 1);
        if (withSelectedLoadedData) {
          setSelectedIds(prev => [...prev, ...getAllSelectedIds(newData)]);
        }
        setExpandedIds(prevExpandedIds => [...prevExpandedIds, ...getAllExpandedIds(newData)]);
        resolve(newData);
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
      onLoadData={handleLoadData}
    />
  );
});
