import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";
import { getIdUsuario, sendEmail, signUp, signUpLocal, storeData } from "../services/Requests";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import myStyle from "../../assets/styles";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { AddressBook, At, ImageSquare, Password, Trash, UserCircle } from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";
import { useColorScheme } from "nativewind";
import { TCustomer, TUserKC } from "../../urubuy";

export default function SignUp() {
  const nav = useNavigation();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validPasswords, setValidPasswords] = useState(true);
  const [image, setImage] = useState("");
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const [address, setAddress] = useState("");

  useEffect(() => {
    nav.addListener("focus", () => {
      setEmail("");
      setName("");
      setImage("");
      setPassword("");
      setPasswordConfirmation("");
      setValidPasswords(true);
      setAddress("");
    });
  }, []);

  function handleRegister() {
    if (password === undefined || password === "") {
      Alert.alert("", "La contraseña no puede estar vacía");
    } else {
      let userAddressess: string[] = [];
      userAddressess.push(address);

      let user: TCustomer = {
        username: username,
        password: password,
        email: email,
        averageRating: 0,
        addresses: userAddressess,
        picture: image,
        givenUserReviews: undefined,
        receivedUserReviews: undefined,
        purchases: [],
        isBlocked: false,
        isSuspended: false,
      };
      let userKc: TUserKC = {
        email: email,
        password: password,
        username: username,
        firstName: "",
        lastName: "",
      };

      if (validPasswords === true) {
        signUp(userKc)
          .then((res: any) => {
            if (res.status === 201) {
              Alert.alert("Bienvenido! Por favor, verifique email para iniciar sesión, gracias.");
              signUpLocal(user);
              sendEmailVerification(email);
              nav.navigate("Home" as never);
            }
          })
          .catch((err: any) => {
            let error = err.response.data.errorMessage;
            console.error(err);
            Alert.alert("Error al registrarse", error as string);
          });
      } else Alert.alert("Formulario inválido");
    }
  }

  const sendEmailVerification = (email: string) => {
    getIdUsuario()
      .then((res: any) => {
        res.data.map((u: any) => {
          if (u.email === email) {
            let id = u.id;
            storeData("idUserToVerify", id as string);
            sendEmail();
          }
        });
      })
      .catch((err: any) => {
        console.error(err.response.data);
      });
  };

  const onBlurPassword = () => {
    if (passwordConfirmation !== undefined)
      if (passwordConfirmation !== password) setValidPasswords(false);
      else setValidPasswords(true);
    else setValidPasswords(true);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.base64!);
    }
  };

  return (
    <>
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

      <KeyboardAvoidingView
        className="flex-1 items-center justify-center bg-[#fff] dark:bg-dark-mode-bg"
        behavior={Platform.select({ ios: "padding", android: undefined })}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomInput
            onChangeText={setName}
            onBlur={undefined}
            value={username as string}
            left={<TextInput.Icon name={() => <UserCircle size={18} color={dark ? "white" : "black"} />} />}
            placeholder="Nombre de usuario"
            secureTextEntry={false}
            keyboardType={undefined}
            onSubmitEditing={undefined}
            style={dark ? myStyle.textB : myStyle.textI}
          />

          <CustomInput
            onChangeText={setPassword}
            value={password as string}
            left={<TextInput.Icon name={() => <Password size={18} color={dark ? "white" : "black"} />} />}
            placeholder="Contraseña"
            secureTextEntry={true}
            style={{}}
            keyboardType={undefined}
            onSubmitEditing={undefined}
            onBlur={onBlurPassword}
          />

          <CustomInput
            onChangeText={setPasswordConfirmation}
            value={passwordConfirmation as string}
            onBlur={onBlurPassword}
            left={<TextInput.Icon name={() => <Password size={18} color={dark ? "white" : "black"} />} />}
            placeholder="Confirmar contraseña"
            secureTextEntry={true}
            keyboardType={undefined}
            onSubmitEditing={undefined}
            style={{}}
          />

          {!validPasswords ? (
            <Text className="text-[#e04747] text-[15px] font-semibold text-center">Las contraseñas no coinciden</Text>
          ) : null}

          <CustomInput
            onChangeText={setEmail}
            onBlur={undefined}
            keyboardType={undefined}
            onSubmitEditing={undefined}
            value={email as string}
            left={<TextInput.Icon name={() => <At size={18} color={dark ? "white" : "black"} />} />}
            placeholder="Correo electrónico"
            secureTextEntry={false}
            style={{}}
          />

          <CustomInput
            onChangeText={setAddress}
            onBlur={undefined}
            keyboardType={undefined}
            onSubmitEditing={undefined}
            value={address as string}
            left={<TextInput.Icon name={() => <AddressBook size={18} color={dark ? "white" : "black"} />} />}
            placeholder="Dirección"
            secureTextEntry={false}
            style={{}}
          />

          <CustomButton
            value="Foto de perfil"
            onPress={pickImage}
            style={
              dark
                ? {
                    padding: 3,
                    backgroundColor: "#292626",
                    width: 290,
                    borderWidth: 1,
                    borderColor: "grey",
                    customColor: {
                      color: "white",
                    },
                  }
                : {
                    padding: 3,
                    backgroundColor: "white",
                    width: 290,
                    borderWidth: 1,
                    borderColor: "grey",
                    customColor: {
                      color: "black",
                    },
                  }
            }
            isDisabled={false}
          />
          <View className={!validPasswords ? "absolute top-[419px] left-[24px]" : "absolute top-[405px] left-[24px]"}>
            <ImageSquare size={20} weight="fill" color={dark ? "white" : "black"} />
          </View>

          {image && (
            <View className="items-center justify-center p-2 mt-2">
              <View className="flex-row">
                <Text className="text-[16px] font-semibold dark:text-dark-mode-text"> Su imagen </Text>
                <TouchableOpacity onPress={() => setImage("")}>
                  <Trash
                    size={20}
                    weight="fill"
                    color={dark ? "white" : "black"}
                    style={{ padding: 5, marginBottom: 5 }}
                  />
                </TouchableOpacity>
              </View>
              <Image source={{ uri: `data:image/jpg;base64,${image}` }} style={{ width: 200, height: 200 }} />
            </View>
          )}
          <View className="mt-3">
            <CustomButton isDisabled={!validPasswords} onPress={handleRegister} value="Registrarme" style={{}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
