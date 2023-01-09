import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { getData, getShoppingPosts, storeData } from "../services/Requests";
import { ActivityIndicator, Divider } from "react-native-paper";
import { Card } from "@rneui/themed";
import SearchBar from "react-native-dynamic-search-bar";
import SettingNotifications from "../components/SettingNotifications";
import { useColorScheme } from "nativewind";
import { BackHandler } from "react-native";
import Loading from "../components/Loading";
import { TShoppingPost } from "../../urubuy";
import { Truck } from "phosphor-react-native";
const noitem = require("../../assets/noitem.png");

export default function Home() {
  const nav = useNavigation();
  const [email, setEmail] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [onEnd, setOnEnd] = useState(false);
  let [shoppingPost, setShoppingPost] = useState<TShoppingPost[] | undefined>(undefined);
  const [aux, setAux] = useState<TShoppingPost[] | undefined>(undefined);

  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      setShoppingPost(undefined);
      setAux([]);
    });
    return unsubscribe;
  }, [nav]);

  useEffect(() => {
    const getInitialData = async () => {
      const email = await getData("email");
      setEmail(email as string);
      getShoppingPosts()
        .then((res) => {
          if (res.status === 200) {
            let posts = res.data as TShoppingPost[];
            let notMyPosts = posts.filter((p) => p.sellerEmail !== email && p.shoppingPostStatus !== "PAUSED");
            setShoppingPost(notMyPosts);
          }
        })
        .catch(() => setShoppingPost([]));
    };

    const unsubscribe = nav.addListener("focus", () => {
      getInitialData();
      //  setPage(0);
    });
    return unsubscribe;
  }, [nav]);

  // prevent exit
  useEffect(() => {
    const backAction = () => {
      Alert.alert("", "Salir?", [
        {
          text: "Volver",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Bye!", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const handlePress = (data: any) => {
    nav.navigate(
      "ShoppingPost" as never,
      {
        id: `${data.id}`,
      } as never,
    );
  };

  type ScrollList = {
    data: TShoppingPost;
  };

  const ListItem: React.FC<ScrollList> = ({ data }) => {
    let randomIndex: number;
    if (data.base64Images) {
      randomIndex = Math.floor(Math.random() * data.base64Images.length);
    }
    return (
      <>
        <TouchableOpacity onPress={() => handlePress(data)}>
          <View className="bg-[#fff] dark:bg-dark-mode-bg border-[1.22px] border-[#0c35c5] m-3 p-1">
            <Card
              containerStyle={
                dark
                  ? {
                      backgroundColor: "#292626",
                      borderColor: "#554b4b",
                      elevation: 10,
                      marginBottom: 4,
                      borderWidth: 1,
                      shadowRadius: 10,
                      shadowColor: "#aaeeda",
                      shadowOpacity: 0.3,
                    }
                  : {
                      backgroundColor: "white",
                      borderColor: "white",
                      elevation: 10,
                      marginBottom: 4,
                      borderWidth: 2,
                      shadowRadius: 10,
                      shadowColor: "#0c35c5",
                      shadowOpacity: 0.3,
                    }
              }
            >
              <Card.Title className="dark:text-dark-mode-text"> {data.title} </Card.Title>
              <Card.Divider className="fill-gray-900" />
              <Card.Image
                className=""
                style={{ resizeMode: "contain" }}
                source={
                  !randomIndex!
                    ? data.base64Images.length === 0
                      ? noitem
                      : data.base64Images[0].includes("data:image")
                      ? { uri: data.base64Images[0] }
                      : { uri: `data:image/jpg;base64,${data.base64Images[0]}` }
                    : data.base64Images.length === 0
                    ? noitem
                    : data.base64Images[randomIndex].includes("data:image")
                    ? { uri: data.base64Images[randomIndex] }
                    : { uri: `data:image/jpg;base64,${data.base64Images[randomIndex]}` }
                }
              />

              <Card.Divider className="m-3 fill-gray-900" />
              <View className="flex-row justify-between">
                <View className="flex-row">
                  <Text className="font-semibold text-[18px] dark:text-dark-mode-text my-auto">
                    {"USD " + data.price}
                  </Text>
                  {data.onSale ? (
                    <Text className="font-bold dark:text-[#0f0] text-[#0e994d] ml-2">{"% " + data.saleDiscount}</Text>
                  ) : (
                    ""
                  )}
                </View>
                {data.hasDelivery ? (
                  <View className="flex-row items-center justify-center">
                    <Text className="p-1 font-semibold text-[18px] dark:text-dark-mode-text">Delivery</Text>
                    <Truck size={20} color={dark ? "white" : "black"} />
                  </View>
                ) : (
                  ""
                )}
              </View>
            </Card>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  type LoadList = {
    load: boolean;
  };

  const FooterList: React.FC<LoadList> = ({ load }) => {
    if (!load) return null;
    return (
      <View className="p-[10px]">
        <ActivityIndicator size={25} color="#fff" />
      </View>
    );
  };

  const removeText = () => {
    setSearchText("");
    setAux(undefined);
  };

  shoppingPost = searchText
    ? shoppingPost?.filter((x) => x.title.toLowerCase().includes(searchText.toLowerCase()))
    : shoppingPost;

  const reloadList = async () => {
    if (loading) return;

    setLoading(true);

    getShoppingPosts()
      .then((res) => {
        if (res.status === 200) {
          let k: TShoppingPost[] = res.data;

          /* if (aux) {
            // es busqueda, si no encuentra items en su lista deberia ir a buscar mas a la bd
            console.log(aux[0].title);
          }*/

          if (k.length === shoppingPost?.length) {
            setOnEnd(true);
            setLoading(false);
          } else if (k.length > shoppingPost!.length) {
            let arr = k.splice(shoppingPost!.length, k.length);
            let notMyPosts = arr.filter((p) => p.sellerEmail !== email);
            notMyPosts.forEach((p) => {
              if (shoppingPost?.find((x) => x.id === p.id) === undefined) {
                setShoppingPost([...shoppingPost!, ...notMyPosts]);
              }
            });

            setOnEnd(true);
            setLoading(false);
          } else if (k.length < shoppingPost!.length) {
            let w = shoppingPost;
            w?.forEach((xw) => {
              if (!k.includes(xw)) {
                w?.splice(w.indexOf(xw), 1);
              }
            });
            setShoppingPost(w);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const handleChangeText = (text: string) => {
    setAux(shoppingPost);
    setOnEnd(true);
    setSearchText(text);
  };

  const _renderItem = ({ item }: { item: TShoppingPost }) => <ListItem data={item} />;

  const _keyExtractor = (item: TShoppingPost) => String(item.id);

  const _separator = () => {
    return <Divider style={{ padding: 1.13, backgroundColor: "white" }} />;
  };

  return (
    <View className="items-center justify-center flex-1 dark:bg-[#181802]">
      <ImageBackground
        source={require("../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        <SettingNotifications />
        <SearchBar
          placeholder="Buscar"
          placeholderTextColor={dark ? "white" : "black"}
          onChangeText={(text) => handleChangeText(text)}
          value={searchText}
          textInputStyle={{ color: dark ? "white" : "black" }}
          onClearPress={() => removeText()}
          className="mt-3 dark:bg-dark-mode-bg dark:text-dark-mode-text border-[1.33px] border-header-color "
          searchIconImageStyle={dark ? { tintColor: "white" } : {}}
          clearIconImageStyle={dark ? { tintColor: "white" } : {}}
        />

        {shoppingPost?.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-2xl font-bold dark:text-dark-mode-text">No hay publicaciones</Text>
          </View>
        ) : shoppingPost ? (
          <FlatList
            style={{}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={_separator}
            contentContainerStyle={{ marginHorizontal: 5 }}
            data={shoppingPost}
            keyExtractor={_keyExtractor}
            renderItem={_renderItem}
            onEndReached={() => {
              if (!onEnd) {
                setAux(shoppingPost);
                reloadList();
                setOnEnd(true);
              }
            }}
            onMomentumScrollBegin={() => {
              setOnEnd(false);
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={<FooterList load={loading} />}
          />
        ) : (
          <View className="mx-auto my-auto">
            <Loading text={"Cargando publicaciones"} bg={true} />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}
