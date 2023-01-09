import { useKeycloak } from "@react-keycloak/web";
import { SignOut } from "phosphor-react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 3.5rem;
  background-color: #000080;
`;

const ButtonLogout = styled(Link)`
  display: flex;
  justify-content: end;
  font-size: 1.5rem;
  margin-left: 80rem;
  color: #ffffff;
`;

const Sidebar: React.FunctionComponent = () => {
  const { keycloak } = useKeycloak();
  const exit = () => keycloak.logout();

  return (
    <>
      <Navbar>
        <ButtonLogout to="#" onClick={exit}>
          <SignOut size={32} color="#2193b1" /> SALIR
        </ButtonLogout>
      </Navbar>
    </>
  );
};

export default Sidebar;
