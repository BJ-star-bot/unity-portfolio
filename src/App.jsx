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
      period: "2025.10",
      summary:
        "Unity 版 ObjectPool 示例：泛型池 + GridPartition + CustomUpdateManager，演示万级物体的复用、空间分区与帧率监控。",
      tech: ["Unity", "C#", "对象池", "性能优化", "GridPartition"],
      metrics: [
        "ObjectPool/IPoolAble 自动扩容复用，追踪 total/active",
        "GridPartition/IGridObject O(1) 迁移 + 近邻检索",
        "CustomUpdateManager 分帧驱动 + FrameTime 展示 FPS/P95",
      ],
      links: {
        github: "https://github.com/BJ-star-bot/ObjectPool",

      },
    },
    {
      title: "不使用Nav插件的A* 网格寻路方案",
      period: "2025.11",
      summary:
        "A* 网格寻路方案：GridManager/PathFinder 生成动态网格，UnitMover 平滑走点，Detect+TraceAI 结合视野追踪并在障碍刷新时自动切换行为。",
      tech: ["Unity", "C#", "NavMesh", "A*"],
      metrics: ["状态切换 <1ms", "动态避障"],
      links: {
        github: "https://github.com/BJ-star-bot/FindPath",
        
      },
    },
      {
    title: "局域网联网系统 Demo",
    period: "2025.11",
    summary:
      "Unity 局域网联机：端口监听、IP 输入、广播发现、Host/Client 切换。",
    tech: ["Unity", "C#", "局域网", "广播", "Host/Client"],
    metrics: [
      "LANDiscovery/INode 端口监听 + 局域网广播拉取房间列表",
      "IPv4Panel 输入/校验 IP，快速直连 Host",
      "SessionHost/Client 一键切换 Host/Client，实时状态提示",
    ],
    links: {
      github: "https://github.com/BJ-star-bot/Network",
    },
  },
  ];

  const loadSceneModule = {
    title: "LoadSceneManager 场景切换方案",
    summary:
      "一套可复用的场景切换与 UI 过渡模块，统一管理黑幕、加载条与附加场景。",
    link: "https://github.com/BJ-star-bot/LoadSceneManager",
  };

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
  const extraHighlights = [
    {
      title: "LeetCode 刷题节奏",
      period: "持续更新",
      summary:
        "保持周更刷题节奏，覆盖数据结构/图/滑窗等核心题型，沉淀题解与思路复盘，打磨基础算法能力。",
      tech: ["算法", "刷题", "总结"],
      metrics: [
        "周更 3~5 题 + 总结",
        "题解同步 GitHub / 笔记库",
        "重点练习 Trie / 单调队列 / 前缀和",
      ],
      links: {
        github: "https://github.com/BJ-star-bot/LeetCodeSolution",
        
      },
    },
    {
      title: loadSceneModule.title,
      period: "2025.9",
      summary: loadSceneModule.summary,
      tech: ["Unity", "C#", "LoadScene"],
      metrics: [
        "一键切场景 + 黑幕渐变",
        "加载进度条 / 假进度曲线",
        "支持附加 UI 场景与事件回调",
      ],
      links: {
        github: loadSceneModule.link,
      },
    },
  ];

  const aboutSummary = "Unity3D 游戏开发实习生，擅长 C# / UGUI / NavMesh / Addressables / Shader Graph，关注可维护性与稳定帧率，能在短周期内交付端到端 Demo。";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">徐宏杰 · Unity 程序员</h1>
            <p className="mt-2 text-neutral-300">
              专注 Gameplay、UGUI 框架、性能优化与工具开发。参与多次 GameJam 并独立完成端到端 Demo。
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-400">
              <a className="hover:text-white" href="mailto:2200623670@qq.com">2200623670@qq.com</a>
              <span>·</span>
              <a className="hover:text-white" href="https://github.com/BJ-star-bot" target="_blank">GitHub</a>
              <span>·</span>
              <a className="hover:text-white" href="https://space.bilibili.com/190527948?spm_id_from=333.1007.0.0" target="_blank">Bilibili</a>
              <span>·</span>
              <a className="hover:text-white" href="https://hh7lin.itch.io/" target="_blank">Itch.io</a>
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
            {/* 外观与主题设置 */}
            <div className="flex items-center gap-2 text-sm" title="外观与主题设置">
              <span className="text-neutral-400">外观与主题</span>
              <label className="text-neutral-400" htmlFor="theme-select">主题色</label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-xl bg-neutral-900 px-3 py-2 text-sm outline-none ring-1 ring-neutral-800 focus:ring-2 focus:ring-indigo-500 border border-neutral-800 text-neutral-300"
              >
                <option value="mint">薄荷</option>
                <option value="ocean">海蓝</option>
                <option value="violet">紫罗兰</option>
                <option value="sun">暖阳</option>
              </select>

              <label className="text-neutral-400" htmlFor="mode-select">外观</label>
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
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...filtered, ...extraHighlights].map((p, i) => (
            <article key={`${p.title}-${i}`} className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
                {p.period && (
                  <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">{p.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-300 min-h-[3.5rem]">{p.summary}</p>

              {p.tech?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-xs text-neutral-300">{t}</span>
                  ))}
                </div>
              )}

              {p.metrics?.length > 0 && (
                <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-xs text-neutral-400">
                  {p.metrics.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {p.links?.github && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.github} target="_blank" rel="noreferrer">GitHub</a>
                )}
                {p.links?.video && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.video} target="_blank" rel="noreferrer">视频</a>
                )}
                {p.links?.itch && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.itch} target="_blank" rel="noreferrer">Itch.io</a>
                )}
                {p.links?.resume && (
                  <a className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700" href={p.links.resume} target="_blank" rel="noreferrer">简历</a>
                )}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16">
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold">关于我</h2>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">{aboutSummary}</p>
                <ul className="mt-4 list-disc pl-5 text-sm text-neutral-400 space-y-1">
                  <li>多次参加 Brackeys/GMTK/TapTap 聚光灯 GameJam，负责程序与玩法实现。</li>
                  <li>喜欢搭建可复用工具链，如对象池管理器、LoadSceneManager、UI 框架。</li>
                  <li>当前聚焦中大型关卡加载、性能监控与自动化验证流程。</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 text-sm text-neutral-300">
                <CopyEmail email="2200623670@qq.com" />
                <a className="rounded-xl border border-neutral-700 px-4 py-2 text-center hover:bg-neutral-800" href="/resume.pdf" target="_blank" rel="noreferrer">
                  下载简历（PDF）
                </a>
              </div>
            </div>
          </article>
        </section>
      </main>

      <footer className="border-t border-neutral-900/60 bg-neutral-950/60">
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-neutral-500">
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
      className="rounded-xl border border-neutral-700 px-4 py-2 text-center hover:bg-neutral-800"
    >
      {copied ? "邮箱已复制 ✅" : "复制邮箱"}
    </button>
  );
}
