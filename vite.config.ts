import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/anomal-warp-suite/",
  },

  tanstackStart: {
    server: { entry: "server" },
  },
});
