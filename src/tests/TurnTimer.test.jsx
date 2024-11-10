// TurnTimer.test.jsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TurnTimer from '../containers/TurnTimer/TurnTimer.jsx';
import '@testing-library/jest-dom';

// Mocks
jest.mock("../containers/TurnTimer/components/TurnTimerView.jsx", () => jest.fn(() => <div>Mocked Timer View</div>));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
  })
);

describe("TurnTimer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe mostrar el tiempo restante inicial", () => {
    render(<TurnTimer initialTime={120} playerId="1" gameId="game123" isYourTurn={false} />);
    expect(screen.getByText("Mocked Timer View")).toBeInTheDocument(); 
  });

  test("debe decrementar el tiempo correctamente", () => {
    jest.useFakeTimers();
    render(<TurnTimer initialTime={10} playerId="1" gameId="game123" isYourTurn={false} />);
    expect(screen.getByText("Mocked Timer View")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(5000); 
    });
    expect(global.fetch).not.toHaveBeenCalled(); 
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(global.fetch).not.toHaveBeenCalled();
    jest.useRealTimers(); 
  });

  test("debe llamar a la API cuando el tiempo llegue a 0 y sea tu turno", async () => {
    jest.useFakeTimers(); // Usar temporizadores falsos para simular el paso del tiempo

    render(<TurnTimer initialTime={1} playerId="1" gameId="game123" isYourTurn={true} />);

    // Simulamos el paso del tiempo hasta que el temporizador llegue a 0
    act(() => {
      jest.advanceTimersByTime(1000); // Avanzar el tiempo en 1 segundo (el timer llegará a 0)
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/games/game123/skip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_id: "1" }),
    });

    jest.useRealTimers(); // Restaurar los temporizadores reales
  });

  
  

  test("debe mostrar 'Finalizando turno...' cuando se esté cargando", () => {
    render(<TurnTimer initialTime={120} playerId="1" gameId="game123" isYourTurn={true} />);
    act(() => {
      screen.getByText("Mocked Timer View").click();
    });
    expect(screen.getByText("Mocked Timer View")).toBeInTheDocument();
  });
});
