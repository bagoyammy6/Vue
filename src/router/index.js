import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/findbike",
    name: "findbike",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/FindBike.vue"),
  },
  {
    path: "/findroad",
    name: "findroad",
    component: () => import("../views/FindRoad.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/errorPage.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

// GitHub Pages 沒有 SPA fallback，用 history 模式時重新整理 /Vue/findbike 會 404，
// 所以改用 hash 模式 (網址會變成 /Vue/#/findbike)。
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
