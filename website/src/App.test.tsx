import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders RTS tree Select', () => {
  render(<App />);
  const element = screen.getByText(/RTS tree Select/i);
  expect(element).toBeInTheDocument();
});
