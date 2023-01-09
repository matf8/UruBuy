import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Dialog from "react-native-dialog";

export type Report = {
  android: boolean;
};

export function ReportIOS() {
  Alert.prompt("Motivo?", "", (text) => {
    console.log(text);
    if (text) {
      Alert.alert("Gracias, será revisado por el grupo de administradores.");
      // report shopping post
    }
  });
}

const CustomReport: React.FC<Report> = ({ android }) => {
  const [isAlertReport, setAlertReport] = useState(false);
  const [reasonReport, setReasonReport] = useState({});
  const nav = useNavigation();

  useFocusEffect(() => {
    if (android) setAlertReport(true);
  });

  useEffect(() => {
    const unsubscribe = nav.addListener("blur", () => {
      setAlertReport(false);
    });
    return unsubscribe;
  });

  const handleCancel = () => {
    setAlertReport(false);
  };

  const handleReportAndroid = () => {
    // report shopping post
    console.log(reasonReport);
    setAlertReport(false);
  };

  return (
    <Dialog.Container visible={isAlertReport}>
      <Dialog.Title>Reportar publicacion</Dialog.Title>
      <Dialog.Description>Por qué quiere reportar esta publicación?</Dialog.Description>
      <Dialog.Input label="Motivo" onChangeText={setReasonReport}></Dialog.Input>
      <Dialog.Button label="Cancel" onPress={handleCancel} />
      <Dialog.Button label="Reportar" onPress={handleReportAndroid} />
    </Dialog.Container>
  );
};

export default CustomReport;
