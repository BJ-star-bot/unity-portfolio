# 背包 & 合成系统技术文档

本文覆盖 `Assets/Scripts` 下背包（Inventory）与合成（Crafting）相关脚本的职责、数据流、配置来源以及扩展注意事项，可作为研发、调试与讲解的技术参考。

## 1. 系统概览
- **数据层**：`PlayerInventoryData` ScriptableObject 负责保存玩家拥有物品、操控格子、响应增删，同时通过 SQLite (`inventory.db`) 实现持久化；`ItemDatabase` 与 `CraftingRecipeDatabase` 解析 CSV，提供静态数据查询。
- **表现层**：背包界面由 `InventoryManager` 驱动，负责将背包数据映射到 `InventoryItemSlotView`，提供容量、提示、删除等交互；合成界面由 `CraftingUIController` + `CraftingRecipeDetailPanel` 构成，负责展示配方、材料需求以及制作过程。
- **交互桥梁**：UI 控件（如 `InventoryAddItemWidget`、`CraftingRecipeDetailPanel`）直接调用 `PlayerInventoryData` 的 API，依赖其事件 `OnInventoryChanged/OnInventoryFull` 推动 UI 刷新与提示。

## 2. 配置与静态数据

### 2.1 物品配置（`配置表/物品信息配置.CSV`）
| 字段 | 示例 | 说明 |
| --- | --- | --- |
| `ID` | 1 | 唯一 ID，也是背包、合成、测试控件的唯一索引。|
| `Name` | 木头 | TMP 直接显示，可包含中文。|
| `Icon` | wood_icon | Addressables Sprite Key，`InventoryItemSlotView` 与合成详情的图标加载依赖该值。|
| `MaxStack` | 30 | 堆叠上限，`PlayerInventoryData.AddItem` 依据它决定是否把数量分摊到多个格子。|
| `Type` | Material | 显示在 Tooltip 中，后续可据此分类。|
| `Desc` | 基础木材 | 物品描述。|

`ItemDatabase` 暴露 `Items` 列表和 `GetItemOrNull/TryGetItem/GetStackLimit` 等方法，供背包和合成 UI 快速查询。

### 2.2 合成配置（`配置表/合成配置表.CSV`）
| 字段 | 示例 | 说明 |
| --- | --- | --- |
| `CraftID` | 201 | 配方唯一 ID，UI 列表与调试均可引用。|
| `ResultItemID` | 8 | 产物 ID，将通过 `ItemDatabase` 查找 `ItemDefinition`。|
| `ResultCount` | 1 | 每次合成的产出数量。|
| `MaterialIDs` | "5,2,3,4" | 需求物品 ID，使用逗号分隔字符串；解析时支持带引号的 CSV 字段。|
| `MaterialCounts` | "20,10,20,5" | 与 `MaterialIDs` 一一对应的需求数量。|

`CraftingRecipeDatabase` 将 CSV 行转换为 `CraftRecipe`，其中包含 `ResultItemId`, `ResultCount`, `List<CraftMaterialCost>`。`Recipes` 列表用于构建 UI，`GetRecipeOrNull/TryGetRecipe` 提供精确查询。

## 3. 运行时数据与存档

### 3.1 `PlayerInventoryData`（`Data/PlayerInventoryData.cs`）
- **容量与数据结构**：`_slotCapacity` 默认 30，`_slots` 保存每个格子的 `ItemId` 与 `Count`，外部通过 `Slots` 只读访问。`_initialItems` 可在 Inspector 中配置新账号初始物品。
- **事件**：`OnInventoryChanged` 在任何写操作后触发，`OnInventoryFull` 在添加物品但空间不足时触发。
- **生命周期**：`OnEnable` 会初始化格子、打开 SQLite 连接、加载存档；若数据库为空则应用 `_initialItems` 后立即 `SaveToDatabase()`。
- **SQLite 保存**：使用 `SQLite4Unity3d`，表结构 `inventory_slots(slotIndex PRIMARY KEY, ItemId, Count)`，借助事务 `RunInTransaction` 先删除旧记录再写入非空格数据。数据库路径：`Application.persistentDataPath/_databaseFileName`。
- **核心 API**：
  - `AddItem(int itemId, int amount, int maxStack)`：优先填满已有同类堆叠，再寻找空格。返回未能放入的剩余数量，并在成功写入后保存数据库、触发 `OnInventoryChanged`。剩余量>0 时会触发 `OnInventoryFull`。
  - `ConsumeItem(int itemId, int amount)`：从末尾格子开始扣除，保证合成等场景优先清理靠后的格子，随后执行 `CompactSlots()` 去除中间空洞。
  - `Craft(CraftRecipe recipe, int craftAmount, ItemDatabase itemDatabase)`：校验 `HasMaterials` 后批量 `ConsumeItem`，再根据产物的 `MaxStack` 调用 `AddItemInternal`。若任何步骤失败返回 `false`，留给 UI 告知用户。
  - 其他辅助：`GetCount`, `HasFreeSlot`, `RemoveSlotItem`, `ResetInventory` 等。
- **格子压缩**：`CompactSlots()` 通过“读指针/写指针”的线性遍历把所有非空格子前移，时间复杂度 O(n)，方便 UI 在视觉上看到紧凑排列。

### 3.2 `ItemDatabase`（`Data/ItemDatabase.cs`）
- 读取 `TextAsset _itemConfigCsv`，在 `Awake` 或手动调用 `Reload()` 时解析 CSV。
- 内部维护 `_items`（顺序列表）与 `_itemsById`（字典），同时提供 `ItemDefinition` 数据结构（名称、图标 key、堆叠上限、分类、描述）。
- 使用 `SplitCsvLine` 支持带引号字段、转义双引号，确保中文/空格能够正确解析。

### 3.3 `CraftingRecipeDatabase`（`Data/CraftingRecipeDatabase.cs`）
- 结构体 `CraftMaterialCost` + `CraftRecipe` 描述产出与材料。
- 解析逻辑与 `ItemDatabase` 类似，支持字符串列表字段，结果存入 `_recipes`（列表）与 `_recipesById`（字典）。
- 提供 `Recipes` 只读列表供 UI 遍历，`GetRecipeOrNull/TryGetRecipe` 供逻辑查询。

## 4. 背包界面（`UI/Inventory` + `Inventory/InventoryManager.cs`）

| 组件 | 位置 | 关键职责 |
| --- | --- | --- |
| `InventoryGridPopulator` | `UI/Inventory/InventoryGridPopulator.cs` | 按 `_slotCount` 实例化格子 Prefab，存于 `_spawnedSlots` 方便重建。运行时若 `_populateOnEnable` 为真则自动构建。|
| `InventoryItemSlotView` | `UI/Inventory/InventoryItemSlotView.cs` | 控制单个格子的空置/占用状态，加载 Addressables 图标，显示 `Name/Count`，必要时隐藏数量文本。`ResolveClickButton()` 被合成列表复用。|
| `InventoryManager` | `Inventory/InventoryManager.cs` | 绑定 `PlayerInventoryData`，监听 `OnInventoryChanged/OnInventoryFull`，在 `RefreshAllSlots()` 中逐格读取 `Slots` 并设置 `InventoryItemSlotView`。负责容量标签 `(占用/总容量)`、“背包已满”提示、清空按钮以及手动删除格子。|
| `InventorySlotTooltipTrigger` | `UI/Inventory/InventorySlotTooltipTrigger.cs` | 处理点击/Pointer 事件，控制 `InventoryItemTooltip` 的显示位置、关闭逻辑，兼容旧/新输入系统。|
| `InventoryItemTooltip` | `UI/Inventory/InventoryItemTooltip.cs` | 显示当前格的名称、ID、类型、描述，并可调用 `InventoryManager.RemoveItemAtSlot` 删除该格物品。|
| `InventoryAddItemWidget` | `UI/Inventory/InventoryAddItemWidget.cs` | 开发/调试用控件，输入 ItemID 与数量后调用 `PlayerInventoryData.AddItem`。根据结果展示绿色/红色提示，同时驱动 `InventoryManager.RefreshAllSlots()` 与 `CraftingUIController.RefreshCurrentRecipe()`。|

`InventoryManager.Start()` 内的 `EnsureDatabaseReadyAndRefresh()` 会等待 `ItemDatabase.Items` 初始化后刷新 UI，避免 `ItemDefinition` 为空导致格子状态不正确。

## 5. 合成界面（`UI/Crafting`）

| 组件 | 位置 | 关键职责 |
| --- | --- | --- |
| `CraftingUIController` | `UI/Crafting/CraftingUIController.cs` | 遍历 `CraftingRecipeDatabase.Recipes`，复用 `InventoryItemSlotView` 作为配方卡片，点击后调用 `OnRecipeSelected` 并把结果传给详情面板。维护 `_currentRecipe` 以便外部刷新。|
| `CraftingRecipeDetailPanel` | `UI/Crafting/CraftingRecipeDetailPanel.cs` | 显示目标产物图标、名称、描述、拥有量；构建材料列表，支持调节制作数量（`_decrease/_increase` 按钮 + `_craftAmountChangedEvent`）。`HandleCraftClicked()` 调用 `PlayerInventoryData.Craft`，根据成功/失败展示淡入淡出的结果文本，并刷新拥有数量与材料状态。材料超过 3 条时触发 `_materialWarningGroup` 闪烁提示。|
| `CraftingMaterialRequirementItem` | `UI/Crafting/CraftingMaterialRequirementItem.cs` | 显示单条需求的图标、名称以及 `(拥有/需求)` 文本，拥有量不足时自动切换到 `_insufficientColor`。|

详情面板内部同样使用 Addressables 加载图标，与背包共享资源；若 `_materialListRoot` 中实例过多，可考虑对象池优化。

## 6. 典型流程

### 6.1 添加物品（调试控件或游戏逻辑）
1. UI 调用 `InventoryAddItemWidget.HandleAddItem()`：解析输入 → `ItemDatabase.GetItemOrNull` 得到 `MaxStack`。
2. `PlayerInventoryData.AddItem()`：
   - 先遍历已有格子补满堆叠；
   - 再遍历空格写入剩余数量；
   - 保存到 SQLite 并触发 `OnInventoryChanged`；若有剩余则触发 `OnInventoryFull`。
3. `InventoryManager.HandleInventoryChanged()` → `RefreshAllSlots()` 逐格刷新图标、名称、数量与 Tooltip 引用，容量标签同步更新。
4. 其他订阅者（如 `CraftingRecipeDetailPanel`）在刷新时重新计算材料拥有数量，立即反馈玩家是否具备合成条件。

### 6.2 合成流程
1. 玩家在 `CraftingUIController` 列表中点击某个配方，`OnRecipeSelected()` 将配方和 `ItemDefinition` 传给 `CraftingRecipeDetailPanel.Show()`。
2. 详情面板：
   - 调整制作数量（受 `_min/_maxCraftAmount` 限制），实时更新“制作 xN”按钮文案；
   - `BuildMaterialList()` 生成需求条目，`UpdateMaterialCounts()` 查询 `PlayerInventoryData.GetCount()`，拥有不足时切换红色提示；
   - 如果材料条目 > 3，启动 `_materialWarningGroup` 闪烁提示玩家需要滚动查看。
3. 点击“制作”按钮：
   - `PlayerInventoryData.Craft()` 检查并扣除材料 → 依据 ItemDatabase 的 `MaxStack` 添加产物；
   - 返回成功时，面板更新拥有数量和材料显示，并触发 `ShowResult("合成成功", _successColor)`；
   - 失败（材料不足/背包满）时只刷新材料状态并展示失败提示。
4. `CraftingUIController.RefreshCurrentRecipe()` 可在背包数据改变后调用，保持当前配方的状态与背包一致。

## 7. 扩展、调试与注意事项
- **事件统一入口**：任何修改背包数据的逻辑都应通过 `PlayerInventoryData`，保证事件触发、数据库写入与 UI 状态一致，避免直接操作 `_slots`。
- **Addressables**：`InventoryItemSlotView` 与 `CraftingMaterialRequirementItem` 都在 `SetItem/Show` 时加载 Sprite，并在 `OnDisable` 或 `Clear` 时调用 `Addressables.Release`，务必确保 Icon Key 与 CSV 一致。
- **输入系统兼容**：`InventorySlotTooltipTrigger` 使用 `#if ENABLE_INPUT_SYSTEM` 兼容新旧输入系统，项目切换输入方案时无需改逻辑。
- **数据库迁移**：若未来需要多存档，可在 `inventory_slots` 表里增加 `profile_id` 列，并在 `LoadFromDatabase/SaveToDatabase` 中带条件查询。
- **UI 切页**：工程中还提供 `UI/Common/GlobalUIManager` 与 `BasePage`，可通过按钮调用 `ShowPage/ClosePage` 在背包、合成等页面之间切换，CanvasGroup 淡入淡出已封装好。
- **调试建议**：
  1. 使用 `InventoryAddItemWidget` 输入 CSV 中的 ID，快速验证堆叠、容量与 Tooltip；
  2. 删除 `Application.persistentDataPath/inventory.db` 或调用 Inspector 的 `Reset Inventory` 以回到初始状态；
  3. 在 `PlayerInventoryData` 中打断点观察 `_slots`、SQLite 事务执行顺序；
  4. 使用 Addressables Event Viewer 监控图标加载是否命中缓存。

通过以上结构，背包与合成系统实现了“配置驱动 + SQLite 存档 + UI 组件化”的完整闭环，可在保持清晰职责的同时方便后续扩展（如装备系统、批量分解、配方分类等）。
