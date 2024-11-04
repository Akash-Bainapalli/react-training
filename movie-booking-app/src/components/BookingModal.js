import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking } from '../redux/bookingsSlice';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ movie, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [showtime, setShowtime] = useState('');
    const [numTickets, setNumTickets] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showSeatSelection, setShowSeatSelection] = useState(false);
    const totalSeats = 20;

    const bookings = useSelector((state) => state.bookings.bookings || []);

    useEffect(() => {
        console.log('Movie Prop:', movie);
    }, [movie]);

    const bookedSeats = bookings
        .filter(
            (booking) =>
                booking.movieId === movie?.imdbID &&
                booking.showtime === showtime &&
                booking.date === selectedDate
        )
        .flatMap((booking) => booking.seats);

    console.log(`Filtered Booked Seats for Movie ID ${movie?.imdbID}, Showtime ${showtime}, Date ${selectedDate}:`, bookedSeats);

    const handleSeatSelect = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
        } else if (selectedSeats.length < numTickets) {
            setSelectedSeats([...selectedSeats, seatNumber]);
        } else {
            alert(`You can only select ${numTickets} seat(s).`);
        }
    };

    const handleConfirmBooking = () => {
        if (!movie?.imdbID) {
            alert("Error: Movie ID is missing. Please try again.");
            return;
        }

        const booking = {
            id: Date.now(),
            movieId: movie.imdbID,
            movieTitle: movie.Title,
            date: selectedDate,
            showtime,
            numTickets,
            seats: selectedSeats,
        };

        console.log('Adding New Booking:', booking);
        dispatch(addBooking(booking));
        onClose();
        navigate('/booking-success', { state: { booking } });
    };

    const handleProceedToSeatSelection = () => {
        if (selectedDate && showtime) {
            setShowSeatSelection(true);
        } else {
            alert('Please select both date and showtime before proceeding.');
            return;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Book Ticket for {movie?.Title}</h2>
                {!showSeatSelection ? (
                    <>
                        <div>
                            <label>
                                Select Date:
                                <input 
                                    type="date" 
                                    value={selectedDate} 
                                    onChange={(e) => setSelectedDate(e.target.value)} 
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Select Showtime:
                                <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="6:00 PM">6:00 PM</option>
                                    <option value="10:00 PM">10:00 PM</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Number of Tickets:
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={numTickets} 
                                    onChange={(e) => setNumTickets(Number(e.target.value))} 
                                />
                            </label>
                        </div>
                        <button onClick={handleProceedToSeatSelection} disabled={!showtime || !selectedDate}>
                            Proceed to Seat Selection
                        </button>
                        <button className="close-button" onClick={onClose}>Cancel</button>
                    </>
                ) : (
                    <>
                        <div className="seat-selection">
                            <h4>Select Seats:</h4>
                            <div className="seat-container">
                                {Array.from({ length: totalSeats }, (_, index) => {
                                    const seatNumber = `Seat ${index + 1}`;
                                    const isBooked = bookedSeats.includes(seatNumber);
                                    const isSelected = selectedSeats.includes(seatNumber);
                                    return (
                                        <button data-test-id={`seat-${seatNumber}`}
                                            key={seatNumber}
                                            className={`seat ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                                            onClick={() => !isBooked && handleSeatSelect(seatNumber)}
                                            disabled={isBooked}
                                        >
                                            {seatNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button onClick={handleConfirmBooking} disabled={selectedSeats.length !== numTickets}>
                            Confirm Booking
                        </button>
                        <button className="close-button" onClick={() => setShowSeatSelection(false)}>Back</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
