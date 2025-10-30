import React, { useEffect, useMemo, useState } from "react";

// ✅ 说明：
// 1) 这是一个单文件 React 作品集页面，默认导出一个组件即可在 ChatGPT 右侧预览。
// 2) Tailwind 已可直接使用；无需外部依赖，拷贝到任意 React/Vite 项目也能跑。
// 3) 修改下方 projects 数组即可填入你的 Demo/项目（支持 GitHub、B站/Itch 链接、技术标签、性能指标）。
// 4) 本页面含：筛选/搜索/标签/卡片/指标/一键复制邮箱按钮；适合放到 GitHub Pages / Vercel / Netlify。

export default function PortfolioSite() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "mint";
  });
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("mode", mode);
  }, [mode]);

  const projects = [
    {
      title: "对象池优化 Demo",
      period: "2025.05",
      summary:
        "基于泛型与接口的通用对象池，降低 GC 抖动；1000+ 实例稳定 60FPS。",
      tech: ["Unity", "C#", "对象池", "性能优化"],
      metrics: ["GC 分配 -60%", "FPS 稳定 60"],
      links: {
        github: "https://github.com/yourname/object-pool-demo",
        video: "https://www.bilibili.com/video/your-id",
        itch: "https://yourname.itch.io/object-pool-demo",
      },
    },
    {
      title: "UGUI 模块化框架",
      period: "2025.06",
      summary:
        "多界面解耦，Canvas 分层合批；支持动态路由与对象池复用列表。",
      tech: ["Unity", "C#", "UGUI", "架构"],
      metrics: ["DrawCall -35%", "列表复用 10k+"],
      links: {
        github: "https://github.com/yourname/ugui-framework",
        video: "https://www.bilibili.com/video/your-id",
      },
    },
    {
      title: "AI 寻路 + FSM",
      period: "2025.07",
      summary:
        "NavMesh + 有限状态机，支持巡逻/追踪/搜寻；动态障碍避让。",
      tech: ["Unity", "C#", "NavMesh", "AI"],
      metrics: ["状态切换 <1ms", "动态避障"],
      links: {
        github: "https://github.com/yourname/ai-fsm-navmesh",
        video: "https://www.bilibili.com/video/your-id",
      },
    },
    {
      title: "Shader 溶解/描边",
      period: "2025.07",
      summary:
        "Shader Graph 实现噪声溶解与描边，可运行时调参与事件驱动。",
      tech: ["Unity", "Shader Graph", "URP"],
      metrics: ["GPU 负载低", "参数可动画化"],
      links: {
        github: "https://github.com/yourname/shader-dissolve-outline",
        video: "https://www.bilibili.com/video/your-id",
      },
    },
    {
      title: "Addressables 资源加载优化",
      period: "2025.08",
      summary:
        "分组与依赖清理，异步加载与缓存策略：场景切换时间-40%。",
      tech: ["Unity", "C#", "Addressables", "性能优化"],
      metrics: ["切换 -40%", "内存峰值 -20%"],
      links: {
        github: "https://github.com/yourname/addressables-optimization",
        video: "https://www.bilibili.com/video/your-id",
      },
    },
  ];

  const tags = useMemo(() => [
    "All",
    ...Array.from(new Set(projects.flatMap((p) => p.tech))).sort(),
  ], []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const hitTag = tag === "All" || p.tech.includes(tag);
      const q = query.trim().toLowerCase();
      const hitQuery = !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tech.join(" ").toLowerCase().includes(q);
      return hitTag && hitQuery;
    });
  }, [projects, tag, query]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">徐宏杰 · Unity 程序员</h1>
            <p className="mt-2 text-neutral-300">
              专注 Gameplay、UGUI 框架、性能优化与工具开发。参与多次 GameJam 并独立完成端到端 Demo。
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-400">
              <a className="hover:text-white" href="mailto:2200623670@qq.com">2200623670@qq.com</a>
              <span>·</span>
              <a className="hover:text-white" href="https://github.com/yourname" target="_blank">GitHub</a>
              <span>·</span>
              <a className="hover:text-white" href="https://space.bilibili.com/yourid" target="_blank">Bilibili</a>
              <span>·</span>
              <a className="hover:text-white" href="https://yourname.itch.io" target="_blank">Itch.io</a>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
            <div className="flex w-full items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索：对象池 / UGUI / AI / Shader…"
                className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm outline-none ring-1 ring-neutral-800 placeholder:text-neutral-500 focus:ring-2 focus:ring-indigo-500 sm:w-80"
              />
              <button
                onClick={() => setQuery("")}
                className="rounded-xl bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700"
              >清空</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    tag === t
                      ? "border-indigo-400 bg-indigo-500/10 text-indigo-200"
                      : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700"
                  }`}
                >{t}</button>
              ))}
            </div>
            {/* Site theme (Dark/Light) dropdown */}
            <div className="flex items-center gap-2 text-sm">
              <label className="text-neutral-400" htmlFor="mode-select">主题</label>
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-xl bg-neutral-900 px-3 py-2 text-sm outline-none ring-1 ring-neutral-800 focus:ring-2 focus:ring-indigo-500 border border-neutral-800 text-neutral-300"
              >
                <option value="dark">深色</option>
                <option value="light">浅色</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <article key={i} className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
                <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">{p.period}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-300 min-h-[3.5rem]">{p.summary}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-xs text-neutral-300">{t}</span>
                ))}
              </div>

              {p.metrics?.length > 0 && (
                <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-xs text-neutral-400">
                  {p.metrics.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-center gap-3 text-sm">
                {p.links.github && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.github} target="_blank">GitHub</a>
                )}
                {p.links.video && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.video} target="_blank">视频</a>
                )}
                {p.links.itch && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.itch} target="_blank">Itch.io</a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* About / 联系 */}
        <section className="mt-14 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-xl font-semibold">关于我</h2>
          <p className="mt-2 text-neutral-300 text-sm leading-relaxed">
            Unity3D 游戏开发实习生，擅长 C# / UGUI / NavMesh / Addressables / Shader Graph，关注稳定帧率与可维护性架构。
            参与 Brackeys、TapTap 等 GameJam，能在短周期内完成端到端可玩 Demo。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <CopyEmail email="2200623670@qq.com" />
            <a className="rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800" href="/resume.pdf" target="_blank">下载简历（PDF）</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900/60 bg-neutral-950/60">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} 徐宏杰 · Portfolio · Built with React
        </div>
      </footer>
    </div>
  );
}

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      className="rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800"
    >
      {copied ? "邮箱已复制 ✅" : "复制邮箱"}
    </button>
  );
}
