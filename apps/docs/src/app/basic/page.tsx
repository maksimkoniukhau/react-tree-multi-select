'use client'

import React, {FC, memo, useEffect, useState} from 'react';
import {CheckedState, TreeMultiSelect, TreeNode, Type} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';
import {Select} from '@/shared-components/Select';
import {Checkbox} from '@/shared-components/Checkbox';
import {Input} from '@/shared-components/Input';

const INPUT_PLACEHOLDER = 'search...';
const NO_DATA = 'No data';
const NO_MATCHES = 'No matches';
const DEFAULT_OPTIONS_CONTAINER_HEIGHT = 300;
const OVERSCAN = 1;

const BasicPage: FC = memo(() => {

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
  const [dropdownHeight, setDropdownHeight] = useState<number>(DEFAULT_OPTIONS_CONTAINER_HEIGHT);
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
    setData(emptyData ? [] : getTreeNodeData(disabledNodes));
  }, [disabledNodes, emptyData]);

  useEffect(() => {
    setSelectedIds(selectedNodes ? getBaseSelectedIds() : []);
  }, [selectedNodes]);

  useEffect(() => {
    setExpandedIds(expandedNodes ? getBaseExpandedIds() : []);
  }, [expandedNodes]);

  const handleOptionChange = (name: string) => (value: string | number | boolean): void => {
    switch (name) {
      case 'type' :
        setType(Type[value as keyof typeof Type]);
        break;
      case 'inputPlaceholder' :
        setInputPlaceholder(value as string);
        break;
      case 'noDataText' :
        setNoDataText(value as string);
        break;
      case 'noMatchesText' :
        setNoMatchesText(value as string);
        break;
      case 'isDisabled' :
        setIsDisabled(value as boolean);
        break;
      case 'isSearchable' :
        setIsSearchable(value as boolean);
        break;
      case 'withChipClear' :
        setWithChipClear(value as boolean);
        break;
      case 'withClearAll' :
        setWithClearAll(value as boolean);
        break;
      case 'withSelectAll' :
        setWithSelectAll(value as boolean);
        break;
      case 'withDropdownInput' :
        setWithDropdownInput(value as boolean);
        break;
      case 'closeDropdownOnNodeChange' :
        setCloseDropdownOnNodeChange(value as boolean);
        break;
      case 'dropdownHeight' :
        setDropdownHeight(Number(value));
        break;
      case 'overscan' :
        setOverscan(Number(value));
        break;
      case 'isVirtualized' :
        setIsVirtualized(value as boolean);
        break;
      case 'loopLeft' :
        setLoopLeft(value as boolean);
        break;
      case 'loopRight' :
        setLoopRight(value as boolean);
        break;
      case 'loopUp' :
        setLoopUp(value as boolean);
        break;
      case 'loopDown' :
        setLoopDown(value as boolean);
        break;
      case 'selectedNodes' :
        setSelectedNodes(value as boolean);
        break;
      case 'expandedNodes' :
        setExpandedNodes(value as boolean);
        break;
      case 'disabledNodes' :
        setDisabledNodes(value as boolean);
        break;
      case 'emptyData' :
        setEmptyData(value as boolean);
        break;
      default:
        break;
    }
  };

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

  const handleClearAll = (selectedIds: string[], selectAllCheckedState: CheckedState | undefined): void => {
    console.log('handleClearAll selectedIds:', selectedIds);
    console.log('handleClearAll selectAllCheckedState:', selectAllCheckedState);
    setSelectedIds(selectedIds);
  };

  const handleSelectAllChange = (selectedIds: string[], selectAllCheckedState: CheckedState): void => {
    console.log('handleSelectAllChange selectedIds:', selectedIds);
    console.log('handleSelectAllChange selectAllCheckedState:', selectAllCheckedState);
    setSelectedIds(selectedIds);
  };

  const handleFocus = (event: React.FocusEvent): void => {
    console.log('focus', event);
  };

  const handleBlur = (event: React.FocusEvent): void => {
    console.log('blur', event);
  };

  return (
    <div className="page-content" style={{marginBottom: '100px'}}>
      <h2>{'Basic Features'}</h2>
      <div className="paragraph">
        {'Toggle different options in order to see how the component behaves and looks depends on properties passed to it.'}
      </div>
      <div className="basic-options">
        <div>{'Component props:'}</div>
        <Select
          label="type:"
          options={[
            {name: Type.TREE_SELECT, value: Type.TREE_SELECT},
            {name: Type.TREE_SELECT_FLAT, value: Type.TREE_SELECT_FLAT},
            {name: Type.MULTI_SELECT, value: Type.MULTI_SELECT},
            {name: Type.SELECT, value: Type.SELECT}
          ]}
          onChange={handleOptionChange('type')}/>
        <Input label="inputPlaceholder:" initValue={INPUT_PLACEHOLDER}
               onChange={handleOptionChange('inputPlaceholder')}/>
        <Input label="noDataText:" initValue={NO_DATA} onChange={handleOptionChange('noDataText')}/>
        <Input label="noMatchesText:" initValue={NO_MATCHES} onChange={handleOptionChange('noMatchesText')}/>
        <Checkbox label="isDisabled" initChecked={false} onChange={handleOptionChange('isDisabled')}/>
        <Checkbox label="isSearchable" initChecked={true} onChange={handleOptionChange('isSearchable')}/>
        <Checkbox label="withChipClear" initChecked={true} onChange={handleOptionChange('withChipClear')}/>
        <Checkbox label="withClearAll" initChecked={true} onChange={handleOptionChange('withClearAll')}/>
        <Checkbox label="withSelectAll" initChecked={false} onChange={handleOptionChange('withSelectAll')}/>
        <Checkbox label="withDropdownInput" initChecked={false} onChange={handleOptionChange('withDropdownInput')}/>
        <Checkbox label="closeDropdownOnNodeChange" initChecked={false}
                  onChange={handleOptionChange('closeDropdownOnNodeChange')}/>
        <Input label="dropdownHeight:" initValue={DEFAULT_OPTIONS_CONTAINER_HEIGHT}
               onChange={handleOptionChange('dropdownHeight')} type="number"/>
        <Input label="overscan:" initValue={OVERSCAN} onChange={handleOptionChange('overscan')} type="number"/>
        <Checkbox label="isVirtualized" initChecked={true} onChange={handleOptionChange('isVirtualized')}/>
        <div>
          <label>{'keyboardConfig:'}</label>
          <div style={{marginLeft: '15px'}}>
            <div>{'field:'}</div>
            <div style={{marginLeft: '15px'}}>
              <Checkbox label="loopLeft" initChecked={false} onChange={handleOptionChange('loopLeft')}/>
              <Checkbox label="loopRight" initChecked={false} onChange={handleOptionChange('loopRight')}/>
            </div>
            <div>{'dropdown:'}</div>
            <div style={{marginLeft: '15px'}}>
              <Checkbox label="loopUp" initChecked={true} onChange={handleOptionChange('loopUp')}/>
              <Checkbox label="loopDown" initChecked={true} onChange={handleOptionChange('loopDown')}/>
            </div>
          </div>
        </div>

        <div className="delimiter"/>
        <div>{'Data initial props:'}</div>
        <Checkbox label="selected nodes" initChecked={true} onChange={handleOptionChange('selectedNodes')}/>
        <Checkbox label="expanded nodes" initChecked={true} onChange={handleOptionChange('expandedNodes')}/>
        <Checkbox label="disabled nodes" initChecked={true} onChange={handleOptionChange('disabledNodes')}/>
        <Checkbox label="empty data" initChecked={false} onChange={handleOptionChange('emptyData')}/>
      </div>
      <div className="tree-multi-select-wrapper" style={{paddingBottom: '60px'}}>
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
      </div>
      <div style={{marginTop: '20px'}} className="paragraph">
        {'You can pass data without children to component. Component will looks and behaves as a multiselect with checkboxes.'}
      </div>
      <div className="tree-multi-select-wrapper">
        <TreeMultiSelect
          data={[
            {id: '1', label: 'label1'},
            {id: '2', label: 'label2'},
            {id: '3', label: 'label3'},
            {id: '4', label: 'label4'},
            {id: '5', label: 'label5'}
          ]}
          id="rtms-multi-select"
          withClearAll
        />
      </div>
    </div>
  );
});

export default BasicPage;
