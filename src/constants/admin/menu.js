const data = [
  {
    id: "home",
    icon: "iconsminds-monitor-analytics",
    label: "BI",
    to: "/admin/dashboard"
  },
  {
    id: "make",
    icon: "simple-icon-note",
    label: "Fazer proposta",
    to: "/admin/make/information"
  },
  {
    id: "sac",
    icon: "iconsminds-headset",
    label: "SAC",
    to: "/admin/sac"
  },
  {
    id: "order",
    icon: "simple-icon-doc",
    label: "Pedidos",
    to: "/admin/order"
  },
  {
    id: "proposal",
    icon: "iconsminds-file-edit",
    label: "Propostas",
    to: "/admin/proposal"
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
    ]
  },
  {
    id: "consults",
    icon: "simple-icon-people",
    label: "Consultores",
    to: "/admin/dashboards",
    subs: [
      {
        icon: "simple-icon-user",
        label: "Ver",
        to: "/admin/consult/view"
      },
      {
        icon: "simple-icon-user",
        label: "Adicionar",
        to: "/admin/consult/new"
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
        icon: "simple-icon-plus",
        label: "Adicionar",
        to: "/admin/user/new"
      },
    ]
  },
  {
    id: "logout",
    icon: "simple-icon-logout",
    label: "Sair",
    to: "/login"
  },
];
export default data;
