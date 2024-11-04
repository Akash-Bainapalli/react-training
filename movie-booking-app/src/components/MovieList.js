import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/moviesSlice';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const MovieList = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movies);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      dispatch(fetchMovies(searchTerm));
    } else {
      dispatch(fetchMovies('movie'));
    }
  }, [dispatch, searchTerm]);

  return (
    <div className="movie-list">
      <h2>Discover Movies</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search"
        />
      </div>

      {loading && <p>Loading movies...</p>}
      {error && !loading && <p>Error loading movies: {error}</p>}

      <div className="results">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <Link to={`/movies/${movie.imdbID}`} key={movie.imdbID} className="result">
              <div className="movie-card">
                <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
                <div className="movie-overlay">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Genre}</p>
                  <p>⭐ {movie.imdbRating}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          !loading && <div className="not-found"><h2>No movies found.</h2></div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
