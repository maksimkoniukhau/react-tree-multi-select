'use client'

import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Components, FooterProps, TreeMultiSelect, TreeMultiSelectHandle, TreeNode} from 'react-tree-multi-select';
import {fetchFakeService} from '@/utils/utils';

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

export const PaginationExample: FC = () => {

  const rtmsRef = useRef<TreeMultiSelectHandle>(null);

  const [data, setData] = useState<TreeNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const loadData = useCallback(async (delay: number) => {
    setIsLoading(true);
    const {data: newData, expandedIds, nextPage} = await fetchFakeService(page, 7, delay);
    if (!nextPage) {
      setLastPageReached(true);
    }
    setExpandedIds(prevExpandedIds => [...prevExpandedIds, ...expandedIds]);
    setPage(page + 1);
    setIsLoading(false);
    return newData;
  }, [page]);

  useEffect(() => {
    const initialLoadData = async () => {
      const loadedData = await loadData(0);
      setData(loadedData);
    };
    void initialLoadData();
  }, []);

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
  };

  const handleLoadData = async (): Promise<TreeNode[]> => {
    return loadData(1000);
  };

  const loadMore = useCallback(async () => {
    if (lastPageReached) {
      return;
    }
    const rtmsAPI = rtmsRef.current;
    if (!rtmsAPI) {
      return;
    }
    await rtmsAPI.loadData();
  }, [lastPageReached]);

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
        ref={rtmsRef}
        data={data}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        withClearAll={false}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onLoadData={handleLoadData}
      />
    </div>
  );
};
