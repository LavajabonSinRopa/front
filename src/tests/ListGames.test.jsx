import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListGames from "../containers/ListGames/ListGames.jsx";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import WS from "jest-websocket-mock";
import { UsernameProvider } from "../contexts/UsernameContext.jsx";
import { UserIdProvider } from "../contexts/UserIdContext.jsx";

global.fetch = jest.fn();

const server = new WS("ws://localhost:1234", { jsonProtocol: true });

const message = {
  type: "CreatedGames",
  payload: [
    {
      board: null,
      creator: "69843b1e-c13b-4329-baea-4643b68b569a",
      name: "dragonball",
      player_names: ["vegetta", "goku", "goten"],
      players: [
        "2dfcfde3-1d0f-4019-a5b4-6f3b21da2a1c",
        "69843b1e-c13b-4329-baea-4643b68b569a",
        "76c0b47b-ea3b-4f77-825a-177e9785dbfd",
      ],
      state: "waiting",
      turn: 0,
      unique_id: "aa626969-cf88-43a0-a65d-1e3e54e48b73",
    },
    {
      board: null,
      creator: "5226c8f1-695a-4bdd-b125-e55769c77afb",
      name: "scaloneta",
      player_names: ["messi", "julian"],
      players: [
        "5226c8f1-695a-4bdd-b125-e55769c77afb",
        "5c57800e-488b-4c72-b2d2-01edb2fa4087",
      ],
      state: "waiting",
      turn: 0,
      unique_id: "22a0f2cd-26fe-426f-b99a-cac457249934",
    },
    {
      board: null,
      creator: "bdb26ad4-d635-4756-b655-dedf8142c61c",
      name: "lavajabon",
      player_names: ["jose", "francisco", "ivo", "marti"],
      players: [
        "35c86e23-ea7d-4eca-92bc-8ca2c2f333b6",
        "ba1d5777-65ca-4bce-b5c9-13f2cc75cb15",
        "bdb26ad4-d635-4756-b655-dedf8142c61c",
        "eda962be-073f-4d6f-9187-565325c1197d",
      ],
      state: "started",
      turn: 0,
      unique_id: "18c90af7-52c5-4f54-bc2e-285ff720fb91",
    },
  ],
};

const mockUsernameContextValue = {
  username: "testUser",
  validUsername: true,
  handleChangeUser: jest.fn(), // Función mockeada
};

const mockUserIdContextValue = {
  userId: "12345",
  setUserId: jest.fn(), // Función mockeada
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("ListaPartidas", () => {
  beforeEach(() => {
    // Limpia los mocks antes de cada prueba
    jest.clearAllMocks();
  });

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

  it("renderiza la lista de items correctamente", async () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );

    server.send(message);

    // ASSERT: TODOS LOS ITEMS DEBEN RENDERIZAR
    //input
    expect(
      screen.getByPlaceholderText(/Ingresa un Nombre/i)
    ).toBeInTheDocument();
    //H1s
    const itemsH1 = await screen.findAllByRole("heading", { level: 1 });
    expect(itemsH1).toHaveLength(4);
    //H2s
    const itemsH2 = await screen.findAllByRole("heading", { level: 2 });
    expect(itemsH2).toHaveLength(5);
    //Filtro de jugadores
    [1, 2, 3, 4].map((num) =>
      expect(screen.getByRole("button", { name: num })).toBeInTheDocument()
    );
    //botones
    const itemsButton = await screen.findAllByRole("button");
    const joinButtons = itemsButton.filter(
      (button) => button.textContent === "UNIRSE"
    );
    expect(joinButtons).toHaveLength(3);
    //Titulo
    expect(screen.getByText("Partidas disponibles")).toBeInTheDocument();
    //Partida 1
    expect(screen.getByText("dragonball")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 3/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: goku")).toBeInTheDocument();
    //Partida 2
    expect(screen.getByText("scaloneta")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 2/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: messi")).toBeInTheDocument();
    //Partida 3
    expect(screen.getByText("lavajabon")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 4/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: ivo")).toBeInTheDocument();
    //Estado de las partidas
    let estados = screen.getAllByText("Estado: waiting");
    expect(estados).toHaveLength(2);
    estados = screen.getAllByText("Estado: started");
    expect(estados).toHaveLength(1);
  });

  it("los items se filtran correctamente segun el input sin distinguir mayusculas de minusculas", async () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );
    // Simula el cambio en el input
    const input = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(input, { target: { value: "rAgOnB" } });

    server.send(message);

    // ASSERT: SOLO LOS ITEM QUE CUMPLEN CON LA BUSQUEDA SE RENDERIZAN
    //input
    expect(
      screen.getByPlaceholderText(/Ingresa un Nombre/i)
    ).toBeInTheDocument();
    //H1s
    const itemsH1 = await screen.findAllByRole("heading", { level: 1 });
    expect(itemsH1).toHaveLength(2);
    //H2s
    const itemsH2 = await screen.findAllByRole("heading", { level: 2 });
    expect(itemsH2).toHaveLength(3);
    //botones
    const itemsButton = await screen.findAllByRole("button");
    const joinButtons = itemsButton.filter(
      (button) => button.textContent === "UNIRSE"
    );
    expect(joinButtons).toHaveLength(1);
    //Titulo
    expect(screen.getByText("Partidas disponibles")).toBeInTheDocument();
    //Partida 1
    expect(screen.getByText("dragonball")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 3/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: goku")).toBeInTheDocument();
    //Partida 2
    expect(screen.queryByText("scaloneta")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cantidad de Jugadores: 2/4")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Dueño: messi")).not.toBeInTheDocument();
    //Partida 3
    expect(screen.queryByText("lavajabon")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cantidad de Jugadores: 4/4")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Dueño: ivo")).not.toBeInTheDocument();
    //Estado de las partidas
    let estados = screen.getAllByText("Estado: waiting");
    expect(estados).toHaveLength(1);
    expect(screen.queryByText("Estado: started")).not.toBeInTheDocument();
  });

  it('muestra "No Hay Más Partidas" solo si está al final del scroll', () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );
    server.send(message);

    const container = screen.getByTestId("scrollable-div");

    expect(screen.queryByText(/No Hay Más Partidas/i)).not.toBeInTheDocument();
    // Establecemos el scrollTop directamente
    container.scrollTop = 50;

    // Simulamos el evento de scroll
    fireEvent.scroll(container);
    // Verificamos que el mensaje no se muestra
    expect(screen.queryByText(/No Hay Más Partidas/i)).toBeInTheDocument();
  });

  it("redirige a /games/game_id al hacer clic en UNIRTE", async () => {
    // Mock de la respuesta de la API
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "Partida creada correctamente" }),
      })
    );

    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );

    server.send(message);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Elige un Nombre");
      fireEvent.change(input, { target: { value: "testUser" } });

      const itemsButton = screen.getAllByRole("button");
      const joinButtons = itemsButton.filter(
        (button) => button.textContent === "UNIRSE"
      );

      expect(joinButtons.length).toBeGreaterThan(0);
      fireEvent.click(joinButtons[0]);
    });

    expect(fetch).toHaveBeenCalledWith(
      `/api/games/aa626969-cf88-43a0-a65d-1e3e54e48b73/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: "testUser",
          password: "",
        }),
      }
    );

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      "/games/aa626969-cf88-43a0-a65d-1e3e54e48b73"
    );
  });

  it("no te deja unirte si la partida está llena", async () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );

    const inputPartida = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(inputPartida, { target: { value: "lavajabon" } });
    server.send(message);
    // Espera a que se actualicen los elementos
    await waitFor(() => {
      const input = screen.getByPlaceholderText("Elige un Nombre");
      fireEvent.change(input, { target: { value: "testUser" } });

      const itemsButton = screen.getAllByRole("button");
      const joinButtons = itemsButton.filter(
        (button) => button.textContent === "UNIRSE"
      );

      expect(joinButtons.length).toBeGreaterThan(0);
      fireEvent.click(joinButtons[0]);
    });

    // Verifica que no se ha navegado a otra ruta
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  it("se filtra correctamente segun numero de jugadores", async () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );

    server.send(message);

    // Filtrar por 3 jugadores
    const button = screen.getByRole("button", { name: "3" });
    fireEvent.click(button);
    // Espera a que se actualicen los elementos
    await waitFor(() => {
      expect(screen.getByText("dragonball")).toBeInTheDocument();
      expect(screen.queryByText("scaloneta")).not.toBeInTheDocument();
      expect(screen.queryByText("lavajabon")).not.toBeInTheDocument();
    });
    // Se deselecciona el filtro
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("dragonball")).toBeInTheDocument();
      expect(screen.getByText("scaloneta")).toBeInTheDocument();
      expect(screen.getByText("lavajabon")).toBeInTheDocument();
    });
  });

  it("debería manejar la desconexión del WebSocket", async () => {
    render(
      <MemoryRouter>
        <UsernameProvider value={mockUsernameContextValue}>
          <UserIdProvider value={mockUserIdContextValue}>
            <ListGames websocketUrl={"ws://localhost:1234"} />
          </UserIdProvider>
        </UsernameProvider>
      </MemoryRouter>
    );

    server.send(message);

    expect(await screen.findByText("dragonball")).toBeInTheDocument();
    expect(await screen.findByText("scaloneta")).toBeInTheDocument();
    expect(await screen.findByText("lavajabon")).toBeInTheDocument();

    server.close();

    expect(screen.queryByText("dragonball")).not.toBeInTheDocument();
    expect(screen.queryByText("scaloneta")).not.toBeInTheDocument();
    expect(screen.queryByText("lavajabon")).not.toBeInTheDocument();

    expect(screen.getByText("Intentando reconectar...")).toBeInTheDocument();
  });
});
