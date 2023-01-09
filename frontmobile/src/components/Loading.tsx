import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";

export type Props = {
  text: string;
  bg: boolean;
};

const Loading: React.FC<Props> = ({ text, bg }) => {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  return (
    <View className="flex-row items-center justify-center">
      <Text
        className={bg ? "text-[22px] font-medium p-2 m-8 text-[#fff]" : "text-[22px] font-medium p-2 m-8 text-[#000]"}
      >
        {text}
      </Text>
      <ActivityIndicator size="large" color={bg ? "white" : "blue"} style={{ marginLeft: -19 }} />
    </View>
  );
};

export default Loading;
