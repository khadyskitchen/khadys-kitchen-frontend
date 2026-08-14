import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Resolves the `@/` alias from tsconfig.json (no manual moduleNameMapper).
  plugins: [tsconfigPaths()],
  // esbuild handles the automatic JSX runtime - no babel/react plugin needed.
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    // The fail-fast env module (src/lib/env.ts) throws at import without this,
    // so anything importing the store/api-slice needs a stub origin.
    env: {
      NEXT_PUBLIC_SERVER_URI: "http://localhost:9999",
    },
  },
});
