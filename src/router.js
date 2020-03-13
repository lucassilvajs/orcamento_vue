import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/order/information",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "/order/information",
        component: () => 
          import("./views/order/Information")
      },
      {
        path: "/order/products",
        component: () => 
          import("./views/order/Products")
      },
      {
        path: "/order/lens",
        component: () => 
          import("./views/order/Lens")
      },
      {
        path: "/order/face",
        component: () => 
          import("./views/order/Face")
      },
      {
        path: "/order/recipe",
        component: () => 
          import("./views/order/Recipe")
      },
      {
        path: "/order/confirmation",
        component: () => 
          import("./views/order/Confirmation")
      },
      {
        path: "/order/orders",
        component: () => 
          import("./views/order/Orders")
      },
      {
        path: "/sac",
        component: () => 
          import("./views/sac/Show")
      },
      {
        path: "/sac/view/:id",
        component: () => 
          import("./views/sac/Show")
      },
      {
        path: "/sac/new",
        component: () => 
          import("./views/sac/New")
      },
      {
        path: "/bi/analytics",
        component: () => 
          import("./views/bi/Analytics")
      },
      {
        path: "/logout",
        component: () => 
          import("./views/order/Confirmation")
      }
    ]
  },
  {
    path: "/",
    component: () => import(/* webpackChunkName: "app" */ "./views/proposal"),
    redirect: "/login",
    children: [
      {
        path: "proposta/:hash/:response",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/order/ResponseOrder")
      },
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      // {
      //   path: "register",
      //   component: () =>
      //     import(/* webpackChunkName: "user" */ "./views/user/Register")
      // },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },    
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },
    ]
  },
  {
    path: "/admin",
    component: () => import(/* webpackChunkName: "user" */ "./views/admin"),
    redirect: "/admin/dashboard",
    children: [
      {
        path: "/admin/dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/dashboard/Dashboard")
      },

      {
        path: "/admin/bi",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/Bi")
      },
      {
        path: "/admin/product/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/product/View")
      },
      {
        path: "/admin/product/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/product/New")
      },
      {
        path: "/admin/product/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/product/Edit")
      },
      {
        path: "/admin/employee/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/employee/View")
      },
      {
        path: "/admin/employee/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/employee/New")
      },
      {
        path: "/admin/employee/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/employee/New")
      },
      {
        path: "/admin/company/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/company/View")
      },
      {
        path: "/admin/company/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/company/New")
      },
      {
        path: "/admin/company/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/company/Edit")
      },
      {
        path: "/admin/user/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/user/View")
      },
      {
        path: "/admin/user/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/user/New")
      },
      {
        path: "/admin/user/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/user/New")
      },
      {
        path: "/admin/sac",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/sac/View")
      },
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
