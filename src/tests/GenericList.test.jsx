import React from "react";
import { render, screen, waitFor} from "@testing-library/react";
import { GenericList } from "../containers/GenericList/GenericList.jsx";
import "@testing-library/jest-dom";
import WS from "jest-websocket-mock";

describe("GenericList", () => {
  let server;

  beforeEach(() => {
    server = new WS("ws://localhost:1234", { jsonProtocol: true });
  });

  afterEach(() => {
    WS.clean(); // Limpiar los mock de WebSocket después de cada test
  });
/*
  it("renders list items based on WebSocket messages", async () => {
    const mockRenderItem = jest.fn((_, item) => (
      <div key={item.id}>{item.name}</div>
    ));
    const websocketUrl = "ws://localhost:1234";
    const typeKey = "players";

    render(
      <GenericList
        websocketUrl={websocketUrl}
        renderItem={mockRenderItem}
        typeKey={typeKey}
      />
    );
    
    // Esperar a que la conexión WebSocket esté lista
    await server.connected;

    // Simular mensaje desde el WebSocket
    const message = {
      type: typeKey,
      payload: [
        { id: 1, name: "Player 1" },
        { id: 2, name: "Player 2" },
      ],
    };

    server.send(message);

    // Esperar a que los items se rendericen
    await waitFor(() => {
      expect(screen.getByText("Player 1")).toBeInTheDocument();
      expect(screen.getByText("Player 2")).toBeInTheDocument();
    });
  });

  it("filters items correctly based on props", async () => {
    // MOCKEO DE PROPS
    const mockRenderItem = jest.fn((_, item) => <div>{item.name}</div>);
    const websocketUrl = "ws://localhost:1234";
    const typeKey = "testType";
    const filterBy = "category";
    const filterKey = "A";

    render(
      <GenericList
        websocketUrl={websocketUrl}
        renderItem={mockRenderItem}
        typeKey={typeKey}
        filterBy={filterBy}
        filterKey={filterKey}
      />
    );
    await server.connected;

    // SIMULANDO EL MENSAJE DEL WEBSOCKET
    const socket = new WebSocket(websocketUrl);
    const message = {
      type: typeKey,
      payload: [
        { id: 1, name: "Item 1", category: "A" },
        { id: 2, name: "Item 2", category: "B" },
      ],
    };

    server.send(message);

    // ASSERT: SOLO LOS ITEMS QUE CUMPLEN CON EL FILTRO SE DEBEN RENDERISAR
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  it("shows items based on the props 'from' and 'to'", async () => {
    // MOCKEO DE PROPS
    const mockRenderItem = jest.fn((_, item) => <div>{item.name}</div>);
    const websocketUrl = "ws://localhost:1234";
    const typeKey = "testType";

    render(
      <GenericList
        websocketUrl={websocketUrl}
        renderItem={mockRenderItem}
        typeKey={typeKey}
        from={1}
        to={5}
      />
    );
    await server.connected;

    // SIMULANDO EL MENSAJE DEL WEBSOCKET
    const socket = new WebSocket(websocketUrl);
    const message = {
      type: typeKey,
      payload: [
        { id: 1, name: "Item 1", category: "A" },
        { id: 2, name: "Item 2", category: "B" },
        { id: 3, name: "Item 3", category: "C" },
        { id: 4, name: "Item 4", category: "D" },
        { id: 5, name: "Item 5", category: "E" },
        { id: 6, name: "Item 6", category: "F" },
        { id: 7, name: "Item 7", category: "G" },
        { id: 8, name: "Item 8", category: "H" },
      ],
    };

    server.send(message);

    // ASSERT: SOLO LOS ITEMS EN EL RANGO INDICADO SE DEBEN RENDERISAR
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.getByText("Item 5")).toBeInTheDocument();
    expect(screen.queryByText("Item 6")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 7")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 8")).not.toBeInTheDocument();
  });
  */
});
