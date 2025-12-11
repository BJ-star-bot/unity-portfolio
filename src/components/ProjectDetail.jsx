import React from "react";

const withBase = (path) => {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/g, "")}`;
};

const LOADING_GIF_SRC = withBase("loading.gif");

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
  "背包 & 合成系统": [
    {
      text:
        "底层数据使用 ScriptableObject + CSV 生成：ItemDefinition 提供稀有度、堆叠上限、图标与 Tooltip 文案，CraftRecipe 定义输入/输出以及检查回调；启动时由 InventoryBootstrap 读取 CSV→SO→Dictionary，使策划可直接改表快速扩展。",
      mediaIndex: 0,
    },
    {
      text:
        "UI 由 UGUI 背包面板 + 右侧 Craft 面板组成：背包格通过 ScrollRect + GridLayoutGroup 动态生成，SlotButton 接入 Pointer 事件展示 Tooltip，支持拖拽/点击快速放入材料，顶部 Tabs 切换装备、材料、消耗品筛选。",
      mediaIndex: 1,
    },
    {
      text:
        "CraftPanel 显示 RecipeList、需求素材和产物预览：点击配方后自动高亮满足与缺失项，批量按钮会根据库存计算可制作次数；点击合成时触发 InventoryService.TryCraft()，扣减材料并写入 SQLite/Json 存档。",
      mediaIndex: 2,
    },
    {
      text:
        "流程内嵌 DebugOverlay：实时打印 AddItem/RemoveItem、合成成功/失败原因，并提供一键补给测试按钮，方便调试；所有 UI 事件统一经由 InventoryEventBus 分发，后续可无痛接入手柄或热键。",
    },
  ],
  "3D 角色控制 Demo": [
    {
      text:
        "StatePlayerCameraFollow 负责第三人称跟随，鼠标输入驱动 yaw/pitch，相机位置通过指数平滑插值黏在 StateManager 身后，Tab 切入 CameraControl 的自由摄影模式即可绕场勘景；联网时再由 NetworkCameraFollow 自动寻找 Player 标签并锁定，保证本地多角色或联机调试时都不会抢镜。",
      mediaIndex: 0,
    },
    {
      text:
        "角色生命/受击链由 HealthManager 统一实现：读取 HealthProvider 初始化 HP，TakeDamage 处理穿透与伤害下限，归零广播 GoDied，否则发 OnInjured，方便动画或特效订阅；攻击命中由 AttackAni 动画脚本驱动，动画事件触发 HitEnable/HitDisable，让 AttackDetect 只在关键帧开放 hitbox。",
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
        "LoadingProgressUI 把进度拆成五段权重，并加入 \"假进度 + 最小速度\" 策略，条子始终向前、不会卡在 90%；同时暴露事件让外部注入资源下载、缓存清理等耗时步骤，为后续扩展多段式加载留出空间。",
    },
    {
      text:
        "场景 ID 与显示名称通过 SceneMapping 数据驱动，新增关卡只需登记一次，UI、加载与黑幕流程便自动保持一致，还能同步维护中文标题、截图等元数据，是快速搭建统一场景切换体验的基础设施。",
    },
  ],
  "联机系统 Demo（LAN + Relay + 状态同步）": [
    {
      text:
        "项目使用 Unity Netcode + UnityTransport 实现 Host/Client 同步，外围由一套联机按钮脚本控制。LanNetButton 绑定 NetworkManager 与 UnityTransport，提供 Host、Join、刷新等 UI；开启 Host 时会检测本机 IPv4、调用 Net.StartHost() 并自动写入防火墙规则，同时启动 UDP 广播与扫描通道。",
      mediaIndex: 0,
    },
    {
      text:
        "发现机制分被动广播与主动扫描：BeginDiscovery() 同时运行 ListenForBroadcasts() 与 StartSubnetScan()，前者监听 broadcastPort 的 BroadcastTag|IP|Port 数据，后者遍历本子网发送 DISCOVER 探测，Host 接到后单播回复。结果缓存在线程安全队列，Update() 拉取后刷新 knownHostsOrdered，让 UI 即时显示所有房间。",
      mediaIndex: 1,
    },
    {
      text:
        "Host 端额外运行 HostProbeResponderLoop()，专门响应 DISCOVER，确保扫描模式也能发现当前主机；NetworkManager.OnClientConnected/Disconnected 统一管理 UI 状态，联机成功后隐藏选择面板，断开则回到房间列表，实现多人调试时的稳定体验。",
    },
    {
      text:
        "针对联机调试还提供 NetworkCameraFollow 自动跟随 Player 标签，避免多机状态下相机冲突；StateCameraFollow 则服务离线调试。整套模块覆盖局域网广播、子网扫描、防火墙开放等细节，并预留 Relay 按钮等扩展接口，可平滑拓展到 Relay/匹配与 State Sync/PredRollback 等更复杂联机场景。",
    },
  ],
  "对象池优化 Demo": [
    {
      text:
        "Demo 场景由 AddObjectManager 驱动：FixedUpdate 中按照 objectNumber 生成球体，勾选 poolTick 时从 ObjectPool<TestBall> 取对象，并根据 ballPool.totalCount/activeCount 实时刷新 UI；关闭 poolTick 则直接 Instantiate，但依旧依托 TestBall.ActiveInstances 统计活跃数量，方便一键对比两种策略。",
      mediaIndex: 0,
    },
    {
      text:
        "ObjectPool<T> 构造时注入预制体、初始容量与父节点，GetObject() 会优先复用空闲实例，若无则创建新对象并调用 OnSpawn()，ReturnObject() 则禁用物体、放回池并维护 total/active 计数，测试中 10000 活跃单位依旧稳定。",
      mediaIndex: 1,
    },
    {
      text:
        "被复用的 TestBall 实现 IPoolAble：OnSpawn 初始化弹道、速度与位置，OnDespawn 重置状态，ReturnPool() 归还对象；脚本还在 OnEnable/OnDisable 中维护静态 ActiveInstances，让非池模式下也能统计实时数量，对比差异更加直观，也方便其它子弹/技能沿用相同接口。",
    },
    {
      text:
        "性能测试 UI（ShowFrameUI、FrameTime 等）展示帧率、激活物体以及 GC 情况，玩家可按 F 键开始/暂停生成，并通过 Toggle 切换“立即 Instantiate vs. 对象池”来观察 CPU、GC 的变化。统一的 IPoolAble 接口意味着子弹/技能也能复用这套机制，显著降低高频生成物体带来的 GC 暂停。",
    },
  ],
  "本地存档系统": [
    {
      text:
        "存档方案采用接口驱动：任何可保存对象都实现 ISaveable，提供 CaptureState、RestoreState 与唯一 ID，从而让 SaveManager 不用关心具体字段，直接循环所有实现者即可获得需要序列化的快照。",
    },
    {
      text:
        "SaveManager 的 SaveGame 会遍历场景（含未激活）里的 ISaveable，将它们输出为 SaveRecord{id、type、json}，再连同当前场景名写入 save.json。LoadGame 则读取文件、校验场景名，并按 id 重新定位组件，利用反射恢复类型后调用 RestoreState，完成状态还原。",
    },
    {
      text:
        "UniqueId 组件负责生成并序列化 Guid，OnValidate 会提醒缺失，每个 ISaveable 都通过它返回自己的 ID。以 Chest 为例，它在 CaptureState 中写出开关状态结构体，RestoreState 则依据记录刷新 UI，哪怕同一场景挂了多个宝箱也不会混淆。",
    },
    {
      text:
        "UI 侧只要通过 SaveButton/LoadButton 调用 SaveManager.SaveGame() / LoadGame() 即可，为菜单或调试增加存读按钮非常轻松。新增需要持久化的物体只需添加 UniqueId 并实现 ISaveable，即刻纳入全局存档；JSON 数据可读可调试，加载时校验场景名也避免了误写问题，非常适合扩展成角色属性、任务进度等更复杂的数据集。",
    },
  ],
  "对话系统": [
    {
      text:
        "对话文本采用 Sentence 结构描述：包含角色名、台词以及左/右站位标记，便于在 Inspector 中快速堆叠剧情脚本并控制角色站位视觉。",
    },
    {
      text:
        "NpcDialog 组件在 Inspector 中配置 Conversation 列表，玩家进入触发器会收到提示，按 C 即调用 DialogueManager.MakeNewDialogue() 开始播放，从而将触发逻辑与展示层解耦。",
    },
    {
      text:
        "DialogueManager 持有 CanvasGroup 与 TMP_Text，MakeNewDialogue 缓存队列并显示面板，PlayNextSentence 根据 Sentence.IsLeft 调整姓名文本的位置，并通过 TapWord 协程按 TapSpeed 实现打字机效果；Update 监听鼠标左键跳到下一句，结束时隐藏面板。",
    },
    {
      text:
        "Conversation 以 List<Sentence> 管理，开发者可在 Inspector 随意增减段落；未来易于扩展头像、语音、跳过动画等特性，NpcDialog 也能根据任务状态切换不同 Conversation，快速搭建剧情交互体验。",
    },
  ],
};

function MediaWithLoading({ src, alt, style, loading = "lazy", className }) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  const { margin, maxWidth, width, ...imgRest } = style || {};
  const wrapperStyle = {
    margin,
    maxWidth,
    width: width ?? "100%",
    position: "relative",
  };
  const imageStyle = {
    ...imgRest,
    width: width ?? "100%",
    display: imgRest?.display ?? "block",
    objectFit: imgRest?.objectFit ?? "contain",
  };

  return (
    <div style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        style={{
          ...imageStyle,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        className={className}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <img
          src={LOADING_GIF_SRC}
          alt=""
          aria-hidden="true"
          style={{
            ...imageStyle,
            position: "absolute",
            inset: 0,
            margin: 0,
            pointerEvents: "none",
          }}
          className={className}
        />
      )}
    </div>
  );
}

export default function ProjectDetail({ project, onBack }) {
  if (!project) return null;
  const articleSections = articleContentMap[project.title];
  const showArticle = Array.isArray(articleSections) && articleSections.length > 0;
  const mediaImgStyle = {
    maxHeight: "270px",
    width: "100%",
    maxWidth: "33rem",
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
                          <MediaWithLoading
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
                      <MediaWithLoading
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
