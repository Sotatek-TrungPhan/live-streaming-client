import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

const env = loadEnv(
  'mock', 
  process.cwd(),
  '' 
)
const processEnvValues = {
  'process.env': Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      }
    },
    {},
  )
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3000,
  },
  define: processEnvValues
})