import React, {FC, useMemo, useState} from 'react';
import {FooterProps, KeyboardConfig, TreeMultiSelect, TreeNode} from '../treeMultiSelectImport';
import {fetchFakeService, RandomTreeNode} from '../utils';

const Footer: FC<FooterProps<{ text: string }>> = (props) => {
  return (
    <div {...props.attributes} style={{padding: '5px', display: 'flex', justifyContent: 'center'}}>
      {props.customProps.text}
    </div>
  );
};

export const InfiniteScrollExample: FC = () => {

  const [data, setData] = useState<RandomTreeNode[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>({dropdown: {loopUp: false, loopDown: false}});
  const [page, setPage] = useState<number>(0);

  const handleNodeChange = (_node: TreeNode, _selectedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as RandomTreeNode[]);
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as RandomTreeNode[]);
  };

  const handleDropdownLastItemReached = async (inputValue: string, disp: any): Promise<void> => {
    if (inputValue || lastPageReached) {
      return;
    }
    const {data: newData, nextPage} = await fetchFakeService(page, 7, 1000);
    if (nextPage) {
      setPage(nextPage);
    } else {
      setKeyboardConfig({dropdown: {loopUp: true, loopDown: true}});
      setLastPageReached(true);
    }
    setData(prevData => [...prevData, ...newData]);
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
        data={data}
        noDataText="Initial data loading..."
        withClearAll={false}
        keyboardConfig={keyboardConfig}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onDropdownLastItemReached={handleDropdownLastItemReached}
      />
    </div>
  );
};
