import React from "react";
import Navbar from "../../../components/Navbar/NavbarUrubuy";
import { useKeycloak } from "@react-keycloak/web";

import NavbarUrubuy from "../../../components/Navbar/NavbarUrubuy";
import DrawerSeller from "./DrawerSeller";

function DashboardSeller() {

    return (
        <>
            <DrawerSeller />

        </>
    )
}

export default DashboardSeller