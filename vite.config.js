import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  publicDir: "imgs",
  base: process.env.NODE_ENV === "production" ? "/TLJ/" : "/",
});
