import axios from "axios";
import Swal from "sweetalert2";
import { IEditShoppingPost, Seller, TCheckout, TUserReview, UserKC } from "../../types";

// Crear base de Axios "instance"
const iLocal = axios.create({
  baseURL: "http://backend.uru-buy.me/",
  headers: {
    "Content-Type": "application/json",
  },
});

const iLocalSideco = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-Type": "application/json",
  },
});

const iAWS = axios.create({
  baseURL: "https://backend.uru-buy.me/",
  headers: {
    "Content-Type": "application/json",
  },
});

const iCloudSideco = axios.create({
  baseURL: "http://urubuy.ddns.net:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

const iAdmin_KC = axios.create({ baseURL: "http://urubuy.ddns.net:8080/admin/realms/Urubuy" });
const iAuth = axios.create({ baseURL: "http://urubuy.ddns.net:8080/realms/Urubuy/protocol/openid-connect" });

export const validateOldId = (pId: string, sLet: string, fNum: string) => {
  return iCloudSideco.get(`v1/getOldIdCard/${pId}/${sLet}/${fNum}`);
};

export const validateNewId = (pId: string, serie: string) => {
  return iCloudSideco.get(`v1/getNewIdCard/${pId}/${serie}`);
};

export const setSellerRole = async (id: string) => {
  let tokenAdmin = localStorage.getItem("tokenAdmin");

  var realmData = JSON.stringify([
    {
      id: "d98698a0-ade9-4ac5-9da5-c8c24643cc1a",
      name: "vendedor",
      containerId: "6aa79d51-77a0-463b-bfb1-eea1470b67be",
    },
  ]);

  if (tokenAdmin !== undefined) {
    let header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
        "Content-Type": "application/json",
      },
    };

    return iAdmin_KC.post(`/users/${id}/role-mappings/realm`, realmData, header);
  } else console.error("token invalido");
};

export const addCategory = (nameCat: string) => {
  let category = {
    name: nameCat,
  };
  return iLocal.post(`category/add`, category);
};

export const getCategories = () => {
  return iLocal.get(`category/list`);
};

export const editCategory = (id: string, name: string) => {
  let category = {
    id: id,
    name: name,
  };
  return iLocal.put("category/update", category);
};

export const deleteCategory = (name: string) => {
  return iLocal.delete(`category/deleteByName/${name}`);
};

export const addShoppingPost = (post: any) => {
  return iLocal.post(`shoppingPost/add`, post);
};

export const editShoppingPost = (post: IEditShoppingPost) => {
  return iLocal.put(`shoppingPost/update`, post);
};

export const getShoppingPosts = () => {
  return iLocal.get("shoppingPost/list");
};

export const getShoppingPostById = (id: string) => {
  return iLocal.get(`shoppingPost/findById/${Number(id)}`);
};

export const getCustomerProfile = (email: string) => {
  return iLocal.get(`user/profileCustomer/${email}`);
};

export const getSellerProfile = (email: string) => {
  return iLocal.get(`user/profileSeller/${email}`);
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
    client_id: "urubuy",
    client_secret: "eiqRw4HaFHFzxADC8lz8xdiZ9LqJz4wj",
    username: "urubuying@gmail.com",
    password: "urubuy",
  });

  const res = await iAuth.post("/token", params.toString(), header);
  //await storeData("tokenAdmin", res.data.access_token);
  localStorage.setItem("tokenAdmin", res.data.access_token);
};

export const getAdminManagerToken = async () => {
  // access token admin
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: "urubuyAdmin",
    client_secret: "ilU4T9UOaJsx2LHPI4xYyAomtLJBY1eL",
    username: "urubuying@gmail.com",
    password: "urubuy",
  });

  const res = await iAuth.post("/token", params.toString(), header);
  localStorage.setItem("tokenAdminManager", res.data.access_token);
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

export const blockUser = (id: string) => {
  let data = {
    enabled: false,
  };
  let tokenAdmin = localStorage.getItem("tokenAdmin");
  if (tokenAdmin !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
        "Content-Type": "application/json",
      },
    };
    return iAdmin_KC.put(`/users/${id}`, data, header);
  }
};

export const unBlockUser = (id: string) => {
  let data = {
    enabled: true,
  };
  let tokenAdmin = localStorage.getItem("tokenAdmin");
  if (tokenAdmin !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
        "Content-Type": "application/json",
      },
    };
    return iAdmin_KC.put(`/users/${id}`, data, header);
  }
};

export const addUserKc = async (user: UserKC) => {
  let tokenAdmin = localStorage.getItem("tokenAdmin");

  if (tokenAdmin !== undefined) {
    let header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
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
    };

    return iAdmin_KC.post("/users", data, header);
  } else console.error("token invalido");
};

export const deleteUserKC = async (id: string) => {
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

export const deleteAdminByEmail = (emailToSearch: string) => {
  let uid;
  getUsersKC().then((res) => {
    if (res?.status === 200) {
      const x: any[] = res?.data;
      x.forEach((element) => {
        if (element.email === emailToSearch) {
          deleteUserKC(element.id);
          uid = element.id;
        }
      });
    }
  });
  return uid;
};

export const sendEmail = async (idUser: string) => {
  let tokenAdmin = localStorage.getItem("tokenAdmin");

  if (tokenAdmin !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
      },
    };

    return iAdmin_KC.put(`/users/${idUser}/send-verify-email`, undefined, header);
  }
};

export const setRole = async (id: string) => {
  let tokenAdmin = localStorage.getItem("tokenAdmin");

  var realmData = JSON.stringify([
    {
      id: "6c2d94e7-0c25-44ad-9b17-811b8b3b1c21",
      name: "appAdmin",
      containerId: "6aa79d51-77a0-463b-bfb1-eea1470b67be",
    },
  ]);

  if (tokenAdmin !== undefined) {
    let header = {
      headers: {
        Authorization: "Bearer " + tokenAdmin,
        "Content-Type": "application/json",
      },
    };

    return iAdmin_KC.post(`/users/${id}/role-mappings/realm`, realmData, header);
  } else console.error("token invalido");
};

export const signUpCustomerLocal = (u: any) => {
  return iLocal.post("user/signUp", u);
};

export const signUpSellerLocal = (u: Seller) => {
  return iLocal.post("user/addSeller", u);
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

export const removeItemFromCart = (user: string, shoppingPostId: number, quantity: number) => {
  let newShoppingPost = {
    shoppingPostId: shoppingPostId,
    customerEmail: user,
    shoppingPostQuantity: quantity,
  };
  return iLocal.patch("shoppingCart/removeShoppingPost", newShoppingPost);
};

export const getUserCart = async (email: string) => {
  if (email) return iLocal.get(`shoppingCart/findByCustomer/${email}`);
};

export const deleteShoppingCart = async (id: string) => {
  const cartId = localStorage.getItem("cartId");
  if (cartId) return iLocal.delete(`shoppingCart/delete/${cartId}`);
};

export const addUserAddress = async (address: string) => {
  const e = localStorage.getItem("email");

  let customer = { email: e, addresses: Array(address) };
  if (address) return iLocal.patch(`user/addAddressToCustomer`, customer);
};

export const addCheckout = async (tcheckout: TCheckout[]) => {
  const email = localStorage.getItem("email");
  if (email) {
    let data = { checkoutShoppingPosts: tcheckout, customerEmail: email };
    return iLocal.post(`checkout/addOrUpdate`, data);
  }
};

export const updateSellStatus = (id: string, status: string) => {
  let data = { id: id, status: status };
  return iLocal.put(`/purchase/updateStatus`, data);
};

export const findCheckout = async (idCheckout: number) => {
  return iLocal.get(`checkout/findById/${String(idCheckout)}`);
};

export const deleteCheckout = async (id: string) => {
  if (id) return iLocal.delete(`checkout/delete/${id}`);
};
export const getSeller = (email: string) => {
  return iLocal.get(`user/profileSeller/${email}`);
};

export const getCustomer = (email: string) => {
  return iLocal.get(`user/profileCustomer/${email}`);
};

export const updateStatusShoppingPost = (post: any) => {
  return iLocal.put(`shoppingPost/updateStatus`, post);
};

export const getUserWithCustomerRole = () => {
  let token = localStorage.getItem("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.get("roles/comprador/users", header);
  } else console.warn("fail get user with role customer");
};

export const getUserWithSellerRole = () => {
  let token = localStorage.getItem("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.get("roles/vendedor/users", header);
  } else console.warn("fail get user with role seller");
};

export const getUserWithAdminRole = () => {
  let token = localStorage.getItem("tokenAdmin");

  if (token !== undefined) {
    const header = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return iAdmin_KC.get("roles/appAdmin/users", header);
  } else console.warn("fail get user with role customer");
};
export const reviewUser = async (review: TUserReview) => {
  if (review) {
    return iLocal.post(`userReview/add`, review);
  }
};

export const sendNewsNtfy = async () => {
  let obj = {
    recipients: ["mattffer08@gmail.com"],
  };
  return iAWS.post(`notifications/sendNews`, obj);
};

export const sendDealsNtfy = async () => {
  let obj = {
    recipients: ["mattffer08@gmail.com"],
  };
  return iAWS.post(`notifications/sendDeals`, obj);
};

export const findPurchaseById = (id: string) => {
  return iLocal.get(`purchase/findById/${id}`);
};

export const reviewShoppingPost = async (review: any) => {
  if (review) {
    return iLocal.post(`review/add`, review);
  }
};

export const updatePicture = (email: string, picture: string) => {
  if (email) {
    let data = {
      username: email,
      picture: picture,
    };
    return iLocal.put(`user/updateProfile`, data);
  }
};

export const suspendAccount = (email: string) => {
  return iLocal.put(`user/suspend/${email}`);
};

export const deleteCustomerKC = (emailToSearch: string) => {
  getUsersKC().then((res) => {
    if (res?.status === 200) {
      const x: any[] = res?.data;
      x.forEach((element) => {
        if (element.email === emailToSearch) {
          deleteUserKC(element.id)
            .then((r) => {
              if (r!.status === 201 || r!.status === 204) {
                Swal.fire("Usuario suspendido!", "", "success").then((result) => {
                  if (result.isConfirmed) window.location.replace("/sorry");
                });
              }
            })
            .catch((e) => {
              console.log(e);
              Swal.fire("Hubo un error intenté mas tarde", "", "error");
            });
        }
      });
    }
  });
};
