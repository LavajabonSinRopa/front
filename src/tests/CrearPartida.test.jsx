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

    expect(
      screen.getByPlaceholderText("Nombre de Usuario")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nombre de la Partida")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Contraseña (opcional)")
    ).toBeInTheDocument();

    let caracteresUsados = screen.getAllByText(/Caracteres usados:/i);
    expect(caracteresUsados).toHaveLength(3);

    const button = screen.getByRole("button", { name: "CREAR PARTIDA" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("background-color: red");
    expect(button).toBeDisabled();

    expect(
      screen.queryByText("El nombre de la partida no es válido")
    ).not.toBeInTheDocument();
  });

  it("Validación de nombres y contraseñas correctamente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Nombre de Usuario");
    const nameInput = screen.getByPlaceholderText("Nombre de la Partida");
    const passwordInput = screen.getByPlaceholderText("Contraseña (opcional)");
    const createButton = screen.getByRole("button", { name: "CREAR PARTIDA" });

    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });

    fireEvent.change(usernameInput, { target: { value: "Username@Invalido" } });
    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 17/20");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("red");
    });

    fireEvent.change(nameInput, { target: { value: "Name@Invalido" } });
    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 13/20");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("red");
    });

    fireEvent.change(passwordInput, { target: { value: "@Invalido" } });
    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 9/10");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("red");
    });
  });

  it("Creación de partida exitosa", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Nombre de Usuario");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Nombre de la Partida");
    fireEvent.change(nameInput, { target: { value: "PartidaTest" } });

    const createButton = screen.getByText("CREAR PARTIDA");

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "Partida creada correctamente" }),
      })
    );

    fireEvent.click(createButton);
    expect(createButton).toBeDisabled();

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
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("Creación de partida fallida", async () => {
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

    const usernameInput = screen.getByPlaceholderText("Nombre de Usuario");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });

    const inputNombre = screen.getByPlaceholderText("Nombre de la Partida");
    fireEvent.change(inputNombre, { target: { value: "Nombre Valido" } });

    const buttonCrear = screen.getByText("CREAR PARTIDA");
    expect(buttonCrear).not.toBeDisabled();

    fireEvent.click(buttonCrear);

    waitFor(() => {
      expect(buttonCrear).not.toHaveStyle("background-color: rgb(6, 49, 58)");
    });

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

    const passwordInput = screen.getByPlaceholderText("Contraseña (opcional)");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  it("Actualiza el estado de validUsername correctamente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Nombre de Usuario");

    fireEvent.change(usernameInput, { target: { value: "Nombre@Invalido" } });

    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 15/20");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("red");
    });

    fireEvent.change(usernameInput, { target: { value: "NombreValido" } });

    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 12/20");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("rgb(5, 45, 56)");
    });
  });

  it("setValidName es false cuando el nombre es inválido", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Nombre de la Partida");
    const createButton = screen.getByRole("button", { name: "CREAR PARTIDA" });

    // Test with an empty name
    fireEvent.change(nameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });

    // Test with a name that contains special characters
    fireEvent.change(nameInput, { target: { value: "Nombre@Invalido" } });
    await waitFor(() => {
      const texto = screen.getByText("Caracteres usados: 15/20");
      expect(texto).toBeInTheDocument();

      const style = window.getComputedStyle(texto);

      expect(style.color).toBe("red");
    });

    // Test with a name that is too long
    fireEvent.change(nameInput, { target: { value: "a".repeat(21) } });
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });
  });

  it("Visibilidad de la contraseña", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <CrearPartida />
        </UserIdProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Contraseña (opcional)");
    const togglePasswordButton = screen.queryAllByRole("button");

    fireEvent.click(togglePasswordButton[0]);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(togglePasswordButton[0]);
    expect(passwordInput.type).toBe("password");
  });

  it("Mensaje de error cuando la creación de la partida falla", async () => {
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

    const usernameInput = screen.getByPlaceholderText("Nombre de Usuario");
    const inputNombre = screen.getByPlaceholderText("Nombre de la Partida");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });
    fireEvent.change(inputNombre, { target: { value: "NombreValido" } });

    const buttonCrear = screen.getByRole("button", { name: "CREAR PARTIDA" });
    fireEvent.click(buttonCrear);

    waitFor(() => {
      expect(buttonCrear).not.toHaveStyle("background-color: rgb(6, 49, 58)");
    });

    consoleErrorSpy.mockRestore();
  });
});
