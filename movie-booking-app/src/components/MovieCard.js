import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to movie:", movie.id);
    if (movie.id) {
      navigate(`/movies/${movie.id}`);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.genre}</p>
      <p>Rating: {movie.rating}</p>
    </div>
  );
};

export default MovieCard;
