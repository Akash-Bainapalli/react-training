import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelBooking } from '../redux/bookingsSlice';
import '../styles/index.css';

const BookingHistory = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings || []);

  const handleCancel = (bookingId) => {
    dispatch(cancelBooking(bookingId));
  };

  return (
    <div className="booking-history">
      <h2>Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <h3>{booking.movieTitle}</h3>
              <p>Date: {booking.date}</p>
              <p>Showtime: {booking.showtime}</p>
              <p>Tickets: {booking.numTickets}</p>
              <p>Seats: {booking.seats.join(', ')}</p>
              <button onClick={() => handleCancel(booking.id)}>Cancel Booking</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;
