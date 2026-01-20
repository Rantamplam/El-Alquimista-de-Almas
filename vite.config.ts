
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del sistema y archivos .env
  // Se utiliza (process as any).cwd() para evitar errores de tipado donde 'process' no tiene definida la propiedad 'cwd' en ciertos contextos de TypeScript.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Forzamos la disponibilidad de la clave en el cliente
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    }
  };
});
