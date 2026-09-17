import { useEffect, useRef } from "react";

export function Dialog({ title, open, onClose, children }) {
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previously = document.activeElement;
    panel.current?.querySelector("button, input, select, textarea")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previously?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="nd-dialog-root">
      <div className="nd-backdrop" onClick={onClose} />
      <div ref={panel} className="nd-dialog" role="dialog" aria-modal="true" aria-labelledby="nd-dialog-title">
        <h2 id="nd-dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
