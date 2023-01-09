import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import myStyle from "../../assets/styles";

export type Props = {
  onChangeText: any;
  value: string;
  left: any;
  placeholder: string;
  secureTextEntry: boolean;
  style: any;
  onBlur: any;
  onSubmitEditing: any;
  keyboardType: any;
};
// text input no tiene la propiedad className; no puede tailwinearse
const CustomInput: React.FC<Props> = ({
  onSubmitEditing,
  onChangeText,
  value,
  left,
  placeholder,
  secureTextEntry,
  style,
  onBlur,
  keyboardType,
}) => {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  return (
    <View style={dark ? myStyle.inputsB : myStyle.inputs}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        onSubmitEditing={onSubmitEditing}
        left={left}
        keyboardType={keyboardType}
        style={dark ? [myStyle.textB, style] : [myStyle.textI, style]}
        secureTextEntry={secureTextEntry}
        theme={dark ? { colors: { placeholder: "white", text: "white" } } : {}}
      />
    </View>
  );
};

export default CustomInput;
