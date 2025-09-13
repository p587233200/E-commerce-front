// 路由鑑權，項目當中路由在什麼條件下可以訪問，什麼時候不行訪問
import router from "./router";
import setting from "./setting";
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import nprogress from "nprogress";
// 引入進度條的樣式
import "nprogress/nprogress.css";
nprogress.configure({ showSpinner: false });
//獲取user倉庫內部的token，來判斷是否登入
import useUserStore from "./store/modules/user";

import pinia from "./store";
let userStore = useUserStore(pinia);

// 全局守衛：項目當中任意路由的切換都會觸發鉤子，判斷能不能訪問路由
// 全局的前置守衛
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = setting.title + "--" + to.meta.title;
  // to:你將要訪問哪個路由
  // from:你從哪個路由而來
  // next:路由的放行函數
  nprogress.start();
  let token = userStore.token;
  let username = userStore.username;
  if (token) {
    //用戶有登入
    if (to.path == "/login") {
      next({ path: "/" });
    } else {
      //其他路由，登入排除
      if (username) {
        next();
      } else {
        //如果沒有username，在守衛這裡發請求再放行
        try {
          await userStore.userInfo();
          next();
        } catch (error) {
          //token過期 或 用戶手動修改本地存儲token
          await userStore.userLogout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    //用戶沒登入
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }

  //訪問某一個路由之前的守衛
  console.log(11111);
});
// 全局的後置守衛
router.afterEach((to: any, from: any) => {
  nprogress.done();
  console.log(22222);
});

// 1.任意的路由切換實現進度條的業務 --> nprogress
// 2.路由權利（路由組建訪問權限的設定）
// 全部路由組件：登入/404/任意路由/首頁/數據屏/權限管理（三個子路由）/商品管理（四個子路由）

// 用戶沒登入： 可以訪問login，其他路由不行（指向login）
// 用戶登入成功： 不可以放問login (指向首頁)，其餘路由都可以
