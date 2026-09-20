export function Button({ variant = "solid", className = "", type = "button", ...props }) {
  return <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...props} />;
}

export function Field({ id, label, hint, error, children }) {
  return (
    <div className={error ? "field field--invalid" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
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

export function StatusWord({ ready }) {
  return ready ? (
    <span className="status status--ready">Note ready</span>
  ) : (
    <span className="status status--wait">Note needed</span>
  );
}

export function DemoBanner() {
  return (
    <p className="demo-banner">
      Sample records in this tab. Changes stay in this session and are not sent to a clinic system.
    </p>
  );
}
