import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chat from "../containers/Chat/Chat.jsx";
import StartGame from "../containers/StartGame/StartGame.jsx";
import { UserIdContext } from "../contexts/UserIdContext.jsx";
import { MemoryRouter } from "react-router-dom";
import WS from "jest-websocket-mock";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ game_id: "gameIdValue" }), // Mock de useParams devolviendo "gameTestId"
}));

const mockUserIdContextValue = {
  userId: "58cf988c-6813-4aa7-b4af-6009828e2065",
  setUserId: jest.fn(),
};

const message = {
  type: "GameStarted",
  payload: {
    board: [],
    creator: "58cf988c-6813-4aa7-b4af-6009828e2065",
    name: "PartidaDePrueba",
    players: [
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
          {
            type: 3,
            unique_id: "5c18c41d-38be-4561-8836-081e62fb4380",
            state: "drawn",
          },
          {
            type: 22,
            unique_id: "bb082724-02ae-4c04-ae5f-7ac9668a1f85",
            state: "drawn",
          },
          {
            type: 8,
            unique_id: "5ed30eb6-e96b-41bc-81e2-747ac8418c69",
            state: "drawn",
          },
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
          {
            type: 6,
            unique_id: "c558bad6-6876-4483-a1a5-a72190e5be2f",
            state: "drawn",
          },
          {
            type: 5,
            unique_id: "76e45acf-0540-493c-8ff5-052e43a125fc",
            state: "drawn",
          },
          {
            type: 6,
            unique_id: "db9cddc5-e0b1-4d10-8dc8-4179320fdccb",
            state: "drawn",
          },
        ],
      },
    ],
    state: "started",
    turn: "0",
    unique_id: "93ef1c22-c03e-4b03-9ca6-cbc462676d2f",
  },
};

describe("LeaveGame component", () => {
  let server;
  let mockSocket;

  beforeEach(() => {
    // Crear un servidor WebSocket mock
    server = new WS(
      "ws://localhost:1234/games/gameIdValue/58cf988c-6813-4aa7-b4af-6009828e2065",
      {
        jsonProtocol: true,
      }
    );
    // Crea un mock de WebSocket
    mockSocket = {
      current: {
        readyState: WebSocket.OPEN, // Simulamos que el WebSocket está abierto
        send: jest.fn(),
      },
    };

    // Mock para setMessages
    setMessagesMock = jest.fn();
  });

  afterEach(() => {
    WS.clean(); // Limpiar los mocks de WebSocket después de cada test
    jest.restoreAllMocks(); // Restaurar los mocks para evitar interferencias con otros tests
  });
  
  test("El componente se renderiza correctamente", () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame>
            <Chat />
          </StartGame>
        </UserIdContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("No hay mensajes")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/escribe un mensaje.../i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  test("El usuario puede enviar un mensaje tocando el boton ENVIAR", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"58cf988c-6813-4aa7-b4af-6009828e2065"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/58cf988c-6813-4aa7-b4af-6009828e2065`}
          >
            <Chat
              messages={[]}
              setMessages={setMessagesMock}
              socketRef={mockSocket}
            />
          </StartGame>
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    server.send(message);

    fireEvent.change(screen.getByPlaceholderText(/escribe un mensaje.../i), {
      target: { value: "Mensaje de prueba" },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    const newMessage = {
      type: "ChatMessage",
      payload: {
        player_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
        time: "(1)",
        player_name: "luca",
        message: "Mensaje de prueba",
      },
    };

    server.send(newMessage);

    expect(screen.getByText("Mensaje de prueba")).toBeInTheDocument();
  });

  test("El usuario puede enviar un mensaje tocando la tecla ENTER", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"58cf988c-6813-4aa7-b4af-6009828e2065"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/58cf988c-6813-4aa7-b4af-6009828e2065`}
          >
            <Chat
              messages={[]}
              setMessages={setMessagesMock}
              socketRef={mockSocket}
            />
          </StartGame>
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    // Simulamos que se escribe un mensaje
    fireEvent.change(screen.getByPlaceholderText(/escribe un mensaje.../i), {
      target: { value: "Mensaje de prueba" },
    });

    // Simulamos presionar la tecla ENTER
    fireEvent.keyDown(screen.getByPlaceholderText(/escribe un mensaje.../i), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    const newMessage = {
      type: "ChatMessage",
      payload: {
        player_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
        time: "(1)",
        player_name: "luca",
        message: "Mensaje de prueba",
      },
    };

    // Simulamos el envío del mensaje por el servidor
    server.send(newMessage);

    // Verificamos que el mensaje aparece en la interfaz
    expect(screen.getByText("Mensaje de prueba")).toBeInTheDocument();
  });

  test("Si el mensaje es invalido se le notifica al usuario", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"58cf988c-6813-4aa7-b4af-6009828e2065"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/58cf988c-6813-4aa7-b4af-6009828e2065`}
          >
            <Chat
              messages={[]}
              setMessages={setMessagesMock}
              socketRef={mockSocket}
            />
          </StartGame>
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    server.send(message);

    fireEvent.change(screen.getByPlaceholderText(/escribe un mensaje.../i), {
      target: { value: "          " },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(
      screen.getByText(
        "El mensaje no puede estar vacio o tener mas de 1000 caracteres"
      )
    ).toBeInTheDocument();
  });
/*
  test("Si el usuario esta muy arriba en el chat se le notifican de nuevos mensajes", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"58cf988c-6813-4aa7-b4af-6009828e2065"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/58cf988c-6813-4aa7-b4af-6009828e2065`}
          >
            <Chat
              messages={[]}
              setMessages={setMessagesMock}
              socketRef={mockSocket}
            />
          </StartGame>
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    server.send(message);

    const newMessage = {
      type: "ChatMessage",
      payload: {
        player_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
        time: "(1)",
        player_name: "luca",
        message: "Mensaje de prueba",
      },
    };

    await waitFor(() => {
      for (let index = 0; index < 40; index++) {
        server.send(newMessage);
      }
    });

    const container = screen.getByTestId("scrollable-chat");
    container.scrollTop = 0;
    fireEvent.scroll(container);

    const newMessage2 = {
      type: "ChatMessage",
      payload: {
        player_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
        time: "(1)",
        player_name: "luca",
        message: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    };
    server.send(newMessage2);

    expect(screen.getByText("Nuevo(s) mensaje(s)")).toBeInTheDocument();
  });*/
});
