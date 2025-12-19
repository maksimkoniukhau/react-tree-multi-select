'use client'

import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {Attributes, Components, InputProps, InputType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomFieldInput: FC<InputProps> = (props) => (
  <textarea {...props.attributes as unknown as Attributes<'textarea'>}/>
);

const CustomDropdownInput: FC<InputProps> = (props) => (
  <div style={{display: 'flex', flex: 1, alignItems: 'center'}}>
    <input {...props.attributes}/>
    <div style={{padding: '0 4px'}}><FontAwesomeIcon icon={faMagnifyingGlass}/></div>
  </div>
);

const DropdownInput: InputType = {component: CustomDropdownInput};
const dropdownComponents: Components = {Input: DropdownInput};

const FieldInput: InputType = {component: CustomFieldInput};
const fieldComponents: Components = {Input: FieldInput};

export const CustomInputExample: FC = () => {

  return (
    <div className="component-example input-example">
      <TreeMultiSelect
        className="custom-dropdown-input"
        data={getTreeNodeData()}
        withDropdownInput={true}
        components={dropdownComponents}
      />
      <TreeMultiSelect
        className="custom-field-input"
        data={getTreeNodeData()}
        components={fieldComponents}
      />
    </div>
  );
};
