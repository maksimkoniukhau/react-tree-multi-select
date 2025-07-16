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

  const selectNode = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    node.selected = selectedNodes.some(selectedNode => (selectedNode as RandomTreeNode).id === (node as RandomTreeNode).id);
    node.children?.forEach(child => selectNode(child, selectedNodes));
  };

  const toggleNode = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    node.expanded = expandedNodes.some(expandedNode => (expandedNode as RandomTreeNode).id === (node as RandomTreeNode).id);
    node.children?.forEach(child => toggleNode(child, expandedNodes));
  };

  const handleNodeChange = (_: TreeNode, selectedNodes: TreeNode[]): void => {
    data.forEach(randomTreeNode => selectNode(randomTreeNode, selectedNodes));
    setData([...data]);
  };

  const handleNodeToggle = (_: TreeNode, expandedNodes: TreeNode[]): void => {
    data.forEach(randomTreeNode => toggleNode(randomTreeNode, expandedNodes));
    setData([...data]);
  };

  const handleDropdownLastItemReached = async (inputValue: string): Promise<void> => {
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
    setData([...data, ...newData]);
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
