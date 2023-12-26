// vite.config.js

import { defineConfig } from 'vite';
import dotenv from 'dotenv';

try {
    dotenv.config({path:"./.env"})
} catch (error) {
    console.log(error);
}

export default defineConfig({
  plugins: [dotenv.config()],
});
