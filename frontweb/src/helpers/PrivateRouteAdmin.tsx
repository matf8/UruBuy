import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const PrivateRouteAdmin = ({ children }: any) => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const isAdmin = keycloak.hasRealmRole("appAdmin");
    const isAuth = keycloak.authenticated;

    return isAdmin && isAuth ? children : navigate("/");
};

export default PrivateRouteAdmin;