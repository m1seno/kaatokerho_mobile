import React from "react";
import { useAuthStore } from "../store/AuthStore";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const RootNavigator: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    // Kirjautunut käyttäjä → alapalkin tabit (Home, Sarjataulukko, jne.)
    return <MainTabNavigator />;
  }

  // Ei kirjautunut → Login-näkymä (AuthNavigator)
  return <AuthNavigator />;
};

export default RootNavigator;