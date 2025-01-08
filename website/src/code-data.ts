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

interface ComponentProps<CP, OP> {
  rootAttributes: JSX.IntrinsicElements['div'];
  componentProps: CP;
  ownProps: OP;
  children?: ReactNode;
}

interface Component<CP = {}, OP = {}> {
  component: ComponentType<ComponentProps<CP, OP>>;
  props?: OP;
}

interface Components<
  FieldOwnProps = any,
  ChipOwnProps = any,
  ChipLabelOwnProps = any,
  ChipClearOwnProps = any,
  FieldClearOwnProps = any,
  FieldToggleOwnProps = any
> {
  Field?: Component<FieldProps, FieldOwnProps>;
  Chip?: Component<ChipProps, ChipOwnProps>;
  ChipLabel?: Component<ChipLabelProps, ChipLabelOwnProps>;
  ChipClear?: Component<ChipClearProps, ChipClearOwnProps>;
  FieldClear?: Component<FieldClearProps, FieldClearOwnProps>;
  FieldToggle?: Component<FieldToggleProps, FieldToggleOwnProps>;
}`;

export const fieldExample = `import React, {FC} from 'react';
import {ComponentProps, FieldProps, TreeSelect, Type} from 'rts';

interface CustomFieldProps {
  label: string;
}

const CustomField: FC<ComponentProps<FieldProps, CustomFieldProps>> = (props) => (
  <div {...props.rootAttributes}>
    <button className="filter-btn">{props.ownProps.label}</button>
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

export const chipExample = `import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire} from '@fortawesome/free-solid-svg-icons';
import {ChipProps, ComponentProps, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

interface CustomChipProps {
  icon: ReactNode;
}

const CustomChip: FC<ComponentProps<ChipProps, CustomChipProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div>{props.ownProps.icon}</div>
    {props.children}
  </div>
);

export const CustomChipExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          Chip: {component: CustomChip, props: {icon: <FontAwesomeIcon icon={faFire}/>}}
        }}
      />
    </div>
  );
};`;

export const chipLabelExample = `import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ChipLabelProps, ComponentProps, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

interface CustomChipLabelProps {
  icon: ReactNode;
}

const CustomChipLabel: FC<ComponentProps<ChipLabelProps, CustomChipLabelProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div className="custom-label">
      {props.ownProps.icon}{' '}{props.componentProps.label}{' '}{props.ownProps.icon}
    </div>
  </div>
);

export const CustomChipLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          ChipLabel: {component: CustomChipLabel, props: {icon: <FontAwesomeIcon icon={faCode}/>}}
        }}
      />
    </div>
  );
};`;

export const chipClearExample = `import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ComponentProps, TreeSelect} from 'rts';
import {getTreeNodeData} from '../../utils';

interface CustomChipClearProps {
  icon: ReactNode;
}

const CustomChipClear: FC<ComponentProps<ChipClearProps, CustomChipClearProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div className="custom-clear">{props.ownProps.icon}</div>
  </div>
);

export const CustomChipClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          ChipClear: {component: CustomChipClear, props: {icon: <FontAwesomeIcon icon={faTrash}/>}}
        }}
      />
    </div>
  );
};`;
