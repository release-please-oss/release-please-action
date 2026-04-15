import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "src",
    clearMocks: true,
    coverage: {
      provider: "v8",
      include: ["**/*.ts"],
      exclude: ["**/*.d.ts"],
      reportsDirectory: "../coverage",
    },
  },
});
