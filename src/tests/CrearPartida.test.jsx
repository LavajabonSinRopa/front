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

    expect(screen.getByText("Nombre de la Partida:")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa un Nombre")
    ).toBeInTheDocument();
    expect(screen.getByText("Contraseña:")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa una Contraseña")
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

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const createButton = screen.getByRole("button", { name: "CREAR PARTIDA" });

    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });

    fireEvent.change(usernameInput, { target: { value: "Username@Invalido" } });
    await waitFor(() => {
      expect(
        screen.getByText("Solo se permiten letras y números!")
      ).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });
    await waitFor(() => {
      expect(
        screen.queryByText("Solo se permiten letras y números!")
      ).not.toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    fireEvent.change(nameInput, { target: { value: "NombreValido" } });
    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
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

    await waitFor(() => {
      expect(
        screen.getByText("Solo se permiten letras y números!")
      ).toBeInTheDocument();
    });

    fireEvent.change(usernameInput, { target: { value: "NombreValido" } });

    await waitFor(() => {
      expect(
        screen.queryByText("Solo se permiten letras y números!")
      ).not.toBeInTheDocument();
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

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    const createButton = screen.getByRole("button", { name: "CREAR PARTIDA" });

    // Test with an empty name
    fireEvent.change(nameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });

    // Test with a name that contains special characters
    fireEvent.change(nameInput, { target: { value: "Nombre@Invalido" } });
    await waitFor(() => {
      expect(
        screen.getByText("Solo se permiten letras y números!")
      ).toBeInTheDocument();
      expect(createButton).toBeDisabled();
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

    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const togglePasswordButton = screen.getByRole("button", {
      name: "Mostrar",
    });

    fireEvent.click(togglePasswordButton);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(togglePasswordButton);
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

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    const inputNombre = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });
    fireEvent.change(inputNombre, { target: { value: "NombreValido" } });

    const buttonCrear = screen.getByRole("button", { name: "CREAR PARTIDA" });
    fireEvent.click(buttonCrear);

    await waitFor(() => {
      expect(
        screen.getByText(
          (content, element) =>
            element.tagName.toLowerCase() === "p" &&
            content.includes(
              "Hubo un problema al crear la partida, intenta de nuevo."
            )
        )
      ).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error al crear la partida:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
