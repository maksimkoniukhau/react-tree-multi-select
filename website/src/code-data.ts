export const basicUsageCode = `import React, {FC} from 'react';
import {CheckedState, TreeNode, TreeMultiSelect} from 'react-tree-multi-select';

export const ReactTreeMultiSelectApp: FC = () => {
  
  const data: TreeNode[] = [
    {
      label: 'label1',
      children: [
        {
          label: 'child11-label'
        },
        {
          label: 'child12-label'
        }
      ]
    },
    {
      label: 'label2',
      children: [
        {
          label: 'child21-label'
        },
        {
          label: 'child22-label'
        }
      ]
    },
    {
      label: 'label3'
    }
  ];
  
  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedNodes:', selectedNodes);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedNodes:', expandedNodes);
  };

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined): void => {
    console.log('handleClearAll selectedNodes:', selectedNodes);
    console.log('handleClearAll selectAllCheckedState:', selectAllCheckedState);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState): void => {
    console.log('handleSelectAllChange selectedNodes:', selectedNodes);
    console.log('handleSelectAllChange selectAllCheckedState:', selectAllCheckedState);
  };

  return (
    <TreeMultiSelect
      data={data}
      withSelectAll
      onNodeChange={handleNodeChange}
      onNodeToggle={handleNodeToggle}
      onClearAll={handleClearAll}
      onSelectAllChange={handleSelectAllChange}
    />
  );
});`;

export const rtmsTypes = `enum Type {
  TREE_SELECT = 'TREE_SELECT',
  TREE_SELECT_FLAT = 'TREE_SELECT_FLAT',
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

type FooterConfig = {
  showWhenSearching?: boolean;
  showWhenNoItems?: boolean;
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
type ChipContainerProps<CustomProps = {}> = ComponentProps<CustomProps, ChipContainerOwnProps, HTMLDivElement>;
type ChipLabelProps<CustomProps = {}> = ComponentProps<CustomProps, ChipLabelOwnProps, HTMLDivElement>;
type ChipClearProps<CustomProps = {}> = ComponentProps<CustomProps, ChipClearOwnProps, HTMLDivElement>;
type InputProps<CustomProps = {}> = ComponentProps<CustomProps, InputOwnProps, HTMLInputElement>;
type FieldClearProps<CustomProps = {}> = ComponentProps<CustomProps, FieldClearOwnProps, HTMLDivElement>;
type FieldToggleProps<CustomProps = {}> = ComponentProps<CustomProps, FieldToggleOwnProps, HTMLDivElement>;
type SelectAllContainerProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllContainerOwnProps, HTMLDivElement>;
type SelectAllCheckboxProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllCheckboxOwnProps, HTMLDivElement>;
type SelectAllLabelProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllLabelOwnProps, HTMLDivElement>;
type NodeContainerProps<CustomProps = {}> = ComponentProps<CustomProps, NodeContainerOwnProps, HTMLDivElement>;
type NodeToggleProps<CustomProps = {}> = ComponentProps<CustomProps, NodeToggleOwnProps, HTMLDivElement>;
type NodeCheckboxProps<CustomProps = {}> = ComponentProps<CustomProps, NodeCheckboxOwnProps, HTMLDivElement>;
type NodeLabelProps<CustomProps = {}> = ComponentProps<CustomProps, NodeLabelOwnProps, HTMLDivElement>;
type FooterProps<CustomProps = {}> = ComponentProps<CustomProps, FooterOwnProps, HTMLDivElement>;
type NoMatchesProps<CustomProps = {}> = ComponentProps<CustomProps, NoMatchesOwnProps, HTMLDivElement>;

type FieldType<CustomProps = {}> = Component<CustomProps, FieldProps<CustomProps>>;
type ChipContainerType<CustomProps = {}> = Component<CustomProps, ChipContainerProps<CustomProps>>;
type ChipLabelType<CustomProps = {}> = Component<CustomProps, ChipLabelProps<CustomProps>>;
type ChipClearType<CustomProps = {}> = Component<CustomProps, ChipClearProps<CustomProps>>;
type InputType<CustomProps = {}> = Component<CustomProps, InputProps<CustomProps>>;
type FieldClearType<CustomProps = {}> = Component<CustomProps, FieldClearProps<CustomProps>>;
type FieldToggleType<CustomProps = {}> = Component<CustomProps, FieldToggleProps<CustomProps>>;
type SelectAllContainerType<CustomProps = {}> = Component<CustomProps, SelectAllContainerProps<CustomProps>>;
type SelectAllCheckboxType<CustomProps = {}> = Component<CustomProps, SelectAllCheckboxProps<CustomProps>>;
type SelectAllLabelType<CustomProps = {}> = Component<CustomProps, SelectAllLabelProps<CustomProps>>;
type NodeContainerType<CustomProps = {}> = Component<CustomProps, NodeContainerProps<CustomProps>>;
type NodeToggleType<CustomProps = {}> = Component<CustomProps, NodeToggleProps<CustomProps>>;
type NodeCheckboxType<CustomProps = {}> = Component<CustomProps, NodeCheckboxProps<CustomProps>>;
type NodeLabelType<CustomProps = {}> = Component<CustomProps, NodeLabelProps<CustomProps>>;
type FooterType<CustomProps = {}> = Component<CustomProps, FooterProps<CustomProps>>;
type NoMatchesType<CustomProps = {}> = Component<CustomProps, NoMatchesProps<CustomProps>>;

interface Components<
  FieldCustomProps = any,
  ChipContainerCustomProps = any,
  ChipLabelCustomProps = any,
  ChipClearCustomProps = any,
  InputCustomProps = any,
  FieldClearCustomProps = any,
  FieldToggleCustomProps = any,
  SelectAllContainerCustomProps = any,
  SelectAllCheckboxCustomProps = any,
  SelectAllLabelCustomProps = any,
  NodeContainerCustomProps = any,
  NodeToggleCustomProps = any,
  NodeCheckboxCustomProps = any,
  NodeLabelCustomProps = any,
  FooterCustomProps = any,
  NoMatchesCustomProps = any
> {
  Field?: FieldType<FieldCustomProps>;
  ChipContainer?: ChipContainerType<ChipContainerCustomProps>;
  ChipLabel?: ChipLabelType<ChipLabelCustomProps>;
  ChipClear?: ChipClearType<ChipClearCustomProps>;
  Input?: InputType<InputCustomProps>;
  FieldClear?: FieldClearType<FieldClearCustomProps>;
  FieldToggle?: FieldToggleType<FieldToggleCustomProps>;
  SelectAllContainer?: SelectAllContainerType<SelectAllContainerCustomProps>;
  SelectAllCheckbox?: SelectAllCheckboxType<SelectAllCheckboxCustomProps>;
  SelectAllLabel?: SelectAllLabelType<SelectAllLabelCustomProps>;
  NodeContainer?: NodeContainerType<NodeContainerCustomProps>;
  NodeToggle?: NodeToggleType<NodeToggleCustomProps>;
  NodeCheckbox?: NodeCheckboxType<NodeCheckboxCustomProps>;
  NodeLabel?: NodeLabelType<NodeLabelCustomProps>;
  Footer?: FooterType<FooterCustomProps>;
  NoMatches?: NoMatchesType<NoMatchesCustomProps>;
}`;

export const customComponentCommonPattern = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.componentAttributes}>
     {/*your custom code here*/}
  </div>
);`;

export const customComponentMergeClassname = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.componentAttributes} className={\`\${props.componentAttributes.className} custom-classname\`}>
     {/*your custom code here*/}
  </div>
);`;

export const customComponentBuiltin = `const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <Tooltip content={\`Tooltip for the \${props.componentProps.label}\`}>
    <components.ChipContainer {...props}/>
  </Tooltip>
);`;

export const customProps = `export const CustomExample: FC = () => {
    
  const data = useMemo(() => getTreeNodeData(true), []);

  const components: Components = useMemo(() => (
    {
      ChipLabel: {
        component: CustomChipLabel,
        props: {suffix: 'Yo'}
      }
    }
  ), []);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        components={components}
      />
    </div>
  );
};`;

export const fieldExample = `import React, {FC, useMemo} from 'react';
import {Components, FieldProps, TreeMultiSelect, Type} from 'react-tree-multi-select';

interface CustomFieldProps {
  label: string;
}

const CustomField: FC<FieldProps<CustomFieldProps>> = (props) => (
  <div {...props.componentAttributes}>
    <button className="filter-btn">{props.customProps.label}</button>
  </div>
);

export const CustomFieldExample: FC = () => {

  const createComponents = (label: string): Components => ({
    Field: {
      component: CustomField,
      props: {label},
    },
  });

  const companyComponents = useMemo(() => createComponents('Filter by company'), []);
  const brandComponents = useMemo(() => createComponents('Filter by brand'), []);
  const priceComponents = useMemo(() => createComponents('Filter by price'), []);

  return (
    <div className="component-example field-example">
      <TreeMultiSelect
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
        components={companyComponents}
      />
      <TreeMultiSelect
        type={Type.MULTI_SELECT}
        data={[
          {label: 'Brand1'},
          {label: 'Brand2'},
          {label: 'Brand3', selected: true},
          {label: 'Brand4'},
          {label: 'Brand5', selected: true}
        ]}
        withSelectAll={true}
        components={brandComponents}
      />
      <TreeMultiSelect
        type={Type.SELECT}
        data={[
          {label: '100'},
          {label: '200'},
          {label: '300'},
          {label: '400'},
          {label: '500'}
        ]}
        components={priceComponents}
      />
    </div>
  );
};`;

export const chipContainerExample = `import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {
  ChipContainerProps,
  ChipContainerType,
  Components,
  components,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <Tooltip content={\`Tooltip for the \${props.componentProps.label}\`}>
    <components.ChipContainer {...props}/>
  </Tooltip>
);

const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const customComponents: Components = {ChipContainer};

export const CustomChipContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={customComponents}
      />
    </div>
  );
};`;

export const chipLabelExample = `import React, {FC, useMemo} from 'react';
import {ChipLabelProps, Components, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

interface CustomChipLabelProps {
  suffix: string;
}

const CustomChipLabel: FC<ChipLabelProps<CustomChipLabelProps>> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.label}{'-'}{props.customProps.suffix}
  </div>
);

export const CustomChipLabelExample: FC = () => {

  const data = useMemo(() => getTreeNodeData(true), []);

  const components: Components = useMemo(() => (
    {
      ChipLabel: {
        component: CustomChipLabel,
        props: {suffix: 'Yo'}
      }
    }
  ), []);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        components={components}
      />
    </div>
  );
};`;

export const chipClearExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ChipClearType, Components, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomChipClear: FC<ChipClearProps> = (props) => (
  <div {...props.componentAttributes}>
    <FontAwesomeIcon icon={faTrash}/>
  </div>
);

const ChipClear: ChipClearType = {component: CustomChipClear};
const components: Components = {ChipClear};

export const CustomChipClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const inputExample = `import React, {FC, HTMLProps} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldProps, FieldType, InputProps, InputType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomField: FC<FieldProps> = (props) => (
  <div {...props.componentAttributes}>
    <button className="filter-btn">Tree multi select</button>
  </div>
);

const CustomFieldInput: FC<InputProps> = (props) => (
  <textarea {...props.componentAttributes as unknown as HTMLProps<HTMLTextAreaElement>}/>
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
};`;

export const fieldClearExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDeleteLeft} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldClearProps, FieldClearType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomFieldClear: FC<FieldClearProps> = (props) => (
  <div {...props.componentAttributes}>
    <FontAwesomeIcon icon={faDeleteLeft}/>
  </div>
);

const FieldClear: FieldClearType = {component: CustomFieldClear};
const components: Components = {FieldClear};

export const CustomFieldClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const fieldToggleExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldToggleProps, FieldToggleType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomFieldToggle: FC<FieldToggleProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.expanded ? <FontAwesomeIcon icon={faCaretUp}/> : <FontAwesomeIcon icon={faCaretDown}/>}
  </div>
);

const FieldToggle: FieldToggleType = {component: CustomFieldToggle};
const components: Components = {FieldToggle};

export const CustomFieldToggleExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const selectAllContainerExample = `import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {Components, SelectAllContainerProps, SelectAllContainerType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomSelectAllContainer: FC<SelectAllContainerProps> = (props) => (
  <Tooltip content={\`Tooltip for the \${props.componentProps.label}\`}>
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  </Tooltip>
);

const SelectAllContainer: SelectAllContainerType = {component: CustomSelectAllContainer};
const components: Components = {SelectAllContainer};

export const CustomSelectAllContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const selectAllCheckboxExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Components, SelectAllCheckboxProps, SelectAllCheckboxType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomSelectAllCheckbox: FC<SelectAllCheckboxProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.componentProps.partial
        ? <FontAwesomeIcon icon={faSquareMinus}/>
        : <FontAwesomeIcon icon={faSquare}/>
    }
  </div>
);

const SelectAllCheckbox: SelectAllCheckboxType = {component: CustomSelectAllCheckbox};
const components: Components = {SelectAllCheckbox};

export const CustomSelectAllCheckboxExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const selectAllLabelExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import {Components, SelectAllLabelProps, SelectAllLabelType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomSelectAllLabel: FC<SelectAllLabelProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.label}{' '}<FontAwesomeIcon icon={faCheckDouble}/>
  </div>
);

const SelectAllLabel: SelectAllLabelType = {component: CustomSelectAllLabel};
const components: Components = {SelectAllLabel};

export const CustomSelectAllLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const nodeContainerExample = `import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {
  Components,
  components,
  NodeContainerProps,
  NodeContainerType,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomNodeContainer: FC<NodeContainerProps> = (props) => (
  <Tooltip content={\`Tooltip for the \${props.componentProps.label}\`}>
    <components.NodeContainer {...props}/>
  </Tooltip>
);

const NodeContainer: NodeContainerType = {component: CustomNodeContainer};
const customComponents: Components = {NodeContainer};

export const CustomNodeContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={customComponents}
      />
    </div>
  );
};`;

export const nodeToggleExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Components, NodeToggleProps, NodeToggleType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomNodeToggle: FC<NodeToggleProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.expanded
      ? <FontAwesomeIcon icon={faMinus}/>
      : <FontAwesomeIcon icon={faPlus}/>
    }
  </div>
);

const NodeToggle: NodeToggleType = {component: CustomNodeToggle};
const components: Components = {NodeToggle};

export const CustomNodeToggleExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const nodeCheckboxExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeCheckboxProps, NodeCheckboxType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomNodeCheckbox: FC<NodeCheckboxProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.componentProps.partial
        ? <FontAwesomeIcon icon={faSquareMinus}/>
        : <FontAwesomeIcon icon={faSquare}/>
    }
  </div>
);

const NodeCheckbox: NodeCheckboxType = {component: CustomNodeCheckbox};
const components: Components = {NodeCheckbox};

export const CustomNodeCheckboxExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const nodeLabelExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandSpock} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeLabelProps, NodeLabelType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomNodeLabel: FC<NodeLabelProps> = (props) => (
  <div {...props.componentAttributes}>
    <FontAwesomeIcon icon={faHandSpock}/>
    {props.componentProps.label}
  </div>
);

const NodeLabel: NodeLabelType = {component: CustomNodeLabel};
const components: Components = {NodeLabel};

export const CustomNodeLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;

export const footerExample = `import React, {FC} from 'react';
import {Components, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';
import {FooterProps, FooterType} from '../../../../src';

const CustomFooter: FC<FooterProps> = (props) => (
  <div {...props.componentAttributes}>
    <span style={{display: 'flex', justifyContent: 'center'}}>
      Footer component
    </span>
  </div>
);

const Footer: FooterType = {component: CustomFooter};
const components: Components = {Footer};

export const CustomFooterExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true, true)}
        components={components}
      />
    </div>
  );
};`;

export const noMatchesExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSadTear} from '@fortawesome/free-regular-svg-icons';
import {Components, NoMatchesProps, NoMatchesType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '../../utils';

const CustomNoMatches: FC<NoMatchesProps> = (props) => (
  <div {...props.componentAttributes}>
    <div><FontAwesomeIcon icon={faFaceSadTear}/>{' '}{props.componentProps.label}</div>
  </div>
);

const NoMatches: NoMatchesType = {component: CustomNoMatches};
const components: Components = {NoMatches};

export const CustomNoMatchesExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};`;
