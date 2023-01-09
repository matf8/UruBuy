import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/CustomButton";
import SliderSlick from "../components/SliderSlick";
import { addToCart, getData, getSellerProfile, getShoppingPostById, getUserCart } from "../services/Requests";
import CustomReport, { ReportIOS } from "../components/Report/CustomReport";
import Loading from "../components/Loading";
import { TShoppingPost, TUserReview } from "../../urubuy";
import { Package, ShoppingCartSimple } from "phosphor-react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";

type SellerRating = {
  username: string;
  averageRating: number;
  receivedUserReviews: TUserReview[];
};

export default function ShoppingPost(props: any) {
  const nav = useNavigation();
  const [shoppingPost, setShoppingPost] = useState<TShoppingPost | undefined>(undefined);
  const [promptAndroid, setPromptAndroid] = useState(false);
  const [activeUser, setActiveUser] = useState<string | undefined>(undefined);
  const [sellerRating, setSellerRating] = useState<SellerRating | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      if (promptAndroid === true) setPromptAndroid(false);
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    setLoading(true);
    getShoppingPostById(props.route.params.id)
      .then((res) => {
        setShoppingPost(res.data);
        handleShowSeller(res.data.sellerEmail);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const unsubscribe = nav.addListener("focus", () => {
      setShoppingPost(undefined);
      loadUser();
    });
    return unsubscribe;
  }, [props]);

  const loadUser = () => {
    getData("email").then((res) => {
      setActiveUser(res);
    });
  };

  const handleAddCart = async () => {
    if (activeUser) {
      addToCart(activeUser, Number(shoppingPost?.id)).finally(() => getUserCart());
      Alert.alert("Agregado!");
    }
  };

  const handleReport = () => {
    if (Platform.OS === "android") {
      setPromptAndroid(true);
    } else {
      ReportIOS();
    }
  };

  function handleProfile(seller: string) {
    if (seller) nav.navigate("UserProfile" as never, { email: seller } as never);
    else console.error("seller wrong");
  }

  function handleShowSeller(email: string) {
    getSellerProfile(email).then((res) => {
      if (res.status === 200) {
        setSellerRating({
          username: res.data.username,
          averageRating: Math.floor(res.data.averageRating),
          receivedUserReviews: res.data.receivedUserReviews,
        });
      }
    });
  }

  function handleLogin() {
    nav.navigate("Login" as never);
  }

  return (
    <View className="items-center justify-center flex-1 bg-[#fff]">
      <ImageBackground
        source={require("../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        <CustomReport android={promptAndroid} />
        {loading ? (
          <View className="flex mx-auto my-auto">
            <Loading text="Cargando publicación..." bg={true} />
          </View>
        ) : shoppingPost ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => handleProfile(shoppingPost.sellerEmail)}>
                <Text className="text-center font-bold text-[19px] mt-2 ml-5 text-gold-buy">
                  {sellerRating?.username!}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={Platform.OS === "android" ? "mr-3" : ""}
                onPress={() =>
                  nav.navigate("SellerReviews" as never, { sellerReviews: sellerRating?.receivedUserReviews } as never)
                }
              >
                <View className="mt-2 mr-5">
                  <StarRatingDisplay
                    rating={sellerRating?.averageRating ? sellerRating?.averageRating : 1}
                    starStyle={{ marginHorizontal: -2 }}
                    color="#cf8c40"
                    starSize={23}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <SliderSlick pictures={shoppingPost.base64Images !== null ? shoppingPost.base64Images : []} />
            <Text className="text-center font-bold text-[24px] mt-1 p-2 text-dark-mode-text">{shoppingPost.title}</Text>
            {shoppingPost.onSale ? (
              <View
                className={
                  shoppingPost.onSale && !shoppingPost.hasDelivery ? "flex-row items-center justify-center" : "flex-row"
                }
              >
                <Text className="font-bold text-[17px] mt-2 ml-7 text-gold-buy">
                  EN OFERTA!! {"%" + shoppingPost.saleDiscount}
                </Text>
              </View>
            ) : null}
            <View className="flex-row justify-evenly">
              <View className="flex-row text-left">
                <Text className="font-bold text-[17px] mt-2 text-dark-mode-text"> USD </Text>
                <Text
                  className={
                    shoppingPost.onSale
                      ? "font-bold text-[17px] mt-2 line-through text-dark-mode-text"
                      : "font-bold text-[17px] mt-2 text-dark-mode-text"
                  }
                >
                  {shoppingPost.price}
                </Text>
                {shoppingPost.onSale ? (
                  <Text className="font-bold text-[17px] mt-2 text-dark-mode-text">
                    {" " +
                      (shoppingPost.price - (shoppingPost.price / 100) * shoppingPost.saleDiscount!).toString() +
                      ""}
                  </Text>
                ) : null}
              </View>
              {shoppingPost.hasDelivery ? (
                <View className="flex-row">
                  <Text className="font-bold text-[17px] mt-2 text-dark-mode-text">Producto con delivery</Text>
                  <Package
                    size={20}
                    weight="duotone"
                    color="#cf8c40"
                    style={Platform.OS === "ios" ? { top: 4.5 } : { top: 10.5 }}
                  />
                </View>
              ) : null}
            </View>

            <View className="h-auto w-[96%] bg- ml-[2%] rounded-3xl border-2 border-gold-buy border-opacity-85">
              <View className="flex-row justify-between">
                <Text className="mt-3 p-3 font-bold text-[17px] text-dark-mode-text">Descripción del producto</Text>
                <Text className="mt-3 p-3 font-bold text-[17px] text-dark-mode-text">
                  Peso: {shoppingPost.weight} kg
                </Text>
              </View>
              <Text className="flex-wrap p-3 -mb-6 -mt-3 font-semibold text-[17px] text-dark-mode-text">
                {shoppingPost.stock
                  ? shoppingPost.stock > 10
                    ? "¡Stock disponible!"
                    : shoppingPost.stock > 5
                    ? "¡¡¡Ultimas unidades!!!"
                    : shoppingPost.stock === 0
                    ? "Producto sin stock"
                    : null
                  : null}
              </Text>
              <Text className="flex-wrap mt-3 p-3 font-semibold text-[17px] text-dark-mode-text">
                {shoppingPost.description}
              </Text>

              <TouchableOpacity
                className={Platform.OS === "android" ? "ml-5" : ""}
                onPress={() => {
                  nav.navigate("ProductReviews" as never, { reviews: shoppingPost.reviews } as never);
                }}
              >
                <View className="flex-row mt-2 ml-5">
                  <StarRatingDisplay
                    rating={shoppingPost?.averageRating ? shoppingPost?.averageRating : 1}
                    starStyle={{ marginHorizontal: -2 }}
                    color="#cf8c40"
                    starSize={23}
                  />
                  <Text className="font-semibold mt-1 ml-2 text-[17px] text-dark-mode-text">
                    {shoppingPost.reviews.length}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {activeUser ? (
              <View className="p-1 m-1">
                <CustomButton
                  isDisabled={false}
                  onPress={() => handleAddCart()}
                  value="Agregar al carrito"
                  style={{}}
                />
                <View className="absolute bottom-[14px] left-[21%]">
                  <ShoppingCartSimple size={19} weight="duotone" color="white" />
                </View>
                {false && (
                  <CustomButton
                    isDisabled={false}
                    onPress={() => handleReport()}
                    value="Reportar publicación"
                    style={{ backgroundColor: "red" }}
                  />
                )}
              </View>
            ) : (
              <View className="p-1 m-1">
                <CustomButton
                  isDisabled={false}
                  onPress={() => handleLogin()}
                  value="Iniciar sesión y añadir"
                  style={{}}
                />
                <View
                  className={Platform.select({
                    ios: "absolute bbottom-[14px] left-[21%]",
                    android: "absolute bottom-[14px] left-[21%]",
                  })}
                >
                  <ShoppingCartSimple size={19} weight="duotone" color="white" />
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="flex mx-auto my-auto">
            <Text className="text-center text-[20px] font-bold text-dark-mode-text">
              Ha ocurrido un problema, lo sentimos.
            </Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}
