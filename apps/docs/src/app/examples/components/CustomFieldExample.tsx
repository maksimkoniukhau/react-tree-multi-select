import React, {FC, useMemo} from 'react';
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
        defaultSelectedIds={['2.2']}
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
        defaultSelectedIds={['3', '5']}
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
};
