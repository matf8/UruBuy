import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const PrivateRouteSeller = ({ children }: any) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const isSeller = keycloak.hasRealmRole("vendedor");
  const isAuth = keycloak.authenticated;
  return isSeller && isAuth ? children : navigate("/");
};

export default PrivateRouteSeller;
