## 项目初始化

`pnpm create vite`

- 输入项目名称
- 选择前端框架
- 选择开发语言

`cd vite project`
`pnpm install`
`pnpm run dev`

`vite`项目中，一个`import语句即代表一个HTTP请求`

```js
import { createApp } from "vue";
import App from "./App.vue";
```

上述两个语句则分别代表了两个不同的请求，Vite Dev Server 会读取本地文件，返回浏览器可以解析的代码。当浏览器解析到新的 import 语句，又会发出新的请求，以此类推，直到所有的资源都加载完成。

**no-bundle**:**利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**整体打包在进行加载**。相比 Webpack 这种必须打包在加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个重要原因。

## 初始配置文件

vite 配置两种方式：

- 通过命令行参数，如`vite --port=8888`
- 通过配置文件

### 配置文件

vite 支持多种配置文件类型，包括`.js`、`.ts`、`.mjs（Node.js应用程序的ES模块（ECMAScript模块）的文件）`

```js
//vite.config.ts

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
});
```

可以看到配置文件中默认在 plugins 数组中配置了官方的 vue 插件，来提供 vue 项目编译和热更新的功能。

需求：页面入口文件`index.html`并不在项目根目录中，而需要放置到`src`目录下，如何访问到`localhost:3000`的时候让 Vite 自动返回`src`目录下的`index.html`文件？

```js
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 手动指定项目根目录位置
  root: path.join(__dirname, 'src')
  plugins: [react()]
})
```

**踩坑记录：找不到模块“path”或其相应的类型声明**

**修复：安装@types/node**，node 类型文件
`pnpm install @types/node --save`

![1649383361957](H:\vite\docs\03、quick-start.assets\1649383361957.png)

**修复： 在 tsconfig.node.json 添加 compilerOptions 对象属性添加 "allowSyntheticDefaultImports": true 即可**

## 生产环境构建

开发阶段，vite 通过 Dev Server 实现了不打包的特性

生产阶段，vite 依然会基于 rollup 进行打包，并采取一系列的打包优化手段

`package.json`

```js
"scripts": {
  // 开发阶段启动 Vite Dev Server
  "dev": "vite",
  // 生产环境打包
  "build": "vue-tsc --noEmit && vite build",
  // 生产环境打包完预览产物
  "preview": "vite preview"
},
```

为什么在 vite build 命令执行之前要先执行 vue-tsc 呢？

`vue-tsc`作为 TypeScript 的官方编译命令，可以用来编译 TypeScript 代码并进行类型检查，而这里的作用主要是用来做类型检查，我们可以从项目的 tsconfig.json 中注意到这样一个配置:

```js
{
   "compilerOptions": {
    // 省略其他配置
    // 1. noEmit 表示只做类型检查，而不会输出产物文件
    // 2. 这行配置与 tsc --noEmit 命令等效
    "noEmit": true,
  },
}
```

**踩坑记录**：**"build": "vue-tsc --noEmit && vite build"报错**
**修复**：**删除 --noEmit 或者添加 --skipLibCheck**
`"build": "vue-tsc --noEmit --skipLibCheck && vite build",`

虽然 Vite 提供了开箱即用的 TypeScript 以及 JSX 的编译能力，但实际上底层并没有实现 TypeScript 的类型校验系统，因此需要借助 tsc 来完成类型校验(在 Vue 项目中使用 vue-tsc 这个工具来完成)，在打包前提早暴露出类型相关的问题，保证代码的健壮性。
