export const basicUsageCode = `import React, {FC} from 'react';
import {CheckedState, TreeNode, TreeSelect} from 'rts';

export const RtsApp: FC = () => {
  
  const data: TreeNode[] = [
    {
      label: 'label1',
      name: 'name1',
      children: [
        {
          label: 'child11-label',
          name: 'child11-name'
        },
        {
          label: 'child12-label',
          name: 'child12-name'
        }
      ]
    },
    {
      label: 'label2',
      name: 'name2',
      children: [
        {
          label: 'child21-label',
          name: 'child21-name'
        },
        {
          label: 'child22-label',
          name: 'child22-name'
        }
      ]
    },
    {
      label: 'label3',
      name: 'name3'
    }
  ];
  
  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]) => {
    console.log('node', node);
    console.log('selectedNodes', selectedNodes);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]) => {
    console.log('node', node);
    console.log('expandedNodes', expandedNodes);
  };

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => {
    console.log('handleClearAll selectedNodes', selectedNodes);
    console.log('handleClearAll selectAllCheckedState', selectAllCheckedState);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => {
    console.log('handleSelectAllChange selectedNodes', selectedNodes);
     console.log('handleSelectAllChange selectAllCheckedState', selectAllCheckedState);
  };

  return (
    <TreeSelect
      id="my-id"
      className="custom-class"
      data={data}
      withSelectAll
      withClearAll
      onNodeChange={handleNodeChange}
      onNodeToggle={handleNodeToggle}
      onClearAll={handleClearAll}
      onSelectAllChange={handleSelectAllChange}
    />
  );
});`;

export const rtsTypes = `enum Type {
  MULTI_SELECT_TREE = 'MULTI_SELECT_TREE',
  MULTI_SELECT_TREE_FLAT = 'MULTI_SELECT_TREE_FLAT',
  MULTI_SELECT = 'MULTI_SELECT',
  SELECT = 'SELECT'
}

interface TreeNode {
  label: string;
  children?: TreeNode[];
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;

  [key: PropertyKey]: unknown;
}

enum CheckedState {
  SELECTED = 'SELECTED',
  PARTIAL = 'PARTIAL',
  UNSELECTED = 'UNSELECTED'
}

interface ComponentProps<CustomProps = {}, OwnProps = {}, ComponentType = {}> {
  componentAttributes: HTMLProps<ComponentType>;
  componentProps: OwnProps;
  customProps: CustomProps;
  children?: ReactNode;
}

interface Component<CustomProps, ComponentProps> {
  component: ComponentType<ComponentProps>;
  props?: CustomProps;
}

type FieldProps<CustomProps = {}> = ComponentProps<CustomProps, FieldOwnProps, HTMLDivElement>;
type InputProps<CustomProps = {}> = ComponentProps<CustomProps, InputOwnProps, HTMLInputElement>;
type ChipProps<CustomProps = {}> = ComponentProps<CustomProps, ChipOwnProps, HTMLDivElement>;
type ChipLabelProps<CustomProps = {}> = ComponentProps<CustomProps, ChipLabelOwnProps, HTMLDivElement>;
type ChipClearProps<CustomProps = {}> = ComponentProps<CustomProps, ChipClearOwnProps, HTMLDivElement>;
type FieldClearProps<CustomProps = {}> = ComponentProps<CustomProps, FieldClearOwnProps, HTMLDivElement>;
type FieldToggleProps<CustomProps = {}> = ComponentProps<CustomProps, FieldToggleOwnProps, HTMLDivElement>;

type FieldType<CustomProps = {}> = Component<CustomProps, FieldProps<CustomProps>>;
type InputType<CustomProps = {}> = Component<CustomProps, InputProps<CustomProps>>;
type ChipType<CustomProps = {}> = Component<CustomProps, ChipProps<CustomProps>>;
type ChipLabelType<CustomProps = {}> = Component<CustomProps, ChipLabelProps<CustomProps>>;
type ChipClearType<CustomProps = {}> = Component<CustomProps, ChipClearProps<CustomProps>>;
type FieldClearType<CustomProps = {}> = Component<CustomProps, FieldClearProps<CustomProps>>;
type FieldToggleType<CustomProps = {}> = Component<CustomProps, FieldToggleProps<CustomProps>>;


interface Components<
  FieldCustomProps = any,
  InputCustomProps = any,
  ChipCustomProps = any,
  ChipLabelCustomProps = any,
  ChipClearCustomProps = any,
  FieldClearCustomProps = any,
  FieldToggleCustomProps = any
> {
  Field?: FieldType<FieldCustomProps>;
  Input?: InputType<InputCustomProps>;
  Chip?: ChipType<ChipCustomProps>;
  ChipLabel?: ChipLabelType<ChipLabelCustomProps>;
  ChipClear?: ChipClearType<ChipClearCustomProps>;
  FieldClear?: FieldClearType<FieldClearCustomProps>;
  FieldToggle?: FieldToggleType<FieldToggleCustomProps>;
}`;

export const fieldExample = `import React, {FC} from 'react';
import {FieldProps, TreeSelect, Type} from 'rts';

interface CustomFieldProps {
  label: string;
}

const CustomField: FC<FieldProps<CustomFieldProps>> = (props) => (
  <div {...props.componentAttributes}>
    <button className="filter-btn">{props.customProps.label}</button>
  </div>
);

export const CustomFieldExample: FC = () => {

  return (
    <div className="component-example field-example">
      <TreeSelect
        data={[
          {
            label: 'Company1',
            children: [{label: 'Company1Branch1'}, {label: 'Company1Branch2'}],
            expanded: true
          },
          {
            label: 'Company2',
            children: [{label: 'Company2Branch1'}, {label: 'Company2Branch2', selected: true}],
            expanded: true
          },
          {
            label: 'Company3',
            children: [{label: 'Company3Branch1', disabled: true}, {label: 'Company3Branch2'}],
            expanded: true
          }
        ]}
        withDropdownInput={true}
        components={{
          Field: {component: CustomField, props: {label: 'Filter by company'}}
        }}
      />
      <TreeSelect
        type={Type.MULTI_SELECT}
        data={[
          {label: 'Brand1'},
          {label: 'Brand2'},
          {label: 'Brand3', selected: true},
          {label: 'Brand4'},
          {label: 'Brand5', selected: true}
        ]}
        withSelectAll={true}
        components={{
          Field: {component: CustomField, props: {label: 'Filter by brand'}}
        }}
      />
      <TreeSelect
        type={Type.SELECT}
        data={[
          {label: '100'},
          {label: '200'},
          {label: '300'},
          {label: '400'},
          {label: '500'}
        ]}
        components={{
          Field: {component: CustomField, props: {label: 'Filter by price'}}
        }}
      />
    </div>
  );
};`;

export const inputExample = `import React, {FC, HTMLProps} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldProps, FieldType, InputProps, InputType, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

const CustomField: FC<FieldProps> = (props) => (
  <div {...props.componentAttributes}>
    <button className="filter-btn">Tree select</button>
  </div>
);

const CustomFieldInput: FC<InputProps> = (props) => (
  <textarea {...props.componentAttributes as HTMLProps<HTMLTextAreaElement>}/>
);

const CustomDropdownInput: FC<InputProps> = (props) => (
  <div style={{display: 'flex', flex: 1, alignItems: 'center'}}>
    <input {...props.componentAttributes}/>
    <div style={{padding: '0 4px'}}><FontAwesomeIcon icon={faMagnifyingGlass}/></div>
  </div>
);

const Field: FieldType = {component: CustomField};
const DropdownInput: InputType = {component: CustomDropdownInput};
const dropdownComponents: Components = {Field, Input: DropdownInput};

const FieldInput: InputType = {component: CustomFieldInput};
const fieldComponents: Components = {Input: FieldInput};

export const CustomInputExample: FC = () => {

  return (
    <div className="component-example input-example">
      <TreeSelect
        className="custom-dropdown-input"
        data={getTreeNodeData()}
        withDropdownInput={true}
        components={dropdownComponents}
      />
      <TreeSelect
        className="custom-field-input"
        data={getTreeNodeData()}
        components={fieldComponents}
      />
    </div>
  );
};`;

export const chipExample = `import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire} from '@fortawesome/free-solid-svg-icons';
import {ChipProps, ChipType, Components, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

interface CustomChipProps {
  icon: ReactNode;
}

const CustomChip: FC<ChipProps<CustomChipProps>> = (props) => (
  <div {...props.componentAttributes}>
    <div>{props.customProps.icon}</div>
    {props.children}
  </div>
);

const Chip: ChipType<CustomChipProps> = {
  component: CustomChip,
  props: {icon: <FontAwesomeIcon icon={faFire}/>}
};

const components: Components = {Chip};

export const CustomChipExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const chipLabelExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ChipLabelProps, ChipLabelType, Components, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.componentAttributes}>
    <div>
      <FontAwesomeIcon icon={faCode}/>{' '}{props.componentProps.label}{' '}<FontAwesomeIcon icon={faCode}/>
    </div>
  </div>
);

const ChipLabel: ChipLabelType = {component: CustomChipLabel};
const components: Components = {ChipLabel};

export const CustomChipLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const chipClearExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ChipClearType, Components, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomChipClear: FC<ChipClearProps> = (props) => (
  <div {...props.componentAttributes}>
    <div><FontAwesomeIcon icon={faTrash}/></div>
  </div>
);

const ChipClear: ChipClearType = {component: CustomChipClear};
const components: Components = {ChipClear};

export const CustomChipClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;
