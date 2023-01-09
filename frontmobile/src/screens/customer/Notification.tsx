import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Card } from "@rneui/themed";
import { TPurchase, TShoppingPost } from "../../../urubuy";
import { getPurchaseById, getShoppingPosts } from "../../services/Requests";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/core";
import Loading from "../../components/Loading";
import { Truck } from "phosphor-react-native";
import { handleStatus } from "./Purchase";
const noitem = require("../../../assets/noitem.png");

type ScrollList = {
  data: TShoppingPost;
};

export default function Notification(props: any) {
  let [shoppingPost, setShoppingPost] = useState<TShoppingPost[] | undefined>(undefined);
  const nav = useNavigation();
  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [purchase, setPurchase] = useState<TPurchase | undefined>(undefined);
  const [categoryNotification, setCategoryNotification] = useState<string>("");

  useEffect(() => {
    let cat = props.route.params.category;
    if (cat) setCategoryNotification(cat);
    if (cat === "promociones") {
      fetchPromotions();
    } else if (cat === "nuevos") {
      fetchNews();
    } else if (cat === "estado") {
      statusChanged(props.route.params.purchaseId);
    } else if (!cat || cat === "") errorNotification();
  }, [props]);

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      setShoppingPost([]);
      setPurchase(undefined);
      setStatus(false);
      setCategoryNotification("");
    });
    return unsubscribe;
  }, [nav]);

  async function fetchPromotions() {
    getShoppingPosts()
      .then((res: any) => {
        if (res.status === 200) {
          let posts: TShoppingPost[] = res.data;
          let withOff: TShoppingPost[] = posts.filter((item: TShoppingPost) => item.onSale === true);
          setShoppingPost(withOff);
        }
      })
      .catch((err: any) => {
        console.error(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function statusChanged(id: number) {
    setStatus(true);
    getPurchaseById(id)
      .then((res) => {
        setPurchase(res?.data);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false);
      });
  }

  async function fetchNews() {
    if (purchase) setPurchase(undefined);
    getShoppingPosts()
      .then((res: any) => {
        if (res.status === 200) {
          let posts: TShoppingPost[] = res.data;
          let zerok: TShoppingPost[] = posts.filter((item: TShoppingPost) => item.isNew === true);
          setShoppingPost(zerok);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        console.error(err.response.data);
      })
      .finally(() => {});
  }

  const errorNotification = () => {
    setLoading(false);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: dark ? "white" : "black" }}>Ha ocurrido un error, lo sentimos.</Text>
      </View>
    );
  };

  const handlePress = (data: any) => {
    nav.navigate(
      "ShoppingPost" as never,
      {
        id: `${data.id}`,
      } as never,
    );
  };

  const ListItem: React.FC<ScrollList> = ({ data }) => {
    return (
      <>
        <View className="dark:bg-dark-mode-bg dark:border-[1.22px] rounded-2xl dark:border-[#0c35c5] m-1 p-1">
          <Card
            containerStyle={
              dark ? { backgroundColor: "#292626", borderColor: "#292626", borderRadius: 0, borderWidth: 0 } : {}
            }
          >
            <TouchableOpacity onPress={() => handlePress(data)}>
              <Card.Title className="dark:text-dark-mode-text"> {data.title} </Card.Title>
              <Card.Divider className="fill-gray-900" />
              <Card.Image
                className="p-2"
                style={{ resizeMode: "contain" }}
                source={
                  data.base64Images.length === 0
                    ? noitem
                    : data.base64Images[0].includes("data:image")
                    ? { uri: data.base64Images[0] }
                    : { uri: `data:image/jpg;base64,${data.base64Images[0]}` }
                }
              />
            </TouchableOpacity>
            <Card.Divider />
            <View className="flex-row-reverse justify-between">
              <View>
                <Text
                  className={
                    data.onSale
                      ? "font-bold text-right line-through dark:text-dark-mode-text"
                      : "font-bold text-right dark:text-dark-mode-text"
                  }
                >
                  {"USD " + data.price}
                </Text>
                {data.onSale ? (
                  <>
                    <Text className="font-bold text-[#479932] dark:text-[#0f0] text-right">
                      {"% " + data.saleDiscount}
                    </Text>
                    <Text className="p-1 font-bold dark:text-dark-mode-text ">
                      {"REBAJADO A USD " + (data.price - (data.price / 100) * data.saleDiscount!) + "!!"}
                    </Text>
                  </>
                ) : null}
              </View>
              {data.hasDelivery ? (
                <View className="flex-row items-center justify-center">
                  <Text className="p-1 font-bold dark:text-dark-mode-text">Delivery</Text>
                  <Truck size={20} color={dark ? "white" : "black"} />
                </View>
              ) : null}
            </View>
          </Card>
        </View>
      </>
    );
  };

  const _renderItem = ({ item }: { item: TShoppingPost }) => <ListItem data={item} />;

  const _header = () => {
    return categoryNotification === "promociones" ? (
      <View className="mt-1">
        <Text className="p-2 text-2xl font-bold text-center text-dark-mode-text">Rebajas!</Text>
      </View>
    ) : categoryNotification === "nuevos" ? (
      <View className="mt-3">
        <Text className="text-2xl font-bold text-center text-dark-mode-text">Productos nuevos</Text>
      </View>
    ) : null;
  };

  return (
    <View className="items-center justify-center flex-1">
      <ImageBackground
        source={require("../../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        {status && purchase && categoryNotification === "estado" ? (
          <View className="w-auto mx-auto my-auto border-[1.33px] m-2 border-header-color bg-[#fff] dark:bg-dark-mode-bg rounded-3xl h-auto">
            <Text className="text-[22px] p-4 font-bold text-[#000] dark:text-dark-mode-text">
              Estado de la compra: {purchase.orderPayPalId}
            </Text>
            <View className="flex flex-row flex-wrap">
              <Text className="text-[17px] p-2 font-bold text-[#000] dark:text-dark-mode-text">
                Compra: {purchase?.date}
              </Text>
              <Text className="text-[17px] p-2 font-bold text-[#000] dark:text-dark-mode-text">
                Estado: {handleStatus(purchase?.status)}
              </Text>
            </View>
            <Text className="text-[17px] p-3 font-bold text-[#000] dark:text-dark-mode-text">Items</Text>
            <View className="flex flex-col">
              {purchase?.shoppingPosts.map((item, index) => (
                <View key={index} className="flex flex-row flex-wrap justify-between">
                  <Text className="text-[17px] p-3 font-bold text-[#000] dark:text-dark-mode-text">
                    {"‣  " + item.title}
                  </Text>
                </View>
              ))}
            </View>
            {purchase?.status === "DELIVERED" && (
              <View className="w-auto mx-auto my-auto border-[1.33px] m-2 border-header-color bg-[#fff] dark:bg-dark-mode-bg rounded-3xl h-auto">
                <Text className="text-[17px] p-4 font-semibold text-[#000] dark:text-dark-mode-text">
                  Tu opinion es importante! No te olvides de calificar al vendedor y a los productos comprados, nos
                  ayudará a mejorar. {"\n"}
                  ¡Que disfrutes de tu compra!
                </Text>
              </View>
            )}
          </View>
        ) : !loading ? (
          <FlatList
            data={shoppingPost}
            ListHeaderComponent={_header}
            keyExtractor={(item) => item.id.toString()}
            renderItem={_renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="my-auto">
            <Loading text="Cargando ofertas" bg={true} />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}
