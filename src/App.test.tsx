import React, { render, screen, fireEvent } from '@testing-library/react';
import { App, ArtItem } from './App';

test('has title', () => {
  render(<App />);
  const title = screen.getByText('Art Rater');
  expect(title).toBeInTheDocument();
});

test('for an art item, submit button is disabled until a rating is selected', () => {
});

test('for an art item, clicking numbered button updates rating display below image to be that number', () => {
});

test('for an art item, clicking numbered button updates rating display below image to be that number, clicking two different numbers one after the other', () => {
});

test('for an art item, clicking submit POSTs update, displays a toast success message, hides buttons', () => {
  // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
  // For the purpose of this test, please use a mock function instead.
});
