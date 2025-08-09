import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App', () => {
  render(<App />);
  const element = screen.getAllByText(/REACT TREE MULTI SELECT/i)[0];
  expect(element).toBeInTheDocument();
});
