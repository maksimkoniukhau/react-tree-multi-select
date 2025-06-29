import React, {FC, useCallback, useMemo, useState} from 'react';
import {Components, FooterProps, TreeMultiSelect, TreeNode} from '../../treeMultiSelectImport';
import {fetchFakeService, generateRandomData} from '../../utils';
import {OptionTreeNode} from '../../data';

interface CustomFooterProps {
  isLoading: boolean;
  isEndReached: boolean;
  onClick: () => void;
}

const CustomFooter: FC<FooterProps<CustomFooterProps>> = (props) => {
  return (
    <div {...props.attributes} style={{display: 'flex', justifyContent: 'center', height: '22px'}}>
      {props.customProps.isEndReached || props.customProps.isLoading ? (
        <span style={{display: 'flex', alignItems: 'center'}}>
          {props.customProps.isEndReached ? 'End reached!' : 'Loading...'}
        </span>
      ) : (
        <button onClick={props.customProps.onClick}>
          Load more
        </button>
      )}
    </div>
  );
};

export const CustomFooterExample: FC = () => {

  const [data, setData] = useState<OptionTreeNode[]>(generateRandomData(1));
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);

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

  const loadMore = useCallback(async () => {
    if (lastPageReached) {
      return;
    }
    setIsLoading(true);
    const {data: newData, nextPage} = await fetchFakeService(page, 7, 1000);
    if (!nextPage) {
      setLastPageReached(true);
    }
    setData([...data, ...newData]);
    setPage(page + 1);
    setIsLoading(false);
  }, [lastPageReached, page, data]);

  const components: Components = useMemo(() => (
    {
      Footer: {
        component: CustomFooter,
        props: {isLoading, isEndReached: lastPageReached, onClick: loadMore}
      }
    }
  ), [isLoading, lastPageReached, loadMore]);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        withClearAll={false}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
};
