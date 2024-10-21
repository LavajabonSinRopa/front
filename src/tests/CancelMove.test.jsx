// CancelMove.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, act, getByText } from "@testing-library/react";
import '@testing-library/jest-dom';
import CancelMove from "../containers/CancelMove/CancelMove.jsx";

// Mock del fetch
global.fetch = jest.fn();

describe("CancelMove component", () => {

    const mockPlayers = [
        { id: "1", name: "Player 1" },
        { id: "2", name: "Player 2" },
    ];

    const playerId = "1";
    const gameId = "game456";

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("deberia mostrar 'cargando' al cancelar el movimiento", async () => {
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({ 
            ok: true 
        });
        
        render(
            <CancelMove playerId={playerId} gameId={gameId} isYourTurn={true} partialMovementsMade={true}/>
        );
    
        fireEvent.click(screen.getByText("Cancelar Movimiento"));
    
        const loadingButton = await screen.findByText("Cargando...");
        expect(loadingButton).toBeInTheDocument();
    });

    test("deberia mostrar mensaje de error en caso de fallo al cancelar el movimiento", async () => {
        // Mock respuesta fallida de la api
        fetch.mockResolvedValueOnce({ 
            ok: false 
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CancelMove playerId={playerId} gameId={gameId} isYourTurn={true} partialMovementsMade={true}/>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Cancelar Movimiento"));
        });

        await waitFor(() => 
            expect(screen.getByText("Error al cancelar movimiento")).toBeInTheDocument()
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith("Error al cancelar movimiento");
        consoleErrorSpy.mockRestore();
    });

    test("registra que el jugador ha cancelado su turno en caso de éxito", async () => {
        // Espia la consola pa ver si manda ok
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({ 
            ok: true 
        });

        render(
            <CancelMove playerId={playerId} gameId={gameId} isYourTurn={true} partialMovementsMade={true} />
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Cancelar Movimiento"));
        });

        await waitFor(() => 
            expect(consoleLogSpy).toHaveBeenCalledWith(`Jugador ${playerId} ha cancelado el ultimo movimiento`)
        );

        consoleLogSpy.mockRestore();
    });

    test("deberia manejar errores en la solicitud", async () => {
        // Mock respuesta fallida de la api
        const errorMessage = "Network Error";
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CancelMove playerId={playerId} gameId={gameId} isYourTurn={true} partialMovementsMade={true}/>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("Cancelar Movimiento"));
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
            <CancelMove playerId={playerId} gameId={gameId} isYourTurn={false} partialMovementsMade={false}/>
        );

        const button = screen.getByText("Cancelar Movimiento");
        expect(button).toBeDisabled();
    });
});