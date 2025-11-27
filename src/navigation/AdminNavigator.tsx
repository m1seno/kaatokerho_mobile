import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import ManageKeilaajatScreen from "../screens/admin/ManageKeilaajatScreen";
import ManageKeilahallitScreen from "../screens/admin/ManageKeilahalliScreen";
import ManageKausiScreen from "../screens/admin/ManageKausiScreen";

export type AdminStackParamList = {
  AdminHome: undefined;
  ManageKeilaajat: undefined;
  ManageKeilahallit: undefined;
  ManageKausi: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator id={undefined} initialRouteName="AdminHome">
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Admin" }}
      />
      <Stack.Screen
        name="ManageKeilaajat"
        component={ManageKeilaajatScreen}
        options={{ title: "Keilaajat" }}
      />
      <Stack.Screen
        name="ManageKeilahallit"
        component={ManageKeilahallitScreen}
        options={{ title: "Keilahallit" }}
      />
      <Stack.Screen
        name="ManageKausi"
        component={ManageKausiScreen}
        options={{ title: "Kausi" }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
