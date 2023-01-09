import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import { Divider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { TUserReview } from "../../urubuy";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { getCustomerProfile } from "../services/Requests";

type ReviewUserCard = {
  review: TUserReview;
};

type TReviewUsername = {
  username: string;
  reviewId: number;
};

export default function SellerReview(props: any) {
  const [receivedUserReviews, setRecievedReviewsUser] = useState<TUserReview[] | undefined>(undefined);
  const [reviewUsername, setReviewUsername] = useState<TReviewUsername[] | undefined>([]);
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const nav = useNavigation();

  useEffect(() => {
    setRecievedReviewsUser(props.route.params.sellerReviews);
    handleCustomer(props.route.params.sellerReviews);
  }, []);

  const handleCustomer = (reviews: TUserReview[]) => {
    let k: TReviewUsername[] = [];

    if (reviews && reviews.length > 0) {
      reviews.forEach((r) => {
        getCustomerProfile(r.customerEmail).then((res) => {
          if (res.status === 200) {
            if (reviewUsername?.find((y) => y.reviewId === +r.id) === undefined) {
              if (res.data.isSuspended)
                setReviewUsername((p) => [...p!, { username: "Usuario suspendido", reviewId: +r.id }]);
              else setReviewUsername((p) => [...p!, { username: res.data.username, reviewId: +r.id }]);
            }
          }
        });
      });
    }
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
          <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">Por: </Text>
          <TouchableOpacity
            onPress={() =>
              nav.navigate(
                "UserProfile" as never,
                {
                  email: review.customerEmail,
                } as never,
              )
            }
          >
            <Text className="text-[18px] p-[11px] text-header-color dark:text-[#f1c533] font-semibold">
              {reviewUsername &&
                reviewUsername.length > 0 &&
                reviewUsername?.map((x) => {
                  if (x.reviewId === +review.id) {
                    return x.username;
                  }
                })}
            </Text>
          </TouchableOpacity>
        </View>
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
        {receivedUserReviews ? (
          receivedUserReviews.length > 0 ? (
            <>
              <FlatList
                className="mt-2"
                data={receivedUserReviews}
                ItemSeparatorComponent={_separator}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Card review={item} />}
              />
            </>
          ) : (
            <Text className="text-[25px] p-[11px] text-[#fff] font-semibold">
              Este vendedor no ha sido calificado por ningún comprador
            </Text>
          )
        ) : null}
      </View>
    </ImageBackground>
  );
}
