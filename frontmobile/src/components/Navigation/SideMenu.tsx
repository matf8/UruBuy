import React, { useState } from "react";
import { Alert, View, Text, TouchableOpacity, Platform } from "react-native";
import Notification from "../../screens/customer/Notification";
import ShoppingPost from "../../screens/ShoppingPost";
import _ShoppingCart from "../../screens/customer/ShoppingCart";
import Home from "../../screens/Home";
import Login from "../../screens/Login";
import SignUp from "../../screens/SignUp";
import LogoutScreen from "../../screens/customer/Logout";
import Help from "../../screens/Help";
import Profile from "../../screens/customer/Profile";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { getData, getUserCart, removeData } from "../../services/Requests";
import { deleteUserCart } from "../../screens/customer/ShoppingCart";
import Purchase from "../../screens/customer/Purchase";
import Review from "../../screens/customer/Review";
import {
  House,
  ShoppingCart,
  SignIn,
  At,
  User,
  SignOut,
  Info,
  ArrowLeft,
  Trash,
  Heart,
  PlusCircle,
  Star,
} from "phosphor-react-native";
import UserProfile from "../../screens/UserProfile";
import { useColorScheme } from "nativewind";
import PrivacyPolicy from "../Help/PrivacyPolicy";
import Likes from "../../screens/customer/Likes";
import GiveReview from "../../screens/customer/GiveReview";
import CheckoutScreen from "../../screens/customer/Checkout";
import Addresses from "../../screens/customer/Addresses";
import SellerReview from "../../screens/SellerReviews";
import ProductReviews from "../../screens/ProductReviews";
import FAQ from "../Help/FAQ";
import { ImageActiveUser } from "./ImageActiveUser";

const Drawer = createDrawerNavigator();

const getUserActive = async () => {
  return await getData("email");
};

const getUsernameActive = async () => {
  return await getData("username");
};

const handlePressCart = async (nav: any, cartCounter: number) => {
  if (cartCounter === 0) Alert.alert("No hay productos :(");
  else nav.navigate("ShoppingCart");
};

const deleteCart = async (nav: any) => {
  await deleteUserCart(nav);
  Alert.alert("Carrito limpio");
};

const deleteLikes = async (nav: any) => {
  await removeData("likes");
  nav.navigate("Home" as never);
  Alert.alert("Favoritos eliminados");
};

const handleDeleteCart = async (nav: any) => {
  Alert.alert("¿Estás seguro de eliminar el carrito?", "", [
    {
      text: "Cancelar",
      style: "cancel",
    },
    {
      text: "Eliminar",
      style: "destructive",
      onPress: () => deleteCart(nav),
    },
  ]);
};

export default function SideMenu() {
  const [user, setUser] = useState("");
  const [cartCounter, setCounter] = useState(0);
  const [username, setUsername] = useState("");
  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";

  getUsernameActive().then((res) => setUsername(res as string));
  getUserActive().then((res) => setUser(res as string));
  getUserCart()
    .then((res) => {
      if (res?.status === 200) {
        let k = Object.keys(res.data.shoppingPosts);
        setCounter(k.length);
      }
    })
    .catch((err) => {
      console.log(err);
      setCounter(0);
    });

  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={({ navigation }) => ({
        drawerStyle: dark ? { backgroundColor: "#292626" } : { backgroundColor: "white" },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerTintColor: "#fff",
          title: "Inicio",
          headerTitle: "Inicio",
          headerTitleAlign: "center",
          drawerLabelStyle: dark ? { color: "white" } : null,
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerIcon: ({ focused }) => (
            <House size={22} weight={focused ? "fill" : "duotone"} color={focused ? "#0c35c5" : "grey"} />
          ),
          headerLeft: () => <ImageActiveUser onPress={navigation.toggleDrawer} />,
          /*header carrito */
          headerRight: (focus) => (
            <View className="flex-row items-center justify-center">
              {user ? (
                <TouchableOpacity onPress={() => handlePressCart(navigation, cartCounter)}>
                  <ShoppingCart size={24} style={{ marginEnd: 15 }} color={focus ? "#fff" : "grey"} />
                </TouchableOpacity>
              ) : null}
              {user && cartCounter > 0 ? (
                <View className="bg-[#ff1717] items-center justify-center rounded-3xl h-[17] w-[17] absolute right-[8] top-[-10]">
                  <Text
                    className={
                      Platform.OS === "android"
                        ? "text-[#ffffff] text-[14px] bottom-[1.8px]"
                        : "items-center justify-center text-[#ffffff] text-[14px]"
                    }
                  >
                    {cartCounter}
                  </Text>
                </View>
              ) : null}
            </View>
          ),
        })}
      />
      {user === "" || user === undefined ? (
        <>
          <Drawer.Screen
            name="Login"
            component={Login}
            options={({ navigation }) => ({
              headerLeft: () => <ImageActiveUser onPress={navigation.toggleDrawer} />,
              headerTintColor: "#fff",
              title: "Iniciar sesión",
              headerTitle: "Ingresar",
              drawerLabelStyle: dark ? { color: "white" } : null,
              headerStyle: {
                backgroundColor: "#0c35c5",
              },
              headerTitleAlign: "center",
              drawerIcon: ({ focused, size }) => (
                <SignIn size={size} weight={focused ? "fill" : "duotone"} color={focused ? "#0c35c5" : "grey"} />
              ),
            })}
          />

          <Drawer.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerTintColor: "#fff",
              headerTitle: "Registro",
              title: "Registrarme",
              drawerLabelStyle: dark ? { color: "white" } : null,
              headerStyle: {
                backgroundColor: "#0c35c5",
              },
              drawerIcon: ({ focused }) => (
                <At size={20} weight={focused ? "fill" : "duotone"} color={focused ? "#0c35c5" : "grey"} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="Perfil"
            component={Profile}
            options={{
              headerTintColor: "#fff",
              headerTitle: username,
              headerTitleAlign: "center",
              drawerLabelStyle: dark ? { color: "white" } : null,
              headerStyle: {
                backgroundColor: "#0c35c5",
              },
              drawerIcon: ({ focused }) => <User size={24} color={focused ? "#0c35c5" : "grey"} />,
            }}
          />

          <Drawer.Screen
            name="Cerrar sesión"
            component={LogoutScreen}
            options={{
              drawerLabelStyle: dark ? { color: "white" } : null,
              drawerIcon: ({ focused }) => (
                <SignOut size={20} weight={focused ? "fill" : "duotone"} color={focused ? "#0c35c5" : "grey"} />
              ),
            }}
          />
        </>
      )}
      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          headerTintColor: "#fff",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerLabelStyle: dark ? { color: "white" } : null,
          drawerIcon: ({ focused }) => (
            <Info size={20} weight={focused ? "fill" : "duotone"} color={focused ? "#0c35c5" : "grey"} />
          ),
        }}
      />

      <Drawer.Screen
        name="Notification"
        options={{
          headerTitle: "",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
        }}
      >
        {(props) => <Notification {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Purchases"
        options={({ navigation }) => ({
          headerTitle: "Mis compras",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.navigate("Perfil" as never)}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Purchase {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Reviews"
        options={({ navigation }) => ({
          headerTitle: "Mis calificaciones",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.navigate("Perfil" as never)}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Review {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="SellerReviews"
        options={({ navigation }) => ({
          headerTitle: "Calificaciones",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <SellerReview {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="ProductReviews"
        options={({ navigation }) => ({
          headerTitle: "Calificaciones",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <ProductReviews {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="ShoppingPost"
        options={({ navigation }) => ({
          headerTitle: "",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <ShoppingPost {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="UserProfile"
        options={({ navigation }) => ({
          headerTitle: "Perfil de usuario",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <UserProfile {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="PrivacyPolicy"
        options={({ navigation }) => ({
          headerTitle: "Políticas de privacidad",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack() as never}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {() => <PrivacyPolicy />}
      </Drawer.Screen>

      <Drawer.Screen
        name="FAQ"
        options={({ navigation }) => ({
          headerTitle: "FAQ",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack() as never}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {() => <FAQ />}
      </Drawer.Screen>

      <Drawer.Screen
        name="GiveReview"
        options={({ navigation }) => ({
          headerTitle: "Calificar compra",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.goBack() as never}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 10 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
          drawerItemStyle: { display: "none" },
        })}
      >
        {(props) => <GiveReview {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Likes"
        options={({ navigation }) => ({
          headerTitle: "Publicaciones favoritas",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          headerRight: (focus) => (
            <TouchableOpacity onPress={() => deleteLikes(navigation)}>
              <Trash size={26} style={{ padding: 10, margin: 5, marginRight: 7 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
          drawerItemStyle: { display: "none" },
        })}
      >
        {() => <Likes />}
      </Drawer.Screen>

      <Drawer.Screen
        name="ShoppingCart"
        options={({ navigation }) => ({
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          headerTitle: "Mi carrito",
          headerTitleAlign: "center",
          drawerItemStyle: { display: "none" },
          headerRight: (focus) => (
            <TouchableOpacity onPress={() => handleDeleteCart(navigation)}>
              <Trash size={26} style={{ padding: 10, margin: 5 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.navigate("Home" as never)}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 5 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {() => <_ShoppingCart />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Checkout"
        options={({ navigation }) => ({
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerTitle: "Resumen de compra",
          headerTitleAlign: "center",
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.navigate("ShoppingCart")}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 5 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <CheckoutScreen {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Addresses"
        options={({ navigation }) => ({
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#0c35c5",
          },
          drawerItemStyle: { display: "none" },
          headerTitle: "Direcciones",
          headerTitleAlign: "center",
          headerLeft: (focus) => (
            <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
              <ArrowLeft size={24} style={{ padding: 10, marginLeft: 5 }} color={focus ? "#fff" : "grey"} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Addresses {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
