import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const PrivateRouteUser = ({ children }: any) => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const isAuth = keycloak.authenticated;


    return isAuth ? children : navigate("/");
};

export default PrivateRouteUser;