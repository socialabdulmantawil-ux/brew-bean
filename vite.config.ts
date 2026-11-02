import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: '/brew-bean/',
    server: {
      port: Number(env.VITE_PORT || 5173),
      proxy: {
        '/api': `http://localhost:${env.API_PORT || '3001'}`,
      },
    },
  };
});
