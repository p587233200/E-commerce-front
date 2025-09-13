<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名稱">
      <el-input
        placeholder="請輸入 SPU 名稱"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="請輸入 SPU 描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU圖片">
      <!-- v-model:fileList -> 展示預設圖片 
                 action: 上傳圖片的接口地址
                 list-type: 檔案列表的型態
            -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="預覽圖片"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU銷售屬性">
      <!-- 展示銷售屬性的下拉選單 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `還未選擇 ${unSelectSaleAttr.length} 個`
            : '無'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        >新增屬性</el-button
      >
      <!-- table 展示銷售屬性與屬性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序號"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="銷售屬性名稱"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="銷售屬性值">
          <!-- row: 即為當前 SPU 已有的銷售屬性物件 -->
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="請輸入屬性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="default"
              icon="Plus"
              style="width: 30px; margin: 0 10px"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              circle
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="large"
        style="width: 50px"
        @click="save"
        >儲存</el-button
      >
      <el-button type="primary" size="large" @click="cancel" style="width: 50px"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { SpuData } from "@/api/product/spu/type";
import { ref, computed } from "vue";
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from "@/api/product/spu";
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from "@/api/product/spu/type";
import { ElMessage } from "element-plus";
let $emit = defineEmits(["changeScene"]);

// 點擊取消按鈕: 通知父元件切換場景為1, 展示已有的SPU的資料
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "update" });
};

// 儲存已有的SPU這些資料
let AllTradeMark = ref<Trademark[]>([]);
// 商品圖片
let imgList = ref<SpuImg[]>([]);
// 已有的SPU銷售屬性
let saleAttr = ref<SaleAttr[]>([]);
// 全部銷售屬性
let allSaleAttr = ref<HasSaleAttr[]>([]);
// 控制對話框的顯示與隱藏
let dialogVisible = ref<boolean>(false);
// 儲存預覽圖片地址
let dialogImageUrl = ref<string>("");

// 儲存已有的SPU物件
let SpuParams = ref<SpuData>({
  category3Id: "", // 收集三級分類的ID
  spuName: "", // SPU的名稱
  description: "", // SPU的描述
  tmId: "", // 品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
});

// 將來收集還未選擇的銷售屬性的ID與屬性值的名稱
let saleAttrIdAndValueName = ref<string>("");

// 子元件方法
const initHasSpuData = async (spu: SpuData) => {
  // 儲存已有的SPU物件, 將來在模板中展示
  SpuParams.value = spu;
  // spu: 即為父元件傳遞過來的已有的SPU物件 [不完整]
  // 獲取全部品牌的資料
  let result: AllTradeMark = await reqAllTradeMark();
  // 獲取某一品牌旗下全部售賣商品的圖片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number);
  // 獲取已有的SPU銷售屬性資料
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number);
  // 獲取整個專案全部SPU的銷售屬性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  // 儲存全部品牌資料
  AllTradeMark.value = result.data;
  // SPU對應商品圖片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  // 儲存已有的SPU的銷售屬性
  saleAttr.value = result2.data;
  // 儲存全部的銷售屬性
  allSaleAttr.value = result3.data;
};

// 照片牆點擊預覽按鈕的時候觸發
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  // 對話框彈出
  dialogVisible.value = true;
};

// 照片牆刪除檔案的回呼
const handleRemove = () => {
  console.log(123);
};

// 照片牆上傳之前的檢查, 約束檔案大小與格式
const handlerUpload = (file: any) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpeg" ||
    file.type == "image/gif"
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上傳檔案必須小於3M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上傳檔案必須為 PNG | JPG | GIF",
    });
    return false;
  }
};

// 計算出當前SPU還未擁有的銷售屬性
let unSelectSaleAttr = computed(() => {
  // 全部銷售屬性: 顏色、版本、尺碼
  // 已有的銷售屬性: 顏色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName;
    });
  });
  return unSelectArr;
});

// 添加銷售屬性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] =
    saleAttrIdAndValueName.value.split(":");
  // 準備一個新的銷售屬性物件: 將來傳給伺服器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  // 追加到陣列
  saleAttr.value.push(newSaleAttr);
  // 清空收集的資料
  saleAttrIdAndValueName.value = "";
};

// 屬性值按鈕的點擊事件
const toEdit = (row: SaleAttr) => {
  // 點擊按鈕的時候, input 元件顯示 -> 編輯模式
  row.flag = true;
  row.saleAttrValue = "";
};

// 表單元素失焦的回呼
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row;
  // 整理成伺服器需要的屬性值格式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  };

  // 非法情況判斷
  if ((saleAttrValue as string).trim() == "") {
    ElMessage({
      type: "error",
      message: "屬性值不能為空",
    });
    return;
  }
  // 判斷屬性值是否已存在於陣列中
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue;
  });

  if (repeat) {
    ElMessage({
      type: "error",
      message: "屬性值重複",
    });
    return;
  }

  // 追加新的屬性值物件
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  // 切換為檢視模式
  row.flag = false;
};

// 保存按鈕的回呼
const save = async () => {
  // 整理參數並發送請求: 添加或更新SPU
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 圖片名稱
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  // 整理銷售屬性資料
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  let result = await reqAddOrUpdateSpu(SpuParams.value);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: SpuParams.value.id ? "更新成功" : "新增成功",
    });
    // 通知父元件切換場景為0
    $emit("changeScene", {
      flag: 0,
      params: SpuParams.value.id ? "update" : "add",
    });
  } else {
    ElMessage({
      type: "error",
      message: "操作失敗",
    });
  }
};

// 添加一個新的SPU初始化請求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空資料
  Object.assign(SpuParams.value, {
    category3Id: "", // 收集三級分類的ID
    spuName: "", // SPU名稱
    description: "", // SPU描述
    tmId: "", // 品牌ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  // 清空照片
  imgList.value = [];
  // 清空銷售屬性
  saleAttr.value = [];
  saleAttrIdAndValueName.value = "";
  // 儲存三級分類ID
  SpuParams.value.category3Id = c3Id;
  // 獲取全部品牌資料
  let result: AllTradeMark = await reqAllTradeMark();
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  // 儲存資料
  AllTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
};

// 對外暴露
defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped></style>
