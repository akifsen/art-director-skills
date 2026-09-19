import { Platform } from "react-native";

export const closeout = {
  canvas: "#151714",
  surface: "#22251f",
  border: "#41473b",
  field: "#f2d048",
  ink: "#171a14",
  paper: "#f6f1e4",
  muted: "#b3b8aa",
  danger: "#ffc0ab",
  ok: "#d5e5bb",
  font: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
  space: 20,
  tap: 48,
  radius: 12
};
