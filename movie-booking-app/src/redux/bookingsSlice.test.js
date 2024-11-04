import bookingsReducer, { addBooking, cancelBooking } from './bookingsSlice';

describe('bookingsSlice', () => {
    const initialState = {
        bookings: [],
    };

    test('should return the initial state', () => {
        expect(bookingsReducer(undefined, {})).toEqual(initialState);
    });

    test('should add a booking when it does not exist', () => {
        const newBooking = {
            id: '1',
            movieId: 'm1',
            date: '2024-11-01',
            showtime: '18:00',
            seats: ['A1', 'A2'],
        };

        const expectedState = {
            bookings: [newBooking],
        };

        expect(bookingsReducer(initialState, addBooking(newBooking))).toEqual(expectedState);
    });

    test('should not add a booking if some seats are already booked', () => {
        const existingBooking = {
            id: '1',
            movieId: 'm1',
            date: '2024-11-01',
            showtime: '18:00',
            seats: ['A1', 'A2'],
        };

        const conflictingBooking = {
            id: '2',
            movieId: 'm1',
            date: '2024-11-01',
            showtime: '18:00',
            seats: ['A2', 'A3'],
        };

        const initialStateWithExistingBooking = {
            bookings: [existingBooking],
        };

        console.error = jest.fn();

        const updatedState = bookingsReducer(initialStateWithExistingBooking, addBooking(conflictingBooking));

        expect(updatedState).toEqual(initialStateWithExistingBooking);
        expect(console.error).toHaveBeenCalledWith('Booking failed: Some seats are already booked.');
    });

    test('should cancel a booking', () => {
        const bookingToCancel = {
            id: '1',
            movieId: 'm1',
            date: '2024-11-01',
            showtime: '18:00',
            seats: ['A1', 'A2'],
        };

        const initialStateWithBooking = {
            bookings: [bookingToCancel],
        };

        const expectedState = {
            bookings: [],
        };

        expect(bookingsReducer(initialStateWithBooking, cancelBooking(bookingToCancel.id))).toEqual(expectedState);
    });

    test('should not change state if canceling a non-existing booking', () => {
        const initialStateWithBooking = {
            bookings: [
                {
                    id: '1',
                    movieId: 'm1',
                    date: '2024-11-01',
                    showtime: '18:00',
                    seats: ['A1', 'A2'],
                },
            ],
        };

        const updatedState = bookingsReducer(initialStateWithBooking, cancelBooking('2'));

        expect(updatedState).toEqual(initialStateWithBooking);
    });
});
