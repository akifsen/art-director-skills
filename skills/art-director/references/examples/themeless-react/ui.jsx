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

export function Empty({ title, children, action }) {
  return (
    <div className="kq-empty" role="status">
      <strong>{title}</strong>
      <div>{children}</div>
      {action}
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

export function Dialog({ title, description, open, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  const descId = useId();
  const previous = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) {
      previous.current = document.activeElement;
      if (!node.open) node.showModal();
    } else if (node.open) {
      node.close();
    }
  }, [open]);

  useEffect(() => {
    const node = ref.current;
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
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <h2 id={titleId}>{title}</h2>
      {description ? <p id={descId}>{description}</p> : null}
      {children}
    </dialog>
  );
}
