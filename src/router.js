import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";
import AuthRequiredAdmin from "./utils/AuthRequiredAdmin";

Vue.use(VueRouter);

const routes = [
  {
    path: "/app",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/app/order/information",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "/app/order/information",
        component: () =>
          import("./views/order/Information")
      },
      {
        path: "/app/order/products",
        component: () =>
          import("./views/order/Products")
      },
      {
        path: "/app/order/lens",
        component: () =>
          import("./views/order/Lens")
      },
      {
        path: "/app/order/face",
        component: () =>
          import("./views/order/Face")
      },
      {
        path: "/app/order/recipe",
        component: () =>
          import("./views/order/Recipe")
      },
      {
        path: "/app/order/confirmation",
        component: () =>
          import("./views/order/Confirmation")
      },
      {
        path: "/app/order/approved", // Aprovadas do consultor
        component: () =>
          import("./views/order/Orders")
      },
      {
        path: "/app/order/proposal", // Pendentes consultor
        component: () =>
          import("./views/order/Orders")
      },
      {
        path: "/app/order/orders", // Todas do cliente
        component: () =>
          import("./views/order/Orders")
      },
      {
        path: "/app/sac",
        component: () =>
          import("./views/sac/Show")
      },
      {
        path: "/app/sac/view/:id",
        component: () =>
          import("./views/sac/Show")
      },
      {
        path: "/app/sac/new",
        component: () =>
          import("./views/sac/New")
      },
      {
        path: "/app/bi/analytics",
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
    beforeEnter: AuthRequiredAdmin,
    children: [
      {
        path: "/admin/dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/Bi")
      },
      {
        path: "/admin/sac",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/sac/View")
      },
      {
        path: "/admin/sac/:id",
        component: () =>
        import(/* webpackChunkName: "dashboards" */ "./views/admin/sac/View")
      },
      {
        path: "/admin/order",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/order/View")
      },
      {
        path: "/admin/proposal",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/proposal/View")
      },
      {
        path: "/admin/order/measure/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/order/Measure")
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
        path: "/admin/consult/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/consult/View")
      },
      {
        path: "/admin/consult/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/consult/New")
      },
      {
        path: "/admin/consult/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/consult/Edit")
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
          import(/* webpackChunkName: "dashboards" */ "./views/admin/user/Edit")
      },
      {
        path: "/admin/make/information",
        component: () =>
          import("./views/admin/make/Information")
      },
      {
        path: "/admin/make/products",
        component: () =>
          import("./views/admin/make/Products")
      },
      {
        path: "/admin/make/lens",
        component: () =>
          import("./views/admin/make/Lens")
      },
      {
        path: "/admin/make/face",
        component: () =>
          import("./views/admin/make/Face")
      },
      {
        path: "/admin/make/recipe",
        component: () =>
          import("./views/admin/make/Recipe")
      },
      {
        path: "/admin/make/confirmation",
        component: () =>
          import("./views/admin/make/Confirmation")
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
