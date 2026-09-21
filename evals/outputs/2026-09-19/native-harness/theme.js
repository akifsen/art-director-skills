import { Platform } from "react-native";

export const closeout = {
  canvas: "#111111",
  field: "#f2d048",
  ink: "#111111",
  paper: "#f6f1e4",
  muted: "#6d6d6d",
  danger: "#c4452d",
  ok: "#1f7a46",
  font: Platform.select({ ios: "System", android: "sans-serif-medium", default: "System" }),
  space: 12,
  tap: 48
};
