import React from "react";
import Navigation from "./src/Navigation";
import { MenuProvider } from "react-native-popup-menu";
import { getAdminToken } from "./src/services/Requests";

export default function App() {
  getAdminToken();
  return (
    <>
      <MenuProvider>
        <Navigation />
      </MenuProvider>
    </>
  );
}
