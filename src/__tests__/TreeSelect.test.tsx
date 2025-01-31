import '@testing-library/jest-dom';

import React from 'react';
import {render, screen} from '@testing-library/react';
import {TreeSelect} from '../index';

describe('TreeSelect component', () => {
  it('renders component', () => {
    render(<TreeSelect
      data={[
        {
          label: 'label1',
          name: 'name1',
          children: [
            {
              label: 'child11-label',
              name: 'child11-name'
            },
            {
              label: 'child12-label',
              name: 'child12-name'
            }
          ],
          selected: true
        },
        {
          label: 'label2',
          name: 'name2',
          children: [
            {
              label: 'child21-label',
              name: 'child21-name'
            },
            {
              label: 'child22-label',
              name: 'child22-name'
            }
          ]
        },
        {
          label: 'label3',
          name: 'name3'
        }
      ]}
    />);

    const chip = screen.getByText(/label1/i);
    expect(chip).toBeInTheDocument();
  });
});
