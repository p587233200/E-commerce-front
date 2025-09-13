import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "@/api/user/type";
import type { UserState } from "./types/type";
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from "@/utils/token";
import { constantRoute } from "@/router/routes";

let useUserStore = defineStore("User", {
  //存數據
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //存儲生成menu需要的數組(路由)
      username: "",
      avatar: "",
    };
  },
  // 存異步/邏輯
  actions: {
    //用戶登入的方法
    async useLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data);
      //登入成功200 token
      //登入失敗201 error訊息
      if (result.code == 200) {
        //pinia存一下token
        //但vuex存數據其實利用js對象
        this.token = result.data as string;
        //本地存儲持久化一份
        SET_TOKEN(result.data as string);
        //可保證當前async函數返回一個成功的promise
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    //獲取用戶資料方法
    async userInfo() {
      //獲得用戶資料存在倉庫中
      let result: userInfoReponseData = await reqUserInfo();
      // console.log(result);
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 登出
    async userLogout() {
      let result: any = await reqLogout();
      if (result.code == 200) {
        this.username = "";
        this.avatar = "";
        this.token = "";
        REMOVE_TOKEN();
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  },
  getters: {},
});

export default useUserStore;
