import React, { forwardRef, useId } from "react";
import { Link } from "./router.jsx";
import { STATUS } from "./format.js";

/* ---------- Button ---------- */

export function Button({ variant = "secondary", size = "md", as, to, className = "", children, ...rest }) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
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

/* ---------- Status badge (word + mark, never color alone) ---------- */

export function StatusBadge({ status, size = "md" }) {
  const s = STATUS[status];
  if (!s) return null;
  return (
    <span className={`badge badge--${s.tone} badge--${size}`}>
      <span className="badge__mark" aria-hidden="true" />
      {s.label}
    </span>
  );
}

/* ---------- Field (label, control, hint, error) ---------- */

export const Field = forwardRef(function Field(
  { label, hint, error, as = "input", className = "", ...rest },
  ref
) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const described = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const Control = as;
  return (
    <div className={`field ${error ? "field--invalid" : ""} ${className}`.trim()}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <Control
        ref={ref}
        id={id}
        className="field__control"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={described}
        {...rest}
      />
      {hint && !error && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={errId} role="alert">
          <span className="field__error-mark" aria-hidden="true">
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
});

/* ---------- Inline notice ---------- */

export function Notice({ tone = "info", children, ...rest }) {
  return (
    <div className={`notice notice--${tone}`} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Definition row used on detail ---------- */

export function Meta({ term, children, wide = false }) {
  return (
    <div className={`meta ${wide ? "meta--wide" : ""}`.trim()}>
      <dt className="meta__term">{term}</dt>
      <dd className="meta__desc">{children}</dd>
    </div>
  );
}
