import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import GpResultsScreen from "../screens/GpResultsScreen";

export type CalendarStackParamList = {
  Calendar: undefined;
  GpResults: { gpId: number; title: string };
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarNavigator: React.FC = () => (
  <Stack.Navigator id={undefined} initialRouteName="Calendar">
    <Stack.Screen
      name="Calendar"
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
