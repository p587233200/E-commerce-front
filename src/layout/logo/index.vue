<template>
  <div class="logo">
    <img :src="setting.logo" alt="logo" v-if="setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from "@/setting";
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    height: 40px;
  }
  p {
    font-size: $base-menu-title-font-size;
    margin-left: 10px;
  }
}
</style>
