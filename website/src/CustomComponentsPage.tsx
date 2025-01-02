import React, {FC, memo} from 'react';
import {TreeSelect, Type} from '../../src';
import {filterExample} from './code-data';
import {CodeBlock} from './CodeBlock';

interface ButtonProps {
  label: string;
}

const Button = (props: ButtonProps) => (
  <button className="filter-btn">{props.label}</button>
);

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
        {'It can be achieved by providing filter button as a custom Field component like in the example below.\n'}
        <span className="important">{'Important'}</span>{': your custom Field component should be focusable for keyboard navigation to work in dropdown.'}
      </div>
      <div className="example-container">
        <CodeBlock code={filterExample}/>
        <div className="filter-example">
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
            customComponents={{
              Field: {component: Button, props: {label: 'Filter by company'}}
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
            customComponents={{
              Field: {component: Button, props: {label: 'Filter by brand'}}
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
            customComponents={{
              Field: {component: Button, props: {label: 'Filter by price'}}
            }}
          />
        </div>
      </div>
    </div>
  );
});
