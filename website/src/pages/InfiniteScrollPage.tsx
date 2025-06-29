import React, {FC, memo, useMemo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from '../treeMultiSelectImport';
import {fetchFakeService} from '../utils';
import {OptionTreeNode} from '../data';
import {FooterProps, KeyboardConfig} from '../../../src';

const Footer: FC<FooterProps<{ text: string }>> = (props) => {
  return (
    <div {...props.attributes}
         style={{
           padding: '5px',
           display: 'flex',
           justifyContent: 'center',
         }}
    >
      {props.customProps.text}
    </div>
  )
};

export const InfiniteScrollPage: FC = memo(() => {

  const [data, setData] = useState<OptionTreeNode[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>({dropdown: {loopUp: false, loopDown: false}});
  const [page, setPage] = useState<number>(1);

  const selectNode = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    node.selected = selectedNodes.some(selectedNode => (selectedNode as OptionTreeNode).option.id === (node as OptionTreeNode).option.id);
    node.children?.forEach(child => selectNode(child, selectedNodes));
  };

  const toggleNode = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    node.expanded = expandedNodes.some(expandedNode => (expandedNode as OptionTreeNode).option.id === (node as OptionTreeNode).option.id);
    node.children?.forEach(child => toggleNode(child, expandedNodes));
  };

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    data.forEach(optionTreeNode => selectNode(optionTreeNode, selectedNodes));
    setData([...data]);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    data.forEach(optionTreeNode => toggleNode(optionTreeNode, expandedNodes));
    setData([...data]);
  };

  const handleDropdownLastItemReached = async (): Promise<void> => {
    if (lastPageReached) {
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
    <div className="page">
      <div className="page-content">
        <h2>{'Infinite Scroll'}</h2>
        <div className="paragraph">
          <b>{'react-tree-multi-select'}</b>{' supports infinite scroll.'}
        </div>
        <div className="tree-multi-select-wrapper">
          <TreeMultiSelect
            data={data}
            noOptionsText="Initial data loading..."
            withClearAll={false}
            keyboardConfig={keyboardConfig}
            components={components}
            onNodeChange={handleNodeChange}
            onNodeToggle={handleNodeToggle}
            onDropdownLastItemReached={handleDropdownLastItemReached}
          />
        </div>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
});
