const data = [
  {
    id: "home",
    icon: "iconsminds-monitor-analytics",
    label: "BI",
    to: "https://idsafety.com.br/bi/bi/bi.html",
    newWindow: true,
  },
  // {
  //   id: "crm",
  //   icon: "simple-icon-graph",
  //   label: "CRM",
  //   subs: [
  //     {
  //       icon: "iconsminds-management",
  //       label: "Dashboard",
  //       to: "/admin/crm"
  //     },
  //     {
  //       icon: "simple-icon-settings",
  //       label: "Configurações",
  //       to: "/admin/crm/config"
  //     },

  //   ]
  // },
  {
    id: "crm",
    icon: "simple-icon-graph",
    label: "CRM",
    to: "/admin/crm"
  },
  {
    id: "make",
    icon: "simple-icon-note",
    label: "Fazer proposta",
    to: "/admin/make/information"
  },
  {
    id: "orders",
    icon: "iconsminds-shopping-cart",
    label: "Vendas",
    to: "/app/app/dashboards",
    subs: [
      {
        subs: [
          {
            icon: "iconsminds-paper",
            label: "Pedidos",
            to: "/admin/order"
          },
          {
            icon: "simple-icon-note",
            label: "Propostas",
            to: "/admin/proposal"
          },
        ],
        label: "Cliente convencional",
      },
      {
        subs: [
          {
            icon: "iconsminds-paper",
            label: "Pedidos",
            to: "/admin/distribuidor/order"
          },
          {
            icon: "simple-icon-note",
            label: "Propostas",
            to: "/admin/distribuidor/proposal"
          },
        ],
        icon: "simple-icon-pie-chart",
        label: "Distribuidor",
        to: "/app/app/dashboards/analytics"
      },
    ]
  },
  {
    id: "sac",
    icon: "iconsminds-headset",
    label: "SAC",
    to: "/admin/sac"
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
        icon: "iconsminds-add",
        label: "Adicionar produto",
        to: "/admin/product/new"
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
      {
        icon: "iconsminds-add",
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
