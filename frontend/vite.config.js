import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // TAMBAHKAN BAGIAN 'server' INI
  server: {
    proxy: {
      // String '/api' akan diteruskan ke target
      '/api': {
        target: 'http://localhost:5000', // Alamat backend Anda
        changeOrigin: true,
        secure: false,      
      }
    }
  }
  // AKHIR BAGIAN TAMBAHAN

});