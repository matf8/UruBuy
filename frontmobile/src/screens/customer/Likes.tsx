import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getData } from "../../services/Requests";
import Review from "./Review";

export default function PrivacyPolicy() {
  const { colorScheme } = useColorScheme();
  let dark = colorScheme === "dark";
  const nav = useNavigation();
  const [likes, setLikes] = useState([]);

  useFocusEffect(() => {
    getInitialLikes();
  });

  async function getInitialLikes() {
    let likes = await getData("likes");
    if (likes) setLikes(Array(likes) as never);
  }

  return (
    <>
      <View className="items-center justify-center flex-1 dark:bg-dark-mode-bg">
        <Text className="text-lg font-semibold dark:text-dark-mode-text">
          si da el tiempo acá van las publicaciones favoritas
          {likes.map((like) => (
            <Text>{like}</Text>
          ))}
        </Text>
      </View>
    </>
  );
}
