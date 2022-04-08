## 样式方案的意义

### 原生 CSS 开发存在的问题

- **开发体验**欠佳。原生 css 不支持选择器嵌套
- **样式污染**问题，如果出现同样的类名，很容易造成不同的样互相覆盖和污染

```js
// a.css
.container {
  color: red;
}

// b.css
// 很有可能覆盖 a.css 的样式！
.container {
  color: blue;
}
```

- **浏览器兼容问题**为了兼容不同的浏览器，我们需要对一些属性(如 transition)加上不同的浏览器前缀，比如 -webkit-、-moz-、-ms-、-o-，意味着开发者要针对同一个样式属性写很多的冗余代码。
- 打包后的**代码体积问题**

### 解决方案：

- `css预处理器`,主流的包括 Sass/Scss、Less 和 Stylus。解决**原生 CSS 的开发体验**问题
- `css modules`，能将 css 类名处理成 hash 值。，这样就可以避免同名的情况下**样式污染**的问题。
- css 处理器`postCss`，用来解析和处理 css 代码，可以实现的功能非常丰富。px 转换为 rem、根据目标浏览器情况自动加上类似于--moz--、-o-的属性前缀等
- `CSS in JS`主流的包括 emotion、styled-components 等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含 CSS 预处理器和 CSS Modules 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题
- CSS 原子化，如 Tailwind CSS、Windi CSS，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了**原生 CSS 开发体验**的问题。

实战在 Vite 中应用上述常见的 CSS 方案。

## CSS 预处理器

Vite 本身对 css 各种预处理器语言做了内置支持。做了内置支持。也就是说，即使你不经过任何的配置也可以直接使用各种 CSS 预处理器

安装 css 预处理器
`pnpm i sass -D`

然后，在上一节初始化后的项目中新建 src/components/Header 目录，并且分别新建`header.vue` 和 `index.scss`文件，代码如下:

```js
//header.vue
<script lang="ts" setup></script>
<template>
  <p class="header">This is Header</p>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>

// index.scss
.header {
  color: red;
}
```

这样就完成了一个最简单的 demo 组件。接着我们在 App.vue 应用这个组件

![1649388291384](H:\vite\docs\04、css-Engineering.assets\1649388291384.png)

![1649388301116](H:\vite\docs\04、css-Engineering.assets\1649388301116.png)

现在我们封装一个全局的主题色，新建 src/variable.scss 文件，内容如下:

```js
// variable.scss
$theme-color: red;
```

然后，我们在原来 Header 组件的样式中应用这个变量:

```vue
<style lang="scss" scoped>
@import "../../variable.scss";
.header {
  color: $theme-color;
}
</style>
```

回到浏览器访问页面，可以看到样式依然生效。

**重点**
每次要使用$theme-color 属性的时候我们都需要手动引入 variable.scss 文件，那有没有自动引入的方案呢？这就需要在 Vite 中进行一些自定义配置了，在配置文件中增加如下的内容:

```js
// vite.config.ts
import { normalizePath } from "vite";

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));

export default defineConfig({
  // css 相关的配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`,
      },
    },
  },
});
```

现在你可以直接在文件中使用全局文件的变量，相当于之前手动引入的方式显然方便了许多:

```css
.header {
  color: $theme-color;
}
```

## CSS Modules

CSS Modules 在 Vite 也是一个开箱即用的能力，Vite 会对后缀带有.module 的样式文件自动应用 CSS Modules

首先，将 Header 组件中的引入 header.module.scss，然后稍微改动一下 index.tsx 的内容，如下:

```js
// header.module.scss
.header {
  color: green;
}
```

```vue
//header.vue
<script lang="ts" setup>
import style from "./header.module.scss";
console.log(style);
</script>
<template>
  <p :class="style.header">This is Header</p>
</template>

<style lang="scss" scoped></style>
```

![1649399082427](H:\vite\docs\04、css-Engineering.assets\1649399082427.png)

![1649399189095](H:\vite\docs\04、css-Engineering.assets\1649399189095.png)
说明现在 CSS Modules 已经正式生效了！同样的，你也可以在配置文件中的 css.modules 选项来配置 CSS Modules 的功能，

```js
//vite.config.ts

// export default {}
export default defineConfig({
   css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]___[hash:base64:5]"
    },
    preprocessorOptions: {
      // 省略预处理器配置
    }
})
```

此时类名变成自定义类名

![1649400322319](H:\vite\docs\04、css-Engineering.assets\1649400322319.png)

## PostCss

一般通过`postcss.config.js`来配置 postcss，不过在 vite 配置文件中已经提供了 postcss 的配置入口，可以直接在 vite 配置文件中进行操作

首先安装 postcss 插件——`autoprefixer`

`pnpm install autofixer -D`
这个插件主要用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题。接下来让我们在 Vite 中接入这个插件:

```js
export default {
  css: {
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
        }),
      ],
    },
  },
};
```

另外 也可以配置`postcss.config.js`文件，此时只需安装 postcss，然后配置`postcss.config.js`文件即可，不需要在配置 vite 文件

> 注意：在使用 Webpack 时 postcss 配置插件这边可以直接传入字符串，但 Vite 这边不行，通过 require() 导入插件，而不是是直接传字符串：

```js
//postcss.config.js
module.exports = {
  plugins: [
    require("autoprefix")({
      overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
    }),
  ],
};
```

> 由于有 CSS 代码的 AST (抽象语法树)解析能力，PostCSS 可以做的事情非常多，甚至能实现 CSS 预处理器语法和 CSS Modules，社区当中也有不少的 PostCSS 插件，除了刚刚提到的 autoprefixer 插件，常见的插件还包括:

- postcss-pxtorem： 用来将 px 转换为 rem 单位，在适配移动端的场景下很常用。
- postcss-preset-env: 通过它，你可以编写最新的 CSS 语法，不用担心兼容性问题。
- cssnano: 主要用来压缩 CSS 代码，跟常规的代码压缩工具不一样，它能做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。

## CSS In JS

社区中有两款主流的 CSS In JS 方案: `styled-components`和`emotion`。

对于 CSS In JS 方案，在构建侧我们需要考虑`选择器命名问题`、`DCE`(Dead Code Elimination 即无用代码删除)、`代码压缩`、`生成 SourceMap`、`服务端渲染(SSR)`等问题，而`styled-components`和`emotion`已经提供了对应的 babel 插件来解决这些问题，我们在 Vite 中要做的就是集成这些 babel 插件。

> **react 方案** **vue**中`@vitejs/plugin-vue`好像不支持`babel`

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // 加入 babel 插件
        // 以下插件包都需要提前安装
        // 当然，通过这个配置你也可以添加其它的 Babel 插件
        plugins: [
          // 适配 styled-component
          "babel-plugin-styled-components"
          // 适配 emotion
          "@emotion/babel-plugin"
        ]
      },
      // 注意: 对于 emotion，需要单独加上这个配置
      // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
      jsxImportSource: "@emotion/react"
    })
  ]
})
```

## css 原子化框架

- Tailwind CSS
- Windi CSS （原作者已经不开发了，维护者重也不再次 尽量不用了）
  小册没配置，我也不会 css 原子化 所以暂时跳过后面补充
