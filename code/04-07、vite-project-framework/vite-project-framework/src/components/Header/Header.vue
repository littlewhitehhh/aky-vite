<script lang="ts" setup>
import style from "./header.module.scss";
console.log(style);
</script>
<template>
  <p :class="style.header">This is Header</p>
</template>

<style lang="scss" scoped>
// @import "../../variable.scss";
// .header {
//   color: $theme-color;
// }
</style>
