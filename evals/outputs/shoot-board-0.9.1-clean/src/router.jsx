import React, { useEffect, useState } from "react";

/**
 * Minimal history-based router for this app (no router package is installed).
 * Routes:
 *   /                          project list
 *   /projeler/:id              project detail
 *   /projeler/:id/teslimat     delivery edit form
 * Query `durum` keeps the active status filter across navigation.
 */

function read() {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  const parts = pathname.split("/").filter(Boolean);
  let view = "list";
  let id = null;
  if (parts[0] === "projeler" && parts[1]) {
    id = decodeURIComponent(parts[1]);
    view = parts[2] === "teslimat" ? "edit" : "detail";
  }
  return { pathname, search, view, id, filter: params.get("durum") || "all" };
}

export function navigate(to, { replace = false } = {}) {
  if (replace) window.history.replaceState(null, "", to);
  else window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useLocation() {
  const [loc, setLoc] = useState(read);
  useEffect(() => {
    const onChange = () => setLoc(read());
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return loc;
}

export function withFilter(path, filter) {
  return filter && filter !== "all" ? `${path}?durum=${encodeURIComponent(filter)}` : path;
}

export function Link({ href, replace, onNavigate, children, ...rest }) {
  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href, { replace });
    if (onNavigate) onNavigate();
  }
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
