import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom'; // Import useNavigate for mocking
import MovieCard from './MovieCard';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep the actual implementation of react-router-dom
  useNavigate: jest.fn(), // Mock useNavigate
}));

describe('MovieCard Component', () => {
    const mockMovie = {
        id: '123',
        title: 'The Lego Movie',
        genre: 'Animation',
        rating: '7.7',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_SX300.jpg'
    };

    test('renders movie card with correct details', () => {
        render(
            <MemoryRouter>
                <MovieCard movie={mockMovie} />
            </MemoryRouter>
        );

        // Check if the movie details are rendered
        expect(screen.getByText(/The Lego Movie/i)).toBeInTheDocument();
        expect(screen.getByText(/Animation/i)).toBeInTheDocument();
        expect(screen.getByText(/Rating: 7.7/i)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /The Lego Movie/i })).toBeInTheDocument();
    });

    test('navigates to the correct movie details page on click', () => {
        const mockNavigate = jest.fn();
        useNavigate.mockImplementation(() => mockNavigate); // Use the mocked function

        render(
            <MemoryRouter>
                <MovieCard movie={mockMovie} />
            </MemoryRouter>
        );

        // Simulate a click on the movie card
        fireEvent.click(screen.getByText(/The Lego Movie/i));

        // Check if navigate was called with the correct path
        expect(mockNavigate).toHaveBeenCalledWith('/movies/123');
    });

    test('does not navigate if movie id is undefined', () => {
        const mockNavigate = jest.fn();
        useNavigate.mockImplementation(() => mockNavigate); // Use the mocked function

        const movieWithoutId = { ...mockMovie, id: undefined };

        render(
            <MemoryRouter>
                <MovieCard movie={movieWithoutId} />
            </MemoryRouter>
        );

        // Simulate a click on the movie card
        fireEvent.click(screen.getByText(/The Lego Movie/i));

        // Assert that the navigate function is not called
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
