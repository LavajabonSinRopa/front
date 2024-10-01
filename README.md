## Estructura del componente `GameLobby`

### `components/`

* **`Archivos index.jsx en general`**: Exportan el componente principal de la carpeta en la que están para que sean más prolijos los import en otros componentes.
* **`Archivos .css en general`**: Estilos.

* **`GameLobby/`**
    * `GameLobby.jsx`: 
        * Renderiza `GameInfo`, `PlayerList` y `GameButtons` (condicionalmente).
        * Maneja la lógica general del lobby.

    * **`PlayerList/`**
        * `PlayerItem.jsx`: Muestra el nombre de cada jugador, destacando si el jugador es el "owner" de la partida.
        * `PlayerList.jsx`: 
            * Reutiliza el componente genérico para listar jugadores.
            * Resalta al owner de la partida.
            * Usa PlayerItem para renderizar cada jugador

    * **`GameInfo/`**
        * Muestra el nombre y tipo de la partida. Recibe estos datos desde GameLobbyContainer.

    * **`GameButtons/`**
        * Muestra el botón "Iniciar Partida" si el usuario es el owner.
        * Muestra el botón "Abandonar Partida" o "Cancelar Partida" según corresponda.
        * Maneja los clics en los botones y llama a `gameService`.

### `containers/`

* **`GameLobbyContainer`**
    * Se conecta al WebSocket para recibir actualizaciones.
    * Obtiene los datos iniciales de la partida de la API.
    * Pasa los datos a los componentes del lobby.
    * Actualiza el estado cuando recibe notificaciones por WebSocket.

### `services/`

* `gameService.js`: Contiene las funciones para llamar a los endpoints de la API para abandonar/cancelar/iniciar la partida.