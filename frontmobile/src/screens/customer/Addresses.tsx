import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Image, Text, View, Platform, Alert, Modal } from "react-native";
import { Divider, TextInput } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Check, HouseSimple, Pencil, Star, X, XCircle } from "phosphor-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomInput from "../../components/CustomInput";
import { deleteAddressCustomer } from "../../services/Requests";

export default function Addresses(props: any) {
  const nav = useNavigation();
  const [addresses, setAddresses] = useState<string[] | undefined>(undefined);
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    setAddresses(props.route.params.addresses);
    setUser(props.route.params.user);
  }, [props]);

  const deleteAddress = (addr: string) => {
    Alert.alert(`Eliminar dirección ${addr}`, "Está seguro?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteAddressCustomer(user, addr)
            .then((r: any) => (r.status === 200 ? setAddresses(r.data) : Alert.alert("Error al borrar la dirección")))
            .catch((e) => {
              console.error(e);
              Alert.alert("Error al borrar la dirección");
            });
        },
      },
    ]);
  };

  type TAddrress = {
    index: number;
    address: string;
  };

  const Card: React.FC<TAddrress> = ({ address }) => {
    return (
      <View
        className="
          ml-[2%]
          mb-[10px]
          w-[96%]
          bg-[#ffffff]
          dark:bg-dark-mode-bg     
          border-header-color rounded-md border-[1.13px]"
      >
        <View className="flex-row justify-between">
          <Text className="text-[18px] p-[11px] dark:text-dark-mode-text font-semibold">{address}</Text>
          <View className="flex-row justify-end p-[11px]">
            {/*<TouchableOpacity onPress={() => setShowEditAddress(true)}>
              <Pencil size={24} weight="bold" color={dark ? "white" : "black"} />
    </TouchableOpacity>*/}
            <TouchableOpacity onPress={() => deleteAddress(address)}>
              <X size={24} weight="bold" color={"red"} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/abstract.jpg")}
        resizeMode="cover"
        className="w-full h-full bg-no-repeat"
        blurRadius={6}
      >
        <FlatList
          className="mt-2"
          data={addresses}
          renderItem={({ index, item }) => <Card index={index} address={item} />}
        />
        {showEditAddress && (
          <View className="items-center justify-center flex-1 mt-6">
            <Modal
              animationType="fade"
              className="border-[#db2e2e] border-[1.33]"
              transparent={true}
              visible={showEditAddress}
              onRequestClose={() => {
                setShowEditAddress(!showEditAddress);
              }}
            >
              <View className="items-center justify-center flex-1 max-h-[650px]">
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
                  <View className="items-center p-1 m-2">
                    <Text className="text-[#dbad2e] text-[20px] font-bold">Editar dirección</Text>
                    <Divider
                      style={
                        dark
                          ? { height: 1.33, width: 250, backgroundColor: "white", margin: 5 }
                          : { height: 1.33, width: 250, backgroundColor: "black" }
                      }
                    />
                    <CustomInput
                      onChangeText={setNewAddress}
                      value={newAddress}
                      keyboardType={undefined}
                      left={<TextInput.Icon name={() => <HouseSimple size={18} color={dark ? "white" : "black"} />} />}
                      placeholder={"Dirección"}
                      secureTextEntry={false}
                      style={undefined}
                      onBlur={undefined}
                      onSubmitEditing={undefined}
                    />
                    <View className="flex-row p-2 mt-5">
                      <TouchableOpacity
                        onPress={() => {
                          setShowEditAddress(!showEditAddress);
                          setNewAddress("");
                        }}
                        className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                      >
                        <Text className="text-[#000] dark:text-dark-mode-text text-[18px] font-semibold m-3">
                          Cancelar
                        </Text>
                        <X
                          weight="fill"
                          size={19}
                          style={{ padding: 2, marginTop: 12, marginRight: 5 }}
                          color={"red"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert("editao");
                          setShowEditAddress(!showEditAddress);
                          setNewAddress("");
                        }}
                        className="border-2 border-[#000] dark:border-[#fff] rounded-md mt-5 m-3 flex-row"
                      >
                        <Text className="text-[#000] dark:text-[#fff] text-[18px] font-semibold m-3">Confirmar</Text>
                        <Check
                          weight="fill"
                          size={19}
                          style={{ padding: 2, marginTop: 12, marginRight: 5 }}
                          color={"green"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </ImageBackground>
    </>
  );
}
