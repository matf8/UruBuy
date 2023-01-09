import React, { useEffect, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import PayPalSvg from "../../components/Svgs/PayPalSvg";
import CustomButton from "../../components/CustomButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "nativewind";
import { TCheckoutResponse, TCheckoutShoppingPost } from "../../../urubuy";
import { deleteCheckout, getCartById, removeData } from "../../services/Requests";
import Loading from "../../components/Loading";
import { CheckCircle, X } from "phosphor-react-native";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { Card } from "@rneui/themed";
import Constants from "expo-constants";

export default function Checkout(props: any) {
  const nav = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const urlPay = Constants.manifest?.extra?.URL_CLOUD + "paypal/pay/";
  const [shoppingCartId, setShoppingCartId] = useState<string | undefined>("");
  const [checkout, setCheckout] = useState<TCheckoutResponse | undefined>(undefined);
  const [loadingRedirect, setLoadingRedirect] = useState(false);

  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";

  useFocusEffect(() => {
    setShoppingCartId(props.route.params.shoppingCartId);
    setCheckout(props.route.params.checkout);
  });

  useEffect(() => {
    const unsuscribe = nav.addListener("blur", () => {
      setErrorMessage("");
      setSuccessMessage("");
      setLoadingRedirect(false);
      setShoppingCartId("");
      setCheckout(undefined);
    });
    return unsuscribe;
  }, []);

  const openLink = async (total: any) => {
    let result = await WebBrowser.openBrowserAsync(urlPay + total);
    if (result.type === "cancel" || result.type === "dismiss") {
      getCartById(shoppingCartId!)
        .then((res: any) => {
          if (res.status === 200) {
            // como enconté el carrito del customer hubo un "problema", el back lo borra al concretar la compra
            setErrorMessage("Problema con tu compra, intenta de nuevo");
          }
        })
        .catch(async (err) => {
          if (err.response.status === 404) {
            setSuccessMessage("Compra exitosa, gracias por usar UruBuy");
            setLoadingRedirect(true);
            await removeData("cartId");
            await removeData("hasCheckout");
            setTimeout(() => {
              nav.navigate("Home" as never);
            }, 4500);
          }
        });
    }
  };

  const handlePay = () => {
    if (checkout?.total) {
      // total no puede salir con mas de 2 decimales
      openLink(checkout?.total);
    } else console.error("total failed");
  };

  type ScrollList = {
    item: TCheckoutShoppingPost;
  };

  const ListItem: React.FC<ScrollList> = ({ item }) => {
    return (
      <>
        <View className="bg-[#fff] dark:bg-dark-mode-bg border-[1.22px] border-[#0c35c5] m-3 p-1">
          <Card
            containerStyle={
              dark
                ? { backgroundColor: "#292626", borderColor: "#292626", marginBottom: 4 }
                : { backgroundColor: "white", borderColor: "white", elevation: 5, marginBottom: 4 }
            }
          >
            <Card.Title className="border-0 dark:text-dark-mode-text"> {item.shoppingPost.title} </Card.Title>
            <Card.Divider className="fill-gray-900" />
            <View className="flex-row justify-between">
              {item.isDelivery ? (
                <Text className="font-semibold text-left dark:text-dark-mode-text">Delivery a: {item.address} </Text>
              ) : (
                <Text className="font-semibold text-left dark:text-dark-mode-text">
                  Retira en local: {item.address}{" "}
                </Text>
              )}
              <Text className="text-left dark:text-dark-mode-text"></Text>
            </View>
            <View className="flex-row justify-between">
              <Card.FeaturedSubtitle className="text-lg font-semibold text-[#000] dark:text-dark-mode-text">
                USD {item.shoppingPost.price}
              </Card.FeaturedSubtitle>
              <Card.FeaturedSubtitle className="text-lg font-semibold text-[#000] dark:text-dark-mode-text">
                Cantidad: {item.quantity}
              </Card.FeaturedSubtitle>
            </View>
            {/*o el resultado de multiplicar cantidad + lo que se está mostrando actualmente(el descuento por cada unidad)*/}
            {item.shoppingPost.onSale === true && item.shoppingPost.saleDiscount! > 0 ? (
              <>
                {item.isDelivery === true && item.shoppingPost.deliveryCost! > 0 ? (
                  <>
                    <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                      {/* Descuento: USD {item.shoppingPost.price * (item.shoppingPost.saleDiscount! / 100)}*/}
                      Descuento: USD{" "}
                      {item.quantity * (item.shoppingPost.price * (item.shoppingPost.saleDiscount! / 100))}
                    </Card.FeaturedSubtitle>
                    <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                      Costo delivery: USD {item.shoppingPost.deliveryCost}
                    </Card.FeaturedSubtitle>
                    <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                      Subtotal: USD{" "}
                      {item.shoppingPost.price * item.quantity -
                        item.quantity * (item.shoppingPost.price * (item.shoppingPost.saleDiscount! / 100)) +
                        item.shoppingPost.deliveryCost!}
                    </Card.FeaturedSubtitle>
                  </>
                ) : (
                  <>
                    <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                      Descuento: USD{" "}
                      {item.quantity * (item.shoppingPost.price * (item.shoppingPost.saleDiscount! / 100))}
                    </Card.FeaturedSubtitle>
                    <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                      Subtotal: USD{" "}
                      {item.shoppingPost.price * item.quantity -
                        item.quantity * (item.shoppingPost.price * (item.shoppingPost.saleDiscount! / 100))}
                    </Card.FeaturedSubtitle>
                  </>
                )}
              </>
            ) : item.isDelivery === true && item.shoppingPost.deliveryCost! > 0 ? (
              <>
                <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                  Costo delivery: USD {item.shoppingPost.deliveryCost}
                </Card.FeaturedSubtitle>
                <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                  Subtotal: USD {item.shoppingPost.price * item.quantity + item.shoppingPost.deliveryCost!}
                </Card.FeaturedSubtitle>
              </>
            ) : (
              <Card.FeaturedSubtitle className="text-lg font-semibold text-right text-[#000] dark:text-dark-mode-text">
                Subtotal: USD {item.shoppingPost.price * item.quantity}
              </Card.FeaturedSubtitle>
            )}
          </Card>
        </View>
      </>
    );
  };

  const _renderItem = ({ item }: { item: TCheckoutShoppingPost }) => <ListItem item={item} />;

  const _keyExtractor = (item: TCheckoutShoppingPost) => String(item.id);

  const handleExit = () => {
    deleteCheckout(String(checkout?.id))
      .then(async (res: any) => {
        if (res.status === 200) {
          nav.navigate("Home" as never);
          await removeData("hasCheckout");
        }
      })
      .catch((err) => console.error(err.response.data));
  };

  return (
    <ImageBackground
      source={require("../../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      {loadingRedirect && successMessage ? (
        <View className="my-auto">
          <Loading text={"Volviendo"} bg={true} />
          <View className="flex-wrap items-center justify-center p-5 mx-auto my-auto bg-header-color rounded-3xl">
            <CheckCircle size={35} weight="bold" color={"white"} />
            <Text className="text-[#fff]	text-center	text-[28px] font-semibold">{successMessage}</Text>
          </View>
        </View>
      ) : null}

      {errorMessage && errorMessage !== "" && !loadingRedirect ? (
        <TouchableOpacity
          className="flex-wrap items-center justify-center p-5 mx-auto my-auto bg-[#f00] rounded-3xl"
          onPress={() => setErrorMessage("")}
        >
          <Text className="text-[#fff]	text-center	text-[28px] font-semibold">{errorMessage}</Text>
        </TouchableOpacity>
      ) : null}

      {!errorMessage && errorMessage === "" && !loadingRedirect ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={checkout?.checkoutShoppingPosts}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          ListFooterComponent={
            !errorMessage && errorMessage === "" && !loadingRedirect ? (
              <>
                <Divider style={{ padding: 1.13, backgroundColor: "white" }} />
                <View className="bg-[#fff] dark:bg-dark-mode-bg w-auto m-3 p-3 border-[1.33px] border-header-color rounded-2xl ">
                  <View className="flex-row justify-between">
                    <Text className="dark:text-dark-mode-text	text-center	text-[23px] font-semibold ml-1 p-1">
                      Subtotal
                    </Text>
                    <Text className="dark:text-dark-mode-text	text-center	text-[23px] font-semibold mr-1 p-1">
                      USD {checkout?.subtotal}
                    </Text>
                  </View>

                  {checkout?.discount && checkout.discount > 0 ? (
                    <View className="flex-row justify-between">
                      <Text className="dark:text-dark-mode-text	text-center	text-[26px] font-semibold ml-1 p-1">
                        Descuentos
                      </Text>
                      <Text className="dark:text-dark-mode-text	text-center	text-[26px] font-semibold mr-1 p-1">
                        USD {checkout.discount}
                      </Text>
                    </View>
                  ) : null}

                  {checkout?.deliveryCost && checkout.deliveryCost > 0 ? (
                    <View className="flex-row justify-between">
                      <Text className="dark:text-dark-mode-text	text-center	text-[26px] font-semibold ml-1 p-1">
                        Costo delivery
                      </Text>
                      <Text className="dark:text-dark-mode-text	text-center	text-[26px] font-semibold mr-1 p-1">
                        USD {checkout?.deliveryCost}
                      </Text>
                    </View>
                  ) : null}

                  <View className="flex-row justify-between">
                    <Text className="dark:text-dark-mode-text	text-center	text-[28px] font-semibold ml-1 p-1">Total</Text>
                    <Text className="dark:text-dark-mode-text	text-center	text-[28px] font-semibold mr-1 p-1">
                      USD {checkout?.total.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <CustomButton isDisabled={false} onPress={handlePay} value="Continuar" style={undefined} />

                <View className="flex-row-reverse justify-around">
                  <View className="bottom-[35px] left-[90px]">
                    <PayPalSvg color={"white"} />
                  </View>
                </View>

                <CustomButton isDisabled={false} onPress={handleExit} value="Salir" style={undefined} />
                <View className="bottom-[28px] left-[80px] w-3">
                  <X size={20} color={"white"} />
                </View>
              </>
            ) : null
          }
          ItemSeparatorComponent={() => <Divider style={{ padding: 1.13, backgroundColor: "white" }} />}
        />
      ) : null}
    </ImageBackground>
  );
}
