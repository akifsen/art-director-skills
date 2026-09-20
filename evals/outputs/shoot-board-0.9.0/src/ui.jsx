import React from "react";
import { STATUS_LABELS } from "./board.js";

export function Link({ to, children, className, ...props }) {
  function onClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <a href={to} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
}

export function Button({ variant = "solid", type = "button", className = "", children, ...props }) {
  return (
    <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function Field({ id, label, hint, error, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={error ? "field field--invalid" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {React.cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy
      })}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function StatusWord({ status }) {
  return (
    <span className={`status status--${status}`}>
      <span className="status__mark" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function Mark({ className = "" }) {
  return (
    <svg
      className={`mark ${className}`.trim()}
      viewBox="0 0 32 22"
      width="32"
      height="22"
      aria-hidden="true"
    >
      <rect x="0.75" y="3.25" width="30.5" height="15.5" fill="var(--canvas)" stroke="var(--text)" strokeWidth="1.5" />
      <rect x="7" y="6.5" width="18" height="9" fill="var(--surface)" stroke="var(--brand)" strokeWidth="1.25" />
    </svg>
  );
}
