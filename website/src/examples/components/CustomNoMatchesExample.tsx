import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSadTear} from '@fortawesome/free-regular-svg-icons';
import {Components, NoMatchesProps, NoMatchesType, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomNoMatches: FC<NoMatchesProps> = (props) => (
  <div {...props.componentAttributes}>
    <div><FontAwesomeIcon icon={faFaceSadTear}/>{' '}{props.componentProps.label}</div>
  </div>
);

const NoMatches: NoMatchesType = {component: CustomNoMatches};
const components: Components = {NoMatches};

export const CustomNoMatchesExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
