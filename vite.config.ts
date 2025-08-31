import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(async () => {
  const plugins = [react()];

  if (process.env.ANALYZE === "1") {
    try {
      const { visualizer } = await import("rollup-plugin-visualizer");
      plugins.push(
        visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          open: false
        })
      );
    } catch {
      console.warn("[analyze] 'rollup-plugin-visualizer' nicht installiert. Optional: npm i -D rollup-plugin-visualizer");
    }
  }

  return {
    plugins,
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") }
    }
  };
});
