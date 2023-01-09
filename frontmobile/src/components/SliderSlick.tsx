import React from "react";
import Slick from "react-native-slick";
import { Dimensions, Image, View } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom/src/index";
const srcPlaceholder = require("../../assets/noitem.png");
const placeholder = Image.resolveAssetSource(srcPlaceholder).uri;

export type ProductImages = {
  pictures: string[];
};

const SliderSlick: React.FC<ProductImages> = ({ pictures }) => {
  let screenW = Dimensions.get("window").width;
  let screenH = Dimensions.get("window").height;
  return (
    <View className="h-[475px]">
      <Slick dotStyle={{ backgroundColor: "white" }} activeDotColor={"#cf8c40"}>
        {pictures && pictures.length > 0 ? (
          pictures.map((x, k) => (
            <View key={Math.random() * k + 100} className="w-full h-full">
              <ImageZoom
                key={Math.random() * k + 100}
                uri={x.includes("data:image") ? x : `data:image/jpg;base64,${x}`}
                containerStyle={{ alignItems: "center", justifyContent: "center", flex: 1, marginTop: 4, padding: 4 }}
                style={{ resizeMode: "contain", width: screenW, height: screenH }}
              />
            </View>
          ))
        ) : pictures?.length === 0 ? (
          <>
            <ImageZoom
              key={Math.random() * 50 + 100}
              uri={placeholder}
              containerStyle={{ alignItems: "center", justifyContent: "center", flex: 1 }}
              style={{ resizeMode: "contain", width: screenW, height: screenH }}
            />
          </>
        ) : null}
      </Slick>
    </View>
  );
};

export default SliderSlick;
