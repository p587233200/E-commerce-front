<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一級分類">
        <!-- change:選中值發生變化時觸發 -->
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
          style="width: 120px"
        >
          <!-- label:即為展示資料 value:即為select下拉選單收集的資料 -->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二級分類">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
          style="width: 120px"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三級分類">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
          style="width: 120px"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入組件掛載完畢方法
import { onMounted } from "vue";
// 引入分類相關的倉庫
import useCategoryStore from "@/store/modules/category";
let categoryStore = useCategoryStore();

// 分類全域組件掛載完畢，通知倉庫發請求獲取一級分類的資料
onMounted(() => {
  categoryStore.getC1();
});

// 此方法即為一級分類下拉選單的 change 事件（選中值的時候會觸發，保證一級分類 ID 有了）
const handler = () => {
  // 需要將二級、三級分類的資料清空
  categoryStore.c2Id = "";
  categoryStore.c3Arr = [];
  categoryStore.c3Id = "";
  // 通知倉庫獲取二級分類的資料
  categoryStore.getC2();
};

// 此方法即為二級分類下拉選單的 change 事件（選中值的時候會觸發，保證二級分類 ID 有了）
const handler1 = () => {
  // 清理三級分類的資料
  categoryStore.c3Id = "";
  categoryStore.getC3();
};

// 接收父組件傳遞過來的 scene
defineProps(["scene"]);

import { ref } from "vue";

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
</script>

<style scoped></style>
