// LeaveGame.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import LeaveGame from "./LeaveGame";

//Mock del fetch
global.fetch = jest.fn();

describe("LeaveGame component", () => {
    
    const mockPlayerId = "player123";
    const mockGameId = "game456";

    beforeEach(() => {
        fetch.mockClear(); 
    });

    test("deberia mostrar el boton para abandonar el juego", () => {
        render(<LeaveGame playerId={mockPlayerId} gameId={mockGameId} />);
        const button = screen.getByText("Abandonar");
        expect(button).toBeInTheDocument();
    });

    test("deberia enviar la solicitud para abandonar el juego y mostrar éxito", async () => {
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "Success" }),
        });

        render(<LeaveGame playerId={mockPlayerId} gameId={mockGameId} />);
        
        const button = screen.getByText("Abandonar");
        fireEvent.click(button);

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // se llamo a la url
        expect(fetch).toHaveBeenCalledWith(`api/games/${mockGameId}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ player_id: mockPlayerId }),
        });

        // se ve el msg de exito
        const successMessage = screen.getByText(`Jugador ${mockPlayerId} ha abandonado la partida.`);
        expect(successMessage).toBeInTheDocument();
    });

    test("deberia mostrar un mensaje de error cuando la solicitud falla", async () => {
        // Mock respuesta exitosa de la api
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Error al abandonar la partida" }),
        });

        render(<LeaveGame playerId={mockPlayerId} gameId={mockGameId} />);

        const button = screen.getByText("Abandonar");
        fireEvent.click(button);

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Verifica que se muestra el mensaje de error
        const errorMessage = screen.getByText("Error: Error al abandonar la partida");
        expect(errorMessage).toBeInTheDocument();
    });

    test("deberia deshabilitar el boton mientras la solicitud está en curso", async () => {
        // Mock de una respuesta exitosa de la API
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "Success" }),
        });

        render(<LeaveGame playerId={mockPlayerId} gameId={mockGameId} />);

        const button = screen.getByText("Abandonar");
        fireEvent.click(button);

        //el boton esta desabilitado miestra se hace la accion
        expect(button).toBeDisabled();

        // esperar a completar el fetch
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        //el boton vuelve a estar habilitado
        expect(button).not.toBeDisabled();
    });
});
