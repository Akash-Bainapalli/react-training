import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../redux/moviesSlice'; // Ensure this path is correct
import BookingModal from './BookingModal';
import '../styles/index.css';

const MovieDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { movieDetails, detailsLoading, detailsError, bookings} = useSelector((state) => state.movies);
    const [showBookingModal, setShowBookingModal] = React.useState(false);
    const [selectedShowtime, setSelectedShowtime] = React.useState(null); 

    useEffect(() => {
        dispatch(fetchMovieDetails(id));
    }, [dispatch, id]);

    if (detailsLoading) return <p>Loading movie details...</p>;
    if (detailsError) return <p>Error: {detailsError}</p>;
    if (!movieDetails) return <p>Movie not found.</p>;

    const handleBookTickets = (showtime) => {
        setSelectedShowtime(showtime);
        setShowBookingModal(true);
    };

    return (
        <div className="movie-details">
            <div className="movie-hero">
                <img src={movieDetails.Poster} alt={movieDetails.Title} className="movie-poster" />
                <div className="movie-info">
                    <h1 className="movie-title">{movieDetails.Title}</h1>
                    <div className="movie-rating">
                        <span>Rating:</span> {movieDetails.imdbRating}
                    </div>
                    <div className="movie-plot">{movieDetails.Plot}</div>
                    <div className="movie-year">Year: {movieDetails.Year}</div>
                    <div className="movie-genre">Genre: {movieDetails.Genre}</div>
                    <div className="movie-director">Director: {movieDetails.Director}</div>

                    <button className="book-button" onClick={() => handleBookTickets("6:00 PM")}>
                        Book Tickets
                    </button>
                </div>
            </div>
            {showBookingModal && (
                <BookingModal 
                    movie={movieDetails} 
                    showtime={selectedShowtime} 
                    bookings={bookings}  
                    onClose={() => setShowBookingModal(false)} 
                />
            )}
        </div>
    );
};

export default MovieDetails;
