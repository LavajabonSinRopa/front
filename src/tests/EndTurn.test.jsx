// EndTurn.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import EndTurn from "../containers/EndTurn/EndTurn.jsx";

// Mock del fetch
global.fetch = jest.fn();

describe("EndTurn component", () => {

    const mockPlayers = [
        { id: "1", name: "Player 1" },
        { id: "2", name: "Player 2" },
    ];

    const playerId = "1";
    const gameId = "game456";
    const currentTurn = 1;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("deberia mostrar 'cargando' al terminar el turno", async () => {
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({ 
            ok: true 
        });
        
        render(
            <EndTurn playerId={playerId} gameId={gameId} players={mockPlayers} currentTurn={currentTurn} />
        );
    
        fireEvent.click(screen.getByText("Terminar Turno"));
    
        const loadingButton = await screen.findByText("Cargando...");
        expect(loadingButton).toBeInTheDocument();
    });

    test("deberia mostrar mensaje de error en caso de fallo al terminar el turno", async () => {
        // Mock respuesta fallida de la api
        fetch.mockResolvedValueOnce({ 
            ok: false 
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <EndTurn playerId={playerId} gameId={gameId} players={mockPlayers} currentTurn={currentTurn} />
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Terminar Turno"));
        });

        await waitFor(() => 
            expect(screen.getByText("Error al intentar terminar el turno")).toBeInTheDocument()
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith("Error al intentar terminar el turno");
        consoleErrorSpy.mockRestore();
    });

    test("registra que el jugador ha terminado su turno en caso de éxito", async () => {
        // Espia la consola pa ver si manda ok
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({ 
            ok: true 
        });

        render(
            <EndTurn playerId={playerId} gameId={gameId} players={mockPlayers} currentTurn={currentTurn} />
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Terminar Turno"));
        });

        await waitFor(() => 
            expect(consoleLogSpy).toHaveBeenCalledWith(`Jugador ${playerId} ha terminado su turno`)
        );

        consoleLogSpy.mockRestore();
    });

    test("deberia manejar errores en la solicitud", async () => {
        // Mock respuesta fallida de la api
        const errorMessage = "Network Error";
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <EndTurn playerId={playerId} gameId={gameId} players={mockPlayers} currentTurn={currentTurn} />
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Terminar Turno"));
        });

        await waitFor(() => 
            expect(screen.getByText(`Error en la solicitud: ${errorMessage}`)).toBeInTheDocument()
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith("Error en la solicitud:", expect.any(Error));
        consoleErrorSpy.mockRestore();
    });

    test("desactiva el botón cuando no es el turno del jugador", () => {
        const currentTurnNotPlayer = 2; // simulamos que es el turno de otro jugador
        
        render(
            <EndTurn playerId={playerId} gameId={gameId} players={mockPlayers} currentTurn={currentTurnNotPlayer} />
        );

        expect(screen.getByText("Esperando tu turno")).toBeInTheDocument();
        expect(screen.getByText("Esperando tu turno").closest('button')).toBeDisabled();
    });
});