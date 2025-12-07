import React, {FC, memo} from 'react';
import {
  chipClearExample,
  chipContainerExample,
  chipLabelExample,
  customComponentBuiltin,
  customComponentCommonPattern,
  customComponentMergeClassname,
  customProps,
  dropdownExample,
  fieldClearExample,
  fieldExample,
  fieldToggleExample,
  footerExample,
  inputExample,
  noDataExample,
  nodeCheckboxExample,
  nodeContainerExample,
  nodeLabelExample,
  nodeToggleExample,
  selectAllCheckboxExample,
  selectAllContainerExample,
  selectAllLabelExample,
  tsSupport
} from '@/utils/code-data';
import {Alert} from '@/shared-components/Alert';
import {CodeBlock} from '@/shared-components/CodeBlock';
import {PageNavigation} from '@/shared-components/PageNavigation';
import {Section} from '@/shared-components/Section';
import {CustomFieldExample} from '@/examples/components/CustomFieldExample';
import {CustomChipContainerExample} from '@/examples/components/CustomChipContainerExample';
import {CustomChipLabelExample} from '@/examples/components/CustomChipLabelExample';
import {CustomChipClearExample} from '@/examples/components/CustomChipClearExample';
import {CustomInputExample} from '@/examples/components/CustomInputExample';
import {CustomFieldClearExample} from '@/examples/components/CustomFieldClearExample';
import {CustomFieldToggleExample} from '@/examples/components/CustomFieldToggleExample';
import {CustomDropdownExample} from '@/examples/components/CustomDropdownExample';
import {CustomSelectAllContainerExample} from '@/examples/components/CustomSelectAllContainerExample';
import {CustomSelectAllCheckboxExample} from '@/examples/components/CustomSelectAllCheckboxExample';
import {CustomSelectAllLabelExample} from '@/examples/components/CustomSelectAllLabelExample';
import {CustomNodeContainerExample} from '@/examples/components/CustomNodeContainerExample';
import {CustomNodeToggleExample} from '@/examples/components/CustomNodeToggleExample';
import {CustomNodeCheckboxExample} from '@/examples/components/CustomNodeCheckboxExample';
import {CustomNodeLabelExample} from '@/examples/components/CustomNodeLabelExample';
import {CustomFooterExample} from '@/examples/components/CustomFooterExample';
import {CustomNoDataExample} from '@/examples/components/CustomNoDataExample';

const ComponentsPage: FC = memo(() => {

  return (
    <>
      <div className="page-content" style={{marginBottom: '250px'}}>
        <Section id="overview">
          <h2>{'Components'}</h2>
          <div className="paragraph">
            <b>{'react-tree-multi-select'}</b>{' allows you to customize its built-in components by providing your own custom components as a property.'}
            {' This feature enables you to tailor the appearance and behavior of various components.\n'}
            {'The general pattern for implementing a custom component involves creating a component and passing the attributes prop to the root element. Here\'s a simple implementation:'}
          </div>
          <CodeBlock code={customComponentCommonPattern}/>
          <Alert type={'important'}>
            {'You must pass attributes prop to the root element in order for component to work properly.'}
          </Alert>
          <div className="paragraph">
            {'If you would like to add custom CSS class to component, you can merge component classname with your own like in the example below:'}
          </div>
          <CodeBlock code={customComponentMergeClassname}/>
          <div className="paragraph">
            <div><b>{'Built-in components'}</b></div>
            {'You can import and reuse built-in components from the library for additional flexibility (except of Footer, since it has empty implementation by default). ' +
              'For an example, refer to the '}
            <a className="link" href="#chip-container">CustomChipContainer</a>{'.'}
          </div>
          <CodeBlock code={customComponentBuiltin}/>
          <div className="paragraph">
            <div><b>{'Custom props'}</b></div>
            <div className="paragraph">
              {'You can pass your own properties to the component through the props object. When creating a custom component, ' +
                'you can access these properties and use them in your implementation.'}
            </div>
            <Alert type={'important'}>
              <span>
                  {'To improve performance, make sure to memoize '}<i>components</i>{' prop (and other props like objects, arrays, or callbacks). ' +
                'This helps prevent unnecessary re-renders by ensuring prop references remain stable between renders.'}
                </span>
            </Alert>
          </div>
          <CodeBlock code={customProps}/>
          <div className="paragraph">
            {'For an example, refer to the '}<a className="link" href="#chip-label">CustomChipLabel</a>{'.'}
          </div>
          <div className="paragraph">
            <div><b>{'TypeScript support'}</b></div>
            <div className="paragraph">
              {'You can use generic parameters to strongly type each component, ensuring type safety and preventing accidental misuse.'}
            </div>
            <Alert type={'note'}>
              <span>
                  {`- Component type entries can be listed in any order. The order of keys in the generic argument does not matter — TypeScript will correctly match each one by name.
                  - Only known component keys (Field, Footer, NodeContainer, etc.) are allowed.
                  - Each component’s props are strongly typed according to the generics you specify.
                  - Extra or unknown keys (like WrongComponent) or mismatched types will result in a TypeScript error.
                  - Extra or unknown fields inside the component config (like wrongProp) are disallowed.`}
                </span>
            </Alert>
          </div>
          <CodeBlock code={tsSupport}/>
          <div className="paragraph">
            {'For an example, refer to the '}<a className="link" href="#field">CustomField</a>{'.'}
          </div>
        </Section>
        <Section id="field">
          <div className="paragraph">
            <h3 className="title">{'Field'}</h3>
            <div className="paragraph">
              {`Let's say you have filters on a page that, when clicked, open a dropdown with a range of filter options.\n`}
              {'It can be achieved by providing custom Field component like in the example below.\n'}
            </div>
            <Alert type={'important'}>
              {'Your custom Field component must either be focusable itself or contain exactly one focusable child to ensure proper keyboard navigation.'}
            </Alert>
          </div>
          <div className="example-container">
            <CodeBlock code={fieldExample}/>
            <CustomFieldExample/>
          </div>
        </Section>
        <Section id="chip-container">
          <div className="paragraph">
            <h3 className="title">{'ChipContainer'}</h3>
            {`Custom ChipContainer component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={chipContainerExample}/>
            <CustomChipContainerExample/>
          </div>
        </Section>
        <Section id="chip-label">
          <div className="paragraph">
            <h3 className="title">{'ChipLabel'}</h3>
            {`Custom ChipLabel component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={chipLabelExample}/>
            <CustomChipLabelExample/>
          </div>
        </Section>
        <Section id="chip-clear">
          <div className="paragraph">
            <h3 className="title">{'ChipClear'}</h3>
            {`Custom ChipClear component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={chipClearExample}/>
            <CustomChipClearExample/>
          </div>
        </Section>
        <Section id="input">
          <div className="paragraph">
            <h3 className="title">{'Input'}</h3>
            {`Custom Input component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={inputExample}/>
            <CustomInputExample/>
          </div>
        </Section>
        <Section id="field-clear">
          <div className="paragraph">
            <h3 className="title">{'FieldClear'}</h3>
            {`Custom FieldClear component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={fieldClearExample}/>
            <CustomFieldClearExample/>
          </div>
        </Section>
        <Section id="field-toggle">
          <div className="paragraph">
            <h3 className="title">{'FieldToggle'}</h3>
            {`Custom FieldToggle component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={fieldToggleExample}/>
            <CustomFieldToggleExample/>
          </div>
        </Section>
        <Section id="dropdown">
          <div className="paragraph">
            <h3 className="title">{'Dropdown'}</h3>
            {`Custom Dropdown component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={dropdownExample}/>
            <CustomDropdownExample/>
          </div>
        </Section>
        <Section id="select-all-container">
          <div className="paragraph">
            <h3 className="title">{'SelectAllContainer'}</h3>
            {`Custom SelectAllContainer component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={selectAllContainerExample}/>
            <CustomSelectAllContainerExample/>
          </div>
        </Section>
        <Section id="select-all-checkbox">
          <div className="paragraph">
            <h3 className="title">{'SelectAllCheckbox'}</h3>
            {`Custom SelectAllCheckbox component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={selectAllCheckboxExample}/>
            <CustomSelectAllCheckboxExample/>
          </div>
        </Section>
        <Section id="select-all-label">
          <div className="paragraph">
            <h3 className="title">{'SelectAllLabel'}</h3>
            {`Custom SelectAllLabel component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={selectAllLabelExample}/>
            <CustomSelectAllLabelExample/>
          </div>
        </Section>
        <Section id="node-container">
          <div className="paragraph">
            <h3 className="title">{'NodeContainer'}</h3>
            {`Custom NodeContainer component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={nodeContainerExample}/>
            <CustomNodeContainerExample/>
          </div>
        </Section>
        <Section id="node-toggle">
          <div className="paragraph">
            <h3 className="title">{'NodeToggle'}</h3>
            {`Custom NodeToggle component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={nodeToggleExample}/>
            <CustomNodeToggleExample/>
          </div>
        </Section>
        <Section id="node-checkbox">
          <div className="paragraph">
            <h3 className="title">{'NodeCheckbox'}</h3>
            {`Custom NodeCheckbox component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={nodeCheckboxExample}/>
            <CustomNodeCheckboxExample/>
          </div>
        </Section>
        <Section id="node-label">
          <div id="node-label" className="paragraph section-heading">
            <h3 className="title">{'NodeLabel'}</h3>
            {`Custom NodeLabel component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={nodeLabelExample}/>
            <CustomNodeLabelExample/>
          </div>
        </Section>
        <Section id="footer">
          <div className="paragraph">
            <h3 className="title">{'Footer'}</h3>
            <div className="paragraph">
              {`An optional custom component rendered at the bottom of the dropdown, scrolling together with the items. 
            The default implementation is null, so the Footer is not rendered unless explicitly provided.
            You can use the Footer to implement features like pagination.`}
            </div>
            <Alert type={'note'}>
              {'By default, the Footer is not shown during search (when the input has a value) or when there are no items in the dropdown. ' +
                'This behavior can be customized using the footerConfig prop.'}
            </Alert>
          </div>
          <div className="example-container">
            <CodeBlock code={footerExample}/>
            <CustomFooterExample/>
          </div>
        </Section>
        <Section id="no-data">
          <div className="paragraph">
            <h3 className="title">{'NoData'}</h3>
            {`Custom NoData component example.`}
          </div>
          <div className="example-container">
            <CodeBlock code={noDataExample}/>
            <CustomNoDataExample/>
          </div>
        </Section>
      </div>
      <PageNavigation
        items={[
          {link: '#overview', label: 'Overview'},
          {link: '#field', label: 'Field'},
          {link: '#chip-container', label: 'ChipContainer'},
          {link: '#chip-label', label: 'ChipLabel'},
          {link: '#chip-clear', label: 'ChipClear'},
          {link: '#input', label: 'Input'},
          {link: '#field-clear', label: 'FieldClear'},
          {link: '#field-toggle', label: 'FieldToggle'},
          {link: '#dropdown', label: 'Dropdown'},
          {link: '#select-all-container', label: 'SelectAllContainer'},
          {link: '#select-all-checkbox', label: 'SelectAllCheckbox'},
          {link: '#select-all-label', label: 'SelectAllLabel'},
          {link: '#node-container', label: 'NodeContainer'},
          {link: '#node-toggle', label: 'NodeToggle'},
          {link: '#node-checkbox', label: 'NodeCheckbox'},
          {link: '#node-label', label: 'NodeLabel'},
          {link: '#footer', label: 'Footer'},
          {link: '#no-data', label: 'NoData'}
        ]}
      />
    </>
  );
});

export default ComponentsPage;
