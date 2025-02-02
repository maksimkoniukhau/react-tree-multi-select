import '@testing-library/jest-dom';
import React, {Component, ElementType} from 'react';

// https://github.com/petyosi/react-virtuoso/issues/26
jest.mock('react-virtuoso', () => {
  const {Virtuoso} = jest.requireActual('react-virtuoso');

  const mockVirtuoso = (WrappedVirtuoso: ElementType) => (
    class extends Component<{ totalCount: number }, unknown> {
      render() {
        return <WrappedVirtuoso initialItemCount={this.props?.totalCount} {...this.props} />
      }
    }
  );
  return {Virtuoso: mockVirtuoso(Virtuoso)};
});
