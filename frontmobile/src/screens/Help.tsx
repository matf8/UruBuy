import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { CaretRight, Files, Question, XCircle } from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/core";

function Help() {
  const { colorScheme } = useColorScheme();
  const nav = useNavigation();
  const [WHOAMI, setWHOAMI] = useState(false);
  let dark = colorScheme === "dark";

  const handlePrivacyPolicy = () => {
    nav.navigate("PrivacyPolicy" as never);
  };

  const handleFAQ = () => {
    nav.navigate("FAQ" as never);
  };

  return (
    <View className="w-full h-full bg-white dark:bg-dark-mode-bg">
      <Text className="mt-8 mr-7 p-2 text-[45px] font-extrabold text-[#000] dark:text-dark-mode-text">Ayuda</Text>
      <Divider style={dark ? { height: 2, backgroundColor: "white" } : { height: 2, backgroundColor: "#32377B" }} />
      <SafeAreaView className="border-[1.33px] rounded-md mt-10 w-[96%] p-3 mx-auto border-[#32377B] dark:border-[#fff]">
        <TouchableOpacity
          onPress={() => setWHOAMI(true)}
          className="p-2 mt-[-20px] h-10 flex-row bg-[#fff] dark:bg-[#292626] border-[#32377B] dark:border-[#ffff] border-[1.33px] rounded-2xl"
        >
          <Question weight="fill" size={19} color={dark ? "white" : "black"} />
          <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">¿Quienes somos?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFAQ()}
          className="p-2 mt-2 h-10 flex-row bg-[#fff] dark:bg-[#292626] border-[#32377B] dark:border-[#ffff] border-[1.33px] rounded-2xl"
        >
          <Question weight="fill" size={19} color={dark ? "white" : "black"} />
          <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">
            Preguntas frecuentes
          </Text>
          <CaretRight weight="bold" size={19} color={dark ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePrivacyPolicy()}
          className="p-2 mt-2 h-10 flex-row bg-[#fff] dark:bg-[#292626] border-[#32377B] dark:border-[#ffff] border-[1.33px] rounded-2xl"
        >
          <Files weight="fill" size={19} color={dark ? "white" : "black"} />
          <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold mx-auto my-auto">
            Políticas de privacidad
          </Text>
          <CaretRight weight="bold" size={19} color={dark ? "white" : "black"} />
        </TouchableOpacity>
      </SafeAreaView>

      <View className="items-center justify-center flex-1 mt-6">
        <Modal
          animationType="fade"
          className="border-[#dbad2e] border-[1.33]"
          transparent={true}
          visible={WHOAMI}
          onRequestClose={() => {
            setWHOAMI(!WHOAMI);
          }}
        >
          <View className="items-center justify-center flex-1 max-h-[750px] ">
            <View
              className="mt-5 bg-[#fff] dark:bg-[#292626] rounded-3xl p-[35px] items-center"
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
              <TouchableOpacity className="absolute right-[-15px] w-16 h-16 top-3" onPress={() => setWHOAMI(!WHOAMI)}>
                <XCircle size={25} weight="regular" color={colorScheme === "dark" ? "white" : "black"} />
              </TouchableOpacity>
              <Text className="font-bold text-header-color dark:text-gold-buy">UruBuy @ 2022</Text>
              <Text className="p-2 mt-3 font-medium dark:text-dark-mode-text">
                Somos un grupo de desarrolladores de Uruguay, estudiantes de Tecnólogo en informática. Ésta aplicación
                fue desarrollada como proyecto final de la carrera.
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

export default Help;
