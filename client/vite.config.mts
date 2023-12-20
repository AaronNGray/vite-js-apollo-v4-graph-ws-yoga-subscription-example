import fs from 'node:fs';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
//    port: 80,

    port: 443,
    https: {
      key: fs.readFileSync('./certs/privkey.pem'),
      cert: fs.readFileSync('./certs/fullchain.pem')
    },

    proxy: {
      "/graphql": {
        target: "http://localhost:8000",
        rewrite: (path) => {
          console.log("rewrite: ", path);
          return path;
        }
      },
      "/graphql": {
        target: "http://localhost:8000",
        ws: true,
        rewrite: (path) => {
          console.log("rewrite: ", path);
          return path;
        }
      }
    }
  }
})
