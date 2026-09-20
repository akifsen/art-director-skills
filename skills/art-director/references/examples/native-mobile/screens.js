import { useState } from "react";
import { AccessibilityInfo, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { closeout as t } from "./theme.js";
import { getStation } from "./session-store.js";

function Tap({ label, onPress, secondary = false }) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
    style={({ pressed }) => [s.tap, secondary ? s.secondary : s.primary, { opacity: pressed ? 0.7 : 1 }]}>
    <Text style={[s.action, { color: secondary ? t.paper : t.ink }]}>{label}</Text>
  </Pressable>;
}
function Status({ saved }) {
  return <Text style={[s.status, { color: saved ? t.ok : t.muted }]}>{saved ? "✓  Note in session" : "—  No closer note"}</Text>;
}

export function ListScreen({ session, onOpen }) {
  const insets = useSafeAreaInsets();
  return <ScrollView style={s.screen} contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: t.space, paddingBottom: insets.bottom + 24 }}>
    <Text style={s.eyebrow}>Tonight</Text>
    <Text accessibilityRole="header" style={s.title}>Closeout</Text>
    <Text style={[s.body, { marginTop: 8, marginBottom: 32 }]}>Three stations. Notes stay in this session only.</Text>
    <View style={s.stationList}>{session.stations.map((row, index) => <Pressable key={row.id} onPress={() => onOpen(row.id)} accessibilityRole="button"
      accessibilityLabel={row.note ? `${row.title}, note saved` : row.title} accessibilityHint="Opens station detail"
      style={({ pressed }) => [s.station, index > 0 && { borderTopWidth: 1, borderTopColor: t.border }, { backgroundColor: pressed ? t.border : t.surface }]}>
      <View style={{ flex: 1, gap: 8 }}><Text style={s.stationTitle}>{row.title}</Text><Status saved={Boolean(row.note)} /></View>
      <Text accessible={false} style={s.chevron}>›</Text>
    </Pressable>)}</View>
  </ScrollView>;
}

export function DetailScreen({ session, id, onBack, onEdit }) {
  const insets = useSafeAreaInsets();
  const row = getStation(session, id);
  return <ScrollView style={s.screen} contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: t.space, paddingBottom: insets.bottom + 24 }}>
    <View style={{ alignSelf: "flex-start", marginLeft: -12, marginBottom: 24 }}><Tap label="‹  Back to stations" secondary onPress={onBack} /></View>
    <Text style={s.eyebrow}>Station</Text>
    <Text accessibilityRole="header" style={s.title}>{row?.title ?? "Unknown station"}</Text>
    <Text style={[s.body, { marginTop: 12, marginBottom: 28 }]}>{row?.detail ?? "That id is not in this closeout. Nothing was changed."}</Text>
    {row ? <><View style={s.noteCard}>
      <Text style={s.eyebrow}>Closer note</Text>
      <Text style={[s.note, { marginTop: 12 }]}>{row.note || "None yet. Add one before you leave the floor."}</Text>
      <View style={{ marginTop: 20, paddingTop: 16, borderTopColor: t.border, borderTopWidth: 1 }}><Status saved={Boolean(row.note)} /></View>
    </View><View style={{ marginTop: 20 }}><Tap label={row.note ? "Edit closer note" : "Add closer note"} onPress={onEdit} /></View></> : null}
  </ScrollView>;
}

export function EditScreen({ session, id, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const row = getStation(session, id);
  const [note, setNote] = useState(row?.note ?? "");
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  if (!row) return <View style={[s.screen, { padding: t.space, paddingTop: insets.top + 24 }]}><Text style={s.title}>Unknown station</Text><Text style={s.body}>Cannot save a note against a missing id.</Text><Tap label="Back" secondary onPress={onClose} /></View>;
  function save() {
    const result = onSave(id, note);
    if (!result.ok) { setError(result.error); AccessibilityInfo.announceForAccessibility(result.error); return; }
    setError(""); setSaveMessage(result.message); Keyboard.dismiss(); setSheet(true);
    AccessibilityInfo.announceForAccessibility(result.message);
  }
  function finish() { setSheet(false); onClose(); }
  return <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={insets.top}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, padding: t.space, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
      <Text style={s.eyebrow}>{row.title}</Text>
      <Text accessibilityRole="header" style={[s.title, { fontSize: 28, marginBottom: 24 }]}>Closer note</Text>
      <Text nativeID="note-label" style={[s.body, { color: t.paper, marginBottom: 10 }]}>What still needs a manager?</Text>
      <TextInput accessibilityLabel="Closer note" accessibilityLabelledBy="note-label" value={note} onChangeText={(text) => { setNote(text); if (text.trim()) setError(""); }} multiline
        selectionColor={t.field} style={[s.input, error && { borderColor: t.danger }]} />
      {error ? <Text accessibilityLiveRegion="polite" style={[s.body, { color: t.danger, marginTop: 10 }]}>{error}</Text> : null}
      <View style={{ paddingTop: 20, gap: 8 }}><Tap label="Save note" onPress={save} /><Tap label="Cancel" secondary onPress={onClose} /></View>
    </ScrollView>
    <Modal visible={sheet} transparent animationType="none" onRequestClose={finish}>
      <View style={[s.overlay, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <ScrollView style={s.confirmation} contentContainerStyle={{ padding: 24 }}>
          <Text style={[s.eyebrow, { color: t.ok }]}>Note saved</Text>
          <Text accessibilityRole="header" style={[s.title, { fontSize: 28, marginTop: 12 }]}>{row.title}</Text>
          <Text style={[s.note, { marginVertical: 20 }]}>{note.trim()}</Text>
          <Text style={s.body}>{saveMessage}</Text>
          <Text style={[s.body, { marginTop: 8 }]}>Restarting the app clears it.</Text>
          <View style={{ marginTop: 24 }}><Tap label="Back to station" onPress={finish} /></View>
        </ScrollView>
      </View>
    </Modal>
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.canvas },
  eyebrow: { fontFamily: t.font, color: t.field, fontSize: 13, fontWeight: "600", letterSpacing: 0.2 },
  title: { fontFamily: t.font, fontSize: 36, fontWeight: "600", color: t.paper, marginTop: 8 },
  body: { fontFamily: t.font, fontSize: 15, lineHeight: 22, color: t.muted },
  note: { fontFamily: t.font, fontSize: 17, lineHeight: 26, color: t.paper },
  stationList: { borderRadius: t.radius, borderWidth: 1, borderColor: t.border, overflow: "hidden" },
  station: { padding: 20, minHeight: 100, flexDirection: "row", alignItems: "center", gap: 16 },
  stationTitle: { fontFamily: t.font, color: t.paper, fontSize: 22, fontWeight: "500" },
  status: { fontFamily: t.font, fontSize: 13, lineHeight: 20 },
  chevron: { color: t.muted, fontSize: 28 },
  noteCard: { padding: 20, borderWidth: 1, borderColor: t.border, borderRadius: t.radius, backgroundColor: t.surface },
  tap: { minHeight: t.tap, paddingHorizontal: 12, paddingVertical: 12, justifyContent: "center", alignItems: "center", borderRadius: 8 },
  primary: { backgroundColor: t.field }, secondary: { backgroundColor: "transparent" },
  action: { fontFamily: t.font, fontSize: 16, fontWeight: "600", textAlign: "center" },
  input: { fontFamily: t.font, fontSize: 17, lineHeight: 25, color: t.paper, backgroundColor: t.surface, minHeight: 132, borderWidth: 1, borderColor: t.muted, borderRadius: 8, padding: 16, textAlignVertical: "top" },
  overlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.68)", paddingHorizontal: 24 },
  confirmation: { flexGrow: 0, maxHeight: "100%", borderWidth: 1, borderColor: t.border, borderRadius: 16, backgroundColor: t.surface }
});
