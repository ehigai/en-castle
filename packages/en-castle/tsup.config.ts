import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["core/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
});
