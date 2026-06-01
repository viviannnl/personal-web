"use client";

import { PROJECTS } from "../data";
import { useOS } from "../OSContext";

export default function BuildsApp() {
  const { open } = useOS();
  return (
    <div className="builds">
      <p className="builds-intro">
        the lab beneath the cozy. bias toward shipping, comfortable being wrong —
        that’s where the good stuff lives.
      </p>
      <div className="proj-grid">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className={`proj acc-${p.accent} ${p.live ? "" : "dim"}`}
          >
            <div className="proj-top">
              <h3>{p.name}</h3>
              <span className={`tag ${p.live ? "live" : ""} mono`}>
                {p.status}
              </span>
            </div>
            <p>{p.blurb}</p>
            <div className="proj-foot">
              {p.open ? (
                <button className="lnk mono" onClick={() => open(p.open!)}>
                  open ↗
                </button>
              ) : p.live && p.url !== "#" ? (
                <a
                  className="lnk mono"
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  visit ↗
                </a>
              ) : (
                <span className="lnk mono muted">{p.live ? "" : "soon™"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
