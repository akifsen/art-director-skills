import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DetailScreen, EditScreen, ListScreen } from "./screens.js";

export default function App() {
  const [stack, setStack] = useState([{ name: "list" }]);
  const top = stack[stack.length - 1];

  function push(screen) {
    setStack((rows) => rows.concat(screen));
  }

  function pop() {
    setStack((rows) => (rows.length > 1 ? rows.slice(0, -1) : rows));
  }

  return (
    <SafeAreaProvider>
      {top.name === "list" ? <ListScreen onOpen={(id) => push({ name: "detail", id })} /> : null}
      {top.name === "detail" ? (
        <DetailScreen id={top.id} onBack={pop} onEdit={() => push({ name: "edit", id: top.id })} />
      ) : null}
      {top.name === "edit" ? <EditScreen id={top.id} onClose={pop} /> : null}
    </SafeAreaProvider>
  );
}
