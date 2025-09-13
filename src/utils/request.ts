//進行axios二次封裝：使用請求與響應攔截器
import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
//step1 利用axios對象的create方法，取撞見axios實例（其他的配置：基礎路徑,超時的時間）

let request = axios.create({
  baseURL: import.meta.env.VITE_SERVER + import.meta.env.VITE_APP_BASE_API, //基礎路徑
  timeout: 5000, //超時時間
});
//step2 request實例添加請求攔截器
request.interceptors.request.use((config) => {
  //從倉庫內拿出內部token，登入成功以後攜帶給服務器
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  //在發送請求之前做一些事情
  return config;
});

//step3 request實例添加響應攔截器
request.interceptors.response.use(
  (response) => {
    //對響應數據進行處理
    return response.data;
  },
  (error) => {
    //對響應錯誤做一些事情
    let message = "";
    let status = error.response.status;
    switch (status) {
      case 400:
        message = "請求錯誤(400)";
        break;
      case 401:
        message = "token失效,請重新登錄(401)";
        break;
      case 403:
        message = "拒絕訪問(403)";
        break;
      case 404:
        message = "請求地址出錯(404)";
        break;
      case 408:
        message = "請求超時(408)";
        break;
      case 500:
        message = "服務器錯誤(500)";
        break;
      default:
        message = `連接錯誤(${status})!`;
    }
    ElMessage({
      type: "error",
      message: message,
    });

    return Promise.reject(error);
  },
);

//step4 將request實例導出
export default request;
