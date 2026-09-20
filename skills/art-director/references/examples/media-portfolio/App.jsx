import { useEffect } from "react";
import { studio, works } from "./data.js";
import "./styles.css";

const featured = works.find((item) => item.featured);
const rest = works.filter((item) => !item.featured);

export default function App() {
  useEffect(() => {
    document.body.classList.add("rs");
    return () => document.body.classList.remove("rs");
  }, []);

  return (
    <>
      <header className="rs-bar">
        <a className="rs-mark" href="#top">
          {studio.name}
        </a>
        <nav className="rs-nav" aria-label="Studio">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#inquire">Inquire</a>
        </nav>
      </header>

      <main id="top">
        <section className="rs-open" aria-labelledby="current-work">
          <div>
            <p className="rs-kicker">Current catalog still</p>
            <h1 id="current-work">{featured.title}</h1>
            <p className="rs-place">{featured.place}</p>
            <p className="rs-lede">{featured.note}</p>
            <p className="rs-meta">
              {featured.year} · {studio.line}
            </p>
          </div>
          <figure className="rs-hero">
            <img
              src={featured.src}
              alt=""
              width="1600"
              height="900"
            />
            <figcaption>
              Generated demo still of a {featured.title.toLowerCase()} in a {featured.place.toLowerCase()} — not a client shoot.
            </figcaption>
          </figure>
        </section>

        <section className="rs-work" id="work" aria-labelledby="work-heading">
          <h2 id="work-heading">Other frames</h2>
          <div className="rs-index">
            {rest.map((item) => (
              <figure className={`rs-tile rs-tile--${item.id === "dock-flood" ? "yard" : "arm"}`} key={item.id}>
                <img src={item.src} alt="" width="1200" height="900" />
                <figcaption>
                  <h3>{item.title}</h3>
                  <p>
                    {item.place} · {item.year}
                  </p>
                  <p>{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="rs-end" aria-labelledby="studio-heading">
          <div id="studio">
            <h2 id="studio-heading">Studio</h2>
            <p>
              Rail Still photographs lighting hardware for manufacturer catalogs.
              The room in the frame is the room that was there.
            </p>
          </div>
          <div id="inquire">
            <h2>Inquire</h2>
            <p>
              Send the fixture name and the room you can give us. We answer with a
              slot, not a moodboard.
            </p>
            <a className="rs-mail" href={`mailto:${studio.email}?subject=Catalog%20still`}>
              Email the desk
            </a>
            <p className="rs-note">
              Stills on this page were generated for the tutorial. They are not
              photographs of a real commission.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
