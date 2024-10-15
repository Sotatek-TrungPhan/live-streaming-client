import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv(
  'mock', 
  process.cwd(),
  '' 
)
const processEnvValues = {
  'process.env': Object.entries(env).reduce(
    (prev, [key, val]) => {
      console.log(key,val)
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
  plugins: [react()],
  server: {
    port: 3000
  },
  define: processEnvValues
})