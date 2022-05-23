import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/components/Home.vue";
import utils from "../utils/utils";
import storage from "@/utils/storage";
import API from "@/api/index";
const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: "/login",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "欢迎体验Vue3全栈课程",
        },
        component: () => import("@/views/Welcome.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/Login.vue"),
  },
  {
    name: "404",
    path: "/404",
    meta: {
      title: "页面不存在",
    },
    component: () => import("@/views/404.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
async function loadAsyncRoutes() {
  let userInfo = storage.getItem("userInfo") || {};
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPerssionList();

      let routes = utils.generateRoute(menuList);
      routes.map((route) => {
        let url = `./../views/${route.component}.vue`;
        route.component = () => import(url);
        router.addRoute("home", route);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
await loadAsyncRoutes();
// 判断
function checkPermission(path) {
  return router.getRoutes().filter((route) => route.path === path).length;
}
//导航守卫
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title;
    next();
  } else {
    next("/404");
  }
});
export default router;
