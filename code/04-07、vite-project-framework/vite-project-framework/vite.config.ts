import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { normalizePath } from "vite";
import autoprefixer from "autoprefixer";

// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));
console.log(variablePath);

const variable = path.resolve(__dirname, "./src/variable.scss");
console.log(variable);

// https://vitejs.dev/config/

// 原来这里可以直接使用export default啊 export default{}
export default defineConfig({
  //css相关配置
  css: {
    preprocessorOptions: {
      scss: {
        //additionalData 的内容会在每个scss文件的开头被引入
        additionalData: `@import"${variablePath}";`,
      },
    },
    modules: {
      //一般我们可以通过generateScopeName属性对生效的类名进行自定义
      //其中name表示当前文件名，loacl表示类名
      // '_header_4cstn_1'--->'header-module_header_f-oMp'
      generateScopedName: "[name]_[local]_[hash:base64:5]",
    },
    postcss: {
      plugins: [
        autoprefixer({
          //指定浏览器
          overrideBrowserslist: ["Chrome >40", "ff>31", "ie 11"],
        }),
      ],
    },
  },
  plugins: [vue()],
});
