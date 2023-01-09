import { Image, TouchableOpacity } from "react-native";

type ImageActiveUserProps = {
  onPress: any;
};

export const ImageActiveUser: React.FC<ImageActiveUserProps> = ({ onPress }) => {
  return (
    <TouchableOpacity className="-left-3.5" onPress={onPress}>
      <Image className="scale-[.35] rounded-full" source={require("../../../assets/placeholder.png")} />
    </TouchableOpacity>
  );
};
