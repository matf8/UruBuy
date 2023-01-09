import { ReactKeycloakProvider } from "@react-keycloak/web";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRouteAdmin from "./helpers/PrivateRouteAdmin";
import AdminUsers from "./pages/Admin/AdminUsers";
import Categories from "./pages/Admin/Categories";
import Dashboard from "./pages/Admin/Dashboard";
import SignUpCustomer from "./pages/Customer/SignUpCustomer";
import Home from "./pages/Home";
import keycloak from "./services/Keycloak";
import PrivateRouteSeller from "./helpers/PrivateRouteSeller";
import PrivateRouteUser from "./helpers/PrivateRouteUser";
import AdminShoppingPost from "./pages/Admin/AdminShoppingPosts";
import EditShoppingPostStatus from "./pages/Admin/EditShoppingPostStatus";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import Checkout from "./pages/Checkout";
import CheckoutResult from "./pages/Customer/CheckoutResult";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import PurchaseProducts from "./pages/Customer/PurchaseProducts";
import MyProfile from "./pages/MyProfile";
import CreateShoppingPost from "./pages/Seller/Dashboard/CreateShoppingPost";
import HomeSeller from "./pages/Seller/Dashboard/HomeSeller";
import Logout from "./pages/Seller/Dashboard/Logout";
import EditShoppingPostStatusSeller from "./pages/Seller/EditShoppingPostStatusSeller";
import Form from "./pages/Seller/FormSignUp/Form";
import MySells from "./pages/Seller/MySells";
import SellerProfile from "./pages/Seller/SellerProfile";
import SellerShoppingPosts from "./pages/Seller/SellerShoppingPosts";
import ShoppingCartList from "./pages/ShoppingCartList";
import Sorry from "./pages/Sorry";
import AdminShoppingPostEdit from "./pages/Admin/AdminShoppingPostsEdit";
import ShoppingPostEdit from "./components/shoppingPost/ShoppingPostEdit";

export default function Navigation() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signupcustomer" element={<SignUpCustomer />} />
            <Route path="/signupseller" element={<Form />} />
            <Route path="/shoppingCartList" element={<ShoppingCartList />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/result" element={<CheckoutResult />} />
            <Route path="/sorry" element={<Sorry />} />
            <Route path="/edit" element={<ShoppingPostEdit />} />
            <Route path="/purchaseProducts" element={<PurchaseProducts />} />
            <Route path="/sellerProfile" element={<SellerProfile />} />
            <Route path="/customerProfile" element={<CustomerProfile />} />

            <Route
              path="/dash"
              element={
                <PrivateRouteAdmin>
                  <Dashboard />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRouteAdmin>
                  <AdminUsers />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/editShoppingPostAdmin"
              element={
                <PrivateRouteAdmin>
                  <AdminShoppingPostEdit />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/homeadmin"
              element={
                <PrivateRouteAdmin>
                  <HomeAdmin />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/editShoppingPostForAdmin"
              element={
                <PrivateRouteAdmin>
                  <AdminShoppingPost />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/editstatus"
              element={
                <PrivateRouteAdmin>
                  <EditShoppingPostStatus />
                </PrivateRouteAdmin>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRouteAdmin>
                  <Categories />
                </PrivateRouteAdmin>
              }
            />

            <Route
              path="/homeseller"
              element={
                <PrivateRouteSeller>
                  <HomeSeller />
                </PrivateRouteSeller>
              }
            />
            <Route
              path="/editSellerShoppingPost"
              element={
                <PrivateRouteSeller>
                  <ShoppingPostEdit />
                </PrivateRouteSeller>
              }
            />
            <Route
              path="/sell"
              element={
                <PrivateRouteSeller>
                  <CreateShoppingPost />
                </PrivateRouteSeller>
              }
            />
            <Route
              path="/logout"
              element={
                <PrivateRouteSeller>
                  <Logout />
                </PrivateRouteSeller>
              }
            />
            <Route
              path="/editstatusseller"
              element={
                <PrivateRouteSeller>
                  <EditShoppingPostStatusSeller />
                </PrivateRouteSeller>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRouteUser>
                  <MyProfile />
                </PrivateRouteUser>
              }
            />
            <Route
              path="/myshopingposts"
              element={
                <PrivateRouteUser>
                  <SellerShoppingPosts />
                </PrivateRouteUser>
              }
            />
            <Route
              path="/mySells"
              element={
                <PrivateRouteUser>
                  <MySells />
                </PrivateRouteUser>
              }
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </ReactKeycloakProvider>
  );
}
