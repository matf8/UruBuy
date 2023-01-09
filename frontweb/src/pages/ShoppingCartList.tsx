import { useKeycloak } from "@react-keycloak/web";
import { Cardholder, House, MinusCircle, PlusCircle, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Customer, IShoppingPost, TCheckout, TShoppingCart } from "../../types";
import { Footer } from "../components/Footer";
import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import {
  addToCart,
  addUserAddress,
  deleteShoppingCart,
  getCustomerProfile,
  getShoppingPostById,
  getUserCart,
  removeFromCart,
  removeItemFromCart,
} from "../services/Requests";
import { Loading } from "./Loading";

function ShoppingCartList(props: any) {
  const [shoppingCart, setShoppingCart] = useState<TShoppingCart | undefined>();
  const { keycloak } = useKeycloak();
  const [shoppingPosts, setShoppingPost] = useState<IShoppingPost[] | undefined>([]);
  const navigate = useNavigate();
  const [customerAddresses, setCustomer] = useState<string[] | undefined>([]);
  const [checkoutProducts, setCheckoutProducts] = useState<TCheckout[] | undefined>([]);

  function getKeys(idShopPost: any) {
    console.log(Object.keys(idShopPost));
    return Object.keys(idShopPost);
  }

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      let email = localStorage.getItem("email");
      if (email) {
        getCustomerProfile(email)
          .then((res) => {
            if (res.status === 200) {
              let c: Customer = res.data;
              if (!ignore) setCustomer(c.addresses);
            }
          })
          .catch((err) => console.log(err.response.data));
      } else {
        console.log("email null");
      }
    }
    fetchUser();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // return () => {
    //cloud not needed
    fetchUserCart();
    // };
  }, []);

  async function fetchUserCart() {
    let email = localStorage.getItem("email");
    if (email) {
      getUserCart(email)
        .then((res: any) => {
          if (res.status === 200) {
            let cart: TShoppingCart = res.data;
            setShoppingCart(cart);
            let ids = getKeys(cart.shoppingPosts);
            if (ids.length === 0) {
              handleDelete();
            } else if (ids.length < shoppingPosts!.length) {
              let arr2 = shoppingPosts?.filter((i) => ids.includes(i.id));
              setShoppingPost(arr2);
            }
            if (ids && ids.length > 0) {
              ids.forEach((x) => {
                getShoppingPostById(x)
                  .then((res) => {
                    if (res.status === 200) {
                      let post: IShoppingPost = res.data;
                      if (shoppingPosts?.find((e) => e.id === post.id) === undefined)
                        setShoppingPost((shoppingPosts) => [...shoppingPosts!, post]);
                      else console.log("");
                    }
                  })
                  .catch((err) => console.log(err));
              });
            } else if (ids.length === 0) {
              localStorage.removeItem("cartId");
            }
          }
        })
        .catch((err) => console.log(err.response.data));
    } else {
      console.log("bad fetch");
    }
  }

  const handleDelete = () => {
    // borra el carrito entero
    let id = localStorage.getItem("cartId");
    if (id) {
      deleteShoppingCart(id)
        .then((res: any) => {
          if (res?.status === 200) {
            localStorage.removeItem("cartId");
            navigate("/");
          }
        })
        .catch((err: any) => {
          console.log(err.response);
        });
    }
  };

  const handlerMinusItem = (shopId: string) => {
    removeFromCart(keycloak.tokenParsed?.email, Number(shopId)).finally(() => {
      fetchUserCart();
    });
  };

  const handlerPlusItem = (shopId: string, shopStock: number) => {
    let v = handleQuantity(shopId);
    if (v === shopStock) {
      Swal.fire({
        title: "No puede agregar mas productos porque llegó al maximo de stock disponible",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      });
    } else {
      addToCart(keycloak.tokenParsed?.email, Number(shopId)).finally(() => {
        fetchUserCart();
      });
    }
  };

  const handlerRemoveItem = (id: string) => {
    let posts = shoppingCart?.shoppingPosts;
    Object.entries(posts!).forEach(([key, value]) => {
      if (key === id) {
        removeItemFromCart(keycloak.tokenParsed?.email, +id, value).finally(() => {
          fetchUserCart();
        });
      }
    });
  };

  function handleQuantity(id: string) {
    let posts = shoppingCart?.shoppingPosts;
    let v;
    Object.entries(posts!).forEach(([key, value]) => {
      if (key === id) v = value;
    });
    return v;
  }

  function isDeliveryUser(address: string) {
    return customerAddresses?.includes(address);
  }

  function handleSelect(id: string, event: any) {
    let posts = shoppingCart?.shoppingPosts;
    let delivery = isDeliveryUser(event.target.value);
    let v: number = 0;
    Object.entries(posts!).forEach(([key, value]) => {
      if (key === id) v = value;
    });
    let item: TCheckout = {
      shoppingPostId: +id,
      quantity: v,
      isDelivery: delivery!,
      address: event.target.value,
    };

    if (checkoutProducts?.find((e) => e.shoppingPostId === +id) === undefined)
      setCheckoutProducts((checkoutProducts) => [...checkoutProducts!, item]);
    else {
      let c = checkoutProducts;
      c.forEach((x) => {
        if (x.shoppingPostId === +id) {
          x.address = event.target.value;
          x.isDelivery = delivery!;
          x.quantity = v;
        }
      });
      setCheckoutProducts(c);
      console.log(checkoutProducts);
    }
  }

  const handlerAddAddress = () => {
    Swal.fire({
      title: "Agregar una dirección de envio",
      showDenyButton: true,
      input: "text",
      confirmButtonText: "Agregar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        addUserAddress(result.value)
          .then((res: any) => {
            if (res.status === 200) {
              Swal.fire("Agregada", "Su dirección fue agregada correctamente", "success");
            }
          })
          .catch((er) => console.log(er.response.data))
          .finally(() => {
            let email = localStorage.getItem("email");
            if (email) {
              getCustomerProfile(email).then((res) => {
                if (res.status === 200) {
                  let c: Customer = res.data;
                  if (c) setCustomer(c.addresses);
                  fetchUserCart();
                }
              });
            } else {
              console.log("");
            }
          });
      }
    });
  };

  const handleCheckout = () => {
    if (checkoutProducts && checkoutProducts.length > 0 && checkoutProducts.length === shoppingPosts?.length)
      navigate("/checkout", { state: { checkout: checkoutProducts, shoppingPost: shoppingPosts } });
    else
      Swal.fire({
        title: "Agregue direcciones de envio a cada producto",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      });
  };

  return (
    <div id="page-container">
      <NavbarUrubuy />
      <div className="mb-80">
        {shoppingPosts!.length > 0 ? (
          <>
            <table className="mx-auto text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Imagen</span>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dirección de envio
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Precio
                  </th>
                </tr>
              </thead>
              <>
                {shoppingPosts &&
                  shoppingPosts?.map((product: IShoppingPost) => (
                    <>
                      <tbody>
                        <tr className="bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                          <td className="w-32 p-4">
                            <img
                              src={
                                product.base64Images[0].includes("data:image")
                                  ? product.base64Images[0]
                                  : `data:image/jpg;base64,${product.base64Images[0]}`
                              }
                              alt="foto de producto"
                            />
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.title}</td>
                          <td>
                            <select
                              id="productos"
                              required
                              className="block py-2.5 px-0 w-auto text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                              onChange={(e) => handleSelect(product.id, e)}
                            >
                              <option className="text-lg text-center text-slate-800">Seleccione dirección</option>

                              <option disabled className="text-lg text-center text-amber-400">
                                Retirar en:
                              </option>

                              {product.addresses &&
                                product.addresses.map((x, i) => (
                                  <option key={i} value={x}>
                                    {x}
                                  </option>
                                ))}
                              {product.hasDelivery ? (
                                <option disabled className="text-lg text-center text-amber-400">
                                  Delivery a:
                                </option>
                              ) : (
                                ""
                              )}
                              {product.hasDelivery
                                ? customerAddresses &&
                                  customerAddresses?.map((x, i) => (
                                    <option key={i} value={x}>
                                      {x}
                                    </option>
                                  ))
                                : ""}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handlerMinusItem(product.id)}
                                className="inline-flex items-center "
                                type="button"
                              >
                                <MinusCircle size={28} color="#a59e9c" />
                              </button>
                              <div>
                                <input
                                  id={product.id}
                                  className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 "
                                  value={handleQuantity(product.id)}
                                  disabled
                                />
                              </div>
                              <button
                                onClick={() => handlerPlusItem(product.id, product.stock)}
                                className="inline-flex items-center "
                                type="button"
                              >
                                <PlusCircle size={28} color="#a59e9c" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">USD {product.price}</td>

                          <td className="px-6 py-4">
                            <button
                              className="font-medium text-red-600 dark:text-red-500"
                              onClick={() => handlerRemoveItem(product.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ))}
                <thead>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <button
                        className="inline-flex font-medium text-gray-600 dark:text-red-500"
                        onClick={() => handlerAddAddress()}
                      >
                        <House size={28} color="#636db6" className="w-5 h-5 mr-2 -ml-1" />
                        Agregar dirección
                      </button>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <p>Subtotal:</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <p>USD{shoppingCart?.subtotal}</p>
                    </td>
                  </tr>
                </thead>
              </>
            </table>

            <div className="overflow-x-auto shadow-md h-1/2 sm:rounded-lg">
              <div className="flex items-start justify-center 1">
                <button
                  onClick={() => handleCheckout()}
                  className="text-white bg-gradient-to-r inline-flex from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-9 py-2.5 text-right mr-2 mb-2"
                >
                  <Cardholder size={20} weight="bold" className="w-5 h-5 mr-2 -ml-1 " />
                  Ir al checkout
                </button>
                <button
                  onClick={handleDelete}
                  className="text-white bg-gradient-to-r inline-flex from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  <Trash size={18} color={"white"} weight="fill" className="w-5 h-5 mr-2 -ml-1" />
                  Eliminar carrito
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-3">
            <Loading />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ShoppingCartList;
