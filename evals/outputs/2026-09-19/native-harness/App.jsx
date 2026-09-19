import { useEffect, useState } from "react";
import { BackHandler, Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DetailScreen, EditScreen, ListScreen } from "./screens.js";
import { createSession, saveNote } from "./session-store.js";

const SEED = [
  { id: "pass", title: "Pass", detail: "Wipe the pass, cover sauces, log waste. Demo data." },
  { id: "dish", title: "Dish pit", detail: "Empty machines, floor dry, spare chemicals counted. Demo data." },
  { id: "bar", title: "Bar", detail: "Lock spirits, ice empty, till counted with manager. Demo data." }
];

export default function App() {
  const [session, setSession] = useState(() => createSession(SEED));
  const [stack, setStack] = useState([{ name: "list" }]);
  const top = stack[stack.length - 1];

  function push(screen) {
    setStack((rows) => rows.concat(screen));
  }

  function pop() {
    setStack((rows) => (rows.length > 1 ? rows.slice(0, -1) : rows));
  }

  function onSave(id, text) {
    const result = saveNote(session, id, text);
    if (result.ok) setSession(result.session);
    return result;
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length]);

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#000000" barStyle={Platform.OS === "android" || top.name !== "edit" ? "light-content" : "dark-content"} />
      {top.name === "list" ? <ListScreen session={session} onOpen={(id) => push({ name: "detail", id })} /> : null}
      {top.name === "detail" ? (
        <DetailScreen session={session} id={top.id} onBack={pop} onEdit={() => push({ name: "edit", id: top.id })} />
      ) : null}
      {top.name === "edit" ? <EditScreen session={session} id={top.id} onSave={onSave} onClose={pop} /> : null}
    </SafeAreaProvider>
  );
}
