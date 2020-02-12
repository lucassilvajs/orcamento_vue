const data = [
{
  id: "order",
  icon: "simple-icon-doc",
  label: "Solicitar",
  to: "/order",
  subs: false
},
{
  id: "history",
  icon: "simple-icon-clock",
  label: "Histórico",
  to: "/order"
},
{
  id: "dashboards",
  icon: "iconsminds-shop-4",
  label: "menu.dashboards",
  to: "/app/dashboards",
  subs: [{
    icon: "simple-icon-briefcase",
    label: "menu.default",
    to: "/app/dashboards/default"
  },
    {
      icon: "simple-icon-pie-chart",
      label: "menu.analytics",
      to: "/app/dashboards/analytics"
    },
    {
      icon: "simple-icon-basket-loaded",
      label: "menu.ecommerce",
      to: "/app/dashboards/ecommerce"
    },
    {
      icon: "simple-icon-doc",
      label: "menu.content",
      to: "/app/dashboards/content"
    }
  ]
},
{
  id: "docs",
  icon: "iconsminds-library",
  label: "menu.docs",
  to: "https://piaf-vue-docs.coloredstrategies.com/",
  newWindow: true
}
];
export default data;
