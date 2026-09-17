import { useState } from "react";
import {
  AccessibilityInfo,
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
import { getStation } from "./session-store.js";

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

export function ListScreen({ session, onOpen }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top }}>
      <Text style={{ color: t.muted, paddingHorizontal: t.space, paddingTop: t.space, letterSpacing: 1, fontSize: 12 }}>
        TONIGHT
      </Text>
      <Text accessibilityRole="header" style={{ color: t.field, fontSize: 32, paddingHorizontal: t.space, paddingBottom: 4 }}>
        Closeout
      </Text>
      <Text style={{ color: t.muted, paddingHorizontal: t.space, paddingBottom: t.space }}>
        Three stations. Notes stay in this session only.
      </Text>
      {session.stations.map((row) => (
        <Pressable
          key={row.id}
          onPress={() => onOpen(row.id)}
          accessibilityRole="button"
          accessibilityLabel={row.note ? `${row.title}, note saved` : row.title}
          accessibilityHint="Opens station detail"
          style={{ minHeight: t.tap, padding: t.space, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" }}
        >
          <Text style={{ color: t.paper, fontSize: 18 }}>{row.title}</Text>
          <Text style={{ color: row.note ? t.field : t.muted, marginTop: 4 }}>
            {row.note ? "Note in session" : "No closer note"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function DetailScreen({ session, id, onBack, onEdit }) {
  const insets = useSafeAreaInsets();
  const row = getStation(session, id);
  if (!row) {
    return (
      <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top, padding: t.space }}>
        <Text accessibilityRole="header" style={{ color: t.paper, fontSize: 22 }}>Unknown station</Text>
        <Text style={{ color: t.muted, marginVertical: t.space }}>That id is not in this closeout. Nothing was changed.</Text>
        <Tap label="Back to stations" onPress={onBack} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: t.canvas, paddingTop: insets.top }}>
      <Tap label="Back" onPress={onBack} />
      <Text accessibilityRole="header" style={{ color: t.paper, fontSize: 26, padding: t.space }}>{row.title}</Text>
      <Text style={{ color: t.muted, paddingHorizontal: t.space }}>{row.detail}</Text>
      <View style={{ margin: t.space, padding: t.space, backgroundColor: "#1c1c1c" }}>
        <Text style={{ color: t.field, fontSize: 12, letterSpacing: 1 }}>CLOSER NOTE</Text>
        <Text style={{ color: t.paper, marginTop: 8 }}>{row.note || "None yet. Add one before you leave the floor."}</Text>
      </View>
      <View style={{ marginTop: "auto", paddingBottom: insets.bottom }}>
        <Tap label={row.note ? "Edit closer note" : "Add closer note"} onPress={onEdit} />
      </View>
    </View>
  );
}

export function EditScreen({ session, id, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const row = getStation(session, id);
  const [note, setNote] = useState(row?.note ?? "");
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  if (!row) {
    return (
      <View style={{ flex: 1, backgroundColor: t.paper, paddingTop: insets.top, padding: t.space }}>
        <Text accessibilityRole="header">Unknown station</Text>
        <Text>Cannot save a note against a missing id.</Text>
        <Tap label="Back" onPress={onClose} />
      </View>
    );
  }

  function save() {
    const result = onSave(id, note);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setSaveMessage(result.message);
    setSheet(true);
    AccessibilityInfo.announceForAccessibility(result.message);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.paper }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, padding: t.space, paddingBottom: insets.bottom + 80 }} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={{ fontSize: 24, marginBottom: t.space }}>Closer note · {row.title}</Text>
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
          <Text accessibilityRole="header">{saveMessage}</Text>
          <Text>Open the station again in this session to read the note. Restarting the app clears it.</Text>
          <Tap label="Back to station" onPress={() => { setSheet(false); onClose(); }} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
