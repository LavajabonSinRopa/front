import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
       // Proxy para redirigir solicitudes a la API
       '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Opcional: cambia la ruta si es necesario
      },
      "/apiWS": {
        target: "ws://127.0.0.1:8000",
        changeOrigin: true,
        ws: true, // Habilitar el soporte para WebSockets
        rewrite: (path) => path.replace(/^\/apiWS/, ""), // Cambia la ruta si es necesario
      },
    },
  },  
});