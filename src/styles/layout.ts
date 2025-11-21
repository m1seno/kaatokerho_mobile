import { StyleSheet } from "react-native";

// ChatGPT:n tekemä tiedosto
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mt16: { marginTop: 16 },
  mb16: { marginBottom: 16 },
  mt8: { marginTop: 8 },
  mb8: { marginBottom: 8 },
});