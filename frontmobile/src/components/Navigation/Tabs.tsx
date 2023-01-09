import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SideMenu from "./SideMenu";
import SettingsScreen from "../../screens/Settings";
import { Gear, House } from "phosphor-react-native";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/core";

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

function _SideMenu(props: any) {
  return (
    <StackNav.Navigator initialRouteName="SideMenu">
      <StackNav.Screen
        name="SideMenu"
        component={SideMenu}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
    </StackNav.Navigator>
  );
}

export default function BottomTabs() {
  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";
  const nav = useNavigation();
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarActiveTintColor: "#0c35c5" }}>
      <Tab.Screen
        name="Home"
        component={_SideMenu}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            nav.navigate("Home" as never);
          },
        }}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, focused }) => <House color={color} weight={focused ? "fill" : "duotone"} size={25} />,
          headerShown: false,
          tabBarLabelStyle: dark ? { color: "white" } : {},
          tabBarStyle: dark ? { backgroundColor: "#292626" } : { backgroundColor: "white" },
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Config.",
          tabBarLabelStyle: dark ? { color: "white" } : {},
          tabBarIcon: ({ color, focused }) => <Gear color={color} weight={focused ? "fill" : "duotone"} size={25} />,
          headerStyle: { backgroundColor: "#0c35c5" },
          headerTitle: "",
          tabBarStyle: dark ? { backgroundColor: "#292626" } : { backgroundColor: "white" },
        }}
      />
    </Tab.Navigator>
  );
}
