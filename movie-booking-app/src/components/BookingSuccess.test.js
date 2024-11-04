import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import BookingSuccess from './BookingSuccess';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('BookingSuccess Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockImplementation(() => mockNavigate);
    });

    test('renders booking success message with correct details', () => {
        const mockBooking = {
            movieTitle: 'The Lego Movie',
            showtime: '6:00 PM',
            date: '2024-11-04',
            seats: ['Seat 1', 'Seat 2'],
        };

        render(
            <MemoryRouter initialEntries={[{ state: { booking: mockBooking } }]}>
                <BookingSuccess />
            </MemoryRouter>
        );

        expect(screen.getByText(/Booking Successful!/i)).toBeInTheDocument();
        expect(screen.getByText(/Thank you for your purchase!/i)).toBeInTheDocument();
        expect(screen.getByText(/Movie:/i)).toBeInTheDocument();
        expect(screen.getByText('The Lego Movie')).toBeInTheDocument();
        expect(screen.getByText(/Showtime:/i)).toBeInTheDocument();
        expect(screen.getByText('6:00 PM')).toBeInTheDocument();
        expect(screen.getByText(/Date:/i)).toBeInTheDocument();
        expect(screen.getByText('2024-11-04')).toBeInTheDocument();
        expect(screen.getByText(/Seats:/i)).toBeInTheDocument();
        expect(screen.getByText('Seat 1, Seat 2')).toBeInTheDocument();
    });

    test('renders with default values when no booking data is provided', () => {
        render(
            <MemoryRouter initialEntries={[{ state: {} }]}>
                <BookingSuccess />
            </MemoryRouter>
        );

        expect(screen.getByText(/Booking Successful!/i)).toBeInTheDocument();
        expect(screen.getByText(/Thank you for your purchase!/i)).toBeInTheDocument();
        expect(screen.getByText(/Movie:/i)).toBeInTheDocument();
        expect(screen.getByText(/Unknown Movie/i)).toBeInTheDocument();
        expect(screen.getByText(/Showtime:/i)).toBeInTheDocument();
        expect(screen.getByText(/Unknown Time/i)).toBeInTheDocument();
        expect(screen.getByText(/Date:/i)).toBeInTheDocument();
        expect(screen.getByText(/Unknown Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Seats:/i)).toBeInTheDocument();
        expect(screen.getByText(/No seats selected/i)).toBeInTheDocument(); // Update to check for "No seats selected"
    });

    test('navigates to home when Back to Home button is clicked', () => {
        const mockBooking = {
            movieTitle: 'The Lego Movie',
            showtime: '6:00 PM',
            date: '2024-11-04',
            seats: ['Seat 1', 'Seat 2'],
        };

        render(
            <MemoryRouter initialEntries={[{ state: { booking: mockBooking } }]}>
                <BookingSuccess />
            </MemoryRouter>
        );

        const homeButton = screen.getByText(/Back to Home/i);
        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
