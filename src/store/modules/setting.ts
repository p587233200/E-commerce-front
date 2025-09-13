import { defineStore } from "pinia";

const useLayoutSettingStore = defineStore("Settingstore", {
  state: () => {
    return {
      fold: false, //用戶控制menu是否折疊
      refresh: false, //用於控制刷新效果
    };
  },
  actions: {},
  getters: {},
});

export default useLayoutSettingStore;
