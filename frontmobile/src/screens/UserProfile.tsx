import React, { useEffect, useState } from "react";
import { Text, View, Image, Alert, FlatList, Platform } from "react-native";
import { getCustomerProfile, getSellerProfile } from "../services/Requests";
import { useNavigation } from "@react-navigation/core";
import Loading from "../components/Loading";
import { useColorScheme } from "nativewind";
import { TSeller, TCustomer, TUserReview } from "../../urubuy";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import CustomButton from "../components/CustomButton";
import { Star } from "phosphor-react-native";
import { Divider } from "react-native-paper";
import { Card } from "@rneui/themed";

function UserProfile(props: any) {
  const [seller, setSeller] = useState<TSeller | undefined>(undefined);
  const [customer, setCustomer] = useState<TCustomer | undefined>(undefined);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<TUserReview[] | undefined>(undefined);
  const [customerSuspended, setCustomerSuspended] = useState<boolean | undefined>(false);
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const nav = useNavigation();
  const dark = colorScheme === "dark";

  useEffect(() => {
    const unsuscribe = nav.addListener("focus", () => {
      setReviews([]);
      getInitialData();
    });
    return unsuscribe;
  }, [props]);

  useEffect(() => {
    const unsuscribe = nav.addListener("blur", () => {
      setReviews([]);
      setShowReviews(false);
      setSeller(undefined);
      setCustomer(undefined);
    });
    return unsuscribe;
  }, []);

  const getInitialData = async () => {
    setLoading(true);

    getSellerProfile(props.route.params.email)
      .then((res) => {
        if (res.status === 200) {
          let myUser: TSeller = res.data;
          setSeller(myUser);
          setReviews(myUser.receivedUserReviews);
        } else console.error("err getting s profile");
      })
      .catch((err) => {
        if (seller === undefined) {
          getCustomerProfile(props.route.params.email)
            .then((res) => {
              if (res.status === 200) {
                let myUser: TCustomer = res.data;
                setCustomer(myUser);
                setCustomerSuspended(false);
                setReviews(myUser.receivedUserReviews);
              } else console.error("err getting c profile");
            })
            .catch((err) => {
              console.error(err.response.data);
              Alert.alert("user no encontrado");
              nav.canGoBack();
            });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderSeller = (user: TSeller) => {
    return (
      <>
        {user?.picture !== undefined && user?.picture !== "" && user?.picture !== null ? (
          <Image
            source={
              user.picture.includes("http")
                ? { uri: user.picture }
                : user.picture.includes("data:image")
                ? { uri: user?.picture }
                : { uri: `data:image/jpg;base64,${user?.picture}` }
            }
            className="w-[150px] h-[150px] mt-[35px] ml-3 rounded-full"
          />
        ) : (
          <Image
            source={require("../../assets/placeholder.png")}
            resizeMode="contain"
            className="w-[137px] h-[137px] mt-[35px] ml-3 rounded-full"
          />
        )}
        <View className="max-h-[250px] max-w-[250px] absolute top-[70] left-[160] border-[black]">
          <Text className="text-[black] dark:text-dark-mode-text text-[20px] font-semibold ml-[15px]">
            {user.firstName + " " + user.lastName}
          </Text>
          <View className="mt-3 ml-4">
            <StarRatingDisplay
              rating={user?.averageRating ? user?.averageRating : 1}
              starStyle={{ marginHorizontal: -2 }}
              color={dark ? "#cf8c40" : "blue"}
            />
          </View>
        </View>

        <CustomButton
          onPress={() => setShowReviews(!showReviews)}
          value={"Ver calificaciones"}
          style={undefined}
          isDisabled={false}
        />
        <View className="left-[72px] bottom-7">
          <Star size={20} color="white" weight="duotone" />
        </View>
      </>
    );
  };

  const renderCustomer = (user: TCustomer) => {
    return (
      <>
        {user?.picture !== undefined && user?.picture !== "" && user?.picture !== null ? (
          <Image
            source={
              customerSuspended
                ? require("../../assets/placeholder.png")
                : user.picture.includes("http")
                ? { uri: user.picture }
                : user.picture.includes("data:image")
                ? { uri: user?.picture }
                : { uri: `data:image/jpg;base64,${user?.picture}` }
            }
            className="w-[150px] h-[150px] mt-[35px] ml-3 rounded-full"
          />
        ) : (
          <Image
            source={require("../../assets/placeholder.png")}
            resizeMode="contain"
            className="w-[137px] h-[137px] mt-[35px] ml-3 rounded-full"
          />
        )}
        {!customerSuspended ? (
          <View className="max-h-[250px] max-w-[250px] absolute top-[70] left-[160] border-[black]">
            <Text className="text-[black] dark:text-dark-mode-text text-[20px] font-semibold ml-[15px]">
              {user.username}
            </Text>
            <View className="mt-3 ml-4">
              <StarRatingDisplay
                rating={user?.averageRating ? user?.averageRating : 1}
                starStyle={{ marginHorizontal: -2 }}
                color={dark ? "#cf8c40" : "blue"}
              />
            </View>
          </View>
        ) : (
          <View className="max-h-[250px] max-w-[250px] absolute top-[70] left-[160] border-[black] flex-row">
            <Text className="text-[black] dark:text-dark-mode-text text-[20px] font-semibold ml-[15px] line-through decoration-custom-red">
              {user.username}
            </Text>
            <Text className="text-[black] dark:text-dark-mode-text text-[20px] font-semibold ml-[15px]">
              {"suspendido"}
            </Text>
          </View>
        )}
        {!customerSuspended && (
          <>
            <CustomButton
              onPress={() => setShowReviews(!showReviews)}
              value={"Ver calificaciones"}
              style={undefined}
              isDisabled={false}
            />
            <View className={Platform.OS === "android" ? "left-[40px] bottom-[12px]" : "left-[72px] bottom-7"}>
              <Star size={20} color="white" weight="duotone" />
            </View>
          </>
        )}
      </>
    );
  };

  const _renderItem = ({ item }: { item: TUserReview }) => <ListItem data={item} />;

  const _keyExtractor = (item: TUserReview) => String(item.id);

  const _header = () => {
    return (
      <Text className="text-[#000] mx-auto dark:text-dark-mode-text text-[20px] font-semibold mt-[15px]">
        Calificaciones
      </Text>
    );
  };

  const _separator = () => {
    return <Divider style={{ padding: 1.13, backgroundColor: "white" }} />;
  };

  type ScrollList = {
    data: TUserReview;
  };

  const ListItem: React.FC<ScrollList> = ({ data }) => {
    return (
      <>
        <View className="bg-[#fff] dark:bg-dark-mode-bg  border-[1.22px] border-header-color dark:border-gold-buy m-3 p-1">
          <Card
            containerStyle={
              dark
                ? {
                    backgroundColor: "#292626",
                    borderColor: "#554b4b",
                    elevation: 10,
                    marginBottom: 4,
                    borderWidth: 1,
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
            <Card.Title className="text-[#000] dark:text-dark-mode-text">
              <StarRatingDisplay
                rating={data.rating ? data.rating : 1}
                starStyle={{ marginHorizontal: -2 }}
                color={dark ? "#cf8c40" : "#0c35c5"}
                starSize={23}
              />
            </Card.Title>
            <Card.Divider className="fill-gray-900" />

            <View className="justify-between">
              <Text className="text-[#000] mt-2 dark:text-dark-mode-text text-[18px] font-semibold">
                {customer ? data.sellerEmail : data.customerEmail}
              </Text>
              <Card.FeaturedSubtitle className="font-semibold text-[18px] p-2 text-[#000] dark:text-dark-mode-text my-auto">
                {data.description}
              </Card.FeaturedSubtitle>
              <Card.FeaturedSubtitle className="font-semibold text-[18px] dark:text-dark-mode-text my-auto"></Card.FeaturedSubtitle>
            </View>
          </Card>
        </View>
      </>
    );
  };

  return (
    <>
      <View className="flex-1 dark:bg-dark-mode-bg">
        {loading ? (
          <View className="items-center justify-center flex-1">
            <Loading text="Cargando perfil" bg={dark ? false : true} />
          </View>
        ) : customer ? (
          renderCustomer(customer)
        ) : seller ? (
          renderSeller(seller)
        ) : null}
        {showReviews ? (
          reviews && reviews.length > 0 ? (
            <FlatList
              ItemSeparatorComponent={_separator}
              ListHeaderComponent={_header}
              data={reviews}
              renderItem={_renderItem}
              keyExtractor={_keyExtractor}
            />
          ) : (
            <Text className="text-[#000] text-center my-auto dark:text-dark-mode-text text-[20px] font-semibold ml-[15px]">
              Usuario no tiene calificaciones.
            </Text>
          )
        ) : null}
      </View>
    </>
  );
}

export default UserProfile;
