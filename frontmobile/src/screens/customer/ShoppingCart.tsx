import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, ImageBackground, Alert, Platform, TouchableOpacity, Modal } from "react-native";
import {
  addCustomerCheckout,
  addNewCustomerAddress,
  addToCart,
  deleteShoppingCart,
  findCheckoutById,
  getCustomerProfile,
  getData,
  getShoppingPostById,
  getUserCart,
  removeData,
  removeFromCart,
  removeItemFromCart,
  storeData,
} from "../../services/Requests";
import myStyle from "../../../assets/styles";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import CustomButton from "../../components/CustomButton";
import {
  AddressBook,
  ArrowRight,
  Check,
  DotsThreeVertical,
  Minus,
  PencilSimpleLine,
  Plus,
  TrashSimple,
  X,
  XCircle,
} from "phosphor-react-native";
import { TShoppingPost, TShoppingCart, TCheckout, TCheckoutResponse } from "../../../urubuy";
import { useColorScheme } from "nativewind";
import { Divider, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "../../components/CustomInput";
import Loading from "../../components/Loading";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); // workaround para el warning en el device de cannot update a component aunque lo hace

export async function deleteUserCart(nav: any) {
  await deleteShoppingCart();
  await removeData("cartId");
  nav.navigate("Home" as never);
}

type CustomShow = {
  idShoppingPost: number;
  show: boolean;
};

type CardCart = {
  product: TShoppingPost;
};

export default function ShoppingCart() {
  const [shoppingCart, setShoppingCart] = useState<TShoppingCart | undefined>(undefined);
  const [shoppingPost, setShoppingPost] = useState<TShoppingPost[] | undefined>([]);
  const [checkoutProducts, setCheckoutProducts] = useState<TCheckout[] | undefined>([]);
  const [customerAddresses, setCustomerAddresses] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState<CustomShow[] | undefined>([]);
  const [newAddress, setNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const { colorScheme } = useColorScheme();
  const nav = useNavigation();
  const dark = colorScheme === "dark";

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", async () => {
      const cartId = await getData("cartId");
      if (!cartId) setShoppingPost([]);
      else {
        let k = getKeys(shoppingCart?.shoppingPosts);
        if (k) {
          if (Object.entries(k).length === 0) {
            setShoppingPost([]);
            deleteUserCart(nav);
          }
        }
      }
      if (loading) setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = nav.addListener("focus", () => {
      setCheckoutProducts([]);
      setShowPicker([]);
      getCart();
      getAddresses();
      setNewCustomerAddress("");
      setLoading(true);
    });
    return unsubscribe;
  }, [shoppingCart, shoppingPost]);

  const getCart = () => {
    getUserCart()
      .then(async (cart) => {
        let k: TShoppingCart = cart?.data;
        if (k.shoppingPosts) {
          setShoppingCart(k);
          let t: string[] = getKeys(k.shoppingPosts)!;
          // update showPicker
          if (t.length > showPicker?.length!) {
            let show: CustomShow[] = [];
            t.forEach((e) => {
              if (!show.find((s) => s.idShoppingPost === parseInt(e)))
                show.push({ idShoppingPost: parseInt(e), show: false });
            });
            setShowPicker(show);
          }
        }
        storeData("cartId", k.id);
        let arr: string[] = getKeys(k.shoppingPosts)!;
        if (arr.length === 0) {
          deleteUserCart(nav);
        } else if (shoppingPost && arr.length <= shoppingPost?.length) {
          let arr2 = shoppingPost?.filter((item) => arr.includes(item.id));
          setShoppingPost(arr2);
        }

        arr.forEach((x) => {
          getShoppingPostById(Number(x))
            .then((res) => {
              if (res.status === 200) {
                let post: TShoppingPost = res.data;

                if (shoppingPost?.find((x) => x.id === post.id) === undefined)
                  setShoppingPost((prevState) => [...prevState!, post]);
              }
            })
            .catch((err) => console.error(err.response.data));
        });
      })
      .catch((err) => console.error(err.response.data))
      .finally(() => setLoading(false));
  };

  const getAddresses = async () => {
    const email = await getData("email");
    if (email) {
      getCustomerProfile(email).then((res) => {
        if (res.status === 200) {
          let addresses: string[] = res.data.addresses;
          setCustomerAddresses(addresses);
        }
      });
    }
  };

  function getKeys(object: any) {
    if (object) return Object.keys(object);
  }

  const increment = async (productId: string) => {
    const email = await getData("email");
    if (email) {
      addToCart(email, Number(productId))
        .then((res) => {
          if (res.status === 200) {
            getUserCart().then((res: any) => {
              if (res.status === 200) {
                let cart: TShoppingCart = res.data;
                let posts = cart.shoppingPosts;
                Object.entries(posts!).forEach(([key, value]) => {
                  let cp: TCheckout[] = checkoutProducts!;

                  if (cp) {
                    cp.forEach((y) => {
                      if (y.shoppingPostId === +key) y.quantity = value;
                    });
                    setCheckoutProducts(cp);
                  }
                });
              }
            });
          }
        })
        .finally(() => getCart());
    }
  };

  const decrement = async (productId: string) => {
    const email = await getData("email");
    if (email) {
      removeFromCart(email!, Number(productId))
        .then((res) => {
          if (res.status === 200) {
            getUserCart().then((res: any) => {
              if (res.status === 200) {
                let cart: TShoppingCart = res.data;
                let posts = cart.shoppingPosts;
                Object.entries(posts!).forEach(([key, value]) => {
                  let cp: TCheckout[] = checkoutProducts!;

                  if (cp) {
                    cp.forEach((y) => {
                      if (y.shoppingPostId === +key) y.quantity = value;
                    });
                    setCheckoutProducts(cp);
                  }
                });
              }
            });
          }
        })
        .finally(() => getCart());
    }
  };

  const handleQuantity = (postId: string) => {
    let posts = shoppingCart?.shoppingPosts;
    let v;
    Object.entries(posts!).forEach(([key, value]) => {
      if (key === postId) v = value;
    });
    return v;
  };

  const _removeItemFromCart = async (postId: string) => {
    Alert.alert("Quitar item", "Está seguro?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          let q = handleQuantity(postId);
          let email = await getData("email");
          if (email) {
            removeItemFromCart(email, +postId, q!).then((res) => {
              if (res.status === 200) {
                let k = checkoutProducts;
                let s = showPicker;
                k?.splice(
                  k?.findIndex((x) => x.shoppingPostId === +postId),
                  1,
                );
                s?.splice(
                  s?.findIndex((x) => x.idShoppingPost === +postId),
                  1,
                );
                getUserCart().then((res: any) => {
                  if (res.status === 200) {
                    let arr: string[] = getKeys(res.data.shoppingPosts)!;
                    if (arr.length === 0) deleteUserCart(nav);
                    else getCart();
                  }
                });
              }
            });
          }
        },
      },
    ]);
  };

  const handleCheckout = async () => {
    setLoading(true);
    let k = getKeys(shoppingCart?.shoppingPosts);
    if (checkoutProducts?.length === 0) {
      Alert.alert("Por favor seleccione una dirección");
      setLoading(false);
    } else if (checkoutProducts && k && checkoutProducts?.length < k?.length) {
      Alert.alert("Por favor seleccione dirección en todos los productos");
      setLoading(false);
    } else {
      let email = await getData("email");
      let checkout: TCheckoutResponse;
      addCustomerCheckout(checkoutProducts!, email!)
        .then(async (res: any) => {
          if (res.status === 200) {
            await storeData("hasCheckout", res.data.toString());
            findCheckoutById(res.data).then((res: any) => {
              if (res.status === 200) {
                checkout = res.data;
                nav.navigate(
                  "Checkout" as never,
                  {
                    checkout: checkout,
                    shoppingCartId: shoppingCart?.id,
                  } as never,
                );
              } else console.error("no hay checkout");
            });
          }
        })
        .catch(async (err) => {
          console.error(err.response.data);
        });
    }
  };

  const isDelivery = (address: string) => {
    return customerAddresses.includes(address);
  };

  async function handleShippingAddress(productId: string, address: string) {
    if (address) {
      let posts = shoppingCart?.shoppingPosts;
      let hasDelivery = isDelivery(address);
      Object.entries(posts!).forEach(([key, value]) => {
        if (key === productId) {
          let p: TCheckout = {
            shoppingPostId: Number(productId),
            quantity: value,
            isDelivery: hasDelivery,
            address: address,
          };

          if (checkoutProducts?.find((x) => x.shoppingPostId === +productId) === undefined) {
            setCheckoutProducts((prevState) => [...prevState!, p]);
          } else {
            // actualizar address almacenada
            let cp: TCheckout[] = checkoutProducts!;
            if (cp) {
              cp.forEach((x) => {
                if (x.shoppingPostId === +productId) {
                  x.address = address;
                  x.quantity = value;
                  x.isDelivery = hasDelivery;
                }
              });
              setCheckoutProducts(cp);
            }
          }
          // tengo otro producto del mismo seller? le seteo la misma dirección elegida.
          handleSameSeller(address, hasDelivery, productId);
          getCart(); // updating ui
        }
      });
    }
  }

  const handleSameSeller = (address: string, hasDelivery: boolean, productId: string) => {
    let posts = shoppingPost;

    if (posts?.length! > 1) {
      let seller = posts?.find((x) => x.id === productId)?.sellerEmail;
      let cp: TCheckout[] = checkoutProducts!;
      posts?.forEach((x) => {
        if (x.id !== productId) {
          if (x.sellerEmail === seller) {
            if (cp?.find((y) => y.shoppingPostId === +x.id) === undefined) {
              let p: TCheckout = {
                shoppingPostId: +x.id,
                quantity: +handleQuantity(x.id)!,
                isDelivery: hasDelivery,
                address: address,
              };
              setCheckoutProducts((prev) => [...prev!, p]);
            } else {
              cp.forEach((y) => {
                if (y.shoppingPostId === +x.id) {
                  y.address = address;
                  y.quantity = +handleQuantity(x.id)!;
                  y.isDelivery = hasDelivery;
                }
              });
              setCheckoutProducts(cp);
            }
          }
        }
      });
    }
  };

  const handleSelectedValue = (productId: string) => {
    let c = checkoutProducts?.find((x) => x.shoppingPostId === +productId);
    let str = c?.address;
    return str! as string;
  };

  function handleNewAddress() {
    setNewAddress(true);
  }

  function handleNewCustomerAddress() {
    if (newCustomerAddress) {
      addNewCustomerAddress(newCustomerAddress)
        .then((res: any) => {
          if (res.status === 200) {
            setNewAddress(false);
            setCustomerAddresses(res.data.addresses);
          } else console.warn(res);
        })
        .catch((err) => console.error(err.response.data))
        .finally(() => {
          getCart();
        });
    }
  }

  function loadShow() {
    let k = getKeys(shoppingCart?.shoppingPosts);
    let arr: CustomShow[] = [];
    k?.forEach((x) => {
      arr.push({ idShoppingPost: +x, show: false });
    });
    setShowPicker(arr);
  }

  const handleShowPicker = (id: number) => {
    let k = showPicker;
    k?.forEach((x) => {
      if (x.idShoppingPost === id) {
        x.show = !x.show;
      }
    });
    setShowPicker(k);
    getCart();
  };

  const handlePress = (id: any) => {
    nav.navigate(
      "ShoppingPost" as never,
      {
        id: id,
      } as never,
    );
  };

  const Card: React.FC<CardCart> = ({ product }) => {
    return (
      <>
        <View
          className="
          ml-[2%]
          mb-[10px]
          w-[96%] 
          min-h-[200px]
          bg-[#ffffff]
          dark:bg-dark-mode-bg
          border-header-color rounded-[5px] border-2"
          style={myStyle.cardCart}
        >
          <TouchableOpacity onPress={() => handlePress(product.id)}>
            <Text className="text-[18px] p-[11px] font-semibold dark:text-dark-mode-text text-center">
              {product.title.length > 100 ? product.title.slice(0, 50) : product.title}
            </Text>
          </TouchableOpacity>
          <Divider
            style={
              dark
                ? { padding: 0.7, height: 1.33, backgroundColor: "white" }
                : { padding: 0.7, height: 1.33, backgroundColor: "#32377B" }
            }
          />
          <View className="flex-row justify-between">
            <Text className="text-[18px] p-[11px] mt-2 flex-wrap max-w-[186.5px] dark:text-dark-mode-text text-left">
              Dirección elegida{"  "}
              {checkoutProducts?.map((x) => (x.shoppingPostId === +product.id ? x.address : null)) ||
                "No eligió direccion"}
            </Text>
            <Menu>
              <MenuTrigger>
                <DotsThreeVertical size={28} color={dark ? "white" : "black"} style={{ marginTop: 16 }} />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  style={
                    dark
                      ? { backgroundColor: "#0f0a36", width: 200, flexDirection: "row" }
                      : { width: 200, flexDirection: "row" }
                  }
                  onSelect={handleNewAddress}
                >
                  <AddressBook size={19} weight="bold" color={dark ? "white" : "black"} />
                  <Text className="text-lg text-[#000] dark:text-dark-mode-text font-semibold">
                    Nueva direccion de envío
                  </Text>
                </MenuOption>
                <MenuOption
                  style={
                    dark
                      ? { backgroundColor: "#0f0a36", width: 250, flexDirection: "row" }
                      : { width: 250, flexDirection: "row" }
                  }
                  onSelect={() => _removeItemFromCart(product.id)}
                >
                  <TrashSimple size={19} color="red" />
                  <Text className="text-lg font-semibold text-[#f00]"> Quitar del carrito </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>

          <View className="flex-row justify-between">
            <Image
              source={
                product.base64Images && product.base64Images[0]
                  ? { uri: product.base64Images[0] }
                  : require("../../../assets/noitem.png")
              }
              className="max-h-[80%] w-[35%] h-[155px] ml-1"
              resizeMode="contain"
            />

            {/* elegir direccion */}

            {(showPicker!.length === 0 && loadShow()) ||
              showPicker?.map((sp, index) =>
                sp.idShoppingPost === +product.id ? (
                  !sp.show ? (
                    checkoutProducts?.length! > 0 &&
                    checkoutProducts?.find(
                      (x) =>
                        x.shoppingPostId === +product.id &&
                        (x.address === undefined || x.address === null || x.address !== "") !== undefined,
                    ) ? (
                      <TouchableOpacity
                        key={index}
                        className="absolute right-10"
                        onPress={() => handleShowPicker(+product.id)}
                      >
                        <Text className="text-[21px] my-auto mx-auto text-[#db8e36] font-semibold underline">
                          Cambiar dirección
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={index}
                        className="absolute right-10"
                        onPress={() => handleShowPicker(+product.id)}
                      >
                        <Text className="text-[21px] my-auto mx-auto text-[#46d6d6] font-semibold underline">
                          Elegir dirección
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <View key={index}>
                      <Picker
                        style={
                          Platform.OS === "ios"
                            ? { width: 190, height: 50, top: -100, right: 25 }
                            : { width: 190, height: 90, top: 0, right: 0 }
                        }
                        mode={Platform.OS === "android" ? "dialog" : "dropdown"}
                        itemStyle={{ fontSize: 20 }}
                        selectedValue={handleSelectedValue(product.id)}
                        onValueChange={(itemValue, itemIndex) => {
                          handleShippingAddress(product.id, itemValue);
                          handleShowPicker(+product.id);
                        }}
                      >
                        {product.hasDelivery && (
                          <Picker.Item label={"Enviar a"} value={undefined} enabled={false} color="red" />
                        )}
                        {product.hasDelivery &&
                          customerAddresses?.map((a) => (
                            <Picker.Item key={Math.random() + 50 * 10} label={a} value={a} color="green" />
                          ))}

                        <Picker.Item label={"Retirar en"} value={undefined} enabled={false} color="red" />

                        {product.addresses?.map((a) => (
                          <Picker.Item key={Math.random() + 50 * 10} label={a} value={a} color="green" />
                        ))}
                      </Picker>
                    </View>
                  )
                ) : null,
              )}
          </View>

          <Text className="text-[18px] p-[11px] mb-[-5px] dark:text-dark-mode-text absolute bottom-0 right-8 h-16 w-16">
            USD {product.price}
          </Text>

          <View className="absolute right-0 w-8 h-8 top-10"></View>
          <View className="flex flex-row  absolute inset-x-12 bottom-7 h-16 ml-[75px]">
            <Text className="p-2 text-right dark:text-dark-mode-text" style={myStyle.quantityPositionFixed}>
              Cantidad: {handleQuantity(product.id)}
            </Text>
            <TouchableOpacity
              onPress={() => increment(product.id)}
              className="w-[27px] h-[27px] bg-header-color rounded-full p-1 mt-[33px] ml-[22px]"
            >
              <Plus size={18} color={"white"} weight="duotone" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => decrement(product.id)}
              className="w-[27px] h-[27px] bg-header-color rounded-full p-1 mt-[33px] ml-[13px]"
            >
              <Minus size={18} color={"white"} weight="duotone" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        {loading ? (
          <View className="mx-auto my-auto">
            <Loading text="Cargando..." bg={true} />
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={
              <View className="flex-row">
                <Text className="text-left text-[19px] text-[#ffffff] p-[9px]"> Productos agregados </Text>
                <Text className="text-rigth text-[19px] text-[#ffffff] p-[9px]">
                  Subtotal: {shoppingCart?.subtotal}
                </Text>
              </View>
            }
            className="mt-2"
            ListFooterComponent={
              shoppingPost?.length && shoppingPost?.length > 0 ? (
                <View className="flex-row items-center justify-center">
                  <CustomButton
                    isDisabled={false}
                    onPress={() => handleCheckout()}
                    value={"Continuar compra"}
                    style={{ marginBottom: 5 }}
                  />
                  <View
                    className={Platform.select({
                      ios: "absolute right-[65px] bottom-[12px]",
                      android: "absolute right-[70px] mt-[28px]",
                    })}
                  >
                    <ArrowRight size={24} color={"white"} />
                  </View>
                </View>
              ) : null
            }
            data={shoppingPost}
            extraData={shoppingPost}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Card product={item} />}
          />
        )}
        {newAddress ? (
          <View>
            <View className="items-center justify-center flex-1 mt-6 border-[#dbad2e] border-[1.33]">
              <Modal
                animationType="fade"
                className="p-10 m-5"
                transparent={true}
                visible={newAddress}
                onRequestClose={() => {
                  setNewAddress(!newAddress);
                }}
              >
                <View className="items-center justify-center flex-1 max-h-[650px]">
                  <View
                    className="mt-5 bg-[#fff] dark:bg-[#292626] rounded-3xl p-[35px] items-center"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity
                      className="absolute right-[-15px] w-16 h-16 top-3"
                      onPress={() => setNewAddress(!newAddress)}
                    >
                      <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
                    </TouchableOpacity>

                    <View className="items-center p-1 m-2">
                      <Text className="text-[#dbad2e] text-[20px] font-bold">Nueva dirección</Text>
                      <Divider
                        style={
                          dark
                            ? { height: 1.33, width: 170, backgroundColor: "white", margin: 5 }
                            : { height: 1.33, width: 170, backgroundColor: "black" }
                        }
                      />
                      <CustomInput
                        onChangeText={setNewCustomerAddress}
                        value={newCustomerAddress}
                        left={
                          <TextInput.Icon
                            name={() => <PencilSimpleLine size={18} color={dark ? "white" : "black"} />}
                          />
                        }
                        placeholder="Dirección"
                        secureTextEntry={false}
                        style={undefined}
                        onBlur={undefined}
                        onSubmitEditing={undefined}
                        keyboardType={undefined}
                      />

                      <View className="flex-row p-2 mt-5">
                        <TouchableOpacity
                          onPress={() => {
                            setNewAddress(!newAddress);
                            setNewCustomerAddress("");
                          }}
                          className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                        >
                          <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                            Salir
                          </Text>
                          <X
                            weight="fill"
                            size={19}
                            style={{ padding: 2, marginTop: 12, marginRight: 5 }}
                            color={"red"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleNewCustomerAddress()}
                          className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                        >
                          <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                            Crear
                          </Text>
                          <Check
                            weight="fill"
                            size={19}
                            style={{ padding: 2, marginTop: 12, marginRight: 5 }}
                            color={"green"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        ) : (
          ""
        )}
      </ImageBackground>
    </>
  );
}
