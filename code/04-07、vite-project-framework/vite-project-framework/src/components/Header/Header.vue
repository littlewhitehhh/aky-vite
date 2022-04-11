<script lang="ts" setup>
import { ref, onMounted } from "vue";
import style from "./header.module.scss";
import imgSrc from "../../assets/imgs/vite.png";
import logoIcon from "../../assets/icons/logo.svg";

import JSON from "../../../package.json";

import Worker from "./example.ts?worker";

import init from "./fib.wasm";

type FibFunc = (num: number) => number;

init({}).then((exports) => {
  const fibFunc = exports.fib as FibFunc;
  console.log("Fib result:", fibFunc(10));
});

//初始化web worker
const worker = new Worker();
// 2. 主线程监听 worker 的信息
worker.addEventListener("message", (e) => {
  console.log(e);
});

console.log(JSON);

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

    <!-- <img :src=`${new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href`} alt=""> -->
  </div>
  <logoIcon />
</template>

<style lang="scss" scoped>
// @import "../../variable.scss";
// .header {
//   color: $theme-color;
// }
</style>
