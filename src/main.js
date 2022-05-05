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

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(router).use(ElementPlus).use(store).mount("#app");
