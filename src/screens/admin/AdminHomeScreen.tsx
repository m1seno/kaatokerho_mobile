import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/AdminNavigator";
import { layout } from "../../styles/layout";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminHome">;

const AdminHomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={[layout.container, { padding: 24 }]}>

      <Button
        mode="contained"
        style={{ marginBottom: 12 }}
        onPress={() => navigation.navigate("ManageKeilaajat")}
      >
        Hallinnoi keilaajia
      </Button>

      <Button
        mode="contained"
        style={{ marginBottom: 12 }}
        onPress={() => navigation.navigate("ManageKeilahallit")}
      >
        Hallinnoi keilahalleja
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("ManageKausi")}
      >
        Hallinnoi kausia
      </Button>
    </View>
  );
};

export default AdminHomeScreen;