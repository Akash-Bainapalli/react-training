import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MovieList from './MovieList';
import { MemoryRouter } from 'react-router-dom';
import { thunk } from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../redux/moviesSlice', () => ({
    fetchMovies: jest.fn(),
}));

describe('MovieList Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            movies: {
                movies: [],
                loading: false,
                error: null,
            },
        });
    });

    test('renders loading state', () => {
        store = mockStore({
            movies: {
                movies: [],
                loading: true,
                error: null,
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Loading movies.../i)).toBeInTheDocument();
    });

    test('renders error state', () => {
        store = mockStore({
            movies: {
                movies: [],
                loading: false,
                error: 'Failed to fetch movies',
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Error loading movies: Failed to fetch movies/i)).toBeInTheDocument();
    });

    test('renders no movies found message', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/No movies found./i)).toBeInTheDocument();
    });

    test('renders movie cards when movies are present', () => {
        const movies = [
            {
                imdbID: 'tt1234567',
                Title: 'The Lego Movie',
                Poster: 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_SX300.jpg',
                Genre: 'Animation, Action, Adventure',
                imdbRating: '7.7',
            },
            {
                imdbID: 'tt7654321',
                Title: 'Another Movie',
                Poster: 'https://example.com/another_movie.jpg',
                Genre: 'Drama',
                imdbRating: '8.0',
            },
        ];

        store = mockStore({
            movies: {
                movies: movies,
                loading: false,
                error: null,
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/The Lego Movie/i)).toBeInTheDocument();
        expect(screen.getByText(/Animation, Action, Adventure/i)).toBeInTheDocument();
        expect(screen.getByText(/⭐ 7.7/i)).toBeInTheDocument();
        
        expect(screen.getByText(/Another Movie/i)).toBeInTheDocument();
        expect(screen.getByText(/Drama/i)).toBeInTheDocument();
        expect(screen.getByText(/⭐ 8.0/i)).toBeInTheDocument();
    });

    test('search input updates searchTerm state', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText(/🔍 Search by title.../i);
        fireEvent.change(searchInput, { target: { value: 'Lego' } });

        expect(searchInput.value).toBe('Lego');
    });
});
