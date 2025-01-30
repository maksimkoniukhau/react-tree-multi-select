import React, {FC, memo, useMemo, useState} from 'react';
import {CheckedState, TreeNode, TreeSelect, Type} from '../../src';
import {getTreeNodeData} from './utils';
import {Select} from './Select';
import {Checkbox} from './Checkbox';
import {Input} from './Input';
import {INPUT_PLACEHOLDER, NO_MATCHES} from '../../src/constants';
import {OptionTreeNode} from './data';

export const BasicPage: FC = memo(() => {

  const [type, setType] = useState<Type>(Type.TREE_SELECT);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(INPUT_PLACEHOLDER);
  const [noMatchesText, setNoMatchesText] = useState<string>(NO_MATCHES);
  const [withClearAll, setWithClearAll] = useState<boolean>(true);
  const [withSelectAll, setWithSelectAll] = useState<boolean>(false);
  const [withDropdownInput, setWithDropdownInput] = useState<boolean>(false);
  const [selectedNodes, setSelectedNodes] = useState<boolean>(true);
  const [expandedNodes, setExpandedNodes] = useState<boolean>(true);
  const [disabledNodes, setDisabledNodes] = useState<boolean>(true);

  const getData = useMemo((): OptionTreeNode[] => {
    return getTreeNodeData(selectedNodes, expandedNodes, disabledNodes);
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
      case 'withClearAll' :
        setWithClearAll(value as boolean);
        break;
      case 'withSelectAll' :
        setWithSelectAll(value as boolean);
        break;
      case 'withDropdownInput' :
        setWithDropdownInput(value as boolean);
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

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined): void => {
    console.log('handleClearAll selectedNodes', selectedNodes);
    console.log('handleClearAll selectAllCheckedState', selectAllCheckedState);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState): void => {
    console.log('handleSelectAllChange selectedNodes', selectedNodes);
    console.log('handleSelectAllChange selectAllCheckedState', selectAllCheckedState);
  };

  const handleFocus = (event: React.FocusEvent): void => {
    console.log('focus', event);
  };

  const handleBlur = (event: React.FocusEvent): void => {
    console.log('blur', event);
  };

  return (
    <div className="page">
      <div className="page-content">
        <h2>{'RTS tree select basic features'}</h2>
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
          <Input label="noMatchesText:" initValue={NO_MATCHES} onChange={handleOptionChange('noMatchesText')}/>
          <Checkbox label="withClearAll" initChecked={true} onChange={handleOptionChange('withClearAll')}/>
          <Checkbox label="withSelectAll" initChecked={false} onChange={handleOptionChange('withSelectAll')}/>
          <Checkbox label="withDropdownInput" initChecked={false} onChange={handleOptionChange('withDropdownInput')}/>
          <div className="delimiter"/>
          <div>{'Data initial props:'}</div>
          <Checkbox label="selectedNodes" initChecked={true} onChange={handleOptionChange('selectedNodes')}/>
          <Checkbox label="expandedNodes" initChecked={true} onChange={handleOptionChange('expandedNodes')}/>
          <Checkbox label="disabledNodes" initChecked={true} onChange={handleOptionChange('disabledNodes')}/>
        </div>
        <div className="tree-select-wrapper">
          <TreeSelect
            data={getData}
            type={type}
            id="basic-rts-id"
            className="basic-rts-custom-class"
            inputPlaceholder={inputPlaceholder}
            noMatchesText={noMatchesText}
            withClearAll={withClearAll}
            withSelectAll={withSelectAll}
            withDropdownInput={withDropdownInput}
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
        <div className="tree-select-wrapper">
          <TreeSelect
            data={[
              {
                label: 'label1',
                name: 'name1'
              },
              {
                label: 'label2',
                name: 'name2'
              },
              {
                label: 'label3',
                name: 'name3'
              },
              {
                label: 'label4',
                name: 'name4'
              },
              {
                label: 'label5',
                name: 'name5'
              }
            ]}
            id="rts-multi-select"
            withClearAll
          />
        </div>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
});
