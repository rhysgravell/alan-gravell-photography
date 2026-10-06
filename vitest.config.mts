import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Only server code is tested so far, so there's no DOM to set up.
    environment: "node",
  },
});
