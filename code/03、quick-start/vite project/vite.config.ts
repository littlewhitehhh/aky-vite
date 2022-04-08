import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; //找不到模块 “path“ 或其相对应的类型声明

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, "src"),
  plugins: [vue()],
});
