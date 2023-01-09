import { useKeycloak } from "@react-keycloak/web";
import { DotsThreeCircle, SignOut, X } from "phosphor-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SidebarData } from "./SidebarData";

const Navbar = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 3.5rem;
  background-color: #000080;
`;

const MenuIconOpen = styled(Link)`
  display: flex;
  justify-content: start;
  font-size: 1.5rem;
  margin-left: 2rem;
  color: #ffffff;
`;

const ButtonLogout = styled(Link)`
  display: flex;
  justify-content: end;
  font-size: 1.5rem;
  margin-left: 80rem;
  color: #ffffff;
`;

const MenuIconClose = styled(Link)`
  display: flex;
  justify-content: end;
  font-size: 1.5rem;
  margin-top: 0.75rem;
  margin-right: 1rem;
  color: #ffffff;
`;

const SidebarMenu = styled.div<{ close: boolean }>`
  width: 250px;
  height: 100vh;
  background-color: #000080;
  position: fixed;
  top: 0;
  left: ${({ close }: any) => (close ? "0" : "-100%")};
  transition: 0.6s;
`;

const MenuItems = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 90px;
  padding: 1rem 0 1.25rem;
`;

const MenuItemLinks = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 2rem;
  font-size: 15px;
  text-decoration: none;
  color: #ffffff;

  &:hover {
    background-color: #ffffff;
    color: #000080;
    width: 100%;
    height: 45px;
  }
`;

const Sidebar: React.FunctionComponent = () => {
  const [close, setClose] = useState(false);
  const showSidebar = () => setClose(!close);
  const sell = () => window.location.replace("/sell");
  const { keycloak } = useKeycloak();
  const exit = () => keycloak.logout();
  return (
    <div>
      <Navbar>
        <MenuIconOpen to="#" onClick={showSidebar}>
          <DotsThreeCircle size={32} color="#2193b1" />
        </MenuIconOpen>
        <ButtonLogout to="#" onClick={exit}>
          <SignOut size={32} color="#2193b1" /> SALIR
        </ButtonLogout>
      </Navbar>

      <SidebarMenu close={close}>
        <MenuIconClose to="#" onClick={showSidebar}>
          <X size={32} color="#2193b1" />{" "}
        </MenuIconClose>
        {SidebarData &&
          SidebarData.map((item, index) => {
            return (
              <MenuItems key={index}>
                <MenuItemLinks to={item.path}>
                  {item.icon}
                  <span style={{ marginLeft: "16px" }}>{item.title}</span>
                </MenuItemLinks>
              </MenuItems>
            );
          })}
      </SidebarMenu>
    </div>
  );
};

export default Sidebar;
