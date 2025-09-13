<template>
  <div class="layout_container">
    <!-- 左側菜單 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 滾動組件 -->
      <el-scrollbar class="scrollbar" background-color="#001529">
        <!-- :default-active頁面載入時預設啟動功能表的index -->
        <!-- router  是否啟用 vue-router 模式。 啟用此模式會在啟動導航時以 index 作為 path 進行路由跳轉 使用 default-active 來設定載入時的啟動項目。 -->
        <el-menu
          :default-active="$route.path"
          router
          :collapse="LayoutSettingStore.fold"
        >
          <Menu :menuList="userStore.menuRoutes"> </Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 頂部導航 -->
    <div class="layout_topbar" :class="{ fold: LayoutSettingStore.fold }">
      <Topbar></Topbar>
    </div>
    <!-- 內容展示區域 -->
    <div class="layout_main" :class="{ fold: LayoutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from "@/layout/logo/index.vue";
import Menu from "@/layout/menu/index.vue";
import Topbar from "@/layout/topbar/index.vue";
import Main from "@/layout/main/index.vue";
import useUserStore from "@/store/modules/user";
import useLayoutSettingStore from "@/store/modules/setting";

let LayoutSettingStore = useLayoutSettingStore();
let userStore = useUserStore();
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_topbar {
    width: calc(100% - $base-menu-width);
    height: $base-topbar-height;
    color: black;
    position: fixed;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-topbar-height);
    background-color: bisque;
    left: $base-menu-width;
    top: $base-topbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
