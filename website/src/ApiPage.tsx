import React, {FC} from 'react';
import {CodeBlock} from './CodeBlock';
import {rtsTypes} from './code-data';

export const ApiPage: FC = () => {

  return (
    <div className="page">
      <div className="page-content">
        <h2>{'RTS tree select API'}</h2>
        <h3 className="title">{'Tree select types:'}</h3>
        <CodeBlock code={rtsTypes}/>
        <h3 className="title">{'Tree select props:'}</h3>
        <table className="props-table">
          <thead>
          <tr>
            <th>{'Name'}</th>
            <th>{'Type'}</th>
            <th>{'Default'}</th>
            <th>{'Description'}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{'data'}</td>
            <td>{'TreeNode[]'}</td>
            <td>{'[]'}</td>
            <td>{'(required) TreeNode data array'}</td>
          </tr>
          <tr>
            <td>{'type'}</td>
            <td>{'Type'}</td>
            <td>{'Type.MULTI_SELECT_TREE'}</td>
            <td>{'MULTI_SELECT_TREE - component behaves as a normal tree structure\n' +
              'MULTI_SELECT_TREE_FLAT - component behaves as a flat tree structure ' +
              '(selecting a node have no affect on its descendants or ancestors)\n' +
              'MULTI_SELECT - component behaves as a multiselect\n' +
              'SELECT - component behaves as a simple select\n'}
            </td>
          </tr>
          <tr>
            <td>{'id'}</td>
            <td>{'string'}</td>
            <td>{`''`}</td>
            <td>{'id applied to the root tree select div'}</td>
          </tr>
          <tr>
            <td>{'className'}</td>
            <td>{'string'}</td>
            <td>{`''`}</td>
            <td>{'className applied to the root tree select div'}</td>
          </tr>
          <tr>
            <td>{'inputPlaceholder'}</td>
            <td>{'string'}</td>
            <td>{`'search...'`}</td>
            <td>{'custom input placeholder'}</td>
          </tr>
          <tr>
            <td>{'noMatchesText'}</td>
            <td>{'string'}</td>
            <td>{`'No matches'`}</td>
            <td>{'custom text displayed when no items found during the search'}</td>
          </tr>
          <tr>
            <td>{'withClearAll'}</td>
            <td>{'boolean'}</td>
            <td>{'true'}</td>
            <td>{`if 'true', clear all nodes icon displayed in the input field`}</td>
          </tr>
          <tr>
            <td>{'withSelectAll'}</td>
            <td>{'boolean'}</td>
            <td>{'false'}</td>
            <td>{`if 'true', select all nodes component displayed in the dropdown header`}</td>
          </tr>
          <tr>
            <td>{'withDropdownInput'}</td>
            <td>{'boolean'}</td>
            <td>{'false'}</td>
            <td>{`if 'true', input is displayed in dropdown (hidden input rendered in field for focus to work)`}</td>
          </tr>
          <tr>
            <td>{'components'}</td>
            <td>{'Components'}</td>
            <td>{'-'}</td>
            <td>{'custom components applied to the tree select (see examples for more details)'}</td>
          </tr>
          <tr>
            <td>{'onNodeChange'}</td>
            <td>{`(node: TreeNode, selectedNodes: TreeNode[]) => void`}</td>
            <td>{'-'}</td>
            <td>{'function called on node change (select/unselect in dropdown, delete chip in field)'}</td>
          </tr>
          <tr>
            <td>{'onNodeToggle'}</td>
            <td>{`(node: TreeNode, expandedNodes: TreeNode[]) => void`}</td>
            <td>{'-'}</td>
            <td>{'function called on node expanded/collapsed'}</td>
          </tr>
          <tr>
            <td>{'onClearAll'}</td>
            <td>{'(selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void'}</td>
            <td>{'-'}</td>
            <td>{'function called on clearAll icon click/press'}</td>
          </tr>
          <tr>
            <td>{'onSelectAllChange'}</td>
            <td>{'(selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void'}</td>
            <td>{'-'}</td>
            <td>{'function called on selectAll select/unselect'}</td>
          </tr>
          <tr>
            <td>{'onFocus'}</td>
            <td>{'(event: React.FocusEvent) => void'}</td>
            <td>{'-'}</td>
            <td>{'function called when component receives focus'}</td>
          </tr>
          <tr>
            <td>{'onBlur'}</td>
            <td>{'(event: React.FocusEvent) => void'}</td>
            <td>{'-'}</td>
            <td>{'function called when component lose focus'}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
};
