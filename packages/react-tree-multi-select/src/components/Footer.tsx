import React, {FC, memo} from 'react';
import {DROPDOWN_PREFIX, FOOTER_SUFFIX, FooterProps, FooterType} from '../types';
import {buildVirtualFocusId} from '../utils/focusUtils';

export const Footer: FC<FooterProps> = () => null;

interface FooterWrapperProps {
  footer: FooterType;
  focused: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const FooterWrapper: FC<FooterWrapperProps> = memo(({footer, focused, onClick}) => {
  return (
    <footer.component
      attributes={{
        'data-rtms-virtual-focus-id': buildVirtualFocusId(DROPDOWN_PREFIX, FOOTER_SUFFIX),
        className: `rtms-footer${focused ? ' focused' : ''}`,
        onClick
      }}
      ownProps={{focused}}
      customProps={footer.props}
    />
  );
});
