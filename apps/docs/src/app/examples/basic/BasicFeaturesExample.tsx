'use client'

import React, {FC, useEffect, useState} from 'react';
import {SelectionAggregateState, TreeMultiSelect, TreeNode, Type} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';
import {Select} from '@/shared-components/Select';
import {Checkbox} from '@/shared-components/Checkbox';
import {Input} from '@/shared-components/Input';

const INPUT_PLACEHOLDER = 'search...';
const NO_DATA = 'No data';
const NO_MATCHES = 'No matches';
const DROPDOWN_HEIGHT = 300;
const OVERSCAN = 1;

export const BasicFeaturesExample: FC = () => {

  const [data, setData] = useState<TreeNode[]>(getTreeNodeData(true));
  const [type, setType] = useState<Type>(Type.TREE_SELECT);
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());
  const [expandedIds, setExpandedIds] = useState<string[]>(getBaseExpandedIds());
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(INPUT_PLACEHOLDER);
  const [noDataText, setNoDataText] = useState<string>(NO_DATA);
  const [noMatchesText, setNoMatchesText] = useState<string>(NO_MATCHES);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isSearchable, setIsSearchable] = useState<boolean>(true);
  const [withChipClear, setWithChipClear] = useState<boolean>(true);
  const [withClearAll, setWithClearAll] = useState<boolean>(true);
  const [withSelectAll, setWithSelectAll] = useState<boolean>(false);
  const [withDropdownInput, setWithDropdownInput] = useState<boolean>(false);
  const [closeDropdownOnNodeChange, setCloseDropdownOnNodeChange] = useState<boolean>(false);
  const [dropdownHeight, setDropdownHeight] = useState<number>(DROPDOWN_HEIGHT);
  const [overscan, setOverscan] = useState<number>(OVERSCAN);
  const [isVirtualized, setIsVirtualized] = useState<boolean>(true);
  const [loopLeft, setLoopLeft] = useState<boolean>(false);
  const [loopRight, setLoopRight] = useState<boolean>(false);
  const [loopUp, setLoopUp] = useState<boolean>(true);
  const [loopDown, setLoopDown] = useState<boolean>(true);
  const [selectedNodes, setSelectedNodes] = useState<boolean>(true);
  const [expandedNodes, setExpandedNodes] = useState<boolean>(true);
  const [disabledNodes, setDisabledNodes] = useState<boolean>(true);
  const [emptyData, setEmptyData] = useState<boolean>(false);

  useEffect(() => {
    setSelectedNodes(true);
    setExpandedNodes(true);
    setDisabledNodes(true);
    setEmptyData(false);
  }, [type]);

  useEffect(() => {
    if (emptyData) {
      setData([]);
    } else {
      setData(getTreeNodeData(disabledNodes));
      setSelectedIds(selectedNodes ? getBaseSelectedIds() : []);
      setExpandedIds(expandedNodes ? getBaseExpandedIds() : []);
    }
  }, [emptyData]);

  useEffect(() => {
    setData(getTreeNodeData(disabledNodes));
  }, [disabledNodes]);

  useEffect(() => {
    setSelectedIds(selectedNodes ? getBaseSelectedIds() : []);
  }, [selectedNodes]);

  useEffect(() => {
    setExpandedIds(expandedNodes ? getBaseExpandedIds() : []);
  }, [expandedNodes]);

  const handleNodeChange = (node: TreeNode, selectedIds: string[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedIds:', selectedIds);
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (node: TreeNode, expandedIds: string[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedIds:', expandedIds);
    setExpandedIds(expandedIds);
  };

  const handleClearAll = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    console.log('handleClearAll selectedIds:', selectedIds);
    console.log('handleClearAll selectionAggregateState:', selectionAggregateState);
    setSelectedIds(selectedIds);
  };

  const handleSelectAllChange = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    console.log('handleSelectAllChange selectedIds:', selectedIds);
    console.log('handleSelectAllChange selectionAggregateState:', selectionAggregateState);
    setSelectedIds(selectedIds);
  };

  const handleFocus = (event: React.FocusEvent): void => {
    console.log('handleFocus', event);
  };

  const handleBlur = (event: React.FocusEvent): void => {
    console.log('handleBlur', event);
  };

  return (
    <>
      <p>
        {'Toggle different options in order to see how the component behaves and looks depends on properties passed to it.'}
      </p>
      <div>{'Component props:'}</div>
      <div className="basic-options">
        <div style={{display: 'flex'}}>
          <div style={{width: '50%'}}>
            <Select
              label="type:"
              options={[
                {name: Type.TREE_SELECT, value: Type.TREE_SELECT},
                {name: Type.TREE_SELECT_FLAT, value: Type.TREE_SELECT_FLAT},
                {name: Type.MULTI_SELECT, value: Type.MULTI_SELECT},
                {name: Type.SINGLE_SELECT, value: Type.SINGLE_SELECT}
              ]}
              onChange={(v) => setType(Type[v as keyof typeof Type])}
            />
            <Input label="inputPlaceholder:" value={inputPlaceholder} onChange={(v) => setInputPlaceholder(v)}/>
            <Input label="noDataText:" value={noDataText} onChange={(v) => setNoDataText(v)}/>
            <Input label="noMatchesText:" value={noMatchesText} onChange={(v) => setNoMatchesText(v)}/>
            <Checkbox label="isDisabled" checked={isDisabled} onChange={(v) => setIsDisabled(v)}/>
            <Checkbox label="isSearchable" checked={isSearchable} onChange={(v) => setIsSearchable(v)}/>
            <Checkbox label="withChipClear" checked={withChipClear} onChange={(v) => setWithChipClear(v)}/>
            <Checkbox label="withClearAll" checked={withClearAll} onChange={(v) => setWithClearAll(v)}/>
            <Checkbox label="withSelectAll" checked={withSelectAll} onChange={(v) => setWithSelectAll(v)}/>
            <Checkbox label="withDropdownInput" checked={withDropdownInput} onChange={(v) => setWithDropdownInput(v)}/>
          </div>
          <div>
            <Checkbox
              label="closeDropdownOnNodeChange"
              checked={closeDropdownOnNodeChange}
              onChange={(v) => setCloseDropdownOnNodeChange(v)}
            />
            <Input
              label="dropdownHeight:"
              value={dropdownHeight}
              onChange={(v) => setDropdownHeight(Number(v))}
              type="number"
            />
            <Input label="overscan:" value={overscan} onChange={(v) => setOverscan(Number(v))} type="number"/>
            <Checkbox label="isVirtualized" checked={isVirtualized} onChange={(v) => setIsVirtualized(v)}/>
            <div className="config-container">
              <span>{'keyboardConfig:'}</span>
              <div style={{marginLeft: '15px'}}>
                <div>{'field:'}</div>
                <div style={{marginLeft: '15px'}}>
                  <Checkbox label="loopLeft" checked={loopLeft} onChange={(v) => setLoopLeft(v)}/>
                  <Checkbox label="loopRight" checked={loopRight} onChange={(v) => setLoopRight(v)}/>
                </div>
                <div>{'dropdown:'}</div>
                <div style={{marginLeft: '15px'}}>
                  <Checkbox label="loopUp" checked={loopUp} onChange={(v) => setLoopUp(v)}/>
                  <Checkbox label="loopDown" checked={loopDown} onChange={(v) => setLoopDown(v)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{'Data initial props:'}</div>
      <div className="basic-options">
        <Checkbox label="selected nodes" checked={selectedNodes} onChange={(v) => setSelectedNodes(v)}/>
        <Checkbox label="expanded nodes" checked={expandedNodes} onChange={(v) => setExpandedNodes(v)}/>
        <Checkbox label="disabled nodes" checked={disabledNodes} onChange={(v) => setDisabledNodes(v)}/>
        <Checkbox label="empty data" checked={emptyData} onChange={(v) => setEmptyData(v)}/>
      </div>
      <TreeMultiSelect
        data={data}
        type={type}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        id="basic-rtms-id"
        className="basic-rtms-custom-class"
        inputPlaceholder={inputPlaceholder}
        noDataText={noDataText}
        noMatchesText={noMatchesText}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        withChipClear={withChipClear}
        withClearAll={withClearAll}
        withSelectAll={withSelectAll}
        withDropdownInput={withDropdownInput}
        closeDropdownOnNodeChange={closeDropdownOnNodeChange}
        dropdownHeight={dropdownHeight}
        overscan={overscan}
        isVirtualized={isVirtualized}
        keyboardConfig={{field: {loopLeft, loopRight}, dropdown: {loopUp, loopDown}}}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onClearAll={handleClearAll}
        onSelectAllChange={handleSelectAllChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </>
  );
};
