import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./components/Navigation/Tabs";

export default function Navigation() {
  return (
    <>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </>
  );
}
