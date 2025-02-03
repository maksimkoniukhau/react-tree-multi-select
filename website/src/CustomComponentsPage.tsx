import React, {FC, memo} from 'react';
import {
  chipClearExample,
  chipContainerExample,
  chipLabelExample,
  customComponentCommonPattern,
  customComponentMergeClassname,
  fieldClearExample,
  fieldExample,
  fieldToggleExample,
  inputExample,
  nodeCheckboxExample,
  nodeContainerExample,
  nodeLabelExample,
  nodeToggleExample,
  noMatchesExample,
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
import {CustomNoMatchesExample} from './examples/components/CustomNoMatchesExample';

export const CustomComponentsPage: FC = memo(() => {

  return (
    <div className="page">
      <div className="page-content">
        <h2>{'React Tree Multi Select custom components'}</h2>
        <div className="paragraph">
          <b>{'react-tree-multi-select'}</b>{' allows you to customize component by providing your own custom components as a property.\n'}
          {'The common pattern of custom component implementing looks like this:'}
        </div>
        <CodeBlock code={customComponentCommonPattern}/>
        <div className="paragraph">
          <span className="important">{'Important'}</span>
          {': you must pass componentAttributes to the root element in order for component to work properly.\n'}
          {'The only classname can be overridden. Or you can merge component classname with your own like in the example below:'}
        </div>
        <CodeBlock code={customComponentMergeClassname}/>
        <div className="paragraph">
          {'Below you can find some examples of usage custom components.'}
        </div>
        <div className="paragraph">
          <h3 className="title">{'Field'}</h3>
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
          <h3 className="title">{'ChipContainer'}</h3>
          {`Custom ChipContainer component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={chipContainerExample}/>
          <CustomChipContainerExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'ChipLabel'}</h3>
          {`Custom ChipLabel component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={chipLabelExample}/>
          <CustomChipLabelExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'ChipClear'}</h3>
          {`Custom ChipClear component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={chipClearExample}/>
          <CustomChipClearExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'Input'}</h3>
          {`Custom Input component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={inputExample}/>
          <CustomInputExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'FieldClear'}</h3>
          {`Custom FieldClear component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={fieldClearExample}/>
          <CustomFieldClearExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'FieldToggle'}</h3>
          {`Custom FieldToggle component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={fieldToggleExample}/>
          <CustomFieldToggleExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'SelectAllContainer'}</h3>
          {`Custom SelectAllContainer component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={selectAllContainerExample}/>
          <CustomSelectAllContainerExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'SelectAllCheckbox'}</h3>
          {`Custom SelectAllCheckbox component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={selectAllCheckboxExample}/>
          <CustomSelectAllCheckboxExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'SelectAllLabel'}</h3>
          {`Custom SelectAllLabel component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={selectAllLabelExample}/>
          <CustomSelectAllLabelExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'NodeContainer'}</h3>
          {`Custom NodeContainer component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={nodeContainerExample}/>
          <CustomNodeContainerExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'NodeToggle'}</h3>
          {`Custom NodeToggle component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={nodeToggleExample}/>
          <CustomNodeToggleExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'NodeCheckbox'}</h3>
          {`Custom NodeCheckbox component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={nodeCheckboxExample}/>
          <CustomNodeCheckboxExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'NodeLabel'}</h3>
          {`Custom NodeLabel component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={nodeLabelExample}/>
          <CustomNodeLabelExample/>
        </div>
        <div className="paragraph">
          <h3 className="title">{'NoMatches'}</h3>
          {`Custom NoMatches component example.`}
        </div>
        <div className="example-container">
          <CodeBlock code={noMatchesExample}/>
          <CustomNoMatchesExample/>
        </div>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
});
