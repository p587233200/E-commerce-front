//定義數據類型state

import type { RouteRecordRaw } from "vue-router";
import type { CategoryObj } from "@/api/product/attr/type";

//定義倉庫數據的state類型
export interface UserState {
  token: string | null;
  menuRoutes: RouteRecordRaw[];
  username: string;
  avatar: string;
}

//定義category倉庫數據的state類型
export interface CategoryState {
  c1Id: string | number;
  c1Arr: CategoryObj[];
  c2Id: string | number;
  c2Arr: CategoryObj[];
  c3Id: string | number;
  c3Arr: CategoryObj[];
}
