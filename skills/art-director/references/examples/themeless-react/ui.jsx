import { useEffect, useId, useRef } from "react";

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  busy,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}${size === "sm" ? " btn-sm" : ""}`}
      disabled={disabled || busy}
      aria-busy={busy ? "true" : undefined}
      {...props}
    >
      {busy ? "Working…" : children}
    </button>
  );
}

export function Field({ label, hint, error, children }) {
  const id = useId();
  const control = { id, "aria-invalid": error ? "true" : undefined, "aria-describedby": error ? `${id}-err` : hint ? `${id}-hint` : undefined };
  return (
    <label className="field" data-invalid={error ? "true" : "false"}>
      <span>{label}</span>
      {typeof children === "function" ? children(control) : children}
      {hint && !error ? <small id={`${id}-hint`}>{hint}</small> : null}
      {error ? <small className="field-error" id={`${id}-err`}>{error}</small> : null}
    </label>
  );
}

export function Badge({ tone = "hold", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Empty({ title, children }) {
  return (
    <div className="kq-empty" role="status">
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export function PageHeader({ title, kicker, actions }) {
  return (
    <header className="kq-header">
      <div>
        {kicker ? <p className="kq-brand">{kicker}</p> : null}
        <h1>{title}</h1>
      </div>
      {actions}
    </header>
  );
}

export function Dialog({ title, open, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const node = ref.current;
    const previous = document.activeElement;
    node?.querySelector("button, [href], input, select, textarea")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous && "focus" in previous) previous.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="dialog-root">
      <div className="dialog-backdrop" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="kq-dialog-title" className="dialog">
        <h2 id="kq-dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
