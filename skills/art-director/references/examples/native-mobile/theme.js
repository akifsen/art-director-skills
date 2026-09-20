import { Platform } from "react-native";

export const closeout = {
  canvas: "#101418",
  surface: "#1a2228",
  border: "#2c3842",
  field: "#3ecfbe",
  ink: "#102027",
  paper: "#e7edf0",
  muted: "#9aa7b0",
  danger: "#ffb4a8",
  ok: "#b8e0a8",
  font: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
  space: 20,
  tap: 48,
  radius: 10
};
