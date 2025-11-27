import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/AuthStore";
import { appColors } from "../styles";

import HomeScreen from "../screens/HomeScreen";
import StandingsScreen from "../screens/StandingsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import StatsScreen from "../screens/StatsScreen";
import AdminNavigator from "./AdminNavigator";
import LogoutMenu from "../components/LogoutMenu";

export type MainTabParamList = {
  Home: undefined;
  Standings: undefined;
  Calendar: undefined;
  Stats: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabRoute = {
  name: keyof MainTabParamList;
  component: React.ComponentType<any>;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  adminOnly?: boolean;
};

const TAB_ROUTES: TabRoute[] = [
  { name: "Home", component: HomeScreen, title: "Etusivu", icon: "home" },
  {
    name: "Standings",
    component: StandingsScreen,
    title: "Sarjataulukko",
    icon: "trophy",
  },
  {
    name: "Calendar",
    component: CalendarScreen,
    title: "Kalenteri",
    icon: "calendar",
  },
  {
    name: "Stats",
    component: StatsScreen,
    title: "Tilastot",
    icon: "chart-line",
  },
  {
    name: "Admin",
    component: AdminNavigator,
    title: "Admin",
    icon: "shield-account",
    adminOnly: true,
  },
];

const MainTabNavigator: React.FC = () => {
  const isAdmin = useAuthStore((state) => state.user?.admin ?? false);
  const availableTabs = TAB_ROUTES.filter((tab) =>
    tab.adminOnly ? isAdmin : true
  );

  return (
    <Tab.Navigator
      id ={undefined}
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => <LogoutMenu />,
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            TAB_ROUTES.find((tab) => tab.name === route.name)?.icon ?? "home";
          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
      })}
    >
      {availableTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.title }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
