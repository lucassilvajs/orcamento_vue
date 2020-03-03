const data = [
  {
    id: "home",
    icon: "simple-icon-home",
    label: "Dashboard",
    to: "/admin/dashboard"
  },
  {
    id: "product",
    icon: "simple-icon-eyeglass",
    label: "Produtos",
    to: "/admin/dashboards",
    subs: [
      {
        icon: "iconsminds-tag",
        label: "Ver produtos",
        to: "/admin/product/view"
      },
      {
        icon: "simple-icon-plus",
        label: "Adicionar",
        to: "/admin/product/new"
      },
    ]
  },
  {
    id: "employees",
    icon: "simple-icon-people",
    label: "Colaboradores",
    to: "/admin/dashboards",
    subs: [
      {
        icon: "simple-icon-user",
        label: "Ver",
        to: "/admin/employee/view"
      },
      {
        icon: "iconsminds-add-user",
        label: "Adicionar",
        to: "/admin/employee/new"
      },
    ]
  },
  {
    id: "company",
    icon: "iconsminds-empire-state-building",
    label: "Empresas",
    to: "/admin/dashboards",
    subs: [
      {
        icon: "iconsminds-building",
        label: "Ver",
        to: "/admin/company/view"
      },
      {
        icon: "iconsminds-add-user",
        label: "Adicionar",
        to: "/admin/company/new"
      },
    ]
  },
  {
    id: "user",
    icon: "iconsminds-administrator",
    label: "Usuários",
    to: "/admin/dashboards",
    subs: [
      {
        icon: "simple-icon-user",
        label: "Ver",
        to: "/admin/user/view"
      },
      {
        icon: "iconsminds-add-user",
        label: "Adicionar",
        to: "/admin/user/new"
      },
    ]
  },
  {
    id: "bi",
    icon: "iconsminds-monitor-analytics",
    label: "BI",
    to: "/admin/bi"
  },
];
export default data;
