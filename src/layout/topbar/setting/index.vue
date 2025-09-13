<template>
  <el-button circle icon="Refresh" @click="updateRefresh"></el-button>
  <el-button circle icon="FullScreen" @click="fullScreen"></el-button>
  <el-button circle icon="Setting"></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; margin: 0px 15px; border-radius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">登出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from "@/store/modules/setting";
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
let $router = useRouter();
let $route = useRoute();
let userStore = useUserStore();
let layoutSettingStore = useLayoutSettingStore();
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};
const fullScreen = () => {
  //DOM對象的一個屬性：可以判斷目前是不是全屏模式[全屏：true,不是全屏null]
  let full = document.fullscreenElement;
  //圈換為全屏模式
  if (!full) {
    //利用文檔的跟節點來reqestFullscreen，實現全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
};
const logout = async () => {
  //1.像server發請求登出
  //2.倉庫相關資料清空
  //3.跳轉頁面
  await userStore.userLogout();
  $router.push({ path: "/login", query: { redirect: $route.path } });
};
</script>

<style scoped></style>
