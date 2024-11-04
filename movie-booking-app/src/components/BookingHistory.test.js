import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BookingHistory from './BookingHistory';
import { cancelBooking } from '../redux/bookingsSlice';

const mockStore = configureStore([]);

describe('BookingHistory Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      bookings: {
        bookings: [
          {
            id: 1,
            movieTitle: 'Movie 1',
            date: '2024-12-01',
            showtime: '18:00',
            numTickets: 2,
            seats: ['A1', 'A2'],
          },
          {
            id: 2,
            movieTitle: 'Movie 2',
            date: '2024-12-02',
            showtime: '20:00',
            numTickets: 1,
            seats: ['B1'],
          },
        ],
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders booking history correctly', () => {
    render(
      <Provider store={store}>
        <BookingHistory />
      </Provider>
    );

    expect(screen.getByText(/Booking History/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();
  });

  test('calls cancelBooking when cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <BookingHistory />
      </Provider>
    );

    const cancelButtons = screen.getAllByText(/Cancel Booking/i);
    fireEvent.click(cancelButtons[0]);

    expect(store.dispatch).toHaveBeenCalledWith(cancelBooking(1));
  });

  test('shows no bookings message when there are no bookings', () => {
    store = mockStore({
      bookings: {
        bookings: [],
      },
    });

    render(
      <Provider store={store}>
        <BookingHistory />
      </Provider>
    );

    expect(screen.getByText(/No bookings available/i)).toBeInTheDocument();
  });
});
