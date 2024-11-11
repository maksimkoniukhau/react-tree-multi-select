import React from 'react';
import './App.css';
import {TreeNode, TreeSelect} from '../../src';
import {optionTreeNodeData} from './utils';

function App() {

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    console.log('NODE TOGGLE = ', node);
    console.log('EXPANDED NODES = ', expandedNodes);
  };

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    console.log('NODE CHANGE = ', node);
    console.log('SELECTED NODES = ', selectedNodes);
  };

  return (
    <div className="app">
      <h2 className="header">RTS tree select</h2>
      <div className="content">
        <div className="tree-select-wrapper">
          <div className="label">Select</div>
          <TreeSelect
            data={[
              {
                label: 'label1',
                name: 'name1'
              },
              {
                label: 'label2',
                name: 'name2'
              },
              {
                label: 'label3',
                name: 'name3'
              }
            ]}
            id="my-rts-select"
            withSelectAll
            onNodeChange={handleNodeChange}
            onNodeToggle={handleNodeToggle}
          />
        </div>
        <div className="tree-select-wrapper">
          <div className="label">Tree Select</div>
          <TreeSelect
            data={optionTreeNodeData}
            id="my-tree-select"
            className="mts-custom-class one-more-mts-custom-class"
            onNodeChange={handleNodeChange}
            onNodeToggle={handleNodeToggle}
          />
        </div>
        {/*       <div className="tree-select-wrapper">
          <div className="label">Tree Select Big Data</div>
          <TreeSelect
            data={bigTreeNodeData}
            id="rts-big-data"
            className="bd-custom-class one-more-bd-custom-class"
            withSelectAll
            onNodeChange={handleNodeChange}
            onNodeToggle={handleNodeToggle}
          />
        </div>*/}
      </div>
    </div>
  );
}

export default App;
