import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CrearPartida from "../containers/CrearPartida/CrearPartida";
global.fetch = jest.fn();
import { MemoryRouter } from "react-router-dom";

describe("CrearPartida", () => {
  /*
  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <MemoryRouter>
        <CrearPartida />
      </MemoryRouter>
    );

    // INPUT
    expect(screen.getByText("Nombre de la Partida:")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa un Nombre")
    ).toBeInTheDocument();

    // PASSWORD
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
        <CrearPartida />
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

  it("Creación de partida exitosa", async () => {
    const mockSendDataToParent = jest.fn();

    render(
      <MemoryRouter>
        <CrearPartida sendDataToParent={mockSendDataToParent} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "UsernameValido" } });

    const nameInput = screen.getByPlaceholderText("Ingresa un Nombre");
    const createButton = screen.getByText("CREAR PARTIDA");

    // Introducir un nombre valido
    fireEvent.change(nameInput, { target: { value: "PartidaTest" } });

    // Mock de la respuesta de la API
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "Partida creada correctamente" }),
      })
    );

    // Hacer clic en el boton de crear partida
    fireEvent.click(createButton);
    // El boton este deshabilitado mientras se esta cargando
    expect(createButton).toBeDisabled();

    // Esperar el mensaje de exito
    await waitFor(() =>
      expect(
        screen.getByText("Creación de partida exitosa.")
      ).toBeInTheDocument()
    );
    expect(createButton).not.toBeDisabled();

    // Verificar que fetch fue llamado con la URL y el metodo correcto
    expect(fetch).toHaveBeenCalledWith("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_name: "PartidaTest",
        player_name: "UsernameValido",
      }),
    });
  });

  it("Creación de partida fallida", async () => {
    // Mock de la respuesta de la API
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const mockSendDataToParent = jest.fn();

    render(
      <MemoryRouter>
        <CrearPartida sendDataToParent={mockSendDataToParent} />
      </MemoryRouter>
    );

    // Escribir un username valido
    const usernameInput = screen.getByPlaceholderText("Elige un Nombre");
    fireEvent.change(usernameInput, { target: { value: "Jugador1" } });

    // Escribir un nombre para la partida valido
    const inputNombre = screen.getByPlaceholderText("Ingresa un Nombre");
    fireEvent.change(inputNombre, { target: { value: "Nombre Valido" } });

    // Asegurarse de que el boton de creacion de partida este habilitado
    const buttonCrear = screen.getByText("CREAR PARTIDA");
    expect(buttonCrear).not.toBeDisabled();

    // Hacer clic en el boton de crear partida
    fireEvent.click(buttonCrear);

    // Esperar que aparezca el mensaje de error
    await waitFor(() => {
      expect(
        screen.getByText(
          "Hubo un problema al crear la partida, intenta de nuevo."
        )
      ).toBeInTheDocument();
    });
  });*/
});
