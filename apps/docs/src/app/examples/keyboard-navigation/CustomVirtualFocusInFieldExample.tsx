import React, {FC} from 'react';
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
    <div data-rtms-virtual-focus-id="field:custom-id-2" className="field-virtual-focusable">
      {`I'm focusable`}
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
};
