import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";
import { TCustomer, TCheckout, TUserKC, TUserReview } from "../../urubuy";

const iLocal = axios.create({
  baseURL: Constants.manifest?.extra?.URL_CLOUD,
  headers: { "Content-Type": "application/json" },
});

const iAuth = axios.create({ baseURL: Constants.manifest?.extra?.URL_KC });

const iAdmin_KC = axios.create({ baseURL: Constants.manifest?.extra?.URL_KC_ADMIN });

export const getShoppingPost = (page: number) => {
  return iLocal.get(`shoppingPost/requestPage/${page}`);
};

export const getShoppingPosts = () => {
  return iLocal.get(`shoppingPost/list`);
};

export const getShoppingPostById = (id: number) => {
  return iLocal.get(`shoppingPost/findById/${id}`);
};

export const getCustomerProfile = (email: string) => {
  return iLocal.get(`user/profileCustomer/${email}`);
};

export const getSellerProfile = (email: string) => {
  return iLocal.get(`user/profileSeller/${email}`);
};

export const updateProfile = async (picture: string, username: string) => {
  let obj = { username: username, picture: picture };
  return iLocal.put(`user/updateProfile/`, obj);
};

export const resetPassword = async (idUser: string) => {
  let token = await getData("tokenAdmin");

  const header = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return iAdmin_KC.put(`/users/${idUser}/reset-password-email`, undefined, header);
};

export const getAdminToken = async () => {
  // access token admin
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: Constants.manifest?.extra?.CLIENT_ID,
    client_secret: Constants.manifest?.extra?.CLIENT_SECRET,
    username: "urubuying@gmail.com",
    password: "urubuy",
  });

  const res = await iAuth.post("/token", params.toString(), header);
  await storeData("tokenAdmin", res.data.access_token);
};

export const login = (user: TUserKC) => {
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: Constants.manifest?.extra?.CLIENT_ID,
    client_secret: Constants.manifest?.extra?.CLIENT_SECRET,
    username: user.email,
    password: user.password,
  });
  return iAuth.post("/token", params.toString(), header);
};

export const getInfoUser = async () => {
  let token = await getData("tokenUser");

  const header = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return iAuth.get("/userinfo", header);
};

export const signUp = async (user: TUserKC) => {
  let token = await getData("tokenAdmin");

  if (token !== undefined) {
    let header = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    let data = {
      username: user.username,
      enabled: true,
      emailVerified: false,
      email: user.email,
      credentials: [
        {
          type: "password",
          value: user.password,
          temporary: false,
        },
      ],
      realmRoles: ["default-roles-urubuy"],
    };
    return iAdmin_KC.post("/users", data, header);
  } else console.error("token invalido");
};

export const signUpLocal = (user: TCustomer) => {
  let customer = {
    username: user.username,
    email: user.email,
    password: user.password,
    addresses: user.addresses,
    picture: user.picture,
  };

  iLocal
    .post("user/signUp", customer)
    .then((res) => {
      if (res.status === 200) console.log("usuario dado de alta localmente");
    })
    .catch((err) => console.error(err));
};

export const logoutUser = async (isAdmin: boolean) => {
  let token = await getData("tokenAdmin");
  let idUser;
  if (isAdmin === true) idUser = Constants.manifest?.extra?.ADMIN_ID;
  else idUser = await getData("idUser");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.post(`/users/${idUser}/logout`, undefined, header);
  }
};

export const getIdUsuario = async () => {
  let token = await getData("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.get("/users", header);
  } else console.warn("fail getIdUsuario");
};

export const sendEmail = async () => {
  let idUser = await getData("idUserToVerify");
  let token = await getData("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.put(`/users/${idUser}/send-verify-email`, undefined, header);
  }
};

export const getUsersKC = async () => {
  let token = localStorage.getItem("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.get("/users", header);
  } else console.warn("fail getIdUsuario");
};

const deleteUserKC = async (id: string) => {
  let tokenAdmin = localStorage.getItem("tokenAdmin");

  if (tokenAdmin !== undefined) {
    let header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
        "Content-Type": "application/json",
      },
    };
    return iAdmin_KC.delete(`/users/${id}`, header);
  } else console.error("token invalido");
};

export const deleteCustomerKC = (emailToSearch: string) => {
  getUsersKC().then((res) => {
    if (res?.status === 200) {
      const x: any[] = res?.data;
      x.forEach((element) => {
        if (element.email === emailToSearch) {
          deleteUserKC(element.id).catch(() => Alert.alert("Error al suspender"));
        }
      });
    }
  });
};

export const sendToken = async (myToken: string) => {
  const user = await getData("email");
  var tenant;
  if (user === "" || user === undefined) {
    tenant = {
      idTenant: Constants.manifest?.extra?.DEVICE_ID,
      token: myToken,
      timestamp: Date.now(),
    };
  } else {
    tenant = {
      idTenant: user,
      token: myToken,
      timestamp: Date.now(),
    };
  }

  console.warn(tenant);
  if (tenant.token !== undefined) {
    return iLocal.post(`notifications/addXP`, tenant);
  }
};

export const checkUserDelete = async (rawPassword: string) => {
  const e = (await getData("email")) as string;
  if (e) {
    let user = {
      email: e,
      password: rawPassword,
    };
    return iLocal.delete("user/checkDelete", { data: user });
  }
};

export const addToCart = (user: string, shoppingPostId: number) => {
  let newShoppingPost = {
    shoppingPostId: shoppingPostId,
    customerEmail: user,
    shoppingPostQuantity: 1,
  };
  return iLocal.post("shoppingCart/addShoppingPost", newShoppingPost);
};

export const removeFromCart = (user: string, shoppingPostId: number) => {
  let newShoppingPost = {
    shoppingPostId: shoppingPostId,
    customerEmail: user,
    shoppingPostQuantity: 1,
  };
  return iLocal.patch("shoppingCart/removeShoppingPost", newShoppingPost);
};

export const removeItemFromCart = (user: string, shoppingPostId: number, q: number) => {
  let newShoppingPost = {
    shoppingPostId: shoppingPostId,
    customerEmail: user,
    shoppingPostQuantity: q,
  };
  return iLocal.patch("shoppingCart/removeShoppingPost", newShoppingPost);
};

export const getUserCart = async () => {
  const email = await getData("email");
  if (email) return iLocal.get(`shoppingCart/findByCustomer/${email}`);
};

export const getCartById = async (id: string) => {
  if (id) return iLocal.get(`shoppingCart/findById/${+id}`);
};

export const deleteShoppingCart = async () => {
  const cartId = await getData("cartId");
  if (cartId) return iLocal.delete(`shoppingCart/delete/${cartId}`);
};

export const addNewCustomerAddress = async (address: string) => {
  const email = await getData("email");
  if (email) {
    let newAddress = {
      email: email,
      addresses: Array(address),
    };
    return iLocal.patch(`user/addAddressToCustomer`, newAddress);
  }
};

export const deleteAddressCustomer = async (_email: string, address: string) => {
  if (_email && address) {
    return iLocal.delete(`user/deleteAddressCustomer/${_email}/${address}`);
  }
};

export const addCustomerCheckout = async (checkout: TCheckout[], email: string) => {
  if (email) {
    let newCheckout = {
      customerEmail: email,
      checkoutShoppingPosts: checkout,
    };
    return iLocal.post(`checkout/addOrUpdate`, newCheckout);
  }
};

export const findCheckoutById = async (id: string) => {
  if (id) {
    return iLocal.get(`checkout/findById/${id}`);
  }
};

export const deleteCheckout = async (id: string) => {
  if (id) {
    return iLocal.delete(`checkout/delete/${id}`);
  }
};

export const getPurchaseById = async (id: number) => {
  if (id) {
    return iLocal.get(`purchase/findById/${id}`);
  }
};

export const suspendAccount = async (email: string) => {
  if (email) {
    return iLocal.put(`user/suspend/${email}`);
  }
};

export const reviewSeller = async (review: TUserReview) => {
  return iLocal.post("userReview/add", review);
};

export const reviewProduct = async (review: any) => {
  return iLocal.post("review/add", review);
};

export const toggleSettingNotifications = async (user: string) => {
  if (user) return iLocal.put(`notifications/setting/${user}`);
};

export const isSuspended = async (user: string) => {
  if (user) iLocal.get(`user/isSuspended/${user}`);
};

// operaciones para localstorage

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) return value as string;
  } catch (error) {
    console.error(error);
  }
};

export const removeData = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
