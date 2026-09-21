import React, { useId } from "react";
import { Link } from "./router";
import { STATUS } from "./board";

/* Small component family shared by list, detail and form. */

export function Button({ variant = "secondary", size = "md", as = "button", className = "", children, ...rest }) {
  const cls = ["btn", `btn--${variant}`, size === "sm" ? "btn--sm" : "", className].filter(Boolean).join(" ");
  if (as === "link") {
    return (
      <Link className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

export function StatusBadge({ status, size = "md" }) {
  const meta = STATUS[status] || { label: status, tone: "unknown" };
  return (
    <span className={`badge badge--${meta.tone} ${size === "sm" ? "badge--sm" : ""}`}>
      <span className="badge__dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function Cue({ cue }) {
  if (!cue) return null;
  return <span className={`cue cue--${cue.tone}`}>{cue.text}</span>;
}

export function Field({ label, hint, error, children, required }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${error ? "field--invalid" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="field__req"> (gerekli)</span> : null}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Notice({ tone = "info", children, ...rest }) {
  return (
    <div className={`notice notice--${tone}`} {...rest}>
      {children}
    </div>
  );
}

export function EmptyPanel({ title, children, action }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {children ? <p className="empty__body">{children}</p> : null}
      {action}
    </div>
  );
}
