import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { closeout as t } from "./theme.js";

const STATIONS = [
  { id: "pass", title: "Pass", detail: "Wipe the pass, cover sauces, log waste. Demo data." },
  { id: "dish", title: "Dish pit", detail: "Empty machines, floor dry, spare chemicals counted. Demo data." },
  { id: "bar", title: "Bar", detail: "Lock spirits, ice empty, till counted with manager. Demo data." }
];

function Tap({ label, onPress, disabled, role = "button" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={({ pressed }) => ({
        minHeight: t.tap,
        justifyContent: "center",
        paddingHorizontal: t.space,
        backgroundColor: pressed ? "#e0bf2a" : t.field,
        opacity: disabled ? 0.45 : 1
      })}
    >
      <Text style={{ fontFamily: t.font, fontSize: 16, color: t.ink }}>{label}</Text>
    </Pressable>
  );
}

export function ListScreen({ onOpen }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top }}>
      <Text accessibilityRole="header" style={{ color: t.field, fontSize: 28, padding: t.space }}>
        Closeout
      </Text>
      {STATIONS.map((row) => (
        <Pressable
          key={row.id}
          onPress={() => onOpen(row.id)}
          accessibilityRole="button"
          accessibilityLabel={row.title}
          accessibilityHint="Opens station detail"
          style={{ minHeight: t.tap, padding: t.space, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" }}
        >
          <Text style={{ color: t.paper, fontSize: 18 }}>{row.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function DetailScreen({ id, onBack, onEdit }) {
  const insets = useSafeAreaInsets();
  const row = STATIONS.find((item) => item.id === id);
  if (!row) {
    return (
      <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top, padding: t.space }}>
        <Text style={{ color: t.paper }}>Unknown station.</Text>
        <Tap label="Back" onPress={onBack} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top }}>
      <Tap label="Back" onPress={onBack} />
      <Text accessibilityRole="header" style={{ color: t.paper, fontSize: 26, padding: t.space }}>{row.title}</Text>
      <Text style={{ color: t.muted, paddingHorizontal: t.space }}>{row.detail}</Text>
      <View style={{ marginTop: "auto", paddingBottom: insets.bottom }}>
        <Tap label="Add closer note" onPress={onEdit} />
      </View>
    </View>
  );
}

export function EditScreen({ id, onClose }) {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(false);

  function save() {
    if (!note.trim()) {
      setError("Write the closer note before saving.");
      return;
    }
    setError("");
    setSheet(true);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.paper }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, padding: t.space, paddingBottom: insets.bottom + 80 }} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={{ fontSize: 24, marginBottom: t.space }}>Closer note · {id}</Text>
        <Text nativeID="note-label">What still needs a manager?</Text>
        <TextInput
          accessibilityLabel="Closer note"
          accessibilityLabelledBy="note-label"
          accessibilityState={{ disabled: false }}
          value={note}
          onChangeText={setNote}
          multiline
          style={{ minHeight: 120, borderWidth: 1, borderColor: error ? t.danger : "#222", padding: t.space, textAlignVertical: "top" }}
        />
        {error ? (
          <Text accessibilityLiveRegion="polite" style={{ color: t.danger, marginTop: 8 }}>{error}</Text>
        ) : null}
      </ScrollView>
      <View style={{ padding: t.space, paddingBottom: insets.bottom + t.space, backgroundColor: t.paper }}>
        <Tap label="Save note" onPress={save} />
        <Tap label="Cancel" onPress={onClose} />
      </View>
      <Modal visible={sheet} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setSheet(false); onClose(); }}>
        <View style={{ flex: 1, backgroundColor: t.field, paddingTop: insets.top, padding: t.space }}>
          <Text accessibilityRole="header">Saved on this device only</Text>
          <Text>Demo state. No kitchen system was updated.</Text>
          <Tap label="Back to station" onPress={() => { setSheet(false); onClose(); }} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
