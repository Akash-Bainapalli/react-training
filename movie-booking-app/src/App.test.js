import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import BookingHistory from './components/BookingHistory';
import BookingSuccess from './components/BookingSuccess';
import Navbar from './components/Navbar';

jest.mock('./components/Navbar', () => () => <div>Mocked Navbar</div>);
jest.mock('./components/MovieList', () => () => <div>Movie List</div>);
jest.mock('./components/MovieDetails', () => () => <div>Movie Details</div>);
jest.mock('./components/BookingHistory', () => () => <div>Booking History</div>);
jest.mock('./components/BookingSuccess', () => () => <div>Booking Success</div>);

describe('App Component', () => {
    test('renders Navbar and routes to MovieList', () => {
        render(
            <MemoryRouter initialEntries={['/movies']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();
        expect(screen.getByText(/Movie List/i)).toBeInTheDocument();
    });

    test('routes to MovieDetails when visiting a specific movie', () => {
        render(
            <MemoryRouter initialEntries={['/movies/tt1234567']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();
        expect(screen.getByText(/Movie Details/i)).toBeInTheDocument();
    });

    test('routes to BookingHistory when visiting the booking history page', () => {
        render(
            <MemoryRouter initialEntries={['/booking-history']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();
        expect(screen.getByText(/Booking History/i)).toBeInTheDocument();
    });

    test('routes to BookingSuccess when visiting the booking success page', () => {
        render(
            <MemoryRouter initialEntries={['/booking-success']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();
        expect(screen.getByText(/Booking Success/i)).toBeInTheDocument();
    });

    test('redirects from root to /movies', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Movie List/i)).toBeInTheDocument();
    });
});
