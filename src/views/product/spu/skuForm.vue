<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名稱">
      <el-input placeholder="SKU名稱" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="價格(元)">
      <el-input
        placeholder="價格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平臺屬性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select
            v-model="item.attrIdAndValueId"
            style="width: 150px; margin: 0 5px"
          >
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="銷售屬性">
      <el-form :inline="true">
        <el-form-item
          :label="item.saleAttrName"
          v-for="(item, index) in saleArr"
          :key="item.id"
        >
          <el-select v-model="item.saleIdAndValueId" style="width: 100px">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="圖片名稱">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="圖片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名稱" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)"
              >設定預設</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save" style="width: 100px"
        >保存</el-button
      >
      <el-button type="primary" @click="cancel" style="width: 100px"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入請求 API
import { reqAttr } from "@/api/product/attr";
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from "@/api/product/spu";
import type { SkuData } from "@/api/product/spu/type";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

// 平臺屬性
let attrArr = ref<any>([]);
// 銷售屬性
let saleArr = ref<any>([]);
// 照片的資料
let imgArr = ref<any>([]);
// 取得 table 元件實例
let table = ref<any>();
// 收集 SKU 的參數
let skuParams = reactive<SkuData>({
  // 父元件傳遞過來的資料
  category3Id: "", //三級分類的 ID
  spuId: "", //已有的 SPU 的 ID
  tmId: "", //SPU 品牌的 ID
  // v-model 收集
  skuName: "", //SKU 名稱
  price: "", //SKU 價格
  weight: "", //SKU 重量
  skuDesc: "", //SKU 的描述

  skuAttrValueList: [
    // 平臺屬性的收集
  ],
  skuSaleAttrValueList: [
    // 銷售屬性
  ],
  skuDefaultImg: "", //SKU 圖片地址
});

// 當前子元件的方法對外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 收集資料
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;
  // 取得平臺屬性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
  // 取得對應的銷售屬性
  let result1: any = await reqSpuHasSaleAttr(spu.id);
  // 取得照片牆的資料
  let result2: any = await reqSpuImageList(spu.id);
  // 平臺屬性
  attrArr.value = result.data;
  // 銷售屬性
  saleArr.value = result1.data;
  // 圖片
  imgArr.value = result2.data;
};

// 取消按鈕的回調
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "" });
};

// 設定預設圖片的方法回調
const handler = (row: any) => {
  // 點擊的時候，全部圖片的複選框不勾選
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false);
  });
  // 被選中的圖片才勾選
  table.value.toggleRowSelection(row, true);
  // 收集圖片地址
  skuParams.skuDefaultImg = row.imgUrl;
};

// 對外暴露方法
defineExpose({
  initSkuData,
});

// 保存按鈕的方法
const save = async () => {
  // 整理參數
  // 平臺屬性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(":");
      prev.push({
        attrId,
        valueId,
      });
    }
    return prev;
  }, []);
  // 銷售屬性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(":");
        prev.push({
          saleAttrId,
          saleAttrValueId,
        });
      }
      return prev;
    },
    [],
  );
  // 新增 SKU 的請求
  let result: any = await reqAddSku(skuParams);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "新增 SKU 成功",
    });
    // 通知父元件切換場景為 0
    $emit("changeScene", { flag: 0, params: "" });
  } else {
    ElMessage({
      type: "error",
      message: "新增 SKU 失敗",
    });
  }
};

// 自訂事件的方法
let $emit = defineEmits(["changeScene"]);
</script>

<style scoped></style>
