import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Minimal history-API router. Real URLs, back/forward, no extra dependency
 * (package.json is fixed for this trial). Vite's dev server falls back to
 * index.html for unknown paths, so deep links work.
 */
const RouterContext = createContext(null);

function readLocation() {
  return { path: window.location.pathname, search: window.location.search };
}

export function RouterProvider({ children }) {
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const onPop = () => setLoc(readLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) window.history.replaceState(null, "", to);
    else window.history.pushState(null, "", to);
    setLoc(readLocation());
  }, []);

  return (
    <RouterContext.Provider value={{ ...loc, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({ to, replace, onClick, ...rest }) {
  const { navigate } = useRouter();
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to, { replace });
  };
  return <a href={to} onClick={handle} {...rest} />;
}

/** Match "/projeler/:id/duzenle" style patterns. Returns params or null. */
export function matchPath(pattern, path) {
  const p = pattern.split("/").filter(Boolean);
  const a = path.split("/").filter(Boolean);
  if (p.length !== a.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}
