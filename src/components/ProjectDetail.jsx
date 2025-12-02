import React from "react";

const articleContentMap = {
  "不使用Nav插件的 A* 网格寻路": [
    {
      text:
        "这个项目基于 Unity 的网格寻路：GridManager 在场景中生成规则网格，每个 Node 记录 walkable 状态和世界坐标，PathFinder 使用 A*（openSet/closedSet、g+h 成本）在网格上求最短路径，并实时调用 RefreshNode 适配会移动的障碍。",
      mediaIndex: 0,
    },
    {
      text:
        "移动体由 UnitMover 控制：收到目标点后通过协程沿节点列表移动，支持转向插值、停止距离控制、动态重新寻路（路径被占时重新规划），还能同步保持在地面高度。",
      mediaIndex: 1,
    },
    {
      text:
        "感知系统 Detect 提供视野扇形绘制与可见性判定：LateUpdate 中生成 Mesh 显示视野区域，同时利用 OverlapSphere + Angle + Raycast 策略筛选最近可见目标，供 AI 查询。",
      mediaIndex: 2,
    },
    {
      text:
        "敌人 AI TraceAI 将两者结合：Detect.CheckVisible 判定玩家，UnitMover 负责追击；当失去目标后，AI 会进入 Idle 状态，在初始方向左右 maxSearchAngle 内左右扫视并随机停顿，同时周期性挑选 roamRadius 范围内（以 roamCenter 或初始位置为中心）可达点，利用同一寻路系统完成巡逻。",
      mediaIndex: 3,
    },
    {
      text:
        "该方案的优势：逻辑拆分明确（感知/寻路/移动），可在 Inspector 中调参，具备动态障碍适应性与可视化调试手段；即便在触及网格边界时，也通过 PathFinder 的空节点保护安全失败，不会崩溃。自然可以扩展更多 AI 状态或多种路径策略，是构建动作或 RPG 原型中轻量却实用的寻路解决方案。",
    },
  ],
  "3D 角色控制 Demo": [
    {
      text:
        "StatePlayerCameraFollow（Assets/Scripts/Camera/StateCameraFollow.cs）负责第三人称跟随，鼠标输入驱动 yaw/pitch，相机位置通过指数平滑插值黏在 StateManager 身后，Tab 切入 CameraControl 的自由摄影模式则提供开发调试；联网时再由 NetworkCameraFollow 自动寻找 Player 标签并锁定，以免多人场景冲突。",
      mediaIndex: 0,
    },
    {
      text:
        "角色生命/受击链由 HealthManager（Assets/Scripts/Creature/HealthManager.cs）统一实现：读取 HealthProvider 初始化 HP，TakeDamage 处理穿透与伤害下限，归零广播 GoDied，否则发 OnInjured，方便动画或特效订阅；攻击命中由 AttackAni（Assets/Scripts/Player/Attack/AttackAni.cs）驱动，动画事件触发 HitEnable/HitDisable，让 AttackDetect 只在关键帧开放 hitbox。",
      mediaIndex: 1,
    },
    {
      text:
        "Animator Controller 除默认 0 层的全身动作，还额外创建 \"UpperBody\" 层：Avatar Mask 只勾选上半身骨骼，层权重=1，上层播放射击/挥剑等动作时，下层保持跑步；当 AttackAni 被动画事件点火时，hitbox 依旧受控，而下半身维持步伐节奏，实现上、下半身动画分离。",
      mediaIndex: 2,
    },
    {
      text:
        "整体结构把相机、生命、攻击、动画分层封装，Inspector 中可以调节灵敏度/偏移或 Animator Layer 权重；既保证稳定视角体验，又能在战斗时叠加更复杂的上半身动作，对动作或 RPG 原型来说是易扩展、易调试的角色控制方案。",
    },
  ],
  "LoadSceneManager 场景切换方案": [
    {
      text:
        "LoadSceneManager 常驻场景，负责触发 OnSceneChangeBegin/End、黑幕过渡、加载协程与 UI 场景的附加加载。核心流程是：黑幕淡入 → 预处理（资源卸载等） → SceneManager.LoadSceneAsync（锁 0.9） → 场景激活 → 黑幕淡出，最后刷新光照探针，保证视觉一致性。",
      mediaIndex: 0,
    },
    {
      text:
        "TransitionController 管理黑幕与进度 UI，利用 AnimationCurve 实现无时缩的淡入淡出，CanvasGroup 控制进度条显隐，因此从初始界面跳转到游戏或在关卡里切换场景，都能复用同一套动画体验。",
      mediaIndex: 1,
    },
    {
      text:
        "LoadingProgressUI 把进度拆成五段权重，并加入 \"假进度 + 最小速度\" 策略，条子始终向前、不会卡在 90%，也为未来接入下载或清理流程预留了钩子（Assets/Scripts/LoadScene/LoadProgressUI.cs, 6-155）。",
    },
    {
      text:
        "场景 ID 与显示名称通过 SceneMapping 数据驱动（Assets/Scripts/LoadScene/SceneConfigure.cs, 7-97），新增关卡只需登记一次，UI、加载与黑幕流程自动保持一致，是快速搭建统一场景切换体验的工具链。",
    },
  ],
};

export default function ProjectDetail({ project, onBack }) {
  if (!project) return null;
  const articleSections = articleContentMap[project.title];
  const showArticle = Array.isArray(articleSections) && articleSections.length > 0;
  const mediaImgStyle = {
    maxHeight: "180px",
    width: "100%",
    maxWidth: "22rem",
    margin: "0 auto",
    display: "block",
    objectFit: "contain",
  };

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

          {showArticle ? (
            <div className="mt-8 space-y-10">
              {articleSections.map((section, idx) => {
                const media =
                  typeof section.mediaIndex === "number"
                    ? project.media?.[section.mediaIndex]
                    : null;
                return (
                  <article key={`${project.title}-section-${idx}`} className="space-y-4">
                    {media && (
                      <figure className="flex flex-col items-center gap-2">
                        <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/60 p-2">
                          <img
                            src={media.src}
                            alt={media.alt || `${project.title} 插图 ${idx + 1}`}
                            loading="lazy"
                            style={mediaImgStyle}
                          />
                        </div>
                        {media.alt && (
                          <figcaption className="text-xs text-neutral-400">
                            {media.alt}
                          </figcaption>
                        )}
                      </figure>
                    )}
                    <p className="text-sm leading-relaxed text-neutral-300">{section.text}</p>
                  </article>
                );
              })}
            </div>
          ) : (
            <>
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
                        style={mediaImgStyle}
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
            </>
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
