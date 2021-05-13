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
        path: "/app/order/selection",
        component: () =>
          import("./views/order/Selection")
      },
      {
        path: "/app/order/distribuidor",
        component: () =>
          import("./views/order/Distribuidor")
      },
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
        path: "/app/order/success",
        component: () =>
          import("./views/order/Success")
      },
      {
        path: "/app/order/approved", // Aprovadas do consultor
        component: () =>
          import("./views/order/Orders")
      },
      {
        path: "/app/order/ariba", // Aprovadas do consultor
        component: () =>
          import("./views/order/Ariba")
      },
      {
        path: "/app/order/proposal", // Pendentes consultor
        component: () =>
          import("./views/order/Orders")
      },
      {
        path: "/app/order/edit/:id", // Editar do consultor
        component: () =>
          import("./views/proposal/Edit")
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
          import("./views/sac/View")
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
        path: "/app/crm",
        component: () =>
          import("./views/crm/Dashboard")
      },
      {
        path: "/app/company/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/app/company/View")
      },
      {
        path: "/app/company/new",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/app/company/New")
      },
      {
        path: "/app/company/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/app/company/Edit")
      },
      {
        path: "/app/company/card/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards"  */ "./views/app/company/CardNew")
          // import(/* webpackChunkName: "dashboards"  */ "./views/Manutencao")
      },
      {
        path: "/logout",
        component: () =>
          import("./views/order/Confirmation")
      },
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
      {
        path: "distribuidor/:hash/:response",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/order/ResponseDistribuidor")
      },
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/politica-seguranca-privacidade",
    component: () => import(/* webpackChunkName: "error" */ "./views/app/politica-seguranca-privacidade")
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
      {
        path: "auto/:hash",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Auto")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password/:hash",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },
      {
        path: "sap-order/:hash",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/sap/Information")
      },
      {
        path: "/sap/products",
        component: () =>
          import("./views/sap/Products")
      },
      {
        path: "/sap/lens",
        component: () =>
          import("./views/sap/Lens")
      },
      {
        path: "/sap/face",
        component: () =>
          import("./views/sap/Face")
      },
      {
        path: "/sap/recipe",
        component: () =>
          import("./views/sap/Recipe")
      },
      {
        path: "/sap/confirmation",
        component: () =>
          import("./views/sap/Confirmation")
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
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/BiTwo")
      },
      {
        path: "/admin/bi",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/Bi")
      },
      {
        path: "/admin/bi/tv",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/BiTv")
      },
      {
        path: "/admin/crm",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/crm/Dashboard")
      },
      {
        path: "/admin/crm/config",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/crm/Config")
      },
      {
        path: "/admin/sac/view",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/sac/Show")
      },
      {
        path: "/admin/sac/view/:id",
        component: () =>
        import(/* webpackChunkName: "dashboards" */ "./views/admin/sac/View")
      },
      {
        path: "/admin/sac/new",
        component: () =>
        import(/* webpackChunkName: "dashboards" */ "./views/sac/New")
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
        path: "/admin/distribuidor/:status",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/distribuidor/View")
      },
      {
        path: "/admin/proposal/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/proposal/Edit")
      },
      {
        path: "/admin/order/measure/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/order/Measure")
      },
      {
        path: "/admin/bi",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/bi/BiTwo")
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
          // import(/* webpackChunkName: "dashboards"  */ "./views/Manutencao")
      },
      {
        path: "/admin/product/edit/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/product/Edit")
      },
      {
        path: "/admin/product/test/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/product/Test")
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
        path: "/admin/company/card/:id",
        component: () =>
          import(/* webpackChunkName: "dashboards" */ "./views/admin/company/CardNew")
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
          import("./views/order/Information")
      },
      {
        path: "/admin/make/products",
        component: () =>
          import("./views/order/Products")
      },
      {
        path: "/admin/make/distribuidor",
        component: () =>
          import("./views/order/Distribuidor")
      },
      {
        path: "/admin/make/lens",
        component: () =>
          import("./views/order/Lens")
      },
      {
        path: "/admin/make/face",
        component: () =>
          import("./views/order/Face")
      },
      {
        path: "/admin/make/recipe",
        component: () =>
          import("./views/order/Recipe")
      },
      {
        path: "/admin/make/confirmation",
        component: () =>
          import("./views/order/Confirmation")
      },
      {
        path: "/admin/make/success",
        component: () =>
          import("./views/order/Success")
      },
      {
        path: "/admin/ariba",
        component: () =>
          import("./views/order/Ariba")
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
