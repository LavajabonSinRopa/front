import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import VictoryScreen from '../containers/VictoryScreen/VictoryScreen.jsx';
import "@testing-library/jest-dom";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('VictoryScreen', () => {
    const mockPlayerId = "Jugador 1";
    const mockNavigate = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    test('muestra la modal cuando isGameOver es true', () => {
        render(
            <MemoryRouter>
                <VictoryScreen isGameOver={true} winner={mockPlayerId} />
            </MemoryRouter>
        );
        expect(screen.getByText(`¡${mockPlayerId} ha ganado!`)).toBeInTheDocument();
    });

    test('no muestra la modal cuando isGameOver es false', () => {
        render(
            <MemoryRouter>
                <VictoryScreen isGameOver={false} winner={mockPlayerId} />
            </MemoryRouter>
        );
        expect(screen.queryByText(`¡${mockPlayerId} ha ganado!`)).not.toBeInTheDocument();
    });

    test('navega al menú principal al hacer clic en "Volver al Menu Principal"', () => {
        render(
            <MemoryRouter>
                <VictoryScreen isGameOver={true} winner={mockPlayerId} />
            </MemoryRouter>
        );

        const button = screen.getByText(/Volver al Menu Principal/i);
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('cierra la modal al hacer clic en la cruz', () => {
        render(
            <MemoryRouter>
                <VictoryScreen isGameOver={true} winner={mockPlayerId} />
            </MemoryRouter>
        );

        const closeButton = screen.getByRole('button', { name: /×/i });
        fireEvent.click(closeButton);

        expect(screen.queryByText(`¡${mockPlayerId} ha ganado!`)).not.toBeInTheDocument();
    });
});
