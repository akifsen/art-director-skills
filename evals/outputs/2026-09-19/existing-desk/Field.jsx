import { useId } from "react";

export function Field({ label, error, children }) {
  const id = useId();
  return (
    <label className="nd-field" data-invalid={error ? "true" : "false"}>
      {label}
      {typeof children === "function"
        ? children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-err` : undefined })
        : children}
      {error ? <span className="nd-error" id={`${id}-err`}>{error}</span> : null}
    </label>
  );
}
