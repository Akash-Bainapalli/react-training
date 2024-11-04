import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { movieTitle, showtime, date, seats } = location.state?.booking || {
        movieTitle: 'Unknown Movie',
        showtime: 'Unknown Time',
        date: 'Unknown Date',
        seats: []
    };

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    return (
        <div className="success-page">
            <div className="success-container">
                <h1>Booking Successful!</h1>
                <p>Thank you for your purchase!</p>
                <div className="booking-details">
                    <h2>Your Booking Details</h2>
                    <p><strong>Movie:</strong> <span id="movie-name">{movieTitle}</span></p>
                    <p><strong>Showtime:</strong> <span id="showtime">{showtime}</span></p>
                    <p><strong>Date:</strong> <span id="booking-date">{date}</span></p>
                    <p><strong>Seats:</strong> <span id="seats">{seats.length > 0 ? seats.join(', ') : 'No seats selected'}</span></p>
                </div>
                <button className="home-button" onClick={handleHomeButtonClick}>Back to Home</button>
            </div>
        </div>
    );
};

export default BookingSuccess;
