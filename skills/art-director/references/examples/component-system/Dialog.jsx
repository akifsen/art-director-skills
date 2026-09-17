import { useEffect, useId, useRef } from "react";

export function Dialog({ title, description, open, onClose, children }) {
  const panel = useRef(null);
  const titleId = useId();
  const descId = useId();
  const previous = useRef(null);

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    if (open) {
      previous.current = document.activeElement;
      if (!node.open) node.showModal();
    } else if (node.open) {
      node.close();
    }
  }, [open]);

  useEffect(() => {
    const node = panel.current;
    if (!node) return undefined;
    const onCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    const onBackdrop = (event) => {
      if (event.target === node) onClose();
    };
    node.addEventListener("cancel", onCancel);
    node.addEventListener("click", onBackdrop);
    return () => {
      node.removeEventListener("cancel", onCancel);
      node.removeEventListener("click", onBackdrop);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open && previous.current && typeof previous.current.focus === "function") {
      previous.current.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={panel}
      className="nd-dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <h2 id={titleId}>{title}</h2>
      {description ? <p id={descId}>{description}</p> : null}
      {children}
    </dialog>
  );
}
