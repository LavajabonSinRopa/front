import React, { useState } from "react";
import "./App.css";
import { GenericList } from "./GenericList";

// Ejemplo de render para GenericList
const renderItem = (item) => (
  <div>
    <div key={item.id}>
      <h1>{item.id + ") Title: " + item.title}</h1>
      <h2>{"UserId: " + item.userId}</h2>
      <p>{item.completed.toString()}</p>
      <button>Click Me</button>
    </div>
  </div>
);

function App() {

  return (
    <div>
      <h1>Aplicación WebSocket</h1>
      <GenericList
        apiEndpoint="https://jsonplaceholder.typicode.com/todos"
        from={0}
        to={10}
        websocketUrl="ws://localhost:3000/"
        renderItem={renderItem}
      />
    </div>
  );
}

export default App;
