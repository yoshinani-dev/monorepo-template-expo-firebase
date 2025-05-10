import react from "@vitejs/plugin-react"
import { defineProject } from "vitest/config"

export default defineProject({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: ["**/*.{ts,tsx}"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
})
