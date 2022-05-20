import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import request from "./utils/request";
import config from "./config";
import storage from "./utils/storage";
import api from "./api/index";
import store from "./store";

const app = createApp(App);

app.directive("has", {
  beforeMount: (el, binding) => {
    console.log(el, binding);
    //获取按钮权限
    let actionList = storage.getItem("actionList");
    let value = binding.value;
    let hasPermission = actionList.includes(value);
    if (!hasPermission) {
      el.style = "display:none";
      setTimeout(() => {
        el.parentNode.removeChild(el);
      }, 0);
    }
  },
});

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(router).use(ElementPlus).use(store).mount("#app");

