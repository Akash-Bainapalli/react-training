import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar Component', () => {
    test('renders Navbar with correct title', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const logoElement = screen.getByText(/Movie Booking/i);
        expect(logoElement).toBeInTheDocument();
    });

    test('renders correct links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const moviesLink = screen.getByRole('link', { name: /Movies/i });
        const bookingHistoryLink = screen.getByRole('link', { name: /Booking History/i });

        expect(moviesLink).toBeInTheDocument();
        expect(bookingHistoryLink).toBeInTheDocument();
    });

    test('renders links with correct hrefs', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const moviesLink = screen.getByRole('link', { name: /Movies/i });
        const bookingHistoryLink = screen.getByRole('link', { name: /Booking History/i });

        expect(moviesLink).toHaveAttribute('href', '/movies');
        expect(bookingHistoryLink).toHaveAttribute('href', '/booking-history');
    });
});
