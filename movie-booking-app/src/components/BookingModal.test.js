import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BookingModal from './BookingModal';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe('BookingModal Component', () => {
    let store;
    const mockMovie = {
        imdbID: '12345',
        Title: 'Sample Movie',
    };

    const onClose = jest.fn();

    beforeEach(() => {
        store = mockStore({
            bookings: {
                bookings: [],
            },
        });
    });

    it('renders the booking modal', () => {
        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} />
            </Provider>
        );

        expect(screen.getByText(/book ticket for sample movie/i)).toBeInTheDocument();
    });

    it('allows selection of date and showtime', () => {
        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} />
            </Provider>
        );

        const dateInput = screen.getByLabelText(/select date/i);
        fireEvent.change(dateInput, { target: { value: '2024-11-01' } });
        expect(dateInput.value).toBe('2024-11-01');

        const showtimeSelect = screen.getByLabelText(/select showtime/i);
        fireEvent.change(showtimeSelect, { target: { value: '2:00 PM' } });
        expect(showtimeSelect.value).toBe('2:00 PM');
    });

    it('enables seat selection button when date and showtime are selected', () => {
        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} />
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/select date/i), { target: { value: '2024-11-01' } });
        fireEvent.change(screen.getByLabelText(/select showtime/i), { target: { value: '2:00 PM' } });

        const proceedButton = screen.getByText(/proceed to seat selection/i);
        expect(proceedButton).toBeEnabled();
    });

    it('shows an alert if trying to proceed without selecting date and showtime', () => {
        window.alert = jest.fn(); // Mock alert

        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} />
            </Provider>
        );

        const proceedButton = screen.getByText(/proceed to seat selection/i);
        fireEvent.click(proceedButton);

        expect(window.alert).toHaveBeenCalledWith('Please select both date and showtime before proceeding.');
    });

    it('allows seat selection and confirms booking', () => {
        const mockMovie = {
            id: 'tt1234567',
            Title: 'Sample Movie',
        };
    
        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} />
            </Provider>
        );
    
        const seatButton = screen.getByTestId('seat-1');
        fireEvent.click(seatButton);
    
        const confirmButton = screen.getByText(/confirm booking/i);
        fireEvent.click(confirmButton);
        expect(window.alert).toHaveBeenCalledWith("Booking confirmed for Sample Movie");
    });
    

    it('alerts if trying to confirm booking without selecting enough seats', () => {
        window.alert = jest.fn();
    
        const mockMovie = {
            id: 'tt1234567',
            Title: 'Sample Movie',
        };
    
        render(
            <Provider store={store}>
                <BookingModal movie={mockMovie} onClose={onClose} seatLimit={2} />
            </Provider>
        );
    
        const seatButtons = screen.getAllByText(/seat/i);
        fireEvent.click(seatButtons[0]);
        const confirmButton = screen.getByText(/confirm booking/i);
        fireEvent.click(confirmButton);

        expect(window.alert).toHaveBeenCalled();
    });
    
    

    it('alerts when movie ID is missing', () => {
        window.alert = jest.fn();

        const mockMovieWithoutId = {
            Title: 'Sample Movie',
        };

        render(
            <Provider store={store}>
                <BookingModal movie={mockMovieWithoutId} onClose={onClose} />
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/select date/i), { target: { value: '2024-11-01' } });
        fireEvent.change(screen.getByLabelText(/select showtime/i), { target: { value: '2:00 PM' } });

        const proceedButton = screen.getByText(/proceed to seat selection/i);
        fireEvent.click(proceedButton);

        const seatButtons = screen.getAllByText(/seat 1/i);
        fireEvent.click(seatButtons[0]);
        const confirmButton = screen.getByText(/confirm booking/i);
        fireEvent.click(confirmButton);

        expect(window.alert).toHaveBeenCalled();
    });
});
