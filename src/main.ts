import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import App from "@/App.vue";

//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
//svg-icons插件
import "virtual:svg-icons-register";
import "@/styles/index.scss"; //全局样式
import router from "./router";
import pinia from "@/store";
import GlobalComponent from "@/components";
import "./permisstion";

//app實例
const app = createApp(App);
//使用ElementPlus
app.use(ElementPlus, {
  locale: zhTw,
});

app.use(GlobalComponent);
app.use(router);
app.use(pinia);
app.mount("#app");
