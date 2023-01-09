import { ChartPie, HouseLine, HouseSimple, Money, Pencil, Queue, SignOut, Suitcase } from "phosphor-react";

export const SidebarData = [
  {
    title: "Mi perfil",
    path: "/profile",
    icon: <HouseSimple size={32} color="#2193b1" />,
  },
  {
    title: "Tienda",
    path: "/",
    icon: <HouseLine size={32} color="#2193b1" />,
  },
  {
    title: "Ventas",
    path: "/mySells",
    icon: <Money size={32} color="#2193b1" />,
  },
  {
    title: "Publicar",
    path: "/sell",
    icon: <Pencil size={32} color="#2193b1" weight="fill" />,
  },
  {
    title: "Publicaciones",
    path: "/myshopingposts",
    icon: <Suitcase size={32} color="#2193b1" weight="fill" />,
  },
  {
    title: "Editar estado de publicación",
    path: "/editstatusseller",
    icon: <Queue size={32} color="#2193b1" weight="fill" />,
  },
];
