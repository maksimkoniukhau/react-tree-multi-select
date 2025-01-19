import React, {FC, memo, ReactNode} from 'react';
import {SELECT_ALL} from './constants';
import {CheckedState, InnerComponents, Type} from './models';
import {SelectAll} from './SelectAll';
import {NoMatches} from './NoMatches';
import {Node} from './Node';

export interface ListItemProps {
  type: Type;
  index: number;
  nodesAmount: number;
  displayedNodes: Node[];
  isAnyHasChildren: boolean;
  searchValue: string;
  showSelectAll: boolean;
  selectAllCheckedState: CheckedState;
  focusedElement: string;
  noMatchesText: string;
  onChangeSelectAll: (e: React.MouseEvent) => void;
  onToggleNode: (node: Node) => (e: React.MouseEvent) => void;
  onClickExpandNode: (node: Node) => (e: React.MouseEvent) => void;
  input: ReactNode;
  components: InnerComponents;
}

export const ListItem: FC<ListItemProps> = memo((props) => {

  const {
    type,
    index,
    nodesAmount = 0,
    displayedNodes = [],
    isAnyHasChildren = false,
    searchValue = '',
    showSelectAll = false,
    selectAllCheckedState = CheckedState.UNSELECTED,
    focusedElement = '',
    noMatchesText,
    onChangeSelectAll,
    onToggleNode,
    onClickExpandNode,
    input,
    components
  } = props;

  if (Boolean(input) && index === 0) {
    return (
      <div className="rts-header-item">
        <div className="rts-input-container">
          {input}
        </div>
      </div>
    );
  }

  if ((showSelectAll && Boolean(input) && index === 1) || (showSelectAll && index === 0)) {
    return (
      <SelectAll
        label={SELECT_ALL}
        checkedState={selectAllCheckedState}
        focused={focusedElement === SELECT_ALL}
        onChange={onChangeSelectAll}
      />
    );
  }

  if (displayedNodes.length === 0) {
    return (
      <NoMatches label={noMatchesText}/>
    );
  }

  let nodeIndex = index;
  if ((showSelectAll || Boolean(input)) && nodesAmount > 0) {
    nodeIndex = showSelectAll && Boolean(input) ? index - 2 : index - 1;
  }
  const node = displayedNodes[nodeIndex];
  const focused = focusedElement === node.path;
  const expanded = searchValue ? node.searchExpanded : node.expanded;
  const indentation = !(type === Type.MULTI_SELECT || type === Type.SELECT)
    && isAnyHasChildren
    && !node.hasChildren();

  const nodeToggleClasses = `rts-node-toggle${expanded ? ' expanded' : ''}`;
  const getCheckboxClasses = () => {
    const disabledClass = node.disabled ? ' disabled' : '';
    const checkedClass = node.selected ? ' selected' : node.partiallySelected ? ' partial' : '';
    return `rts-node-checkbox${disabledClass}${checkedClass}`;
  };
  const getNodeRowClasses = (): string => {
    const disabledClass = node.disabled ? ' disabled' : '';
    const selectedClass = node.selected ? ' selected' : node.partiallySelected ? ' partial' : '';
    const expandedClass = node.expanded ? ' expanded' : '';
    const focusedClass = focused ? ' focused' : '';
    const matchedClass = node.matched ? ' matched' : '';
    const plClass = ` pl-${node.deep + (indentation ? 1 : 0)}`;
    return `rts-list-item${disabledClass}${selectedClass}${expandedClass}${focusedClass}${matchedClass}${plClass}`;
  };

  return (
    <div className={getNodeRowClasses()} onClick={onToggleNode(node)}>
      {type !== Type.MULTI_SELECT && type !== Type.SELECT && node.hasChildren() && (
        <components.NodeToggle.component
          componentAttributes={{className: nodeToggleClasses, onClick: onClickExpandNode(node)}}
          componentProps={{expanded}}
          customProps={components.NodeToggle.props}
        />
      )}
      {type !== Type.MULTI_SELECT && type !== Type.SELECT && (
        <components.NodeCheckbox.component
          componentAttributes={{className: getCheckboxClasses()}}
          componentProps={{checked: node.selected, partial: node.partiallySelected, disabled: node.disabled}}
          customProps={components.NodeCheckbox.props}
        />
      )}
      <components.NodeLabel.component
        componentAttributes={{className: "rts-label"}}
        componentProps={{label: node.name}}
        customProps={components.NodeLabel.props}
      />
    </div>
  );
});
