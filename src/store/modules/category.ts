//商品分类全局组件的小仓库
import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import type { CategoryResponseData } from "@/api/product/attr/type";
import type { CategoryState } from "./types/type";
const useCategoryStore = defineStore("Category", {
  state: (): CategoryState => {
    return {
      //儲存一級分類的數據
      c1Arr: [],
      //儲存一級分類的ID
      c1Id: "",
      //儲存一級分類下二級分類的數據
      c2Arr: [],
      //儲存二級分類的ID
      c2Id: "",
      //儲存三級分類的數據
      c3Arr: [],
      //儲存三級分類的ID
      c3Id: "",
    };
  },
  actions: {
    //獲取一級分類的方法
    async getC1() {
      const result: CategoryResponseData = await reqC1();
      if (result.code == 200) {
        this.c1Arr = result.data;
      }
    },
    //获取二級分類的方法
    async getC2() {
      //獲取對應一级分類的下二级分類的數據
      const result: CategoryResponseData = await reqC2(this.c1Id);
      if (result.code == 200) {
        this.c2Arr = result.data;
      }
    },
    //獲取三級分類的方法
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id);
      if (result.code == 200) {
        this.c3Arr = result.data;
      }
    },
  },
  getters: {},
});

export default useCategoryStore;
