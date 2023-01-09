import React from "react";
import { Text, TouchableOpacity } from "react-native";

export type Props = {
  onPress: any;
  value: string;
  style: any;
  isDisabled: boolean;
};

const CustomButton: React.FC<Props> = ({ isDisabled, onPress, value, style }) => {
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onPress}
      className={classNames(
        isDisabled ? "bg-[#72788a]" : "bg-[#0c35c5]",
        "p-[10] mt-[5%] w-[70%] self-center rounded-[10px] border-white border-[0.5]",
      )}
      style={style}
    >
      <Text className="text-center text-[#fff] text-[18px]" style={style?.customColor}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
