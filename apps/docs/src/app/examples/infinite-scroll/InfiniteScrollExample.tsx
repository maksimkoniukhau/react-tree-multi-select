'use client'

import React, {FC, useMemo, useRef, useState} from 'react';
import {FooterProps, KeyboardConfig, TreeMultiSelect, TreeMultiSelectHandle, TreeNode} from 'react-tree-multi-select';
import {fetchFakeService} from '@/utils/utils';

const Footer: FC<FooterProps<{ text: string }>> = (props) => {
  return (
    <div {...props.attributes} style={{padding: '5px', display: 'flex', justifyContent: 'center'}}>
      {props.customProps.text}
    </div>
  );
};

export const InfiniteScrollExample: FC = () => {

  const rtmsRef = useRef<TreeMultiSelectHandle>(null);

  const [data] = useState<TreeNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>({dropdown: {loopUp: false, loopDown: false}});
  const [page, setPage] = useState<number>(0);

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[],): void => {
    setExpandedIds(expandedIds);
  };

  const handleDropdownLastItemReached = async (inputValue: string): Promise<void> => {
    if (inputValue || lastPageReached) {
      return;
    }
    const rtmsAPI = rtmsRef.current;
    if (!rtmsAPI) {
      return;
    }
    await rtmsAPI.loadData();
  };

  const handleLoadData = async (): Promise<TreeNode[]> => {
    const {data: newData, expandedIds, nextPage} = await fetchFakeService(page, 7, 1000);
    if (nextPage) {
      setPage(nextPage);
    } else {
      setKeyboardConfig({dropdown: {loopUp: true, loopDown: true}});
      setLastPageReached(true);
    }
    setExpandedIds(prevExpandedIds => [...prevExpandedIds, ...expandedIds]);
    return newData;
  };

  const components = useMemo(() => (
    {
      Footer: {
        component: Footer,
        props: {text: lastPageReached ? 'No more data!' : 'Loading more data...'}
      }
    }
  ), [lastPageReached]);

  return (
    <div className="component-example">
      <TreeMultiSelect
        ref={rtmsRef}
        data={data}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        noDataText="Initial data loading..."
        withClearAll={false}
        keyboardConfig={keyboardConfig}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onDropdownLastItemReached={handleDropdownLastItemReached}
        onLoadData={handleLoadData}
      />
    </div>
  );
};
