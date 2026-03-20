import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ADD THIS RESOLVE BLOCK:
  resolve: {
    dedupe: [
      'react', 
      'react-dom', 
      'three', 
      '@react-three/fiber', 
      '@react-three/drei', 
      '@react-three/xr'
    ]
  }
})
