
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Solo definimos la variable si existe, de lo contrario será undefined (no el string "undefined")
      'process.env.API_KEY': JSON.stringify(env.API_KEY || (process as any).env.API_KEY || null)
    }
  };
});
