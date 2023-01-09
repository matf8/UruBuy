import React from "react";
import { useNavigation } from "@react-navigation/core";
import { logoutUser, removeData } from "../../services/Requests";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); // workaround para el warning en el device de cannot update a component aunque lo hace

export const removeDataStored = async () => {
  await removeData("email");
  await removeData("tokenUser");
  await removeData("username");
  await removeData("userImg");
};

export default function Logout() {
  const nav = useNavigation();
  removeDataStored();
  logoutUser(false); // false porque es un usuario
  nav.navigate("Home" as never);
  return <></>;
}
