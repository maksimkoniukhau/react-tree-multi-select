export const basicUsageCode = `import React, {FC} from 'react';
import {SelectionAggregateState, TreeNode, TreeMultiSelect} from 'react-tree-multi-select';

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
  
  const handleNodeChange = (node: TreeNode, selectedIds: string[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedIds:', selectedIds);
  };

  const handleNodeToggle = (node: TreeNode, expandedIds: string[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedIds:', expandedIds);
  };

  const handleClearAll = (selectedIds: string[], selectionAggregateState: SelectionAggregateState | undefined): void => {
    console.log('handleClearAll selectedIds:', selectedIds);
    console.log('handleClearAll selectionAggregateState:', selectionAggregateState);
  };

  const handleSelectAllChange = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    console.log('handleSelectAllChange selectedIds:', selectedIds);
    console.log('handleSelectAllChange selectionAggregateState:', selectionAggregateState);
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

export const largeDataExample = `import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {largeTreeNodeData25, largeTreeNodeData50, RandomTreeNode} from '@/utils/utils';
import {Select} from '@/shared-components/Select';

export const LargeDataExample: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(largeTreeNodeData25.data);
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '5.5.3', '10.3']);
  const [expandedIds, setExpandedIds] = useState<string[]>(largeTreeNodeData25.expandedIds);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? largeTreeNodeData50.data : largeTreeNodeData25.data);
    setExpandedIds(value === '50' ? largeTreeNodeData50.expandedIds : largeTreeNodeData25.expandedIds);
  };

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
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
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});`;

export const nonVirtualizedExample = `import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';
import {generateRandomTreeNodeData, getAllExpandedIds, RandomTreeNode} from '@/utils/utils';

/*Add to styles:
.non-virtualized-example .rtms-dropdown {
  width: auto;
}*/
export const NonVirtualizedExample: FC = memo(() => {

  const [data] = useState<RandomTreeNode[]>(generateRandomTreeNodeData(3, 3));
  const [expandedIds] = useState<string[]>(getAllExpandedIds(data));

  return (
    <div className="non-virtualized-example">
      <TreeMultiSelect
        data={data}
        expandedIds={expandedIds}
        isVirtualized={false}
      />
    </div>
  );
});`;

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
