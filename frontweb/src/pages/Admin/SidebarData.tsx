import { ChartPie, HouseSimple, ListBullets, Money, UsersFour } from "phosphor-react";

export const SidebarData = [

  {
    title: "Home",
    path: "/homeadmin",
    icon: <HouseSimple size={32} color="#2193b1" />,
  },
  {
    title: "Usuarios",
    path: "/users",
    icon: <UsersFour size={32} color="#2193b1" />,
  },
  {
    title: "Categorias",
    path: "/Categories",
    icon: <ListBullets size={32} color="#2193b1" />,
  },
  {
    title: "Editar Publicación",
    path: "/editShoppingPostForAdmin",
    icon: <ListBullets size={32} color="#2193b1" />,
  },
  {
    title: "Cambiar estado de publciación",
    path: "/editstatus",
    icon: <ListBullets size={32} color="#2193b1" />,
  },
  {
    title: "Reportes",
    path: "/Reportes",
    icon: <ChartPie size={32} color="#2193b1" />,
  },


];
