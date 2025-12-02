import React from "react";

export default function ProjectGrid({ projects, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-slide-in">
      {projects.map((project, index) => (
        <article
          key={`${project.title}-${index}`}
          onClick={() => onSelect(project)}
          className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
            {project.period && (
              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                {project.period}
              </span>
            )}
          </div>

          <p className="mt-2 min-h-[3.5rem] text-sm text-neutral-300">
            {project.summary}
          </p>

          {project.tech?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-xs text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {project.metrics?.length > 0 && (
            <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-xs text-neutral-400">
              {project.metrics.map((metric, idx) => (
                <li key={idx}>{metric}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {project.links?.github && (
              <a
                className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700"
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                GitHub
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
