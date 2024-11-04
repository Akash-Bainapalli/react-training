import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MovieDetails from './MovieDetails';
import {thunk} from 'redux-thunk'; // Import thunk middleware

const mockStore = configureStore([thunk]); // Use thunk middleware

describe('MovieDetails Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      movies: {
        movieDetails: null,
        detailsLoading: false,
        detailsError: null,
      },
    });

    store.dispatch = jest.fn(); // Mock the dispatch function
  });

  test('renders loading state when movie details are loading', () => {
    store = mockStore({
      movies: {
        movieDetails: null,
        detailsLoading: true,
        detailsError: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/movies/1']}>
          <Routes>
            <Route path="/movies/:id" element={<MovieDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading movie details.../i)).toBeInTheDocument();
  });

  test('renders error message when there is an error fetching movie details', () => {
    store = mockStore({
      movies: {
        movieDetails: null,
        detailsLoading: false,
        detailsError: 'Failed to fetch',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/movies/1']}>
          <Routes>
            <Route path="/movies/:id" element={<MovieDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  test('renders movie details when they are successfully fetched', async () => {
    const movie = {
        Title: 'Inception',
        Poster: 'https://example.com/inception.jpg',
        imdbRating: '8.8',
        Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        Year: '2010',
        Genre: 'Action, Sci-Fi',
        Director: 'Christopher Nolan',
    };

    store = mockStore({
        movies: {
            movieDetails: movie,
            detailsLoading: false,
            detailsError: null,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/movies/1']}>
                <Routes>
                    <Route path="/movies/:id" element={<MovieDetails />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByText(movie.Title)).toBeInTheDocument();
    expect(screen.getByText(/Rating:/i)).toBeInTheDocument(); // Check for "Rating:"
    expect(screen.getByText(/8.8/i)).toBeInTheDocument(); // Check for "8.8"
    expect(screen.getByText(/Year:/i)).toHaveTextContent(movie.Year);
    expect(screen.getByText(/Genre:/i)).toHaveTextContent(movie.Genre);
    expect(screen.getByText(/Director:/i)).toHaveTextContent(movie.Director);
});



  test('opens booking modal when Book Tickets button is clicked', async () => {
    const movie = {
      Title: 'Inception',
      Poster: 'https://example.com/inception.jpg',
      imdbRating: '8.8',
      Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
      Year: '2010',
      Genre: 'Action, Sci-Fi',
      Director: 'Christopher Nolan',
    };

    store = mockStore({
      movies: {
        movieDetails: movie,
        detailsLoading: false,
        detailsError: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/movies/1']}>
          <Routes>
            <Route path="/movies/:id" element={<MovieDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const bookButton = screen.getByText(/Book Tickets/i);
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument(); // Ensure your BookingModal is structured correctly
    });
  });
});
