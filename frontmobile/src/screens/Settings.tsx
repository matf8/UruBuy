import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, TextInput } from "react-native-paper";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Buffer } from "buffer";
import {
  ArrowFatLinesRight,
  BellRinging,
  BugBeetle,
  Check,
  CircleHalf,
  Moon,
  Password,
  PauseCircle,
  Sun,
  Swap,
  X,
  XCircle,
} from "phosphor-react-native";
import { Appearance } from "react-native";
import { useColorScheme } from "nativewind";
import CustomReport, { ReportIOS } from "../components/Report/CustomReport";
import CustomInput from "../components/CustomInput";
import {
  deleteCustomerKC,
  getCustomerProfile,
  getData,
  login,
  suspendAccount,
  toggleSettingNotifications,
} from "../services/Requests";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { removeDataStored } from "./customer/Logout";
import { TUserKC } from "../../urubuy";
import Loading from "../components/Loading";

function Settings() {
  const version: string = "1.0";
  const id = Buffer.from(Constants.manifest?.extra?.DEVICE_ID).toString("base64");
  let model = Device.modelId;
  let deviceInfo;
  if (model) deviceInfo = Device.brand + " " + model + " " + Device.osName + "/" + Device.osVersion;
  else deviceInfo = Device.brand + " " + Device.osName + "/" + Device.osVersion;

  const [chooseTheme, setChooseTheme] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const [promptAndroid, setPromptAndroid] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [activeUser, setActiveUser] = useState<string | undefined>(undefined);
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [ntfEnabled, setNtfEnabled] = useState(false);

  const getUserActive = async () => {
    return await getData("email");
  };

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      setUserPassword("");
      setPromptAndroid(false);
    });
    return unsubscribe;
  }, []);

  useFocusEffect(() => {
    getUserActive().then((res) => {
      setActiveUser(res as string);
      if (res) {
        getCustomerProfile(res as string)
          .then((res) => {
            setNtfEnabled(res.data.notificationsEnabled);
          })
          .catch((err) => {
            console.error(err.response.data);
            alert("error al obtener perfil de usuario");
          });
      }
    });
  });

  const requestDarkTheme = () => {
    if (colorScheme === "light") toggleColorScheme();
  };

  const requestLightTheme = () => {
    if (colorScheme === "dark") toggleColorScheme();
  };

  const requestAutoTheme = () => {
    const actualScheme = Appearance.getColorScheme();
    if (dark === (actualScheme === "light")) toggleColorScheme();
  };

  const handleReport = () => {
    if (Platform.OS === "android") {
      setPromptAndroid(true);
    } else {
      ReportIOS();
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(true);
  };

  const handleVerifyDelete = () => {
    setConfirmDelete(false);
    setVerifyDelete(true);
  };

  const checkUserPassword = async () => {
    let username = await getData("username");
    let email = await getData("email");
    var user = {
      email: email,
      password: userPassword,
    } as TUserKC;
    setLoading(true);
    login(user)
      .then((res: any) => {
        if (res.status === 200) {
          setVerifyDelete(false);
          setUserPassword("");
          suspendAccount(email!)
            .then((res) => {
              if (res?.status === 200) {
                Alert.alert(`${
                  username ? username : "Usuario"
                }, tu cuenta ha sido suspendida, si deseas volver tus datos estarán disponibles
              al registrarte nuevamente en la plataforma.`);
                removeDataStored();
                deleteCustomerKC(email!);
                nav.navigate("Home" as never);
              }
            })
            .catch((err) => {
              console.error(err.response.data);
              if (err.response.status === 409) Alert.alert(err.response.data);
            });
        }
      })
      .catch((err: any) => {
        console.error(err.response.data.error_description);
        if (err.response.status === 401 && err.response.data.error_description === "Invalid user credentials")
          Alert.alert("Credenciales incorrectas");
        else Alert.alert("Problema interno, intente luego");
      })
      .finally(() => setLoading(false));
  };

  const handleNotifications = async (value: boolean) => {
    toggleSettingNotifications(activeUser!)
      .then((res: any) => {
        if (res.status === 200) {
          let r = res.data as boolean;
          setNtfEnabled(r);
        }
      })
      .catch((e) => console.error(e.response.data));
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        <CustomReport android={promptAndroid} />

        {!loading ? (
          <>
            <Text
              className={
                Platform.OS === "android"
                  ? "text-[35px] " + "mt-3 mr-7 p-2 font-extrabold text-[#fff]"
                  : "text-[42px] " + "mt-5 mr-7 p-2 font-extrabold text-[#fff]"
              }
            >
              Configuración
            </Text>
            <Divider style={{ height: 1.3, backgroundColor: "white" }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[#fff] text-[18px] font-bold mt-[20px] ml-3 p-2">Opciones generales </Text>

              <View
                className="w-[96%] mx-auto border-2 border-[#8a0e79] flex"
                style={{
                  elevation: 5,
                  shadowRadius: 9,
                  shadowColor: "black",
                  shadowOpacity: 10,
                  shadowOffset: {
                    height: 2,
                    width: 3,
                  },
                }}
              >
                {activeUser ? (
                  <View className="p-2 h-10 flex-row bg-[#fff] dark:bg-[#292626] border-header-color border-[1.33px] m-3 rounded-2xl">
                    <BellRinging size={19} color={dark ? "white" : "black"} weight={"duotone"} />
                    <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">
                      Notificaciones
                    </Text>
                    <Switch
                      value={ntfEnabled}
                      onChange={() => handleNotifications(!ntfEnabled)}
                      className={Platform.OS === "ios" ? "absolute top-[3px] scale-[.85] right-1" : ""}
                    />
                  </View>
                ) : null}

                <TouchableOpacity
                  onPress={() => setChooseTheme(true)}
                  className="p-2 h-10 flex-row bg-[#fff] dark:bg-[#292626] border-header-color border-[1.33px] m-3 rounded-2xl"
                >
                  <Swap weight="fill" size={19} color={dark ? "white" : "black"} />
                  <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">
                    Cambiar tema
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReport}
                  className="p-2 h-10 flex-row bg-[#fff] dark:bg-[#292626] border-header-color border-[1.33px] m-3 rounded-2xl"
                >
                  <BugBeetle weight="fill" size={19} color={dark ? "white" : "black"} />
                  <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">
                    Reportar error
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-[#fff] text-[18px] font-bold mt-[20px] ml-3 p-2">App info</Text>
              <View
                className="w-[96%] mx-auto border-2 border-[#8a0e79] flex"
                style={{
                  elevation: 5,
                  shadowRadius: 9,
                  shadowColor: "black",
                  shadowOpacity: 10,
                  shadowOffset: {
                    height: 2,
                    width: 3,
                  },
                }}
              >
                <View className="flex-row p-2 border-[#fff] border-[1.33px] m-5 rounded-2xl ">
                  <Text className="text-[#fff] text-[22px] font-semibold"> Client version </Text>
                  <Text className="text-[#fff] text-[22px] mx-auto"> {version} </Text>
                </View>
                <View className="flex-row p-2 border-[#fff] border-[1.33px] m-5 rounded-2xl ">
                  <Text className="text-[#fff] text-[22px] font-semibold "> Device Id </Text>
                  <Text className="text-[#fff] text-[22px] mx-auto"> {id} </Text>
                </View>
                <View className="flex-row p-2 border-[#fff] border-[1.33px] m-5 rounded-2xl ">
                  <Text className="text-[#fff] text-[22px] mx-auto"> {deviceInfo} </Text>
                </View>
              </View>
              {activeUser ? (
                <View className="p-2 mt-3">
                  <TouchableOpacity
                    onPress={handleDeleteAccount}
                    className="p-2 h-10 flex-row bg-[#ff0000] dark:bg-[#ff0000] border-[white] border-[1.33px] m-5 rounded-2xl"
                  >
                    <PauseCircle weight="fill" size={19} color="white" />
                    <Text className="text-[#fff] text-[17px] font-bold mx-auto my-auto">Suspender mi cuenta</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                ""
              )}
            </ScrollView>

            {/***************** MODALS *****************/}

            {chooseTheme || confirmDelete || verifyDelete ? (
              <View>
                <View className="items-center justify-center flex-1 mt-6">
                  <Modal
                    animationType="fade"
                    className="border-[#dbad2e] border-[1.33]"
                    transparent={true}
                    visible={chooseTheme}
                    onRequestClose={() => {
                      setChooseTheme(!chooseTheme);
                    }}
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
                          onPress={() => setChooseTheme(!chooseTheme)}
                        >
                          <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={requestAutoTheme}
                          className="p-2 h-10 w-[187px] flex-row bg-[#fff] dark:bg-[#504e4e] border-header-color border-[1.33px] m-5 rounded-2xl"
                        >
                          <CircleHalf
                            weight="fill"
                            size={19}
                            style={{ padding: 10 }}
                            color={dark ? "white" : "black"}
                          />
                          <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold mx-auto">
                            Automático
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={requestDarkTheme}
                          className="p-2 h-10 w-[187px] flex-row bg-[#fff] dark:bg-[#504e4e] border-header-color border-[1.33px] m-5 rounded-2xl"
                        >
                          <Moon weight="fill" size={19} style={{ padding: 10 }} color={dark ? "white" : "black"} />
                          <Text className="text-[#000] text-[18px] dark:text-dark-mode-text font-semibold mx-auto">
                            Oscuro
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={requestLightTheme}
                          className="p-2 h-10 w-[187px] flex-row bg-[#fff] dark:bg-[#504e4e] border-header-color border-[1.33px] m-5 rounded-2xl"
                        >
                          <Sun weight="fill" size={19} style={{ padding: 10 }} color={dark ? "white" : "black"} />
                          <Text className="text-[#000] text-[18px] dark:text-dark-mode-text font-semibold mx-auto">
                            Claro
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>

                <View className="items-center justify-center flex-1 mt-6">
                  <Modal
                    animationType="fade"
                    className="border-[#dbad2e] border-[1.33]"
                    transparent={true}
                    visible={confirmDelete}
                    onRequestClose={() => {
                      setConfirmDelete(!confirmDelete);
                    }}
                  >
                    <View className="items-center justify-center flex-1 max-h-[650px] ">
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
                          onPress={() => setConfirmDelete(!confirmDelete)}
                        >
                          <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
                        </TouchableOpacity>
                        <Text
                          className={
                            Platform.OS === "android"
                              ? "text-[17px] " + "text-[#f00] font-semibold mx-auto"
                              : "text-[19px] " + "text-[#f00] font-semibold mx-auto"
                          }
                        >
                          Estás apunto de suspender tu cuenta
                        </Text>
                        <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold mx-auto mt-2">
                          Esta acción es reversible registrándote nuevamente en la plataforma con el mismo email. Ten en
                          cuenta que tus datos, compras y calificaciones seguirán en el sistema y en caso de que vuelvas
                          a registrarte tu información personal será la que estaba antiguamente.
                        </Text>
                        <View className="flex-row p-2 mt-5">
                          <TouchableOpacity
                            onPress={() => setConfirmDelete(!confirmDelete)}
                            className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                          >
                            <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                              Cancelar
                            </Text>
                            <X
                              weight="fill"
                              size={19}
                              style={
                                Platform.OS === "android"
                                  ? { padding: 2, marginTop: 16.5, marginRight: 5 }
                                  : { padding: 2, marginTop: 12, marginRight: 5 }
                              }
                              color={"green"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleVerifyDelete()}
                            className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                          >
                            <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                              Continuar
                            </Text>
                            <ArrowFatLinesRight
                              weight="duotone"
                              size={19}
                              style={
                                Platform.OS === "android"
                                  ? { padding: 2, marginTop: 16.5, marginRight: 5 }
                                  : { padding: 2, marginTop: 12, marginRight: 5 }
                              }
                              color={"red"}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>

                <View className="items-center justify-center flex-1 mt-6">
                  <Modal
                    animationType="fade"
                    className="border-[#db2e2e] border-[1.33]"
                    transparent={true}
                    visible={verifyDelete}
                    onRequestClose={() => {
                      setVerifyDelete(!verifyDelete);
                    }}
                  >
                    <View className="items-center justify-center flex-1 max-h-[650px] ">
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
                            setVerifyDelete(!verifyDelete);
                            setConfirmDelete(false);
                            setUserPassword("");
                          }}
                        >
                          <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
                        </TouchableOpacity>

                        <CustomInput
                          onChangeText={setUserPassword}
                          value={userPassword}
                          keyboardType={undefined}
                          left={<TextInput.Icon name={() => <Password size={18} color={dark ? "white" : "black"} />} />}
                          placeholder={"Contraseña"}
                          secureTextEntry={true}
                          style={undefined}
                          onBlur={undefined}
                          onSubmitEditing={checkUserPassword}
                        />
                        <View className="flex-row p-2 mt-5">
                          <TouchableOpacity
                            onPress={() => {
                              setVerifyDelete(!verifyDelete);
                              setUserPassword("");
                            }}
                            className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                          >
                            <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                              Cancelar
                            </Text>
                            <X
                              weight="fill"
                              size={19}
                              style={
                                Platform.OS === "android"
                                  ? { padding: 2, marginTop: 16.5, marginRight: 5 }
                                  : { padding: 2, marginTop: 12, marginRight: 5 }
                              }
                              color={"green"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => checkUserPassword()}
                            className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                          >
                            <Text className="text-[#000] dark:text-[#fff] text-[18px] font-semibold m-3">
                              Confirmar
                            </Text>
                            <Check
                              weight="fill"
                              size={19}
                              style={
                                Platform.OS === "android"
                                  ? { padding: 2, marginTop: 16.5, marginRight: 5 }
                                  : { padding: 2, marginTop: 12, marginRight: 5 }
                              }
                              color={"red"}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            ) : (
              ""
            )}
          </>
        ) : (
          <View className="items-center justify-center flex-1">
            <Loading text="Verificando..." bg={true} />
          </View>
        )}
      </ImageBackground>
    </>
  );
}

export default Settings;
