<template>
  <div class="topbar">
    <!-- 頂部左側靜態 -->
    <div class="topbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <!-- 頂部右側靜態 -->
    <div class="topbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/layout/topbar/breadcrumb/index.vue";
import Setting from "@/layout/topbar/setting/index.vue";
</script>

<style scoped lang="scss">
.topbar {
  width: 100%;
  height: 100%;
  // background-color: red;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(208, 197, 197),
    rgb(210, 212, 192),
    rgb(224, 207, 207)
  );

  .topbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .topbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
