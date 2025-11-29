export const basicUsageCode = `import React, {FC} from 'react';
import {CheckedState, TreeNode, TreeMultiSelect} from 'react-tree-multi-select';

export const ReactTreeMultiSelectApp: FC = () => {
  
  const data: TreeNode[] = [
    {
      id: '1',
      label: 'label1',
      children: [
        {
          id: '1.1',
          label: 'child11-label'
        },
        {
          id: '1.2',
          label: 'child12-label'
        }
      ]
    },
    {
      id: '2',
      label: 'label2',
      children: [
        {
          id: '2.1',
          label: 'child21-label'
        },
        {
          id: '2.2',
          label: 'child22-label'
        }
      ]
    },
    {
      id: '3',
      label: 'label3'
    }
  ];
  
  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[], data: TreeNode[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedNodes:', selectedNodes);
    console.log('handleNodeChange data:', data);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[], data: TreeNode[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedNodes:', expandedNodes);
    console.log('handleNodeToggle data:', data);
  };

  const handleClearAll = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined, data: TreeNode[]): void => {
    console.log('handleClearAll selectedNodes:', selectedNodes);
    console.log('handleClearAll selectAllCheckedState:', selectAllCheckedState);
    console.log('handleClearAll data:', data);
  };

  const handleSelectAllChange = (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState, data: TreeNode[]): void => {
    console.log('handleSelectAllChange selectedNodes:', selectedNodes);
    console.log('handleSelectAllChange selectAllCheckedState:', selectAllCheckedState);
    console.log('handleSelectAllChange data:', data);
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

export const customComponentCommonPattern = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.attributes}>
     {/*your custom code here*/}
  </div>
);`;

export const customComponentMergeClassname = `const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.attributes} className={\`\${props.attributes.className} custom-classname\`}>
     {/*your custom code here*/}
  </div>
);`;

export const customComponentBuiltin = `const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <Tooltip content={\`Tooltip for the \${props.ownProps.label}\`}>
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

export const tsSupport = `const createComponents = (label: string): Components<{ Field: FieldType<CustomFieldProps>; }> => ({
    Field: {
      component: CustomField,
      props: {label},
    },
  });`;

export const fieldExample = `import React, {FC, useMemo} from 'react';
import {Components, FieldProps, FieldType, TreeMultiSelect, Type} from 'react-tree-multi-select';

interface CustomFieldProps {
  label: string;
}

const CustomField: FC<FieldProps<CustomFieldProps>> = (props) => (
  <div {...props.attributes}>
    <button className="filter-btn">{props.customProps.label}</button>
  </div>
);

export const CustomFieldExample: FC = () => {

  const createComponents = (label: string): Components<{ Field: FieldType<CustomFieldProps>; }> => ({
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
            id: '1',
            label: 'Company1',
            children: [{id: '1.1', label: 'Company1Branch1'}, {id: '1.2', label: 'Company1Branch2'}],
            expanded: true
          },
          {
            id: '2',
            label: 'Company2',
            children: [{id: '2.1', label: 'Company2Branch1'}, {id: '2.2', label: 'Company2Branch2'}],
            expanded: true
          },
          {
            id: '3',
            label: 'Company3',
            children: [{id: '3.1', label: 'Company3Branch1', disabled: true}, {id: '3.2', label: 'Company3Branch2'}],
            expanded: true
          }
        ]}
        selectedIds={['2.2']}
        withDropdownInput={true}
        components={companyComponents}
      />
      <TreeMultiSelect
        type={Type.MULTI_SELECT}
        data={[
          {id: '1', label: 'Brand1'},
          {id: '2', label: 'Brand2'},
          {id: '3', label: 'Brand3'},
          {id: '4', label: 'Brand4'},
          {id: '5', label: 'Brand5'}
        ]}
        selectedIds={['3', '5']}
        withSelectAll={true}
        components={brandComponents}
      />
      <TreeMultiSelect
        type={Type.SELECT}
        data={[
          {id: '1', label: '100'},
          {id: '2', label: '200'},
          {id: '3', label: '300'},
          {id: '4', label: '400'},
          {id: '5', label: '500'}
        ]}
        components={priceComponents}
      />
    </div>
  );
};`;

export const chipContainerExample = `import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  ChipContainerProps,
  ChipContainerType,
  Components,
  components,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <>
    <Tooltip id="chip-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <components.ChipContainer
      {...props}
      attributes={{
        ...props.attributes,
        "data-tooltip-id": "chip-tooltip",
        "data-tooltip-content": \`Tooltip for the \${props.ownProps.label}\`,
        "data-tooltip-place": "top"
      }}/>
  </>
);

const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const customComponents: Components = {ChipContainer};

export const CustomChipContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={customComponents}
      />
    </div>
  );
};`;

export const chipLabelExample = `import React, {FC, useMemo, useState} from 'react';
import {ChipLabelProps, Components, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

interface CustomChipLabelProps {
  suffix: string;
}

const CustomChipLabel: FC<ChipLabelProps<CustomChipLabelProps>> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.label}{'-'}{props.customProps.suffix}
  </div>
);

export const CustomChipLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

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
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const chipClearExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ChipClearType, Components, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomChipClear: FC<ChipClearProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faTrash}/>
  </div>
);

const ChipClear: ChipClearType = {component: CustomChipClear};
const components: Components = {ChipClear};

export const CustomChipClearExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const inputExample = `import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {
  Attributes,
  Components,
  FieldProps,
  FieldType,
  InputProps,
  InputType,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomField: FC<FieldProps> = (props) => (
  <div {...props.attributes}>
    <button className="filter-btn">Tree multi select</button>
  </div>
);

const CustomFieldInput: FC<InputProps> = (props) => (
  <textarea {...props.attributes as unknown as Attributes<'textarea'>}/>
);

const CustomDropdownInput: FC<InputProps> = (props) => (
  <div style={{display: 'flex', flex: 1, alignItems: 'center'}}>
    <input {...props.attributes}/>
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

export const fieldClearExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDeleteLeft} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldClearProps, FieldClearType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomFieldClear: FC<FieldClearProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faDeleteLeft}/>
  </div>
);

const FieldClear: FieldClearType = {component: CustomFieldClear};
const components: Components = {FieldClear};

export const CustomFieldClearExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const fieldToggleExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldToggleProps, FieldToggleType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomFieldToggle: FC<FieldToggleProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.expanded ? <FontAwesomeIcon icon={faCaretUp}/> : <FontAwesomeIcon icon={faCaretDown}/>}
  </div>
);

const FieldToggle: FieldToggleType = {component: CustomFieldToggle};
const components: Components = {FieldToggle};

export const CustomFieldToggleExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const dropdownExample = `import React, {FC, useState} from 'react';
import {Components, DropdownProps, DropdownType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomDropdown: FC<DropdownProps> = (props) => {
  return (
    <div {...props.attributes}>
      <div style={{padding: '10px', display: 'flex', justifyContent: 'center', borderBottom: '2px solid #ebebeb'}}>
        <label>{'Custom Dropdown top content'}</label>
      </div>
      {props.children}
      <div style={{padding: '10px', display: 'flex', justifyContent: 'center', borderTop: '2px solid #ebebeb'}}>
        <label>{'Custom Dropdown bottom content'}</label>
      </div>
    </div>
  );
};

const Dropdown: DropdownType = {component: CustomDropdown};
const components: Components = {Dropdown};

export const CustomDropdownExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const selectAllContainerExample = `import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  Components,
  SelectAllContainerProps,
  SelectAllContainerType,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllContainer: FC<SelectAllContainerProps> = (props) => (
  <>
    <Tooltip id="select-all-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <div
      {...props.attributes}
      data-tooltip-id="select-all-tooltip"
      data-tooltip-content={\`Tooltip for the \${props.ownProps.label}\`}
      data-tooltip-place="top"
    >
      {props.children}
    </div>
  </>
);

const SelectAllContainer: SelectAllContainerType = {component: CustomSelectAllContainer};
const components: Components = {SelectAllContainer};

export const CustomSelectAllContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const selectAllCheckboxExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {
  Components,
  SelectAllCheckboxProps,
  SelectAllCheckboxType,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllCheckbox: FC<SelectAllCheckboxProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.ownProps.partial
        ? <FontAwesomeIcon icon={faSquareMinus}/>
        : <FontAwesomeIcon icon={faSquare}/>
    }
  </div>
);

const SelectAllCheckbox: SelectAllCheckboxType = {component: CustomSelectAllCheckbox};
const components: Components = {SelectAllCheckbox};

export const CustomSelectAllCheckboxExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const selectAllLabelExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import {Components, SelectAllLabelProps, SelectAllLabelType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllLabel: FC<SelectAllLabelProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.label}{' '}<FontAwesomeIcon icon={faCheckDouble}/>
  </div>
);

const SelectAllLabel: SelectAllLabelType = {component: CustomSelectAllLabel};
const components: Components = {SelectAllLabel};

export const CustomSelectAllLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        components={components}
      />
    </div>
  );
};`;

export const nodeContainerExample = `import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  Components,
  components,
  NodeContainerProps,
  NodeContainerType,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeContainer: FC<NodeContainerProps> = (props) => (
  <>
    <Tooltip id="node-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <components.NodeContainer
      {...props}
      attributes={{
        ...props.attributes,
        "data-tooltip-id": "node-tooltip",
        "data-tooltip-content": \`Tooltip for the \${props.ownProps.label}\`,
        "data-tooltip-place": "top"
      }}/>
  </>
);

const NodeContainer: NodeContainerType = {component: CustomNodeContainer};
const customComponents: Components = {NodeContainer};

export const CustomNodeContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={customComponents}
      />
    </div>
  );
};`;

export const nodeToggleExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Components, NodeToggleProps, NodeToggleType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeToggle: FC<NodeToggleProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.expanded
      ? <FontAwesomeIcon icon={faMinus}/>
      : <FontAwesomeIcon icon={faPlus}/>
    }
  </div>
);

const NodeToggle: NodeToggleType = {component: CustomNodeToggle};
const components: Components = {NodeToggle};

export const CustomNodeToggleExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const nodeCheckboxExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeCheckboxProps, NodeCheckboxType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeCheckbox: FC<NodeCheckboxProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.ownProps.partial
        ? <FontAwesomeIcon icon={faSquareMinus}/>
        : <FontAwesomeIcon icon={faSquare}/>
    }
  </div>
);

const NodeCheckbox: NodeCheckboxType = {component: CustomNodeCheckbox};
const components: Components = {NodeCheckbox};

export const CustomNodeCheckboxExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const nodeLabelExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandSpock} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeLabelProps, NodeLabelType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeLabel: FC<NodeLabelProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faHandSpock}/>{' '}{props.ownProps.label}
  </div>
);

const NodeLabel: NodeLabelType = {component: CustomNodeLabel};
const components: Components = {NodeLabel};

export const CustomNodeLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const footerExample = `import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Components, FooterProps, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {fetchFakeService, RandomTreeNode} from '@/utils/utils';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const loadData = useCallback(async (delay: number) => {
    setIsLoading(true);
    const {data: newData, nextPage} = await fetchFakeService(page, 7, delay);
    if (!nextPage) {
      setLastPageReached(true);
    }
    setData(prevData => [...prevData, ...newData]);
    setPage(page + 1);
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    void loadData(0);
  }, []);

  const handleNodeChange = (_node: TreeNode, selectedNodes: TreeNode[]): void => {
    setSelectedIds(selectedNodes.map(node => node.id));
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as RandomTreeNode[]);
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
        selectedIds={selectedIds}
        withClearAll={false}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
};`;

export const noDataExample = `import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSadTear} from '@fortawesome/free-regular-svg-icons';
import {Components, NoDataProps, NoDataType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNoData: FC<NoDataProps> = (props) => (
  <div {...props.attributes}>
    <div><FontAwesomeIcon icon={faFaceSadTear}/>{' '}{props.ownProps.label}</div>
  </div>
);

const NoData: NoDataType = {component: CustomNoData};
const components: Components = {NoData};

export const CustomNoDataExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};`;

export const controlledExample = `import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledExample: FC = memo(() => {

  const [data, setData] = useState<TreeNode[]>(getTreeNodeData(true, true));
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  const handleNodeChange = (_node: TreeNode, selectedNodes: TreeNode[]): void => {
    setSelectedIds(selectedNodes.map(node => node.id));
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data);
  };

  return (
    <div className="controlled-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withClearAll={false}
        openDropdown={open}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});`;

export const largeDataExample = `import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';
import {largeTreeNodeData25, largeTreeNodeData50, RandomTreeNode} from '@/utils/utils';
import {Select} from '@/shared-components/Select';

export const LargeDataExample: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(largeTreeNodeData25.data);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? largeTreeNodeData50.data : largeTreeNodeData25.data);
  };

  return (
    <div className="large-data-example">
      <Select
        label="Choose amount of nodes:"
        options={[
          {name: \`\${largeTreeNodeData25.amount}\`, value: '25'},
          {name: \`\${largeTreeNodeData50.amount}\`, value: '50'}
        ]}
        onChange={handleOptionChange}
      />
      <TreeMultiSelect data={data}/>
    </div>
  );
});`;

export const nonVirtualizedExample = `import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';
import {generateRandomTreeNodeData, RandomTreeNode} from '@/utils/utils';

/*Add to styles:
.non-virtualized-example .rtms-dropdown {
  width: auto;
}*/
export const NonVirtualizedExample: FC = memo(() => {

  const [data] = useState<RandomTreeNode[]>(generateRandomTreeNodeData(3, 3));

  return (
    <div className="non-virtualized-example">
      <TreeMultiSelect
        data={data}
        isVirtualized={false}
      />
    </div>
  );
});`;

export const infiniteScrollExample = `import React, {FC, useMemo, useState} from 'react';
import {FooterProps, KeyboardConfig, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {fetchFakeService, RandomTreeNode} from '@/utils/utils';

const Footer: FC<FooterProps<{ text: string }>> = (props) => {
  return (
    <div {...props.attributes} style={{padding: '5px', display: 'flex', justifyContent: 'center'}}>
      {props.customProps.text}
    </div>
  );
};

export const InfiniteScrollExample: FC = () => {

  const [data, setData] = useState<RandomTreeNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastPageReached, setLastPageReached] = useState<boolean>(false);
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>({dropdown: {loopUp: false, loopDown: false}});
  const [page, setPage] = useState<number>(0);

  const handleNodeChange = (_node: TreeNode, selectedNodes: TreeNode[]): void => {
    setSelectedIds(selectedNodes.map(node => node.id));
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as RandomTreeNode[]);
  };

  const handleDropdownLastItemReached = async (inputValue: string): Promise<void> => {
    if (inputValue || lastPageReached) {
      return;
    }
    const {data: newData, nextPage} = await fetchFakeService(page, 7, 1000);
    if (nextPage) {
      setPage(nextPage);
    } else {
      setKeyboardConfig({dropdown: {loopUp: true, loopDown: true}});
      setLastPageReached(true);
    }
    setData(prevData => [...prevData, ...newData]);
  };

  const components = useMemo(() => (
    {
      Footer: {
        component: Footer,
        props: {text: lastPageReached ? 'No more data!' : 'Loading more data...'}
      }
    }
  ), [lastPageReached]);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        noDataText="Initial data loading..."
        withClearAll={false}
        keyboardConfig={keyboardConfig}
        components={components}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
        onDropdownLastItemReached={handleDropdownLastItemReached}
      />
    </div>
  );
};`;

export const virtualFocusIdDefinition = `field:<elementId> 
dropdown:<elementId>`;

export const dropdownVirtualFocusIdsDefinition = `const getDropdownVirtualFocusIds = (): VirtualFocusId[] => {
    const focusableElements: VirtualFocusId[] = [];
    if (showSelectAll) {
      focusableElements.push(\`\${DROPDOWN_PREFIX}\${SELECT_ALL_SUFFIX}\`);
    }
    focusableElements.push(...displayedNodes
      .filter(node => !node.skipDropdownVirtualFocus)
      .map(node => buildVirtualFocusId(\`\${DROPDOWN_PREFIX}\${node.id}\`));
    if (showFooter) {
      focusableElements.push(\`\${DROPDOWN_PREFIX}\${FOOTER_SUFFIX}\`);
    }
    return focusableElements;
  };`;

export const customVirtualFocusInFieldExample = `import React, {FC} from 'react';
import {
  ChipContainerProps,
  ChipContainerType,
  Components,
  components,
  FieldProps,
  FieldType,
  InputProps,
  InputType,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomFieldInput: FC<InputProps> = (props) => {
  const {['data-rtms-virtual-focus-id']: _omit, ...restAttributes} = props.attributes;
  return (
    <components.Input{...props} attributes={restAttributes}/>
  );
};

const CustomChipContainer: FC<ChipContainerProps> = (props) => {
  const {['data-rtms-virtual-focus-id']: _omit, ...restAttributes} = props.attributes;
  return (
    <components.ChipContainer{...props} attributes={props.ownProps.disabled ? restAttributes : props.attributes}/>
  );
};

const CustomField: FC<FieldProps> = (props) => (
  <div {...props.attributes}>
    <div data-rtms-virtual-focus-id="field:custom-id-1" className="field-virtual-focusable">
      {\`I'm focusable\`}
    </div>
    {props.children}
  </div>
);

const Input: InputType = {component: CustomFieldInput};
const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const Field: FieldType = {component: CustomField};
const customComponents: Components = {Field, ChipContainer, Input};

export const CustomVirtualFocusInFieldExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true, true, true)}
        components={customComponents}
      />
    </div>
  );
};`;

export const skipDropdownVirtualFocusExample = `import React, {FC} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';

export const SkipDropdownVirtualFocusExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={[
          {
            id: '1',
            label: 'node-1',
            expanded: true,
            children: [
              {id: '1.1', label: 'node-1-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {id: '1.2', label: 'node-1-child-2'}
            ]
          },
          {
            id: '2',
            label: 'node-2',
            expanded: true,
            children: [
              {id: '2.1', label: 'node-2-child-1'},
              {id: '2.2', label: 'node-2-child-2', disabled: true, skipDropdownVirtualFocus: true}
            ]
          },
          {
            id: '3',
            label: 'node-3',
            expanded: true,
            selected: true,
            children: [
              {id: '3.1', label: 'node-3-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {id: '3.2', label: 'node-3-child-2'}
            ]
          }
        ]}
      />
    </div>
  );
};`;
