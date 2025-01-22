import React, {FC, memo} from 'react';
import {
  chipClearExample,
  chipContainerExample,
  chipLabelExample,
  fieldClearExample,
  fieldExample,
  fieldToggleExample,
  inputExample,
  nodeCheckboxExample,
  nodeContainerExample,
  nodeLabelExample,
  nodeToggleExample,
  selectAllCheckboxExample,
  selectAllContainerExample,
  selectAllLabelExample
} from './code-data';
import {CodeBlock} from './CodeBlock';
import {CustomFieldExample} from './examples/components/CustomFieldExample';
import {CustomChipContainerExample} from './examples/components/CustomChipContainerExample';
import {CustomChipLabelExample} from './examples/components/CustomChipLabelExample';
import {CustomChipClearExample} from './examples/components/CustomChipClearExample';
import {CustomInputExample} from './examples/components/CustomInputExample';
import {CustomFieldClearExample} from './examples/components/CustomFieldClearExample';
import {CustomFieldToggleExample} from './examples/components/CustomFieldToggleExample';
import {CustomSelectAllContainerExample} from './examples/components/CustomSelectAllContainerExample';
import {CustomSelectAllCheckboxExample} from './examples/components/CustomSelectAllCheckboxExample';
import {CustomSelectAllLabelExample} from './examples/components/CustomSelectAllLabelExample';
import {CustomNodeContainerExample} from './examples/components/CustomNodeContainerExample';
import {CustomNodeToggleExample} from './examples/components/CustomNodeToggleExample';
import {CustomNodeCheckboxExample} from './examples/components/CustomNodeCheckboxExample';
import {CustomNodeLabelExample} from './examples/components/CustomNodeLabelExample';

export const CustomComponentsPage: FC = memo(() => {

  return (
    <div className="page">
      <h3>{'RTS tree select custom components'}</h3>
      <div className="paragraph">
        {'RTS allows you to customize tree select by providing your own custom components as a property.\n'}
        {'Below you can find some examples of usage custom components.\n'}
      </div>
      <div className="paragraph">
        <b>{'Field\n'}</b>
        {`Let's say you have filters on a page that, when clicked, open a dropdown with a range of filter options.\n`}
        {'It can be achieved by providing custom Field component like in the example below.\n'}
        <span className="important">{'Important'}</span>
        {': your custom Field component should have one focusable child (or to be focusable itself) for keyboard navigation to work in dropdown.'}
      </div>
      <div className="example-container">
        <CodeBlock code={fieldExample}/>
        <CustomFieldExample/>
      </div>
      <div className="paragraph">
        <b>{'ChipContainer\n'}</b>
        {`Custom ChipContainer component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={chipContainerExample}/>
        <CustomChipContainerExample/>
      </div>
      <div className="paragraph">
        <b>{'ChipLabel\n'}</b>
        {`Custom ChipLabel component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={chipLabelExample}/>
        <CustomChipLabelExample/>
      </div>
      <div className="paragraph">
        <b>{'ChipClear\n'}</b>
        {`Custom ChipClear component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={chipClearExample}/>
        <CustomChipClearExample/>
      </div>
      <div className="paragraph">
        <b>{'Input\n'}</b>
        {`Custom Input component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={inputExample}/>
        <CustomInputExample/>
      </div>
      <div className="paragraph">
        <b>{'FieldClear\n'}</b>
        {`Custom FieldClear component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={fieldClearExample}/>
        <CustomFieldClearExample/>
      </div>
      <div className="paragraph">
        <b>{'FieldToggle\n'}</b>
        {`Custom FieldToggle component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={fieldToggleExample}/>
        <CustomFieldToggleExample/>
      </div>
      <div className="paragraph">
        <b>{'SelectAllContainer\n'}</b>
        {`Custom SelectAllContainer component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={selectAllContainerExample}/>
        <CustomSelectAllContainerExample/>
      </div>
      <div className="paragraph">
        <b>{'SelectAllCheckbox\n'}</b>
        {`Custom SelectAllCheckbox component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={selectAllCheckboxExample}/>
        <CustomSelectAllCheckboxExample/>
      </div>
      <div className="paragraph">
        <b>{'SelectAllLabel\n'}</b>
        {`Custom SelectAllLabel component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={selectAllLabelExample}/>
        <CustomSelectAllLabelExample/>
      </div>
      <div className="paragraph">
        <b>{'NodeContainer\n'}</b>
        {`Custom NodeContainer component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={nodeContainerExample}/>
        <CustomNodeContainerExample/>
      </div>
      <div className="paragraph">
        <b>{'NodeToggle\n'}</b>
        {`Custom NodeToggle component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={nodeToggleExample}/>
        <CustomNodeToggleExample/>
      </div>
      <div className="paragraph">
        <b>{'NodeCheckbox\n'}</b>
        {`Custom NodeCheckbox component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={nodeCheckboxExample}/>
        <CustomNodeCheckboxExample/>
      </div>
      <div className="paragraph">
        <b>{'NodeLabel\n'}</b>
        {`Custom NodeLabel component example.\n`}
      </div>
      <div className="example-container">
        <CodeBlock code={nodeLabelExample}/>
        <CustomNodeLabelExample/>
      </div>
    </div>
  );
});
