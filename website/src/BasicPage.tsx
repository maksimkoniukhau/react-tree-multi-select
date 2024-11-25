import React, {FC, memo, useCallback, useState} from 'react';
import {CheckedState, TreeNode, TreeSelect, Type} from '../../src';
import {getOptionTreeNodeData} from './utils';
import {Select} from './Select';
import {Checkbox} from './Checkbox';
import {Input} from './Input';
import {INPUT_PLACEHOLDER, NO_MATCHES} from '../../src/constants';
import {OptionTreeNode} from './data';

export const BasicPage: FC = memo(() => {

  const [type, setType] = useState<Type>(Type.MULTI_SELECT_TREE);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(INPUT_PLACEHOLDER);
  const [noMatchesText, setNoMatchesText] = useState<string>(NO_MATCHES);
  const [withSelectAll, setWithSelectAll] = useState<boolean>(false);
  const [withClearAll, setWithClearAll] = useState<boolean>(true);
  const [selectedNodes, setSelectedNodes] = useState<boolean>(true);
  const [expandedNodes, setExpandedNodes] = useState<boolean>(true);
  const [disabledNodes, setDisabledNodes] = useState<boolean>(true);

  const getData = useCallback((): OptionTreeNode[] => {
    return getOptionTreeNodeData(selectedNodes, expandedNodes, disabledNodes)
  }, [selectedNodes, expandedNodes, disabledNodes]);

  const handleOptionChange = (name: string) => (value: string | boolean): void => {
    switch (name) {
      case 'type' :
        setType((Type as any)[value as string]);
        break;
      case 'inputPlaceholder' :
        setInputPlaceholder(value as string);
        break;
      case 'noMatchesText' :
        setNoMatchesText(value as string);
        break;
      case 'withSelectAll' :
        setWithSelectAll(value as boolean);
        break;
      case 'withClearAll' :
        setWithClearAll(value as boolean);
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
      default:
        break;
    }
  };

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    console.log('node', node);
    console.log('selectedNodes', selectedNodes);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    console.log('node', node);
    console.log('expandedNodes', expandedNodes);
  };

  const handleClearAll = (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]): void => {
    console.log('handleClearAll selectAllCheckedState', selectAllCheckedState);
    console.log('handleClearAll selectedNodes', selectedNodes);
  };

  const handleSelectAllChange = (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]): void => {
    console.log('handleSelectAllChange selectAllCheckedState', selectAllCheckedState);
    console.log('handleSelectAllChange selectedNodes', selectedNodes);
  };

  return (
    <div className="page">
      <h3>{'Tree select basic features'}</h3>
      <div className="basic-options">
        <div>{'Component props:'}</div>
        <Select
          label="Type:"
          options={[
            {name: Type.MULTI_SELECT_TREE, value: Type.MULTI_SELECT_TREE},
            {name: Type.MULTI_SELECT_TREE_FLAT, value: Type.MULTI_SELECT_TREE_FLAT}
          ]}
          onChange={handleOptionChange('type')}/>
        <Input label="Input placeholder:" initValue={INPUT_PLACEHOLDER}
               onChange={handleOptionChange('inputPlaceholder')}/>
        <Input label="No matches text:" initValue={NO_MATCHES} onChange={handleOptionChange('noMatchesText')}/>
        <Checkbox label="withSelectAll" initChecked={false} onChange={handleOptionChange('withSelectAll')}/>
        <Checkbox label="withClearAll" initChecked={true} onChange={handleOptionChange('withClearAll')}/>
        <div className="delimiter"/>
        <div>{'Data initial props:'}</div>
        <Checkbox label="selectedNodes" initChecked={true} onChange={handleOptionChange('selectedNodes')}/>
        <Checkbox label="expandedNodes" initChecked={true} onChange={handleOptionChange('expandedNodes')}/>
        <Checkbox label="disabledNodes" initChecked={true} onChange={handleOptionChange('disabledNodes')}/>
      </div>
      <div className="tree-select-wrapper">
        <TreeSelect
          data={getData()}
          type={type}
          id="basic-rts-id"
          className="basic-rts-custom-class"
          inputPlaceholder={inputPlaceholder}
          noMatchesText={noMatchesText}
          withSelectAll={withSelectAll}
          withClearAll={withClearAll}
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggle}
          onClearAll={handleClearAll}
          onSelectAllChange={handleSelectAllChange}
        />
      </div>
    </div>
  );
});
