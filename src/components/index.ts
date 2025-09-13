import SvgIcon from "@/components/SvgIcon/index.vue";
import Category from "@/components/Category/index.vue";

//引入所有element-plus圖標
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import type { App } from "vue";
const allGloablComponents: any = { SvgIcon, Category };
export default {
  install(app: App) {
    Object.keys(allGloablComponents).forEach((key: string) => {
      app.component(key, allGloablComponents[key]);
    });
    //將element-plus圖標註冊為全局組件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
