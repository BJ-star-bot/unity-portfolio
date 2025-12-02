import React from "react";

export default function ProjectDetail({ project, onBack }) {
  if (!project) return null;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10 fade-slide-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
      >
        <span aria-hidden="true">←</span>
        返回项目列表
      </button>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            项目介绍
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{project.title}</h2>
          {project.period && (
            <span className="mt-2 inline-flex rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
              {project.period}
            </span>
          )}
          <p className="mt-4 text-neutral-300 leading-relaxed">{project.summary}</p>

          {project.media?.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {project.media.map((item, idx) => (
                <figure
                  key={item.src ?? idx}
                  className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/40"
                >
                  <img
                    src={item.src}
                    alt={item.alt || `${project.title} 展示 ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {item.alt && (
                    <figcaption className="px-3 py-2 text-xs text-neutral-400">
                      {item.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {project.metrics?.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-400">
              {project.metrics.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          )}
        </div>

        <aside className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
          <h3 className="text-sm font-semibold text-neutral-200">技术要点</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech?.map((t) => (
              <span
                key={t}
                className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-xs text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 text-sm">
            {project.links?.github && (
              <a
                className="rounded-xl border border-neutral-700 px-4 py-2 text-center hover:bg-neutral-800"
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
              >
                查看 GitHub
              </a>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
