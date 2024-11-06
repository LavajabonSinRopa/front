import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CrearPartida from "../containers/CrearPartida/CrearPartida";
global.fetch = jest.fn();
import { MemoryRouter, useNavigate } from "react-router-dom";
import { UserIdProvider } from "../contexts/UserIdContext.jsx";

const mockUserIdContextValue = {
  userId: "12345",
  setUserId: jest.fn(), // Función mockeada
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("CrearPartida", () => {
  beforeEach(() => {
    // Limpia los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    // INPUT
    expect(screen.getByText("Nombre de la Partida:")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa un Nombre")
    ).toBeInTheDocument();

    //PASSWORD
    expect(screen.getByText("Contraseña:")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa una Contraseña")
    ).toBeInTheDocument();

    // CARACTERES USADOS
    let caracteresUsados = screen.getAllByText(/Caracteres usados:/i);
    expect(caracteresUsados).toHaveLength(3);

    // BOTON
    const button = screen.getByRole("button", { name: "CREAR PARTIDA" });
    expect(button).toBeInTheDocument();
    // Verificar el estilo y estado del botón
    expect(button).toHaveStyle("background-color: red");
    expect(button).toBeDisabled();

    // Verificar que el mensaje de error no se muestre inicialmente
    expect(
      screen.queryByText("El nombre de la partida no es válido")
    ).not.toBeInTheDocument();
  });

  it("Validacion de nombres correcta", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    const createButton = screen.getByText("CREAR PARTIDA");

    // Caso: Nombre valido
    fireEvent.change(nameInput, { target: { value: "NombreValido" } });
    expect(createButton).not.toBeDisabled();

    // Caso: Nombre solo de espacios
    fireEvent.change(nameInput, { target: { value: "       " } });
    expect(
      screen.getByText("El nombre de la partida no es válido.")
    ).toBeInTheDocument();
    expect(createButton).toBeDisabled();

    // Caso: Nombre demasiado largo
    fireEvent.change(nameInput, {
      target: { value: "EsteNombreTiene38CaracteresYNoEsValido" },
    });
    expect(
      screen.getByText("El nombre de la partida no es válido.")
    ).toBeInTheDocument();
    expect(createButton).toBeDisabled();

    // Caso: Nombre con caracteres no validos
    fireEvent.change(nameInput, { target: { value: "Nombre@Invalido" } });
    expect(
      screen.getByText("El nombre de la partida no es válido.")
    ).toBeInTheDocument();
    expect(createButton).toBeDisabled();

    // Caso: Nombre valido de nuevo
    fireEvent.change(nameInput, { target: { value: "NombreValido2" } });
    expect(createButton).not.toBeDisabled();
    expect(
      screen.queryByText("El nombre de la partida no es válido.")
    ).not.toBeInTheDocument();

    // Caso: Nombre vacio
    fireEvent.change(nameInput, { target: { value: "" } });
    expect(createButton).toBeDisabled();
    expect(
      screen.queryByText("El nombre de la partida no es válido.")
    ).not.toBeInTheDocument();
  });

  it("Creación de partida exitosa sin contraseña", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    const createButton = screen.getByText("CREAR PARTIDA");

    fireEvent.change(nameInput, { target: { value: "PartidaTest" } });

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "Partida creada correctamente" }),
      })
    );

    fireEvent.click(createButton);
    expect(createButton).toBeDisabled();

    await waitFor(() =>
      expect(
        screen.getByText("Creación de partida exitosa.")
      ).toBeInTheDocument()
    );
    expect(createButton).not.toBeDisabled();

    expect(fetch).toHaveBeenCalledWith("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_name: "PartidaTest",
        player_name: "UsernameValido",
        password: "",
      }),
    });

    expect(mockedUsedNavigate).toHaveBeenCalled();
  });

  it("Creación de partida fallida sin contraseña", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });

    const inputNombre = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(inputNombre, { target: { value: "Nombre Valido" } });

    const buttonCrear = screen.getByText("CREAR PARTIDA");
    expect(buttonCrear).not.toBeDisabled();

    fireEvent.click(buttonCrear);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Hubo un problema al crear la partida, intenta de nuevo."
        )
      ).toBeInTheDocument();
    });

    // Verifica que no se ha navegado a otra ruta
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  it("Actualiza el estado de la contraseña correctamente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  it("Creación de partida exitosa con contraseña", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(nameInput, { target: { value: "PartidaTest" } });

    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const createButton = screen.getByText("CREAR PARTIDA");

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ game_id: "game123", player_id: "player123" }),
      })
    );

    fireEvent.click(createButton);

    expect(createButton).toBeDisabled();

    await waitFor(() =>
      expect(
        screen.getByText("Creación de partida exitosa.")
      ).toBeInTheDocument()
    );
    expect(createButton).not.toBeDisabled();

    expect(fetch).toHaveBeenCalledWith("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_name: "PartidaTest",
        player_name: "UsernameValido",
        password: "password123",
      }),
    });

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/games/game123");
  });

  it("Creación de partida exitosa sin contraseña", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(nameInput, { target: { value: "PartidaTest" } });

    const createButton = screen.getByText("CREAR PARTIDA");

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ game_id: "game123", player_id: "player123" }),
      })
    );

    fireEvent.click(createButton);

    expect(createButton).toBeDisabled();

    await waitFor(() =>
      expect(
        screen.getByText("Creación de partida exitosa.")
      ).toBeInTheDocument()
    );
    expect(createButton).not.toBeDisabled();

    expect(fetch).toHaveBeenCalledWith("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_name: "PartidaTest",
        player_name: "UsernameValido",
        password: "",
      }),
    });

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/games/game123");
  });

  it("Muestra mensaje de error y loguea el error en consola cuando la creación de la partida falla", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network Error"))
    );

    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });

    const inputNombre = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(inputNombre, { target: { value: "Nombre Valido" } });

    const buttonCrear = screen.getByText("CREAR PARTIDA");
    expect(buttonCrear).not.toBeDisabled();

    fireEvent.click(buttonCrear);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Hubo un problema al crear la partida, intenta de nuevo."
        )
      ).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error al crear la partida:",
      expect.any(Error)
    );

    expect(mockedUsedNavigate).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("Actualiza el estado de validUsername correctamente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");

    fireEvent.change(usernameInput, { target: { value: "Nombre@Invalido" } });
    expect(
      screen.getByText("El nombre de usuario no es válido.")
    ).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: "NombreValido" } });
    expect(
      screen.queryByText("El nombre de usuario no es válido.")
    ).not.toBeInTheDocument();
  });
  
});
