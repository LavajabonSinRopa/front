import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import WebSocketExample from './contexts/WebSocketExample'; 
//import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Aplicación WebSocket</h1>
        <WebSocketExample /> {/* Incluye el componente de ejemplo WebSocket */}
      </div>
    </>
  )
}

export default App