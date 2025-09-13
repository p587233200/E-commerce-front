<template>
  <div>
    <!-- 三級分類全域元件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >新增屬性</el-button
        >
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序號"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="屬性名稱"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="屬性值名稱">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row：已有的屬性物件 -->
            <template #="{ row, $index }">
              <!-- 修改已有屬性的按鈕 -->
              <el-button
                type="primary"
                circle
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你確定要刪除 ${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="danger" circle icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示新增屬性與修改資料的結構 -->
        <el-form :inline="true">
          <el-form-item label="屬性名稱">
            <el-input
              placeholder="請輸入屬性名稱"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          >新增屬性值</el-button
        >
        <el-button type="primary" size="default" @click="cancel"
          >取消</el-button
        >
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序號"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="屬性值名稱">
            <!-- row: 即為當前屬性值物件 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="請輸入屬性值名稱"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="屬性值操作">
            <template #="{ row, index }">
              <el-button
                type="danger"
                circle
                icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          >儲存</el-button
        >
        <el-button type="primary" size="default" @click="cancel"
          >取消</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//組合式 API
import { watch, ref, reactive, nextTick, onBeforeUnmount } from "vue";
//引入 API
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from "@/api/product/attr";
import type {
  AttrResponseData,
  Attr,
  AttrValue,
} from "@/api/product/attr/type";
//引入分類倉庫
import useCategoryStore from "@/store/modules/category";
import { ElMessage } from "element-plus";
let categoryStore = useCategoryStore();

//存放已有屬性與屬性值
let attrArr = ref<Attr[]>([]);

//切換場景：0 表格，1 新增或修改屬性
let scene = ref<number>(0);

//收集新增的屬性資料
let attrParams = reactive<Attr>({
  attrName: "",
  attrValueList: [],
  categoryId: "", // 三級分類的ＩＤ
  categoryLevel: 3, // 代表的是三級分類
});

//存放 el-input 元件實例
let inputArr = ref<any>([]);

//監聽三級分類 ID 變化
watch(
  () => categoryStore.c3Id,
  () => {
    attrArr.value = [];
    if (!categoryStore.c3Id) return;
    getAttr();
  },
);

//獲取已有屬性與屬性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
};

//新增屬性
const addAttr = () => {
  Object.assign(attrParams, {
    attrName: "",
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  });
  scene.value = 1;
};

//修改屬性
const updateAttr = (row: Attr) => {
  scene.value = 1;
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
};

//取消
const cancel = () => {
  scene.value = 0;
};

//新增屬性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: "",
    flag: true,
  });
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  });
};

//儲存
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams);
  if (result.code == 200) {
    scene.value = 0;
    ElMessage({
      type: "success",
      message: attrParams.id ? "修改成功" : "新增成功",
    });
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: attrParams.id ? "修改失敗" : "新增失敗",
    });
  }
};

//屬性值失去焦點
const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName.trim() == "") {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: "error",
      message: "屬性值不能為空",
    });
    return;
  }
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });

  if (repeat) {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: "error",
      message: "屬性值不能重複",
    });
    return;
  }
  row.flag = false;
};

//點擊進入編輯模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true;
  nextTick(() => {
    inputArr.value[$index].focus();
  });
};

//刪除屬性
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "刪除成功",
    });
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: "刪除失敗",
    });
  }
};

//路由銷毀時清空倉庫
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped></style>
