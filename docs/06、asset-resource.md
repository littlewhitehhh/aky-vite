# 静态资源处理

## 图片加载

### 使用场景

- 在 HTML 或者 JSX 中，通过 img 标签来加载图片，如:

```html
<img src="../../assets/a.png"></img>
```

- 在 css 中通过 background 属性加载图片

```css
background: url("../../assets/b.png") norepeat;
```

- 在 JavaScript 中，通过脚本的方式动态指定图片的 src 属性

```js
document.getElementById("hero-img").src = "../../assets/c.png";
```

当然，大家一般还会有别名路径的需求，比如地址前缀直接换成`@assets`，这样就不用开发人员手动寻址，降低开发时的心智负担。

## 在 vite 中使用

```js
//vite.config.ts

export default defineConfig({
  resolve: {
    //别名配置
    alias: {
      "@/assets": path.join(__dirname, "src/assets"),
    },
  },
});
```

导入

```vue
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import style from "./header.module.scss";
import imgSrc from "../../assets/imgs/vite.png";

const oImg = ref<any>(null);
// const oImg = ref<HTMLElement | null>(null);
console.log(style);
console.log(oImg);
onMounted(() => {
  console.log(oImg.value);
  oImg.value.src = imgSrc;
});
</script>
<template>
  <div :class="style.header">
    <p>This is Header</p>
    <img :src="imgSrc" alt="" />
    <img class="image" ref="oImg" alt="" />
  </div>
</template>

<style lang="scss" scoped></style>
```

添加背景图片

```css
//header.module.scss
.header {
  // 前面的样式代码省略
  background: url("@assets/imgs/background.png") no-repeat;
}
```

## SVG 组件加载方式

刚才我们成功地在 Vite 中实现了图片的加载，上述这些加载的方式对于 svg 格式来说依然是适用的。不过，我们通常也希望能将 svg 当做一个组件来引入，这样我们可以很方便地修改 svg 的各种属性，而且比 img 标签的引入方式更加优雅。

SVG 组件加载在不同的前端框架中的实现不太相同，社区中也已经了有了对应的插件支持:

- Vue2 项目中可以使用 vite-plugin-vue2-svg 插件。
- Vue3 项目中可以引入 vite-svg-loader。

安装`pnpm ivite-svg-loader -D`

配置 vite.config.ts

```js
import svgLoader from "vite-svg-loader";

{
  plugins: [
    //其他插件
    svgLoader(),
  ];
}
```

随后注意要在 tsconfig.json 添加如下配置，否则会有类型错误:

```js
{
  "compilerOptions": {
    // 省略其它配置
    "types": ["vite-plugin-svgr/client"]
  }
}
```

## JSON 加载

Vite 中已经内置了对于 JSON 文件的解析，底层使用@rollup/pluginutils 的 dataToEsm 方法将 JSON 对象转换为一个包含各种具名导出的 ES 模块，使用姿势如下:

```js
import { version } from "../../../package.json";
```

不过你也可以在配置文件禁用按名导入的方式:

```js
// vite.config.ts

{
  json: {
    stringify: true;
  }
}
```

这样会将 JSON 的内容解析为 export default JSON.parse("xxx")，这样会失去按名导出的能力，不过在 JSON 数据量比较大的时候，可以优化解析性能。

## Web Worker 脚本

Vite 中使用 Web Worker 也非常简单，我们可以在新建 Header/example.js 文件:

```js
const start = () => {
  let count = 0;
  setInterval(() => {
    // 给主线程传值
    postMessage(++count);
  }, 2000);
};

start();
```

然后在 Header 组件中引入，引入的时候注意加上`?worker`后缀，相当于告诉 Vite 这是一个 Web Worker 脚本文件:

```
import Worker from './example.js?worker';
// 1. 初始化 Worker 实例
const worker = new Worker();
// 2. 主线程监听 worker 的信息
worker.addEventListener('message', (e) => {
  console.log(e);
});
```

## Web Assembly 文件

Vite 对于 .wasm 文件也提供了开箱即用的支持，我们拿一个斐波拉契的 .wasm 文件(原文件已经放到 Github 仓库中)来进行一下实际操作，对应的 JavaScript 原文件如下:

```js
export function fib(n) {
  var a = 0,
    b = 1;
  if (n > 0) {
    while (--n) {
      let t = a + b;
      a = b;
      b = t;
    }
    return b;
  }
  return a;
}
```

让我们在组件中导入 fib.wasm 文件:

```vue
// Header/header.vue import init from './fib.wasm'; type FibFunc = (num: number) => number; init({}).then((exports) => {
const fibFunc = exports.fib as FibFunc; console.log('Fib result:', fibFunc(10)); });
```

![1649641353359](H:\vite\docs\06、asset-resource.assets\1649641353359.png)

## 其他静态资源

除了上述的一些资源格式，Vite 也对下面几类格式提供了内置的支持:.

- 媒体类文字，包括`mp4`、`webm`、`ogg`、`mp3`、`wav`、`flac`、`aac`
- 字体类文件，包括`woff`、`woff2`、`eot`、`ttf`、`otf`
- 文本类，包括`webmanifest`、`pdf`、`txt`

也就是说，你可以在 Vite 将这些类型的文件当做一个 ES 模块来导入使用。如果你的项目中还存在其它格式的静态资源，你可以通过 assetsInclude 配置让 Vite 来支持加载:

```js
// vite.config.ts
{
  assetsInclude: [".gltf"];
}
```

## 特殊资源后缀

Vite 中引入静态资源时，也支持在路径最后加上一些特殊的 query 后缀，包括: -`?url`: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用

- `raw`:表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀
- `?inline`: 表示资源强制内联，而不是打包成单独的文件

## 生产环境处理

- 部署域名配置
- 资源打包成单文件或作为 base64 格式内联？
- 图片太大压缩？
- svg 请求数量太多怎么优化

### 自定义部署域名

一般在我们访问线上的站点时，站点里面一些静态资源的地址都包含了相应域名的前缀，如：

```html
<img src="https://sanyuan.cos.ap-beijing.myqcloud.com/logo.png" />
```

以上面这个地址例子，https://sanyuan.cos.ap-beijing.myqcloud.com是 CDN 地址前缀，/logo.png 则是我们开发阶段使用的路径。那么，我们是不是需要在上线前把图片先上传到 CDN，然后将代码中的地址手动替换成线上地址呢？这样就太麻烦了！

在 Vite 中我们可以有更加自动化的方式来实现地址的替换，只需要在配置文件中指定 base 参数即可:

```js
// vite.config.ts
// 是否为生产环境，在生产环境下一定会注入 NODE_ENV 这个环境变量，
const isProduction = process.env.NODE_ENV === "production";
// 填入项目的 CDN 域名地址
const CDN_URL = "XXXXXX";

//具体配置

{
  base: isProduction ? CDN_URL : "/";
}
```

```
//// .env.development
NODE_ENV=development
```

```

// .env.production
NODE_ENV=production
```

### 内联？ 单文件

对于比较小的资源，适合内联到代码中，一方面对代码体积的影响很小，另一方面可以减少不必要的网络请求，优化网络性能。而对于比较大的资源，就推荐单独打包成一个文件，而不是内联了，否则可能导致上 MB 的 base64 字符串内嵌到代码中，导致代码体积瞬间庞大，页面加载性能直线下降。

vite 中

- 如果静态资源体积 >= 4KB，则提取成单独的文件
- 如果静态资源体积 < 4KB，则作为 base64 格式的字符串内联

```js
// vite.config.ts
{
  build: {
    //8kb
    assetsInlineLimit: 8 * 1024;
  }
}
```

> svg 格式的文件不受这个临时值的影响，始终会打包成单独的文件，因为它和普通格式的图片不一样，需要动态设置一些属性

### 图片压缩

webpack image-webpack-loade

vite vite-plugin-imagemin

`pnpm i vite-plugin-imagemin -D`

```js
//vite.config.ts
import viteImagemin from "vite-plugin-imagemin";

{
  plugins: [
    // 忽略前面的插件
    viteImagemin({
      // 无损压缩配置，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7,
      },
      // 有损压缩配置，有损压缩下图片质量可能会变差
      pngquant: {
        quality: [0.8, 0.9],
      },
      // svg 优化
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ];
}
```
