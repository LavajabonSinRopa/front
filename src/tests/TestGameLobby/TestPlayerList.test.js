import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerList from "../../components/GameLobby/PlayerList";

describe("PlayerList", () => {
  const players = ["Player1", "Player2", "Player3"];
  const ownerId = "Player1";

  it("El componente se renderiza correctamente con la lista de jugadores", () => {
    render(<PlayerList playerList={players} ownerId={ownerId} />);

    expect(screen.getByText("Jugadores")).toBeInTheDocument();

    players.forEach((player) => {
      expect(screen.getByText(player)).toBeInTheDocument();
    });
  });

  it("El jugador propietario (owner) se muestra en negrita", () => {
    render(<PlayerList playerList={players} ownerId={ownerId} />);

    const ownerElement = screen.getByText(ownerId);
    expect(ownerElement).toHaveStyle("font-weight: bold");

    players
      .filter((player) => player !== ownerId)
      .forEach((player) => {
        const playerElement = screen.getByText(player);
        expect(playerElement).toHaveStyle("font-weight: normal");
      });
  });

  it("El componente se renderiza correctamente con una lista vacía", () => {
    render(<PlayerList playerList={[]} ownerId={ownerId} />);

    expect(screen.getByText("Jugadores")).toBeInTheDocument();
    expect(screen.queryByText("Player1")).not.toBeInTheDocument();
  });
});
