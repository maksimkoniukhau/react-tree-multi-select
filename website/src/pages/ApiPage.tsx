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
          <h2>{'API'}</h2>
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
              <td>{'(required) TreeNode data array.'}</td>
            </tr>
            <tr>
              <td>{'type'}</td>
              <td>{'Type'}</td>
              <td>{'TREE_SELECT'}</td>
              <td>{`TREE_SELECT - component behaves as a normal tree structure. 
              TREE_SELECT_FLAT - component behaves as a flat tree structure (selecting a node have no affect on its descendants or ancestors). 
              MULTI_SELECT - component behaves as a multiselect. 
              SELECT - component behaves as a simple select.`}
              </td>
            </tr>
            <tr>
              <td>{'id'}</td>
              <td>{'string'}</td>
              <td>{`''`}</td>
              <td>{'id is applied to the root tree multi select div.'}</td>
            </tr>
            <tr>
              <td>{'className'}</td>
              <td>{'string'}</td>
              <td>{`''`}</td>
              <td>{'className is applied to the root tree multi select div.'}</td>
            </tr>
            <tr>
              <td>{'inputPlaceholder'}</td>
              <td>{'string'}</td>
              <td>{`'search...'`}</td>
              <td>{'Custom input placeholder.'}</td>
            </tr>
            <tr>
              <td>{'noDataText'}</td>
              <td>{'string'}</td>
              <td>{`'No data'`}</td>
              <td>{'Custom text displayed when there is no available data.'}</td>
            </tr>
            <tr>
              <td>{'noMatchesText'}</td>
              <td>{'string'}</td>
              <td>{`'No matches'`}</td>
              <td>{'Custom text displayed when no items are found during a search.'}</td>
            </tr>
            <tr>
              <td>{'isDisabled'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`If 'true', the component is disabled.`}</td>
            </tr>
            <tr>
              <td>{'isSearchable'}</td>
              <td>{'boolean'}</td>
              <td>{'true'}</td>
              <td>{`If 'true', search input in field (or in dropdown if withDropdownInput=true) is rendered.`}</td>
            </tr>
            <tr>
              <td>{'withChipClear'}</td>
              <td>{'boolean'}</td>
              <td>{'true'}</td>
              <td>{`If 'true', ChipClear component is rendered.`}</td>
            </tr>
            <tr>
              <td>{'withClearAll'}</td>
              <td>{'boolean'}</td>
              <td>{'true'}</td>
              <td>{`If 'true', clear all nodes icon is displayed in the input field.`}</td>
            </tr>
            <tr>
              <td>{'withSelectAll'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`If 'true', a 'Select all' component is rendered in the dropdown header. 
              It is not rendered when the component type is 'SELECT', when the input has a value (search mode), when there is no available data.`}</td>
            </tr>
            <tr>
              <td>{'withDropdownInput'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`If 'true', input is displayed in dropdown (hidden input is rendered in Field for focus to work).`}</td>
            </tr>
            <tr>
              <td>{'closeDropdownOnNodeChange'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`If 'true', close dropdown after node change (select/unselect in dropdown).`}</td>
            </tr>
            <tr>
              <td>{'dropdownHeight'}</td>
              <td>{'number'}</td>
              <td>{'300'}</td>
              <td>{`Dropdown height in pixels (it is automatically reduced if the content height is less than the value in the property).`}</td>
            </tr>
            <tr>
              <td>{'footerConfig'}</td>
              <td>{'FooterConfig'}</td>
              <td>{`{showWhenSearching: false, showWhenNoItems: false}`}</td>
              <td>{`Controls when the Footer component is rendered. 
              showWhenNoItems takes precedence over showWhenSearching. 
              For example, if showWhenSearching is true and showWhenNoItems is false, and there are no matching items during the search, the Footer will not be rendered.`}
              </td>
            </tr>
            <tr>
              <td>{'keyboardConfig'}</td>
              <td>{'KeyboardConfig'}</td>
              <td>{`{
                field: {loopLeft: false, loopRight: false}, 
                dropdown: {loopUp: true, loopDown: true}
                }`}
              </td>
              <td>{`Controls keyboard navigation behavior for the component.`}</td>
            </tr>
            <tr>
              <td>{'components'}</td>
              <td>{'Components'}</td>
              <td>{'{}'}</td>
              <td>{'Custom components are applied to the tree multi select (see examples for more details).'}</td>
            </tr>
            <tr>
              <td>{'onNodeChange'}</td>
              <td>{`(node: TreeNode, selectedNodes: TreeNode[]) => void`}</td>
              <td>{'-'}</td>
              <td>{'Function called on node change (select/unselect in dropdown, delete chip in field).'}</td>
            </tr>
            <tr>
              <td>{'onNodeToggle'}</td>
              <td>{`(node: TreeNode, expandedNodes: TreeNode[]) => void`}</td>
              <td>{'-'}</td>
              <td>{'Function called on node expanded/collapsed.'}</td>
            </tr>
            <tr>
              <td>{'onClearAll'}</td>
              <td>{'(selectedNodes: TreeNode[], selectAllCheckedState?: CheckedState) => void'}</td>
              <td>{'-'}</td>
              <td>{'Function called on clearAll icon click/press.'}</td>
            </tr>
            <tr>
              <td>{'onSelectAllChange'}</td>
              <td>{'(selectedNodes: TreeNode[], selectAllCheckedState: CheckedState) => void'}</td>
              <td>{'-'}</td>
              <td>{'Function called on selectAll component select/unselect.'}</td>
            </tr>
            <tr>
              <td>{'onFocus'}</td>
              <td>{'(event: React.FocusEvent) => void'}</td>
              <td>{'-'}</td>
              <td>{'Function called when component receives focus.'}</td>
            </tr>
            <tr>
              <td>{'onBlur'}</td>
              <td>{'(event: React.FocusEvent) => void'}</td>
              <td>{'-'}</td>
              <td>{'Function called when component loses focus.'}</td>
            </tr>
            <tr>
              <td>{'onDropdownLastItemReached'}</td>
              <td>{'(inputValue: string, displayedNodes: TreeNode[]) => void'}</td>
              <td>{'-'}</td>
              <td>{`Callback triggered when the last item in the dropdown is rendered.
              This is useful for implementing infinite scrolling or lazy loading.
              Note: The callback is invoked when the last item (including overscan) is rendered, not based on actual scroll position.`}</td>
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
