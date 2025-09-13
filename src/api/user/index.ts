import request from "@/utils/request";
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "./type";
enum API {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info",
  LOGOUT_URL = "/user/logout",
}
// 暴露請求函數
// 登入接口方法
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data);
// 獲得用戶資訊方法
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL);
// 登出
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);
