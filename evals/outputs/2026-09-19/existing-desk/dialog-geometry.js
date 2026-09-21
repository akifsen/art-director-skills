export function isDialogBackdropClick(event) {
  const node = event.currentTarget;
  if (!node || event.target !== node) return false;
  const rect = node.getBoundingClientRect();
  return (
    event.clientX < rect.left
    || event.clientX > rect.right
    || event.clientY < rect.top
    || event.clientY > rect.bottom
  );
}

export function dialogFocusables(node) {
  return [...node.querySelectorAll("button, [href], input, select, textarea")].filter(
    (el) => !el.disabled && !el.hidden && el.getAttribute("tabindex") !== "-1"
  );
}

export function cycleDialogTab(event) {
  const node = event.currentTarget;
  if (event.key !== "Tab" || !node?.open) return;
  const items = dialogFocusables(node);
  if (!items.length) {
    event.preventDefault();
    node.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = event.target;
  if (event.shiftKey && (active === first || active === node)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || active === node)) {
    event.preventDefault();
    first.focus();
  }
}
