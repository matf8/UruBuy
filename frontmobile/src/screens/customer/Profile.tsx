import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, Platform, Alert } from "react-native";
import { getData, getCustomerProfile, updateProfile, resetPassword, getIdUsuario } from "../../services/Requests";
import StarSvg from "../../components/Svgs/StarSvg";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import CustomButton from "../../components/CustomButton";
import { AddressBook, Handbag, Star, Swap, TrashSimple, WarningOctagon } from "phosphor-react-native";
import { useColorScheme } from "nativewind";
import { TCustomer } from "../../../urubuy";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import * as ImagePicker from "expo-image-picker";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import Loading from "../../components/Loading";

function Profile() {
  const [user, setUser] = useState<TCustomer | undefined>(undefined);
  const nav = useNavigation();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsuscribe = nav.addListener("focus", () => {
      getInitialData();
    });
    return unsuscribe;
  }, []),
    useEffect(() => {
      const unsuscribe = nav.addListener("blur", () => {
        setUser(undefined);
      });
      return unsuscribe;
    }, []);

  const getInitialData = async () => {
    let email = (await getData("email")) as string;
    getCustomerProfile(email).then((res) => {
      if (res.status === 200) {
        let myUser: TCustomer = {
          username: res.data.username,
          email: res.data.email,
          password: "",
          averageRating: res.data.averageRating,
          addresses: res.data.addresses,
          picture: res.data.picture,
          givenUserReviews: res.data.givenUserReviews,
          receivedUserReviews: res.data.receivedUserReviews,
          givenReviews: res.data.givenReviews,
          purchases: res.data.purchases,
          isBlocked: res.data.isBlocked,
          isSuspended: res.data.isSuspended,
        };
        setUser(myUser);
      } else console.error("getting profile");
    });
  };

  const handleRemoveProfilePicture = () => {
    Alert.alert("Quitar foto de perfil", "Está seguro?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          updateProfile("", user?.username!)
            .then((res) => {
              if (res.status === 200) {
                Alert.alert("Foto de perfil eliminada");
                getInitialData();
              }
            })
            .catch((err) => {
              console.error(err);
              Alert.alert("Ocurrio un problema al eliminar la foto de perfil");
            });
        },
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      updateProfile(result.base64!, user?.username!).finally(() => {
        getInitialData();
      });
    }
  };

  const handleResetPassword = () => {
    setLoading(true);
    getIdUsuario()
      .then((res: any) => {
        res.data.map((u: any) => {
          if (u.email === user?.email.toLocaleLowerCase()) {
            let id = u.id;
            resetPassword(id)
              .then((res) => {
                if (res.status === 204) {
                  Alert.alert("Verifique email para restaurar contraseña");
                  setLoading(false);
                } else {
                  setLoading(false);
                  Alert.alert("Ha ocurrido un error al enviar mail");
                }
              })
              .catch((er) => {
                setLoading(false);
                console.error(er);
              });
          }
        });
      })
      .catch((er) => {
        setLoading(false);
        console.error(er);
      });
  };

  return (
    <>
      <View className="flex-1 dark:bg-dark-mode-bg">
        <Menu>
          <MenuTrigger>
            {user?.picture && user?.picture !== "" ? (
              <Image
                source={
                  user?.picture.includes("data:image")
                    ? { uri: user?.picture }
                    : { uri: `data:image/jpg;base64,${user?.picture}` }
                }
                className="w-[137px] h-[137px] mt-[35px] ml-3 rounded-full"
              />
            ) : (
              <Image
                source={require("../../../assets/placeholder.png")}
                resizeMode="contain"
                className="w-[137px] h-[137px] mt-[35px] ml-3 rounded-full"
              />
            )}
          </MenuTrigger>

          <MenuOptions
            customStyles={
              dark
                ? { optionsWrapper: { backgroundColor: "#292626" } }
                : { optionsWrapper: { backgroundColor: "white" } }
            }
          >
            <MenuOption style={{ flexDirection: "row-reverse" }} onSelect={() => handleRemoveProfilePicture()}>
              <Text className="font-medium text-[16px] text-right dark:text-dark-mode-text"> Remover </Text>
              <TrashSimple color={dark ? "white" : "black"} size={20} style={{ marginRight: 3 }} />
            </MenuOption>
            <MenuOption style={{ flexDirection: "row-reverse" }} onSelect={() => pickImage()}>
              <Text className="font-medium text-[16px] text-right dark:text-dark-mode-text"> Cambiar </Text>
              <Swap color={dark ? "white" : "black"} size={20} style={{ marginRight: 3 }} />
            </MenuOption>
          </MenuOptions>
        </Menu>

        <View className="max-h-[250px] max-w-[250px] absolute top-[70] left-[160] border-[black]">
          <Text className="text-[black] text-[15px] dark:text-dark-mode-text font-semibold ml-[15px] mt-[15px] p-[1]">
            {user?.email}
          </Text>

          <StarRatingDisplay
            rating={user?.averageRating ? user?.averageRating : 1}
            starStyle={{ marginHorizontal: -2, left: 16, marginTop: 10 }}
            color={dark ? "#cf8c40" : "#0c35c5"}
            starSize={24}
          />
        </View>

        {loading ? (
          <View className="mx-auto my-auto">
            <Loading text="Enviando mail..." bg={dark ? true : false} />
          </View>
        ) : (
          <View className="my-8">
            <TouchableOpacity>
              <CustomButton
                isDisabled={false}
                onPress={() =>
                  nav.navigate(
                    "Purchases" as never,
                    {
                      user: user,
                      purchases: user?.purchases,
                    } as never,
                  )
                }
                value={"Mis compras"}
                style={undefined}
              />
              <View
                className={Platform.select({
                  ios: "absolute left-[85px] mt-6",
                  android: "absolute left-[70px] mt-[30px]",
                })}
              >
                <Handbag size={26} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <CustomButton
                isDisabled={false}
                onPress={() => {
                  nav.navigate(
                    "Reviews" as never,
                    {
                      givenUserReviews: user?.givenUserReviews,
                      receivedUserReviews: user?.receivedUserReviews,
                      givenReviews: user?.givenReviews,
                    } as never,
                  );
                }}
                value={"Mis calificaciones"}
                style={undefined}
              />
              <View
                className={Platform.select({
                  ios: "absolute left-[85px] mt-6",
                  android: "absolute left-[70px] mt-[30px]",
                })}
              >
                <Star size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <CustomButton
                isDisabled={false}
                onPress={() =>
                  nav.navigate(
                    "Addresses" as never,
                    {
                      addresses: user?.addresses,
                      user: user?.email,
                    } as never,
                  )
                }
                value={"Mis direcciones"}
                style={undefined}
              />
              <View
                className={Platform.select({
                  ios: "absolute left-[85px] mt-6",
                  android: "absolute left-[70px] mt-[30px]",
                })}
              >
                <AddressBook size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <CustomButton
                isDisabled={false}
                onPress={() => handleResetPassword()}
                value={"Cambiar contraseña"}
                style={undefined}
              />
              <View
                className={Platform.select({
                  ios: "absolute left-[85px] mt-6",
                  android: "absolute left-[70px] mt-[30px]",
                })}
              >
                <WarningOctagon size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

export default Profile;
