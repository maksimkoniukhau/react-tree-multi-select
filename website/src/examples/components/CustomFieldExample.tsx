import React, {FC} from 'react';
import {FieldProps, TreeSelect, Type} from '../../../../src';

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
};
