import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { ChatCircleDots, ImageSquare, PencilSimple, Star, UserCircle, X, XCircle } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, Alert, Platform, ImageBackground } from "react-native";
import { useColorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import SliderSlick from "../../components/SliderSlick";
import { minShoppingPost, TCustomer, TPurchase, TReview, TShoppingCart, TUserReview } from "../../../urubuy";
import { Divider, TextInput } from "react-native-paper";
import Loading from "../../components/Loading";
import myStyle from "../../../assets/styles";
import { getCustomerProfile, getData, getSellerProfile, reviewProduct, reviewSeller } from "../../services/Requests";
import StarRating from "react-native-star-rating-widget";

type GReview = {
  titlePhoto: string;
  base64: string;
};

export default function GiveReview(props: any) {
  const [purchase, setPurchase] = useState<TPurchase | undefined>(undefined);
  const [showReviewSeller, setShowReviewSeller] = useState(false);
  const [showReviewProduct, setShowReviewProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [images, setImages] = useState<string[] | undefined>([]);
  const [photos, setPhotos] = useState<GReview[] | undefined>([]);
  const [defaultRating, setDefaultRating] = useState(3);
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const [inputHeight, setInputHeight] = useState(0);
  const [email, setEmail] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [user, setUser] = useState<TCustomer | undefined>(undefined);
  const [sellerUsername, setSellerUsername] = useState("");
  const [sellerReviewed, setSellerReviewed] = useState(false);
  const [activeProduct, setActiveProduct] = useState<minShoppingPost | undefined>(undefined);
  const nav = useNavigation();

  useFocusEffect(() => {
    setPurchase(props.route.params.purchase);
    setUser(props.route.params.user);
    fetchSellerUsername(props.route.params.seller);
    setSellerEmail(props.route.params.seller);
  });

  useEffect(() => {
    getInitialData();
  }, [user]);

  const fetchSellerUsername = async (seller: string) => {
    getSellerProfile(seller).then((res) => {
      if (res.status === 200) {
        setSellerUsername(res.data.username);
      }
    });
  };

  const getInitialData = async () => {
    let email = await getData("email");
    setEmail(email!);
    setSellerReviewed(props.route.params.sReviewed);
  };

  const handleSeller = () => {
    setShowReviewSeller(!showReviewSeller);
  };

  const handleProduct = (product: minShoppingPost) => {
    setActiveProduct(product);
    setShowReviewProduct(!showReviewProduct);
  };

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });

    if (!result.cancelled) {
      result.selected.forEach((image: any) => {
        let photo: GReview = {
          titlePhoto: image.fileName,
          base64: image.base64,
        };
        if (photos?.some((p) => p.titlePhoto === photo.titlePhoto)) {
          console.warn("ya existe foto");
        } else {
          setPhotos((prev) => [...prev!, photo]);
          setImages((prev) => [...prev!, image.base64]);
        }
        setLoading(false);
      });
    } else setLoading(false);
  };

  let handleReview = () => {
    if (showReviewSeller === true) {
      let sellerReview: TUserReview = {
        id: "",
        rating: defaultRating,
        description: reviewComment,
        date: "",
        customerEmail: email,
        sellerEmail: sellerEmail,
        from: "CUSTOMER",
        purchaseId: +purchase?.id!,
      };
      reviewSeller(sellerReview)
        .then((res) => {
          if (res.status === 200) Alert.alert("Gracias por calificar");
        })
        .catch((err) => {
          Alert.alert("Imposible calificar", err.response.data);
        })
        .finally(() => {
          setReviewComment("");
          setSellerReviewed(true);
          setImages([]);
          setDefaultRating(3);
          showReviewProduct ? setShowReviewProduct(!showReviewProduct) : setShowReviewSeller(!showReviewSeller);
        });
    } else {
      let review = {
        id: "",
        rating: defaultRating,
        description: reviewComment,
        base64Images: images!,
        date: "",
        customerEmail: email,
        shoppingPostId: activeProduct!.id,
      };
      reviewProduct(review)
        .then((res) => {
          if (res.status === 200) Alert.alert("Gracias por calificar");
        })
        .catch((err) => {
          if (err.response.status === 403) Alert.alert("Ya calificaste este producto");
          else Alert.alert("Imposible calificar", err.response.data);
        })
        .finally(() => {
          setReviewComment("");
          setImages([]);
          setDefaultRating(3);
          showReviewProduct ? setShowReviewProduct(!showReviewProduct) : setShowReviewSeller(!showReviewSeller);
        });
    }
  };

  const sellerClicked = () => {
    if (sellerEmail) nav.navigate("UserProfile" as never, { email: sellerEmail } as never);
    else console.error("seller wrong");
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        <View className="flex-1">
          <Text className="mt-5 mr-7 p-2 text-[45px] font-extrabold text-dark-mode-text">Calificaciones</Text>
          <Divider style={{ height: 1.3, backgroundColor: "white" }} />

          <View className="border-header-color border-[1.33px] p-3 m-2 mt-[20px] bg-dark-mode-text dark:bg-dark-mode-bg">
            <View className="flex-row">
              <Text className="p-2 text-lg font-semibold dark:text-dark-mode-text">Calificar compra del vendedor:</Text>
              <TouchableOpacity className="flex-1" onPress={() => sellerClicked()}>
                <Text className="flex-wrap p-2 text-lg font-semibold text-gold-buy ">{sellerUsername}</Text>
              </TouchableOpacity>
            </View>
            <Text className="p-2 text-lg font-semibold dark:text-dark-mode-text">Productos de la compra</Text>
            {purchase &&
              purchase.shoppingPosts &&
              purchase.shoppingPosts.length > 0 &&
              purchase.shoppingPosts.map((p, i) => (
                <View key={i} className="flex-row flex-wrap">
                  <TouchableOpacity onPress={() => handleProduct(p)}>
                    <Text className="p-1 text-lg font-semibold text-gold-buy">{"‣  " + p.title}</Text>
                  </TouchableOpacity>
                </View>
              ))}

            <View className="justify-center m-2">
              <CustomButton
                onPress={() => handleSeller()}
                value={sellerReviewed ? "Vendedor ya calificado" : "Calificar vendedor"}
                style={undefined}
                isDisabled={sellerReviewed}
              />
              <View className="left-[57px] bottom-7">
                <UserCircle size={19} color={"white"} weight="duotone" />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      {showReviewSeller || showReviewProduct ? (
        <View className="dark:bg-dark-mode-bg">
          <View className="items-center justify-center flex-1 mt-6">
            <Modal
              animationType="fade"
              className="border-[#dbad2e] border-[1.33]"
              transparent={true}
              visible={showReviewProduct || showReviewSeller}
              onRequestClose={() => {
                showReviewProduct ? setShowReviewProduct(!showReviewProduct) : setShowReviewSeller(!showReviewSeller);
              }}
            >
              <ScrollView
                contentContainerStyle={{ alignItems: "center", justifyContent: "center", flex: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="items-center justify-center flex-1 max-h-[750px] ">
                  <View
                    className="mt-5 bg-[#fff] dark:bg-[#0f0a36] rounded-3xl p-[35px] items-center"
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
                      onPress={() => {
                        setImages([]);
                        setPhotos([]);
                        setReviewComment("");
                        setLoading(false);
                        setDefaultRating(3);
                        setActiveProduct(undefined);
                        showReviewProduct
                          ? setShowReviewProduct(!showReviewProduct)
                          : setShowReviewSeller(!showReviewSeller);
                      }}
                    >
                      <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-center dark:text-dark-mode-text">
                      {showReviewProduct
                        ? `Calificar producto: ${activeProduct?.title}`
                        : `Calificar vendedor: ${sellerEmail}`}
                    </Text>
                    <Divider
                      style={dark ? { height: 2, backgroundColor: "white" } : { height: 2, backgroundColor: "#32377B" }}
                    />
                    <View className="w-[300]">
                      {Platform.OS === "ios" ? (
                        <TextInput
                          placeholder="Comentario"
                          multiline={true}
                          left={
                            <TextInput.Icon
                              name={() => <ChatCircleDots size={18} weight="bold" color={dark ? "white" : "black"} />}
                            />
                          }
                          onChangeText={setReviewComment}
                          onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                          theme={dark ? { colors: { placeholder: "white", text: "white" } } : {}}
                          style={
                            dark
                              ? [myStyle.textAreaB, { height: Math.max(50, inputHeight) }]
                              : [myStyle.textArea, { height: Math.max(50, inputHeight) }]
                          }
                          value={reviewComment}
                        />
                      ) : (
                        <TextInput
                          placeholder="Comentario"
                          multiline={true}
                          left={
                            <TextInput.Icon
                              name={() => <ChatCircleDots size={18} weight="bold" color={dark ? "white" : "black"} />}
                            />
                          }
                          onChangeText={setReviewComment}
                          theme={dark ? { colors: { placeholder: "white", text: "white" } } : {}}
                          style={
                            dark
                              ? [myStyle.textAreaB, { height: Math.max(50, inputHeight) }]
                              : [myStyle.textArea, { height: Math.max(50, inputHeight) }]
                          }
                          value={reviewComment}
                        />
                      )}
                    </View>
                    <View className="flex-row mt-2 text-start">
                      <Text className="mt-3 text-lg font-semibold dark:text-dark-mode-text">Calificación: </Text>
                      <StarRating
                        starStyle={{ marginHorizontal: -0.5, left: 16, marginTop: 10 }}
                        rating={defaultRating}
                        color="#cf8c40"
                        starSize={32}
                        minRating={3}
                        onChange={(n) => setDefaultRating(n)}
                      />
                    </View>
                    {showReviewProduct && (
                      <View className="flex-row mt-">
                        <CustomButton
                          onPress={() => {
                            openPicker();
                            setLoading(true);
                          }}
                          value={"Imágenes"}
                          style={undefined}
                          isDisabled={false}
                        />
                        <View
                          className={
                            Platform.OS === "android" ? "right-[179px] top-[27px]" : "right-[180px] top-[25px]"
                          }
                        >
                          <ImageSquare size={20} weight="fill" color={"white"} />
                        </View>
                      </View>
                    )}
                    {loading ? (
                      <Loading text="Subiendo fotos" bg={dark ? true : false} />
                    ) : (
                      showReviewProduct &&
                      images &&
                      images.length > 0 && (
                        <View className="flex-row flex-wrap justify-center">
                          <SliderSlick pictures={images!} />
                        </View>
                      )
                    )}

                    <View className="flex-row justify-between mt-3">
                      <CustomButton
                        onPress={() => {
                          setImages([]);
                          setPhotos([]);
                          setReviewComment("");
                          setLoading(false);
                          setDefaultRating(3);
                          setActiveProduct(undefined);
                          showReviewProduct
                            ? setShowReviewProduct(!showReviewProduct)
                            : setShowReviewSeller(!showReviewSeller);
                        }}
                        value={"Salir"}
                        style={{ width: 130, margin: 10 }}
                        isDisabled={false}
                      />
                      <View
                        className={Platform.OS === "android" ? "right-[135px] top-[27px]" : "right-[132px] top-[25px]"}
                      >
                        <X size={20} weight="fill" color="white" />
                      </View>
                      <CustomButton
                        onPress={() => handleReview()}
                        value={"Calificar"}
                        style={{ width: 130, margin: 10 }}
                        isDisabled={false}
                      />
                      <View
                        className={Platform.OS === "android" ? "right-[135px] top-[26px]" : "right-[132px] top-[24px]"}
                      >
                        <Star size={20} weight="duotone" color="white" />
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Modal>
          </View>
        </View>
      ) : (
        ""
      )}
    </>
  );
}
