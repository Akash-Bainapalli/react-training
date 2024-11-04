import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilter from './SearchFilter';

describe('SearchFilter Component', () => {
    test('renders input and button', () => {
        render(<SearchFilter onSearch={jest.fn()} />);

        const inputElement = screen.getByPlaceholderText(/Search by title or genre/i);
        const buttonElement = screen.getByRole('button', { name: /Search/i });

        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls onSearch with the input value when the button is clicked', () => {
        const mockOnSearch = jest.fn();
        render(<SearchFilter onSearch={mockOnSearch} />);

        const inputElement = screen.getByPlaceholderText(/Search by title or genre/i);
        const buttonElement = screen.getByRole('button', { name: /Search/i });

        fireEvent.change(inputElement, { target: { value: 'Inception' } });
        fireEvent.click(buttonElement);

        expect(mockOnSearch).toHaveBeenCalledWith('Inception');
    });

    test('does not call onSearch if input is empty', () => {
        const mockOnSearch = jest.fn();
        render(<SearchFilter onSearch={mockOnSearch} />);

        const buttonElement = screen.getByRole('button', { name: /Search/i });

        fireEvent.click(buttonElement);

        expect(mockOnSearch).not.toHaveBeenCalled();
    });
});
