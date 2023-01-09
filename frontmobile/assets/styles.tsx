import { StyleSheet, Dimensions } from "react-native";

const window = Dimensions.get("window");
export const IMAGE_HEIGHT = window.width / 2;

export default StyleSheet.create({
  logo: {
    height: IMAGE_HEIGHT,
  },
  inputs: {
    padding: 10,
    width: 300,
    marginVertical: 5,
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.5,
  },
  inputsB: {
    padding: 10,
    width: 300,
    marginVertical: 5,
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.5,
  },
  textB: {
    maxHeight: 45,
    textAlign: "center",
    backgroundColor: "#504e4e",
    textAlignVertical: "center",
    color: "purple",
    placeholderTextColor: "darkblue",
  },
  textI: {
    maxHeight: 45,
    textAlign: "center",
    backgroundColor: "white",
    textAlignVertical: "center",
    color: "purple",
    placeholderTextColor: "darkblue",
  },
  quantityPositionFixed: {
    position: "absolute",
    marginTop: 5,
    marginLeft: 15,
  },
  cardCart: {
    shadowColor: "white",
    shadowOpacity: 0.55,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  paperIconInc: {
    width: 36,
    height: 36,
    marginTop: 38,
    marginLeft: 11,
    backgroundColor: "navy",
  },
  paperIconDec: {
    width: 40,
    height: 40,
    marginTop: 38,
    marginLeft: 15,
    backgroundColor: "navy",
  },
  textAreaB: {
    marginTop: 5,
    textAlign: "center",
    backgroundColor: "#504e4e",
    color: "purple",
  },
  textArea: {
    marginTop: 5,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "white",
    color: "purple",
  },
});
