import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
});
