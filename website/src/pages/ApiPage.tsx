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
              <td>{'(required) The data to be rendered in the component.'}</td>
            </tr>
            <tr>
              <td>{'type'}</td>
              <td>{'Type'}</td>
              <td>{'TREE_SELECT'}</td>
              <td>{`Specifies the type of the component, determining its behavior and rendering.
              - TREE_SELECT: Component behaves as a normal tree structure.
              - TREE_SELECT_FLAT: Component behaves as a flat tree structure (selecting a node has no effect on its descendants or ancestors).
              - MULTI_SELECT: Component behaves as a multi-select.
              - SELECT: Component behaves as a simple select.`}
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
              <td>{`If 'true', FieldClear component is rendered.`}</td>
            </tr>
            <tr>
              <td>{'withSelectAll'}</td>
              <td>{'boolean'}</td>
              <td>{'false'}</td>
              <td>{`If 'true', a sticky 'Select all' component is rendered in the dropdown. 
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
              <td>{`Closes the dropdown automatically after a node is changed (selected/unselected in dropdown).
              Useful when 'type' is 'Type.SELECT'.`}</td>
            </tr>
            <tr>
              <td>{'openDropdown'}</td>
              <td>{'boolean'}</td>
              <td>{'-'}</td>
              <td>{`Controls whether the dropdown is rendered (open) or hidden (closed).
              This enables external control over the dropdown's rendering state.
              When set to 'true', the dropdown is rendered (opened).
              When set to 'false', the dropdown is hidden (closed).
              If omitted, the component manages the dropdown state internally.
              For full control, use this prop in conjunction with the 'onDropdownToggle' callback.`}</td>
            </tr>
            <tr>
              <td>{'dropdownHeight'}</td>
              <td>{'number'}</td>
              <td>{'300'}</td>
              <td>{`Dropdown height in pixels. 
              If the content height is smaller than this value, the dropdown height is automatically reduced to fit the content.`}</td>
            </tr>
            <tr>
              <td>{'overscan'}</td>
              <td>{'number'}</td>
              <td>{'1'}</td>
              <td>{`The number of items to render outside the visible viewport (above and below) to improve scroll performance and reduce flickering during fast scrolling.`}</td>
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
              <td>{'onDropdownToggle'}</td>
              <td>{`(open: boolean) => void`}</td>
              <td>{'-'}</td>
              <td>{`Callback triggered when the dropdown is opened or closed by user interaction.
              This is used to synchronize external state with the dropdown’s rendering state.
              Note: This callback is only invoked when the 'openDropdown' prop is provided. If 'openDropdown' is undefined, the component manages its own state and 'onDropdownToggle' will not be called.`}</td>
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
