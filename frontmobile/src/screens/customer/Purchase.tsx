import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Image, Text, View, Platform, Touchable } from "react-native";
import { Divider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Star } from "phosphor-react-native";
import CustomButton from "../../components/CustomButton";
import { TCustomer, TPurchase, TReview, TSeller, TUserReview } from "../../../urubuy";
import { TouchableOpacity } from "react-native-gesture-handler";

type PurchaseCard = {
  purchase: TPurchase;
};

type CustomShow = {
  purchaseId: number;
  show: boolean;
};

export const handleStatus = (status: string) => {
  let s = "";
  status === "PREPARING_ORDER"
    ? (s = "En preparación")
    : status === "OUT_FOR_DELIVERY"
    ? (s = "En camino")
    : status === "READY_FOR_PICKUP"
    ? (s = "Listo para retirar")
    : status === "DELIVERED"
    ? (s = "Entregado")
    : (s = "Indefinido");
  return s;
};

export default function Purchase(props: any) {
  const nav = useNavigation();
  const [purchases, setPurchases] = useState<TPurchase[] | undefined>(undefined);
  const { colorScheme } = useColorScheme();
  const [user, setUser] = useState<TCustomer | undefined>(undefined);
  const dark = colorScheme === "dark";

  useEffect(() => {
    const unsubscribe = nav.addListener("focus", () => {
      let u = props.route.params.user as TCustomer;
      setUser(u);
      setPurchases(props.route.params.purchases);
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      setPurchases([]);
    });
    return unsubscribe;
  }, [props]);

  const handleReviewing = (purchaseId: string, seller: string) => {
    let sReviewed: boolean = false;
    let p = purchases?.find((x) => x.id === purchaseId);
    if (p)
      p.customerReview && p.customerReview.customerEmail === user?.email ? (sReviewed = true) : (sReviewed = false);

    nav.navigate(
      "GiveReview" as never,
      {
        purchase: p,
        user: user,
        seller: seller,
        sReviewed: sReviewed,
      } as never,
    );
  };

  const Card: React.FC<PurchaseCard> = ({ purchase }) => {
    return (
      <View
        className="
          ml-[2%]
          mb-[10px]
          w-[96%]          
          bg-[#ffffff]
          dark:bg-dark-mode-bg     
          border-header-color rounded-md border-[1.13px]"
      >
        <View className="flex-row-reverse justify-between">
          <Text className="text-[18px] p-[11px] flex-wrap dark:text-dark-mode-text font-semibold">
            Status: {handleStatus(purchase.status)}
          </Text>
          <Text className="text-[18px] p-[12px] dark:text-dark-mode-text font-semibold">
            {Platform.OS === "android" ? purchase.date : "Fecha: " + purchase.date}
          </Text>
        </View>
        <Divider style={dark ? { height: 1.5, backgroundColor: "white" } : { height: 1.5 }} />
        <View className="flex-row flex-wrap justify-between">
          <View className="flex-row">
            <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">Vendedor:</Text>
            <TouchableOpacity
              onPress={() => nav.navigate("UserProfile" as never, { email: purchase.sellerEmail } as never)}
            >
              <Text className="text-[18px] p-[11px] text-gold-buy font-semibold">{purchase.sellerEmail}</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">USD {purchase.total}</Text>
        </View>
        {purchase.shoppingPosts.map((x, i) => (
          <Text key={i} className="text-[18px] p-[11px] text-right dark:text-dark-mode-text font-semibold">
            {i + 1 + ": " + x.title}
          </Text>
        ))}
        {purchase.status === "DELIVERED" && (
          <View className="flex-row">
            <CustomButton
              value={"Calificar"}
              style={{ width: "40%", margin: 35, right: -70 }}
              onPress={() => handleReviewing(purchase.id, purchase.sellerEmail)}
              isDisabled={false}
            />
            <View
              className={Platform.select({
                ios: "absolute left-[116px] mt-[25px]",
                android: "absolute left-[111px] mt-[30px]",
              })}
            >
              <Star size={21} color="white" />
            </View>
          </View>
        )}
      </View>
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
        {purchases && purchases.length > 0 ? (
          <FlatList
            className="mt-2"
            data={purchases}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Card purchase={item} />}
          />
        ) : (
          <Text className="text-[25px] p-[11px] mx-auto my-auto font-semibold">No has realizado compras</Text>
        )}
      </ImageBackground>
    </>
  );
}
