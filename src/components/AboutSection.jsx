import React, { useState } from "react";

export default function AboutSection({ summary }) {
  return (
    <section className="mt-16 fade-slide-in">
      <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold">关于我</h2>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">{summary}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-neutral-400">
              <li>多次参加 Brackeys / GMTK / TapTap 聚光灯 GameJam。</li>
              <li>喜欢搭建工具链：对象池、LoadSceneManager、UI 框架。</li>
              <li>关注关卡加载、性能监控与自动化验证流程。</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 text-sm text-neutral-300">
            <CopyEmail email="2200623670@qq.com" />
            <a
              className="rounded-xl border border-neutral-700 px-4 py-2 text-center hover:bg-neutral-800"
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              下载简历（PDF）
            </a>
          </div>
        </div>
      </article>
    </section>
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
