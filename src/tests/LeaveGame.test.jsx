// LeaveGame.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeaveGame from "../containers/LeaveGame/LeaveGame.jsx";
import { MemoryRouter } from "react-router-dom";

//Mock del fetch
global.fetch = jest.fn();

describe("LeaveGame component", () => {
  const mockPlayerId = "player123";
  const mockGameId = "game456";
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mockeamos console.log y console.error
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restauramos las funciones originales después de cada test
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  test("deberia mostrar el boton para abandonar el juego", () => {
    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );
    const button = screen.getByText("Abandonar");
    expect(button).toBeInTheDocument();
  });

  test("deberia enviar la solicitud para abandonar el juego y mostrar éxito", async () => {
    // Mock respuesta exitosa de la api
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );

    const button = screen.getByText("Abandonar");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // se llamo a la url
    expect(fetch).toHaveBeenCalledWith(`/api/games/${mockGameId}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_id: mockPlayerId }),
    });

    // se ve el msg de exito
    const successMessage = screen.getByText(
      `Jugador ${mockPlayerId} ha abandonado la partida.`
    );
    expect(successMessage).toBeInTheDocument();
  });

  test("deberia mostrar un mensaje de error cuando la solicitud falla", async () => {
    // Mock respuesta exitosa de la api
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error al abandonar la partida" }),
    });

    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );

    const button = screen.getByText("Abandonar");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Error: Error al abandonar la partida/i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("deberia deshabilitar el boton mientras la solicitud está en curso", async () => {
    // Mock de una respuesta exitosa de la API
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );

    const button = screen.getByText("Abandonar");
    fireEvent.click(button);

    //el boton esta desabilitado miestra se hace la accion
    expect(button).toBeDisabled();

    // esperar a completar el fetch
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    //el boton vuelve a estar habilitado
    expect(button).not.toBeDisabled();
  });

  test("debería mostrar un mensaje de error cuando ocurre un error inesperado", async () => {
    // Mock para forzar un error en el fetch
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );

    const button = screen.getByText("Abandonar");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Verificar que se muestre el mensaje de error genérico
    const errorMessage = screen.getByText(
      /Error en la solicitud. Inténtalo nuevamente./i
    );
    expect(errorMessage).toBeInTheDocument();

    // Verificar que console.error haya sido llamado
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error en la solicitud:",
      expect.any(Error)
    );
  });

  test("debería mostrar un mensaje de error genérico cuando no hay mensaje en la respuesta", async () => {
    // Mock respuesta de error sin un mensaje específico
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <LeaveGame playerId={mockPlayerId} gameId={mockGameId} />
      </MemoryRouter>
    );

    const button = screen.getByText("Abandonar");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const errorMessage = screen.getByText(
      /Error al intentar abandonar la partida/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
