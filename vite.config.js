import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',  // Allow access from any IP address (including Docker containers)
        port: 8001,
    },
    plugins: [react()],
})