import { useEffect, useId, useRef, useState } from "react";
import { Button, Field } from "./ui.jsx";

function focusables(root) {
  return [...root.querySelectorAll("button, [href], textarea, input, select")].filter(
    (el) => !el.disabled && el.getAttribute("tabindex") !== "-1"
  );
}

function clickOutsideSheet(event, sheet) {
  const box = sheet.getBoundingClientRect();
  return (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  );
}

export default function NoteEditor({ record, onSave, onCancel }) {
  const dialogRef = useRef(null);
  const sheetRef = useRef(null);
  const fieldRef = useRef(null);
  const triggerRestore = useRef(document.activeElement);
  const fieldId = useId();
  const [draft, setDraft] = useState(record.note);
  const [error, setError] = useState("");
  const adding = record.note.trim() === "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    fieldRef.current?.focus();
    fieldRef.current?.setSelectionRange(draft.length, draft.length);
    return () => {
      if (dialog.open) dialog.close();
      const restore = triggerRestore.current;
      if (restore && typeof restore.focus === "function") restore.focus();
    };
  }, []);

  function discard() {
    onCancel();
  }

  function submit(event) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) {
      setError("Write the going-home note before saving.");
      fieldRef.current?.focus();
      return;
    }
    onSave(next);
  }

  function onDialogClick(event) {
    if (!sheetRef.current) return;
    if (clickOutsideSheet(event, sheetRef.current)) discard();
  }

  function onKeyDown(event) {
    if (event.key !== "Tab") return;
    const nodes = focusables(dialogRef.current);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="note-dialog"
      aria-labelledby="note-editor-title"
      onCancel={(event) => {
        event.preventDefault();
        discard();
      }}
      onClick={onDialogClick}
      onKeyDown={onKeyDown}
    >
      <form ref={sheetRef} className="note-sheet" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <p className="note-sheet__kicker">
          {record.slot} · {record.species} · {record.id}
        </p>
        <h2 id="note-editor-title" className="note-sheet__title">
          {adding ? `Add discharge note for ${record.name}` : `Edit discharge note for ${record.name}`}
        </h2>
        <p className="note-sheet__meta">
          Owner {record.owner} · {record.reason}
        </p>
        <Field
          id={fieldId}
          label="Tell the owner"
          hint="What they need to do at home. Saved only in this tab."
          error={error}
        >
          <textarea
            ref={fieldRef}
            id={fieldId}
            className="note-field"
            rows={7}
            value={draft}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : `${fieldId}-hint`}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError("");
            }}
          />
        </Field>
        <div className="note-sheet__actions">
          <Button variant="ghost" onClick={discard}>
            Cancel
          </Button>
          <Button type="submit" variant="solid">
            Save note
          </Button>
        </div>
      </form>
    </dialog>
  );
}
