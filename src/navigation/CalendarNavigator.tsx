import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import GpResultsScreen from "../screens/GpResultsScreen";

export type CalendarStackParamList = {
  CalendarHome: undefined;
  GpResults: { gpId: number; title: string };
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarNavigator: React.FC = () => (
  <Stack.Navigator id={undefined} initialRouteName="CalendarHome">
    <Stack.Screen
      name="CalendarHome"
      component={CalendarScreen}
      options={{ title: "GP-kalenteri" }}
    />
    <Stack.Screen
      name="GpResults"
      component= {GpResultsScreen}
      options={({ route }) => ({ title: route.params.title })}
    />
  </Stack.Navigator>
);

export default CalendarNavigator;
