import { createSlice } from '@reduxjs/toolkit';

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
  },
  reducers: {
    addBooking(state, action) {
      const { movieId, date, showtime, seats } = action.payload;
      const existingBooking = state.bookings.find(
        booking =>
          booking.movieId === movieId &&
          booking.date === date &&
          booking.showtime === showtime &&
          booking.seats.some(seat => seats.includes(seat))
      );

      if (!existingBooking) {
        state.bookings.push(action.payload);
      } else {
        console.error('Booking failed: Some seats are already booked.');
      }
    },
    cancelBooking(state, action) {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
  },
});

export const { addBooking, cancelBooking } = bookingsSlice.actions;

export default bookingsSlice.reducer;
