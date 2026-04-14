import { defineConfig } from "oxlint";

import core from "ultracite/oxlint/core";
import vitest from "ultracite/oxlint/vitest";
import jest from "ultracite/oxlint/jest";

export default defineConfig({
  extends: [
    core,
    // vitest,
    jest,
  ],
  ignorePatterns: ["dist/**/*", "coverage/**/*", "build/**/*"],
});
