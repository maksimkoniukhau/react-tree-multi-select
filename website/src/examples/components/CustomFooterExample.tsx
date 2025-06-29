import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Components, FooterProps, TreeMultiSelect, TreeNode} from '../../treeMultiSelectImport';
import {fetchFakeService, RandomTreeNode} from '../../utils';

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

  const [data, setData] = useState<RandomTreeNode[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const loadData = useCallback(async (delay: number) => {
    setIsLoading(true);
    const {data: newData, nextPage} = await fetchFakeService(page, 7, delay);
    if (!nextPage) {
      setLastPageReached(true);
    }
    setData([...data, ...newData]);
    setPage(page + 1);
    setIsLoading(false);
  }, [page, data]);

  useEffect(() => {
    void loadData(0);
  }, []);

  const selectNode = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    node.selected = selectedNodes.some(selectedNode => (selectedNode as RandomTreeNode).id === (node as RandomTreeNode).id);
    node.children?.forEach(child => selectNode(child, selectedNodes));
  };

  const toggleNode = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    node.expanded = expandedNodes.some(expandedNode => (expandedNode as RandomTreeNode).id === (node as RandomTreeNode).id);
    node.children?.forEach(child => toggleNode(child, expandedNodes));
  };

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    data.forEach(randomTreeNode => selectNode(randomTreeNode, selectedNodes));
    setData([...data]);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    data.forEach(randomTreeNode => toggleNode(randomTreeNode, expandedNodes));
    setData([...data]);
  };

  const loadMore = useCallback(async () => {
    if (lastPageReached) {
      return;
    }
    void loadData(1000);
  }, [lastPageReached, loadData]);

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
