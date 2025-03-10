import React, {FC} from 'react';
import {rtmsTypes} from '../code-data';
import {CodeBlock} from '../components/CodeBlock';
import {PageNavigation} from '../components/PageNavigation';
import {Section} from '../components/Section';

export const ApiPage: FC = () => {

  return (
    <div className="page">
      <div className="page-content">
        <Section id="types">
          <h2>{'React Tree Multi Select API'}</h2>
          <h3 className="title">{'TreeMultiSelect types:'}</h3>
          <CodeBlock code={rtmsTypes}/>
        </Section>
        <Section id="props">
          <h3 className="title">{'TreeMultiSelect props:'}</h3>
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
              <td>{'TREE_SELECT'}</td>
              <td>{'TREE_SELECT - component behaves as a normal tree structure\n' +
                'TREE_SELECT_FLAT - component behaves as a flat tree structure ' +
                '(selecting a node have no affect on its descendants or ancestors)\n' +
                'MULTI_SELECT - component behaves as a multiselect\n' +
                'SELECT - component behaves as a simple select\n'}
              </td>
            </tr>
            <tr>
              <td>{'id'}</td>
              <td>{'string'}</td>
              <td>{`''`}</td>
              <td>{'id applied to the root tree multi select div'}</td>
            </tr>
            <tr>
              <td>{'className'}</td>
              <td>{'string'}</td>
              <td>{`''`}</td>
              <td>{'className applied to the root tree multi select div'}</td>
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
              <td>{'isSearchable'}</td>
              <td>{'boolean'}</td>
              <td>{'true'}</td>
              <td>{`if 'true', search input in field (or in dropdown if withDropdownInput=true) is rendered`}</td>
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
              <td>{'closeDropdownOnNodeChange'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`if 'true', close dropdown after node change (select/unselect in dropdown)`}</td>
            </tr>
            <tr>
              <td>{'dropdownHeight'}</td>
              <td>{'number'}</td>
              <td>{'300'}</td>
              <td>{`dropdown height in pixels (it can be reduced if the content height is less than the value in the property)`}</td>
            </tr>
            <tr>
              <td>{'components'}</td>
              <td>{'Components'}</td>
              <td>{'-'}</td>
              <td>{'custom components applied to the tree multi select (see examples for more details)'}</td>
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
        </Section>
      </div>
      <PageNavigation
        items={[
          {link: '#types', label: 'Types'},
          {link: '#props', label: 'Props'}
        ]}
      />
    </div>
  );
};
