import { Text, View } from "react-native";
import { ITEMS } from "./data.js";

export default function App() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Railbag</Text>
      <Text>{ITEMS.length} items in data. List, detail, and edit are not built. Safe area and keyboard are not wired.</Text>
    </View>
  );
}
