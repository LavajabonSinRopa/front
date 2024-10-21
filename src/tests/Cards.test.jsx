import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cards from "../containers/Cards/Cards.jsx";
import { UserIdContext, UserIdProvider } from "../contexts/UserIdContext.jsx";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import WS from "jest-websocket-mock";
import {
  MovCardContext,
  MovCardProvider,
} from "../contexts/MovCardContext.jsx";
import {
  MovementContext,
  MovementProvider,
} from "../contexts/MovementContext.jsx";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

useParams.mockReturnValue({ gameId: 1 });

const mockUserIdContextValue = {
  userId: "8825596f-450e-438d-bd17-a2202af15f4a",
  setUserId: jest.fn(),
};

const mockMovCardContextValue = {
  movCardId: "c64f69b3-746a-41b5-93c3-26800a9b864e",
  setMovCardId: jest.fn(),
  movCardType: "1",
  setMovCardType: jest.fn(),
};

const mockMovementContextValue = {
  firstPieceXaxis: "0",
  setFirstPieceXaxis: jest.fn(),
  firstPieceYaxis: "0",
  setFirstPieceYaxis: jest.fn(),
  secondPieceXaxis: "1",
  setSecondPieceXaxis: jest.fn(),
  secondPieceYaxis: "1",
  setSecondPieceYaxis: jest.fn(),
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
  let allPlayersCards;

  beforeEach(() => {
    allPlayersCards = [
      {
        unique_id: "8825596f-450e-438d-bd17-a2202af15f4a",
        name: "luca",
        movement_cards: [
          {
            type: 1,
            unique_id: "c64f69b3-746a-41b5-93c3-26800a9b864e",
            state: null,
          },
          {
            type: 2,
            unique_id: "ead42368-e902-4b3c-99d1-f7b65b6fe1e3",
            state: null,
          },
          {
            type: 3,
            unique_id: "ef43d251-8dda-4a08-8fda-f1b159a31ec1",
            state: null,
          },
        ],
        figure_cards: [
          { type: 4, state: "drawn" },
          { type: 5, state: "drawn" },
          { type: 6, state: "drawn" },
        ],
      },
      {
        unique_id: "e1ba906d-d1c7-41c3-9495-da40a38f1acc",
        name: "messi",
        movement_cards: [
          {
            type: 4,
            unique_id: "416305b3-df8a-4889-9388-fe1e89dead57",
            state: null,
          },
          {
            type: 5,
            unique_id: "816a767b-2c00-4f4c-bd10-987a45ce8eed",
            state: null,
          },
          {
            type: 6,
            unique_id: "2b219f08-5d29-4e69-8dcf-1ae6d79f10aa",
            state: null,
          },
        ],
        figure_cards: [
          { type: 1, state: "drawn" },
          { type: 2, state: "drawn" },
          { type: 3, state: "drawn" },
        ],
      },
    ];
  });

  it("El componente se renderiza correctamente sin errores inicialmente", () => {
    render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <Cards playerData={allPlayersCards[0]} isYourTurn={true} />
            <Cards playerData={allPlayersCards[1]} isYourTurn={false} />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );

    expect(screen.getByText(/tus cartas/i)).toBeInTheDocument();
    expect(screen.getByText(/cartas de messi/i)).toBeInTheDocument();
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(12);
  });

  it("Cuando no hay cartas que mostrar se muestra el mensaje acorde", () => {
    allPlayersCards = {};

    render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <Cards playerData={allPlayersCards} isYourTurn={true} />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );
    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);

    expect(screen.getByText("No hay cartas de figura")).toBeInTheDocument();
    expect(screen.getByText("No hay cartas de movimiento")).toBeInTheDocument();
  });

  it("Se muestra 'Loading...' cuando playerData no esta disponible", () => {
    render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <Cards playerData={null} isYourTurn={true} />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
