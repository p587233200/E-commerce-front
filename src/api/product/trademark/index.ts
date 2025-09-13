import request from "@/utils/request";
import type { TradeMark, TradeMarkResponseData } from "./type";

enum API {
  TRADEMARK_URL = "/admin/product/baseTrademark", //獲取已有的品牌
  ADDTRADEMARK_URL = "/admin/product/baseTrademark/save", //添加新的品牌
  UPDATETRADEMARK_URL = "/admin/product/baseTrademark/update", //修改品牌
  DELECTTRADEMARK_URL = "/admin/product/baseTrademark/remove/", //刪除品牌
}

//獲取已有的品牌方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `/${page}/${limit}`,
  );

//新增與修改品牌的方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  //有id，代表是修改品牌
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data);
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data);
  }
};
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELECTTRADEMARK_URL + id);
