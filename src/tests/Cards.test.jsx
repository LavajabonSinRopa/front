import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cards from "../containers/Cards/Cards.jsx";
import { UserIdProvider } from "../contexts/UserIdContext.jsx";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import WS from "jest-websocket-mock";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

useParams.mockReturnValue({ gameId: 1 });

const mockUserIdContextValue = {
  userId: "8825596f-450e-438d-bd17-a2202af15f4a",
  setUserId: jest.fn(), // Función mockeada
};

jest.mock(
  "../containers/Cards/components/cardSVG/fig01.svg",
  () => "fig01.svg"
);
jest.mock(
  "../containers/Cards/components/cardSVG/fig02.svg",
  () => "fig02.svg"
);
jest.mock(
  "../containers/Cards/components/cardSVG/fige03.svg",
  () => "fige03.svg"
);
jest.mock("../containers/Cards/components/cardSVG/mov1.svg", () => "mov1.svg");
jest.mock("../containers/Cards/components/cardSVG/mov3.svg", () => "mov3.svg");
jest.mock("../containers/Cards/components/cardSVG/mov5.svg", () => "mov5.svg");

describe("Card", () => {

  afterEach(() => {
    // Limpiar el mock después de cada test
    jest.clearAllMocks();
    WS.clean(); // Limpiar los mocks de WebSocket
  });

  it("El componente se renderiza correctamente sin errores inicialmente", () => {
    const allPlayersCards = [
      {
        unique_id: "8825596f-450e-438d-bd17-a2202af15f4a",
        name: "luca",
        movement_cards: [2, 4, 5],
        figure_cards: [
          { type: 4, state: "drawn" },
          { type: 5, state: "drawn" },
          { type: 6, state: "drawn" },
        ],
      },
      {
        unique_id: "e1ba906d-d1c7-41c3-9495-da40a38f1acc",
        name: "messi",
        movement_cards: [1, 3, 4],
        figure_cards: [
          { type: 1, state: "drawn" },
          { type: 2, state: "drawn" },
          { type: 3, state: "drawn" },
        ],
      },
    ];

    render(
      <UserIdProvider value={mockUserIdContextValue}>
        <Cards playerData={allPlayersCards[0]}/>
        <Cards playerData={allPlayersCards[1]}/>
      </UserIdProvider>
    );

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(12);
  });

  it("Cuando no hay cartas que mostrar se muestra el mensaje acorde", () => {
    const allPlayersCards = {};

    render(
      <UserIdProvider value={mockUserIdContextValue}>
        <Cards playerData={allPlayersCards}/>
      </UserIdProvider>
    );
    screen.debug();
    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);

    expect(screen.getByText("No hay cartas de figura")).toBeInTheDocument();
    expect(screen.getByText("No hay cartas de movimiento")).toBeInTheDocument();
  });
});
