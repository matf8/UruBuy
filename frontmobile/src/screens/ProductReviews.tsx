import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import { Divider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { TReview } from "../../urubuy";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { getCustomerProfile } from "../services/Requests";
import SliderSlick from "../components/SliderSlick";

type ReviewCard = {
  review: TReview;
};
export default function ProductReview(props: any) {
  const [receivedReviews, setRecievedReviews] = useState<TReview[] | undefined>([]);
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const nav = useNavigation();

  useFocusEffect(() => {
    setRecievedReviews(props.route.params.reviews);
  });

  useEffect(() => {
    const unsuscribe = nav.addListener("blur", () => {
      setRecievedReviews([]);
    });
    return unsuscribe;
  }, []);

  const handleProductClicked = (productId: string) => {
    nav.navigate(
      "ShoppingPost" as never,
      {
        id: productId,
      } as never,
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
          <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">
            {review.shoppingPost.title}
          </Text>
        </TouchableOpacity>
        <View className="flex-row flex-wrap justify-between">
          <Text className="text-[18px] flex-wrap p-[5px] ml-6 mt-3 dark:text-dark-mode-text font-semibold">
            {review.description}
          </Text>
          <TouchableOpacity
            onPress={() => nav.navigate("UserProfile" as never, { email: review.customerEmail } as never)}
          >
            <Text className="text-[18px] flex-wrap p-[5px] mr-3 dark:text-dark-mode-text font-semibold">
              {review.customerEmail}
            </Text>
          </TouchableOpacity>
        </View>
        {review.base64Images ? (
          <View className="p-2 scale-50 -mb-28 -mt-28">
            <SliderSlick pictures={review.base64Images} />
          </View>
        ) : null}
      </View>
    );
  };

  const _separator = () => {
    return <Divider style={{ padding: 1.13, backgroundColor: "white", margin: 15 }} />;
  };

  return (
    <ImageBackground
      source={require("../../assets/abstract.jpg")}
      resizeMode="cover"
      className="w-full h-full bg-no-repeat"
      blurRadius={6}
    >
      <View className="items-center justify-center h-max">
        {receivedReviews ? (
          receivedReviews.length > 0 ? (
            <>
              <FlatList
                className="mt-2"
                data={receivedReviews}
                ItemSeparatorComponent={_separator}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ReviewCard review={item} />}
              />
            </>
          ) : (
            <Text className="text-[25px] p-[11px] text-[#fff] font-semibold">
              Este producto no ha sido calificado por ningún comprador.
            </Text>
          )
        ) : null}
      </View>
    </ImageBackground>
  );
}
