import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

export default function Logout() {
  const { keycloak } = useKeycloak();
  const exit = () => keycloak.logout();
  useEffect(() => {
    exit();
  }, []);
  return <></>;
}
