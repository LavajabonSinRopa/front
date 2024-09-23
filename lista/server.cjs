const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });


server.on("connection", (ws) => {
  console.log("Cliente conectado");

  //TESTS
  // Iniciar el envío de mensajes al cliente
  // Crea item ID=11
  setTimeout(() => {
    const message = {
      type: "new_item",
      data: {id: 11, title: "Nuevo Elemento", userId: "Descripción del nuevo elemento", completed: true},};
    ws.send(JSON.stringify(message));
  }, 3000);

  // Borrar item ID=11
  setTimeout(() => {
    const message = {type: "remove_item", data: {id: 1}};
    ws.send(JSON.stringify(message));
  }, 6000);

  // Crea item ID=1
  setTimeout(() => {
    const message = {
      type: "new_item",
      data: {id: 1, title: "Nuevo Elemento", userId: "Descripción del nuevo elemento", completed: true},};
    ws.send(JSON.stringify(message));
  }, 9000);

  // Crea item ID=1 para testear repetidos
  setTimeout(() => {
    const message = {
      type: "new_item",
      data: {id: 1, title: "Nuevo Elemento", userId: "Descripción del nuevo elemento", completed: true},};
    ws.send(JSON.stringify(message));
  }, 12000);

  // Crea item ID=12
  setTimeout(() => {
    const message = {
      type: "new_item",
      data: {id: 12, title: "Nuevo Elemento", userId: "Descripción del nuevo elemento", completed: true},};
    ws.send(JSON.stringify(message));
  }, 15000);

//--------------------------------------------------------------------


  ws.on("message", (message) => {
    console.log("Mensaje recibido:", message);
    ws.send(`Mensaje recibido: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("Servidor WebSocket escuchando en ws://localhost:3000");
