import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ListGames from "../containers/ListGames/ListGames.jsx";
import { UsernameProvider } from "../contexts/UsernameContext.jsx";
import {UserIdProvider} from "../contexts/UserIdContext.jsx"
import WS from "jest-websocket-mock";

describe("ListGames", () => {
  let server;

  beforeEach(() => {
    server = new WS("ws://localhost:1234", { jsonProtocol: true });
  });

  afterEach(() => {
    WS.clean();
    jest.clearAllMocks();
  });

  test('renders ListGamesView and inputs', () => {
    render(
      <UsernameProvider>
        <ListGames websocketUrl="ws://localhost:1234" />
      </UsernameProvider>
    );

    expect(screen.getByText('Partidas disponibles')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa un Nombre')).toBeInTheDocument();
  });

  test('updates search input value', () => {
    render(
      <UsernameProvider>
        <ListGames websocketUrl="ws://localhost:1234" /> 
      </UsernameProvider>
    );

    const searchInput = screen.getByPlaceholderText('Ingresa un Nombre');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'test-game' } });
    });
    expect(searchInput.value).toBe('test-game');
  });

  test('sets isAtBottom to true if there are no games', () => {
    render(
      <UsernameProvider>
        <ListGames websocketUrl="ws://localhost:1234" />
      </UsernameProvider>
    );

    expect(screen.getByText('Todavia no hay elementos para mostrar.')).toBeInTheDocument();
  });

  test('handles WebSocket new game message', async () => {
    const { getByText } = render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <UserIdProvider>
          <ListGames websocketUrl="ws://localhost:1234" />
        </UserIdProvider>
      </MemoryRouter>
    );

    await server.connected;

    const mockMessage = {
      type: 'CreatedGames',
      payload: [
        {
          "unique_id": "e7835a2e-e54d-40fe-b097-0ea3221bc41f",
          "name": "Juego de Prueba",
          "state": "waiting",
          "board": null,
          "turn": 0,
          "creator": "6c839d04-a0b9-49bb-9c8d-55303e063922",
          "players": [
            "385567c3-4b36-4786-8013-c160d17e0fad",
            "6c839d04-a0b9-49bb-9c8d-55303e063922"
          ],
          "player_names": [
            "Pedro",
            "Sofia"
          ]
        }
      ]
    };

    server.send(mockMessage); 

    await waitFor(() => {
      expect(getByText('Juego de Prueba')).toBeInTheDocument();
      expect(getByText('Cantidad de Jugadores: 2/4')).toBeInTheDocument();
      expect(getByText('Estado: waiting')).toBeInTheDocument();
      expect(getByText('Dueño: Sofia')).toBeInTheDocument();
  
      const joinButton = getByText('UNIRSE');
      expect(joinButton).toBeDisabled();
    });
  });
});
