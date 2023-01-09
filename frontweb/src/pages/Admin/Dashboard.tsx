import React from "react";
import Navbar from "../../components/Navbar/NavbarUrubuy";
import { useKeycloak } from "@react-keycloak/web";

import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import DrawerAdmin from "./DrawerAdmin";

function Dashboard() {
    const { keycloak } = useKeycloak();



    return (
        <>
            <DrawerAdmin />

        </>
    )
}

export default Dashboard