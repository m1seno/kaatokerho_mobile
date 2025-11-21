import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// ChatGPT:n tekemä tiedosto 
export const appColors = {
  primary: "#0066CC",
  secondary: "#00A3FF",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  text: "#1F2937",
  error: "#EF4444"
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: appColors.primary,
    secondary: appColors.secondary,
    background: appColors.background,
    surface: appColors.surface,
    error: appColors.error,
    onSurface: appColors.text,
    onBackground: appColors.text,
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: appColors.primary,
    secondary: appColors.secondary,
    background: "#111827",
    surface: "#1F2937",
    error: "#F87171",
    onSurface: "#E5E7EB",
    onBackground: "#E5E7EB",
  }
};