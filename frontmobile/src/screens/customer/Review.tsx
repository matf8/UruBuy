import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text, View, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { Divider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { TUserReview, TReview } from "../../../urubuy";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SliderSlick from "../../components/SliderSlick";

type ReviewUserCard = {
  review: TUserReview;
};

type ReviewCard = {
  review: TReview;
};

export default function Review(props: any) {
  const nav = useNavigation();
  const [givenReviewsUser, setGivenReviewsUser] = useState<TUserReview[] | undefined>(undefined);
  const [receivedUserReviews, setRecievedReviewsUser] = useState<TUserReview[] | undefined>(undefined);
  const [givenReviews, setGivenReviews] = useState<TReview[] | undefined>(undefined);
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "receivedUserReview", title: "Reseñas de vendedores" },
    { key: "givenUserReview", title: "Reseñas a vendedores" },
    { key: "givenReviews", title: "Reseñas a productos" },
  ]);

  useEffect(() => {
    setGivenReviewsUser(props.route.params.givenUserReviews);
    setRecievedReviewsUser(props.route.params.receivedUserReviews);
    setGivenReviews(props.route.params.givenReviews);
  }, [props]);

  const _receivedUserReview = () => (
    <ImageBackground
      source={require("../../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      <View className="items-center justify-center h-max">
        {receivedUserReviews ? (
          receivedUserReviews.length > 0 ? (
            <>
              <FlatList
                ListHeaderComponent={
                  <Text className="text-[35px] p-[11px] text-dark-mode-text font-semibold">
                    Calificaciones recibidas por vendedores
                  </Text>
                }
                className="mt-2"
                data={receivedUserReviews}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Card review={item} />}
              />
            </>
          ) : (
            <Text className="text-[25px] p-[11px] text-[#fff] font-semibold">
              No ha sido calificado por ningún vendedor
            </Text>
          )
        ) : null}
      </View>
    </ImageBackground>
  );

  const _givenUserReview = () => (
    <ImageBackground
      source={require("../../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      <View className="items-center justify-center h-max w-max">
        {givenReviewsUser ? (
          givenReviewsUser.length > 0 ? (
            <FlatList
              className="mt-2"
              ListHeaderComponent={
                <Text className="text-[35px] p-[11px] text-dark-mode-text font-semibold">
                  Calificaciones dadas a vendedores
                </Text>
              }
              data={givenReviewsUser}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <Card review={item} />}
            />
          ) : (
            <Text className="text-[25px] p-[11px] text-[#fff] font-semibold">No ha calificado a ningún vendedor</Text>
          )
        ) : null}
      </View>
    </ImageBackground>
  );

  const _givenReviews = () => (
    <ImageBackground
      source={require("../../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      <View className="items-center justify-center h-max">
        {givenReviews ? (
          givenReviews.length > 0 ? (
            <>
              <FlatList
                ListHeaderComponent={
                  <Text className="text-[35px] p-[11px] text-dark-mode-text font-semibold">
                    Calificaciones dadas a productos
                  </Text>
                }
                className="mt-2"
                data={givenReviews}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ReviewCard review={item} />}
              />
            </>
          ) : (
            <Text className="text-[25px] p-[11px] text-[#fff] font-semibold">No ha calificado ningún producto</Text>
          )
        ) : null}
      </View>
    </ImageBackground>
  );

  const renderScene = SceneMap({
    receivedUserReview: _receivedUserReview,
    givenUserReview: _givenUserReview,
    givenReviews: _givenReviews,
  });

  const handleProfileSeller = (seller: string) => {
    nav.navigate(
      "UserProfile" as never,
      {
        email: seller!,
      } as never,
    );
  };

  const handleProductClicked = (productId: string) => {
    nav.navigate(
      "ShoppingPost" as never,
      {
        id: productId,
      } as never,
    );
  };

  const Card: React.FC<ReviewUserCard> = ({ review }) => {
    return (
      <View
        className="
          ml-[2%]
          mb-[10px]
          w-[96%]           
          bg-[#fff]
          dark:bg-dark-mode-bg          
          border-header-color rounded-[5px] border-[1.33px]"
      >
        <View className="flex-row justify-between">
          <Text className="text-[18px] p-[11px] items-start dark:text-dark-mode-text font-semibold">
            Fecha: {review.date}
          </Text>
          <View className="flex-row p-2">
            <StarRatingDisplay
              rating={review.rating ? review?.rating : 1}
              starStyle={{ marginHorizontal: -2 }}
              color={dark ? "#cf8c40" : "blue"}
            />
          </View>
        </View>
        <Divider style={dark ? { height: 1.5, backgroundColor: "white" } : { height: 1.5 }} />
        <View className="flex-row justify-between">
          <Text className="text-[18px] flex-wrap p-[5px] ml-6 mt-3 dark:text-dark-mode-text font-semibold">
            {review.description}
          </Text>
        </View>
        <View className="flex-row">
          <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">Vendedor</Text>
          <TouchableOpacity onPress={() => handleProfileSeller(review.sellerEmail)}>
            <Text className="text-[18px] p-[11px] text-header-color dark:text-[#f1c533] font-semibold">
              {review.sellerEmail}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ReviewCard: React.FC<ReviewCard> = ({ review }) => {
    return (
      <View
        className="
          ml-[2%]
          mb-[10px]
          w-[96%]           
          bg-[#fff]
          dark:bg-dark-mode-bg          
          border-header-color rounded-[5px] border-[1.33px]"
      >
        <View className="flex-row justify-between">
          <Text className="text-[18px] p-[11px] items-start dark:text-dark-mode-text font-semibold">
            Fecha: {review.date}
          </Text>
          <View className="flex-row p-2">
            <StarRatingDisplay
              rating={review.rating ? review?.rating : 1}
              starStyle={{ marginHorizontal: -2 }}
              color={dark ? "#cf8c40" : "blue"}
            />
          </View>
        </View>
        <Divider style={dark ? { height: 1.5, backgroundColor: "white" } : { height: 1.5 }} />
        <TouchableOpacity onPress={() => handleProductClicked(review.shoppingPost.id)}>
          <Text className="text-[18px] p-[11px] text-header-color dark:text-[#f1c533] font-semibold">
            {review.shoppingPost.title}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-between">
          <Text className="text-[18px] flex-wrap p-[5px] ml-6 mt-3 dark:text-dark-mode-text font-semibold">
            {review.description}
          </Text>
        </View>
        {review.base64Images && (
          <View className="p-2 scale-50 -mb-28 -mt-28">
            <SliderSlick pictures={review.base64Images} />
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        swipeEnabled={true}
        animationEnabled={true}
        initialLayout={{ width: layout.width }}
        style={{ backgroundColor: "#fff" }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor="#0c35c5"
            inactiveColor="#501728"
            indicatorStyle={{ backgroundColor: "#0c35c5" }}
            labelStyle={
              Platform.OS === "android" ? { fontWeight: "bold", fontSize: 14 } : { fontSize: 16, fontWeight: "bold" }
            }
            style={{ backgroundColor: "white" }}
          />
        )}
      />
    </ImageBackground>
  );
}
