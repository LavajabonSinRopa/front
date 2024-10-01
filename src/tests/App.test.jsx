import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WS from "jest-websocket-mock";
import App from "../containers/App/App.jsx";

describe("App", () => {
  const server = new WS("ws://localhost:1234", { jsonProtocol: true });

  const message = {
    type: "CreatedGames",
    payload: [
      {
        unique_id: "c1c906df-b66c-44ee-ab45-f900c08bbaa1",
        name: "swicherneta",
        state: "waiting",
        board: null,
        creator: "jose",
        players: ["jose"],
      },
      {
        unique_id: "d0457665-b2dd-4ce2-a189-3ad418930332",
        name: "hola mundo",
        state: "started",
        board: null,
        creator: "francisco",
        players: ["francisco", "ivo"],
      },
      {
        unique_id: "d3945022-b2dd-4ce2-a189-3ad418930332",
        name: "Famaf Es Lo Mas",
        state: "waiting",
        board: null,
        creator: "marti",
        players: ["marti", "franco", "messi"],
      },
    ],
  };
  /*
  it("renderiza la lista de items correctamente", async () => {
    render(<App />);

    server.send(message);

    // ASSERT: TODOS LOS ITEMS DEBEN RENDERIZAR
    //input
    expect(
      screen.getByPlaceholderText(/Ingresa un Nombre/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buscar/i })).toBeInTheDocument();
    //H1s
    const itemsH1 = await screen.findAllByRole("heading", { level: 1 });
    expect(itemsH1).toHaveLength(4);
    //H2s
    const itemsH2 = await screen.findAllByRole("heading", { level: 2 });
    expect(itemsH2).toHaveLength(3);
    //botones
    const itemsButton = await screen.findAllByRole("button");
    const joinButtons = itemsButton.filter(
      (button) => button.textContent === "UNIRSE"
    );
    expect(joinButtons).toHaveLength(3);
    //Titulo
    expect(screen.getByText("Partidas disponibles")).toBeInTheDocument();
    //Partida 1
    expect(screen.getByText("swicherneta")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 1/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: jose")).toBeInTheDocument();
    //Partida 2
    expect(screen.getByText("hola mundo")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 2/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: francisco")).toBeInTheDocument();
    //Partida 3
    expect(screen.getByText("Famaf Es Lo Mas")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 3/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: marti")).toBeInTheDocument();
    //Estado de las partidas
    let estados = screen.getAllByText("Estado: waiting");
    expect(estados).toHaveLength(2);
    estados = screen.getAllByText("Estado: started");
    expect(estados).toHaveLength(1);
  });

  test("los items se filtran correctamente segun el input sin distinguir mayusculas de minusculas", async () => {
    render(<App />);
    // Simula el cambio en el input
    const input = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(input, { target: { value: "SwIcHe" } });

    server.send(message);

    // ASSERT: SOLO LOS ITEM QUE CUMPLEN CON LA BUSQUEDA SE RENDERIZAN
    //input
    expect(
      screen.getByPlaceholderText(/Ingresa un Nombre/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buscar/i })).toBeInTheDocument();
    //H1s
    const itemsH1 = await screen.findAllByRole("heading", { level: 1 });
    expect(itemsH1).toHaveLength(2);
    //H2s
    const itemsH2 = await screen.findAllByRole("heading", { level: 2 });
    expect(itemsH2).toHaveLength(1);
    //botones
    const itemsButton = await screen.findAllByRole("button");
    const joinButtons = itemsButton.filter(
      (button) => button.textContent === "UNIRSE"
    );
    expect(joinButtons).toHaveLength(1);
    //Titulo
    expect(screen.getByText("Partidas disponibles")).toBeInTheDocument();
    //Partida 1
    expect(screen.getByText("swicherneta")).toBeInTheDocument();
    expect(screen.getByText("Cantidad de Jugadores: 1/4")).toBeInTheDocument();
    expect(screen.getByText("Dueño: jose")).toBeInTheDocument();
    //Partida 2
    expect(screen.queryByText("hola mundo")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cantidad de Jugadores: 2/4")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Dueño: francisco")).not.toBeInTheDocument();
    //Partida 3
    expect(screen.queryByText("Famaf Es Lo Mas")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cantidad de Jugadores: 3/4")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Dueño: marti")).not.toBeInTheDocument();
    //Estado de las partidas
    let estados = screen.getAllByText("Estado: waiting");
    expect(estados).toHaveLength(1);
    expect(screen.queryByText("Estado: started")).not.toBeInTheDocument();
  });

  test('muestra "No Hay Más Partidas" solo si está al final del scroll', () => {
    render(<App />);
    server.send(message);

    const container = screen.getByTestId('scrollable-div');

    expect(screen.queryByText(/No Hay Más Partidas/i)).not.toBeInTheDocument();
    // Establecemos el scrollTop directamente
    container.scrollTop = 50;

    // Simulamos el evento de scroll
    fireEvent.scroll(container);
    // Verificamos que el mensaje no se muestra
    expect(screen.queryByText(/No Hay Más Partidas/i)).toBeInTheDocument();
  });
  */
});
