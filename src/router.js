import Vue from "vue";
import store from "@/store/store";
import VueRouter from "vue-router";
import Login from "./components/auth/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter(to, from, next) {
      if (store.state.auth.token) {
        next(false);
      } else {
        next();
      }
    }
  },
  {
    path: "/",
    name: "dashboard",
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (dashboard.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "./components/Dashboard")
  },
  {
    path: "/protected",
    name: "protected",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "./components/Protected")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
