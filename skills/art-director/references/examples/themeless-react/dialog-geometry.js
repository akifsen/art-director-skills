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
