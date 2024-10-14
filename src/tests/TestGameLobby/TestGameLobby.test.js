import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby.jsx";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter

jest.mock("../../containers/GameLobbyContainer/components/GameInfo/GameInfo.jsx", () => () => (
  <div>Mock GameInfo</div>
));
jest.mock("../../containers/GameLobbyContainer/components/PlayerList/PlayerList.jsx", () => () => (
  <div>Mock PlayerList</div>
));
jest.mock("../../containers/GameLobbyContainer/components/GameButtons/GameButtons.jsx", () => () => (
  <div>Mock GameButtons</div>
));

describe("GameLobby", () => {
  const mockGameData = {
    gameName: "Test Game",
    gameId: "12345",
    gameState: "waiting",
    gameCreator: "ownerId",
  };
  const mockPlayerList = ["player1", "player2", "ownerId"];
  const mockPlayerId = "player1";

  it("Se renderizan los componentes internos correctamente", () => {
    render(
      <MemoryRouter>
      <GameLobby
        gameData={mockGameData}
        playerList={mockPlayerList}
        playerId={mockPlayerId}
      />
    </MemoryRouter>
    );

    expect(screen.getByText("Mock GameInfo")).toBeInTheDocument();
    expect(screen.getByText("Mock PlayerList")).toBeInTheDocument();
    expect(screen.getByText("Mock GameButtons")).toBeInTheDocument();
  });
/*
  it("Llama a la función onStartGame cuando se inicia el juego", () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(
      <GameLobby
        gameData={mockGameData}
        playerList={mockPlayerList}
        playerId={mockPlayerId}
      />
    );

    fireEvent.click(screen.getByText("Mock GameButtons"));

    expect(consoleSpy).toHaveBeenCalledWith("Iniciar juego para 12345");

    consoleSpy.mockRestore();
  });

  it("Llama a la función onCancelGame cuando el owner cancela el juego", () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(
      <GameLobby
        gameData={mockGameData}
        playerList={mockPlayerList}
        playerId="ownerId"
      />
    );

    fireEvent.click(screen.getByText("Mock GameButtons"));

    expect(consoleSpy).toHaveBeenCalledWith("Cancelar juego para 12345");

    consoleSpy.mockRestore();
  });

  it("Llama a la función onLeaveGame cuando un jugador abandona el juego", () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(
      <GameLobby
        gameData={mockGameData}
        playerList={mockPlayerList}
        playerId={mockPlayerId}
      />
    );

    fireEvent.click(screen.getByText("Mock GameButtons"));

    expect(consoleSpy).toHaveBeenCalledWith("Abandonar juego para 12345");

    consoleSpy.mockRestore();
  });
  */
});
