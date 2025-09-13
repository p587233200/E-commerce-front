<template>
  <div>
    <!-- 三級分類 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <!-- v-if|v-show:都可以實現顯示與隱藏 -->
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >新增SPU</el-button
        >
        <!-- 展示已有SPU資料 -->
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序號"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名稱" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row: 即為已有的SPU物件 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                circle
                icon="Plus"
                title="新增SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                circle
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                circle
                icon="View"
                title="查看SKU清單"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你確定要刪除 ${row.spuName}？`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    circle
                    icon="Delete"
                    title="刪除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分頁器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        ></el-pagination>
      </div>
      <!-- 新增SPU | 修改SPU子元件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 新增SKU的子元件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog對話框: 展示已有的SKU資料 -->
      <el-dialog v-model="show" title="SKU清單">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名稱" prop="skuName"></el-table-column>
          <el-table-column label="SKU價格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU圖片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SkuInfoData,
  SkuData,
} from "@/api/product/spu/type";
import { ref, watch, onBeforeUnmount } from "vue";
import { reqHasSpu, reqSkuList, reqRemoveSpu } from "@/api/product/spu/index";
// 引入分類的倉庫
import useCategoryStore from "@/store/modules/category";
import type { SpuData } from "@/api/product/spu/type";
import SpuForm from "./spuForm.vue";
import SkuForm from "./skuForm.vue";
import { ElMessage } from "element-plus";

let categoryStore = useCategoryStore();
// 場景的資料
let scene = ref<number>(0); // 0: 顯示已有 SPU  1: 新增或修改 SPU  2: 新增 SKU
// 分頁器預設頁碼
let pageNo = ref<number>(1);
// 每一頁展示的資料筆數
let pageSize = ref<number>(3);
// 儲存已有的 SPU 資料
let records = ref<Records>([]);
// 儲存已有 SPU 的總數
let total = ref<number>(0);
// 取得子元件 SpuForm
let spu = ref<any>();
// 取得子元件 SkuForm
let sku = ref<any>();
// 儲存全部的 SKU 資料
let skuArr = ref<SkuData[]>([]);
// 是否顯示對話框
let show = ref<boolean>(false);

// 監聽三級分類 ID 變化
watch(
  () => categoryStore.c3Id,
  () => {
    // 當三級分類發生變化時，清空對應的資料
    records.value = [];
    // 必須保證有三級分類 ID
    if (!categoryStore.c3Id) return;
    getHasSpu();
  },
);

// 取得某一個三級分類下的全部 SPU
const getHasSpu = async (pager = 1) => {
  // 修改當前頁碼
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  );
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
};

// 分頁器下拉選單變化時觸發
const changeSize = () => {
  getHasSpu();
};

// 點擊「新增 SPU」按鈕
const addSpu = () => {
  // 切換為場景 1: 新增或修改 SPU -> SpuForm
  scene.value = 1;
  // 調用子元件方法初始化資料
  spu.value.initAddSpu(categoryStore.c3Id);
};

// 點擊「修改 SPU」按鈕
const updateSpu = (row: SpuData) => {
  // 切換為場景 1: 新增或修改 SPU -> SpuForm
  scene.value = 1;
  // 調用子元件方法取得完整的 SPU 資料
  spu.value.initHasSpuData(row);
};

// 子元件 SpuForm 綁定自定義事件，通知父元件切換場景
const changeScene = (obj: any) => {
  // 取消返回場景 0: 顯示已有的 SPU
  scene.value = obj.flag;
  if (obj.params == "update") {
    // 更新後留在當前頁
    getHasSpu(pageNo.value);
  } else {
    // 新增後返回第一頁
    getHasSpu();
  }
};

// 點擊「新增 SKU」按鈕
const addSku = (row: SpuData) => {
  // 切換為場景 2: 新增 SKU
  scene.value = 2;
  // 調用子元件方法初始化新增 SKU 的資料
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};

// 查看 SKU 列表
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number);
  if (result.code == 200) {
    skuArr.value = result.data;
    // 顯示對話框
    show.value = true;
  }
};

// 刪除 SPU
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "刪除成功",
    });
    // 更新剩餘的 SPU 資料
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: "error",
      message: "刪除失敗",
    });
  }
};

// 路由元件銷毀前，清空分類倉庫的資料
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped></style>
