import React, { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ArtItem } from './App';

test('has title', () => {
  render(<App />);
  const title = screen.getByText('Art Rater');
  expect(title).toBeInTheDocument();
});

test('for an art item, submit button is disabled until a rating is selected', () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <ArtItem id={27992} setArtItems={() => {}} />
    </QueryClientProvider>,
  );
  const submitBtn = screen.getByText('Submit');
  expect(submitBtn).toBeDisabled();
});

test('for an art item, clicking numbered button updates rating display below image to be that number', async () => {
  const queryClient = new QueryClient();
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={queryClient}>
      <ArtItem id={27992} setArtItems={() => {}} />
    </QueryClientProvider>,
  );
  const ratingBtn = screen.getByText(1);
  await user.click(ratingBtn);
  const ratingEle = screen.getByText('Rating: 1');
  expect(ratingEle).toBeTruthy();
});

test('for an art item, clicking numbered button updates rating display below image to be that number, clicking two different numbers one after the other', async () => {
  const queryClient = new QueryClient();
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={queryClient}>
      <ArtItem id={27992} setArtItems={() => {}} />
    </QueryClientProvider>,
  );
  const rating1Btn = screen.getByText(1);
  await user.click(rating1Btn);

  const rating5Btn = screen.getByText(5);
  await user.click(rating5Btn);

  const ratingEle = screen.getByText('Rating: 5');
  expect(ratingEle).toBeTruthy();
});

test('for an art item, clicking submit POSTs update, displays a toast success message, hides buttons', async () => {
  // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
  // For the purpose of this test, please use a mock function instead.
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ message: 'success' }),
  })) as jest.Mock;

  const queryClient = new QueryClient();
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <ArtItem id={27992} setArtItems={() => {}} />
    </QueryClientProvider>,
  );

  const rating1Btn = screen.getByText(1);
  const submitBtn = screen.getByText('Submit');

  await user.click(rating1Btn);
  await user.click(submitBtn);

  expect(alertMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('Submit')).toBeFalsy();
});

// TODO:
// test('"Add Art" button succesffully appends an ArtItem', () => {

// });

// test('"Remove Art" button succesffully removes an ArtItem', () => {

// });

// test('"Add Art" input validates correctly', () => {

// });

// test('rating correctly updates for individual art items', () => {

// });
