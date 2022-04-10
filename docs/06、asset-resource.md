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

export default defineConfig({});
```
