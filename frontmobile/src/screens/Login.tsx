import React, { useState, useEffect } from "react";
import { Image, Alert, Text, TouchableOpacity, View, Modal, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";
import {
  getCustomerProfile,
  getIdUsuario,
  getInfoUser,
  login,
  resetPassword,
  sendToken,
  storeData,
} from "../services/Requests";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import myStyle from "../../assets/styles";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { XCircle, At, Password, SignIn } from "phosphor-react-native";
import Loading from "../components/Loading";
import { useColorScheme } from "nativewind";
import { TUserKC } from "../../urubuy";
import { registerForPushNotificationsAsync } from "../components/SettingNotifications";

export default function Login() {
  const nav = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [passwordForgotten, setPasswordForgotten] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";

  useEffect(() => {
    nav.addListener("focus", () => {
      setEmail("");
      setPass("");
      setPasswordForgotten(false);
      setLoadingLogin(false);
      setLoading(false);
    });
  }, []);

  function handleLogin() {
    var user = {
      email: email,
      password: password,
    } as TUserKC;
    setLoadingLogin(true);
    login(user)
      .then((res: any) => {
        if (res.status === 200) {
          setLoadingLogin(false);
          storeData("tokenUser", res.data.access_token as string);
          getInfoUser()
            .then((res: any) => {
              let user = res.data.name !== undefined ? res.data.name : res.data.preferred_username;
              Alert.alert("Bienvenido " + user + "!");
              storeData("email", res.data.email as string);
              storeData("username", res.data.preferred_username as string);
              storeData("idUser", res.data.sub as string);
              getCustomerProfile(res.data.email).then((res: any) => {
                if (res.status === 200) storeData("userImg", res.data.picture as string);
              });

              nav.navigate("Home" as never);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err: any) => {
        if (err.response.data) {
          console.error(err.response.data.error_description);
          if (err.response.status === 401 && err.response.data.error_description === "Invalid user credentials")
            Alert.alert("Credenciales incorrectas, verifique");
          else if (err.response.status === 400 && err.response.data.error_description === "Account is not fully set up")
            Alert.alert("Verifique su cuenta, gracias");
          else if (err.response.status === 400 && err.response.data.error_description === "Account disabled")
            Alert.alert("Cuenta bloqueada. Contacte a los administradores.");
          else Alert.alert("Problema interno, intente luego");
        } else Alert.alert("Problema interno, intente luego");
      })
      .finally(() => {
        setLoadingLogin(false);
      });
  }

  const [expoPushToken, setExpoPushToken] = useState("");
  const [tokenSent, setTokenSent] = useState(false);

  const manageSentToken = (token: any) => {
    if (tokenSent === false) {
      sendToken(token);
      setTokenSent(true);
    }
  };

  const getNotificationToken = async () => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token!);
      manageSentToken(token);
    });
  };

  const sendEmailPasswordReset = () => {
    setLoading(true);
    getIdUsuario()
      .then((res: any) => {
        res.data.map((u: any) => {
          if (u.email === email.toLocaleLowerCase()) {
            let id = u.id;
            resetPassword(id).then((res) => {
              if (res.status === 204) {
                setLoading(false);
                setPasswordForgotten(false);
                Alert.alert("Verifique email para restaurar contraseña");
              } else Alert.alert("Imposible enviar mail");
            });
          }
        });
      })
      .catch((err: any) => {
        console.error(err.response.data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView
      className="items-center justify-center flex-1 bg-[#fff] dark:bg-dark-mode-bg"
      behavior={Platform.select({ ios: "padding", android: undefined })}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {dark ? (
          <Image
            source={require("../../assets/dark_logoMain.png")}
            style={myStyle.logo}
            className="p-[8px] max-w-[100%] h-[screen]"
          />
        ) : (
          <Image
            source={require("../../assets/logoMain.png")}
            style={myStyle.logo}
            className="p-[8px] max-w-[100%] h-[screen]"
          />
        )}

        {loading ? (
          <Loading text="Enviando" bg={false} />
        ) : (
          <>
            {loadingLogin ? (
              <Loading text="Iniciando sesión" bg={dark ? true : false} />
            ) : (
              <>
                <CustomInput
                  placeholder="Correo electrónico"
                  onChangeText={setEmail}
                  onBlur={undefined}
                  keyboardType={undefined}
                  onSubmitEditing={undefined}
                  value={email}
                  left={<TextInput.Icon name={() => <At size={18} color={dark ? "white" : "black"} />} />}
                  secureTextEntry={false}
                  style={{}}
                />

                <CustomInput
                  placeholder="Contraseña"
                  onChangeText={setPass}
                  keyboardType={undefined}
                  onBlur={undefined}
                  value={password}
                  left={<TextInput.Icon name={() => <Password size={18} color={dark ? "white" : "black"} />} />}
                  secureTextEntry={true}
                  style={{}}
                  onSubmitEditing={handleLogin}
                />
                <View className="flex-row items-center justify-center">
                  <CustomButton isDisabled={false} onPress={handleLogin} value="Ingresar" style={{}} />
                  <View
                    className={
                      Platform.OS === "android"
                        ? "absolute right-[275px] top-[30px]"
                        : "absolute right-[285px] top-[27px]"
                    }
                  >
                    <SignIn size={22} weight="fill" color="white" />
                  </View>
                </View>

                <TouchableOpacity onPress={() => setPasswordForgotten(true)}>
                  <Text className="mt-6 text-center text-[#455ad3] dark:text-[#fff] text-[16px] font-medium">
                    ¿Has olvidado tu contraseña?
                  </Text>
                </TouchableOpacity>

                <View className="items-center justify-center flex-1 mt-6">
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={passwordForgotten}
                    onRequestClose={() => {
                      setPasswordForgotten(!passwordForgotten);
                    }}
                  >
                    <View className="items-center justify-center flex-1 max-h-[750px]">
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
                          className="absolute right-0 w-16 h-16 mt-[-4px] top-3"
                          onPress={() => setPasswordForgotten(!passwordForgotten)}
                        >
                          <XCircle size={25} color={dark ? "white" : "black"} />
                        </TouchableOpacity>

                        <CustomInput
                          keyboardType={undefined}
                          onChangeText={setEmail}
                          value={email}
                          left={<TextInput.Icon name={() => <At size={18} color={dark ? "white" : "black"} />} />}
                          placeholder="Correo electrónico"
                          secureTextEntry={false}
                          style={undefined}
                          onSubmitEditing={sendEmailPasswordReset}
                          onBlur={undefined}
                        />

                        <CustomButton
                          onPress={sendEmailPasswordReset}
                          value={"Restaurar contraseña"}
                          style={undefined}
                          isDisabled={false}
                        />
                      </View>
                    </View>
                  </Modal>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
