import React, { useCallback, useEffect, useState } from "react";
import { projects as seed } from "./data";
import { RouterProvider, matchPath, useRouter } from "./router.jsx";
import {
  DetailPane,
  EditPane,
  IdlePane,
  ListPane,
  NotFoundPane,
  statusFromSlug
} from "./screens.jsx";

/**
 * Session store: the seed records are demo data (see src/data.js).
 * Edits live in React state for this browser session only.
 */
function useProjects() {
  const [projects, setProjects] = useState(seed);
  const update = useCallback((id, patch) => {
    setProjects((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);
  return [projects, update];
}

function resolveRoute(path) {
  if (path === "/" || path === "") return { screen: "list" };
  let m = matchPath("/projeler/:id/duzenle", path);
  if (m) return { screen: "edit", id: m.id };
  m = matchPath("/projeler/:id", path);
  if (m) return { screen: "detail", id: m.id };
  return { screen: "missing" };
}

function Shell() {
  const { path, search } = useRouter();
  const [projects, update] = useProjects();
  const [savedId, setSavedId] = useState(null);

  const route = resolveRoute(path);
  const params = new URLSearchParams(search);
  const filter = statusFromSlug(params.get("durum"));
  // Keep only the filter in links so the list comes back the same way.
  const keep = filter ? `?durum=${params.get("durum")}` : "";

  const project = route.id ? projects.find((p) => p.id === route.id) : null;

  // The success notice belongs to the record just saved; leaving it clears it.
  useEffect(() => {
    if (route.screen !== "detail" || route.id !== savedId) setSavedId(null);
  }, [route.screen, route.id, savedId]);

  const onSave = (id, patch) => {
    update(id, patch);
    setSavedId(id);
  };

  let pane;
  if (route.screen === "list") pane = <IdlePane />;
  else if (route.screen === "missing") pane = <NotFoundPane kind="route" search={keep} />;
  else if (!project) pane = <NotFoundPane kind="record" id={route.id} search={keep} />;
  else if (route.screen === "edit") pane = <EditPane project={project} search={keep} onSave={onSave} />;
  else pane = <DetailPane project={project} search={keep} saved={savedId === project.id} />;

  const mode = route.screen === "list" ? "list" : "pane";

  return (
    <div className="app" data-mode={mode}>
      <header className="topbar">
        <div className="topbar__inner">
          <h1 className="brand">
            <span className="brand__mark" aria-hidden="true" />
            Shoot board
          </h1>
          <p className="topbar__note">
            Örnek veri<span className="topbar__note-long"> · değişiklikler bu oturumda kalır</span>
          </p>
        </div>
      </header>

      <main className="work">
        <aside className="work__list" aria-label="Proje listesi">
          <ListPane
            projects={projects}
            filter={filter}
            search={keep}
            selectedId={project ? project.id : null}
          />
        </aside>
        <section className="work__pane" aria-label="Seçili proje">
          {pane}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
