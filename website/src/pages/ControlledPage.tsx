import React, {FC, memo} from 'react';
import {CodeBlock} from '../components/CodeBlock';
import {controlledExample} from '../code-data';
import {ControlledExample} from '../examples/ControlledExample';

export const ControlledPage: FC = memo(() => {

  return (
    <div className="page" style={{paddingBottom: '150px'}}>
      <div className="page-content">
        <h2>{'Controlled'}</h2>
        <div className="paragraph">
          <div className="paragraph">
            <b>{'react-tree-multi-select'}</b>{` allows you to externally control the dropdown’s open and close state using the openDropdown prop.
            This gives you full control over when the dropdown is rendered or hidden.
            By pairing 'openDropdown' with the 'onDropdownToggle' callback, you can synchronize the dropdown’s visibility state with your application’s state, enabling custom behaviors such as toggling from external controls or reacting to other UI events.
            Here’s how to implement controlled dropdown behavior:`}
          </div>
        </div>
        <CodeBlock code={controlledExample}/>
        <ControlledExample/>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
});
