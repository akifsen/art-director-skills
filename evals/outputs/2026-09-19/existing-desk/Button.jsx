export function Button({ variant = "primary", size = "md", type = "button", disabled, children, ...props }) {
  const classes = ["nd-btn", `nd-btn-${variant}`];
  if (size === "sm") classes.push("nd-btn-sm");
  return (
    <button type={type} className={classes.join(" ")} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
