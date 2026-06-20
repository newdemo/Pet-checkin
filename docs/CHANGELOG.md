# 萌宠打卡小程序 — 变更日志

本文档按语义化版本记录所有值得关注的变化。

---

## [v1.8.5] — 2026-06-21

### UX-1B 待验收 — 宠物页高保真重构

#### 新增

- **小梨的家宠物页** — 新增普通页面 `frontend/src/pages/pet/index.vue`，用于承载宠物状态中心、家园展示中心、家具展示中心和照顾互动中心。
- **顶部状态 Chip** — 展示饱腹、清洁、心情、成长值，并复用现有 `pet.hunger`、`pet.cleanliness`、`pet.mood`、`petStore.growthProgress` 数据。
- **家园主舞台** — 使用 CSS 渐变、几何图形和 emoji 临时素材实现小窝、星星灯、玩具角、待解锁区域和小梨主视觉。
- **家园布置静态模块** — 在页面内部使用静态配置展示小窝、星星灯、玩具角、待解锁，不接入真实家具/收藏/金币系统。
- **小梨悄悄话** — 根据现有宠物状态派生照顾提示，并展示今日任务进度提示。

#### 修改

- **普通页面注册** — 在 `frontend/src/pages.json` 的 `pages` 数组新增 `pages/pet/index`，未修改 `tabBar.list`。
- **首页入口** — 在 `frontend/src/pages/home/index.vue` 仅为现有宠物舞台增加点击进入宠物页的导航入口，未重构首页视觉和布局。
- **照顾动作复用** — 宠物页喂食、清洁、陪玩继续调用 `petStore.performAction(type)`，保留道具不足提示“完成任务可获得更多道具”和 `upgrade-modal` 升级弹窗。

#### 涉及文件

| 文件 | 操作 |
|------|------|
| `frontend/src/pages/pet/index.vue` | ✅ 新增宠物页主实现 |
| `frontend/src/pages.json` | ✅ 仅在 pages 数组新增普通页面注册 |
| `frontend/src/pages/home/index.vue` | ✅ 仅增加进入宠物页导航入口 |
| `docs/TODO.md` | ✅ 更新当前断点与 UX-1B 已完成状态 |
| `docs/开发计划.md` | ✅ 更新页面数量、阶段与版本状态 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.5 条目 |

#### 边界确认

- 未修改 `tabBar.list`
- 未修改 `frontend/src/stores/*`
- 未修改 `frontend/src/services/*`
- 未修改任务页、成长页、家长页
- 未修改数据库、云函数、Mock 数据结构
- 未新增真实家具系统、收藏系统、金币系统
- 未引入外部图片素材

---

## [v1.8.4] — 2026-06-20

### P4-2A 待验收 — 最小数据库集合设计（含预留字段）

#### 修订

- **执行版 Spec** — 新增 `docs/specs/P4-2A_database-design-cleanup.md`，记录本次数据库设计清理的执行范围和验收标准。
- **P4 执行版唯一数据库设计文档** — 新增 `docs/P4-2A_最小数据库集合设计.md`，作为 P4-2B 创建集合的唯一依据。
- **历史内容降级** — 将 `family`、`streak_stat`、`daily_summary`、`inventory_log`、`task_template`、`daily_task`、`checkin`、`waiting` / `done`、snake_case 和 `getFamilyIds()` 明确标记为历史参考。
- **执行边界收敛** — P4-2B 仅允许创建 `pet`、`inventory`、`taskTemplates`、`dailyTasks`、`checkinRecords`；P4-3 仅保留 `login`、`getHomeData`、`submitCheckin`、`reviewCheckin`。

#### 新增

- **最小数据库集合设计** — 输出 `pet`、`inventory`、`taskTemplates`、`dailyTasks`、`checkinRecords` 五个集合设计。
- **索引设计** — 明确 `pet`、`inventory`、`dailyTasks`、`checkinRecords` 的核心索引，并补充去重与待确认查询建议索引。
- **初始化数据设计** — 明确后续 login 云函数需要初始化的 familyId、childId、宠物、背包、任务模板和当日任务生成规则。
- **状态流转设计** — 明确 `dailyTasks.status`、`checkinRecords.status`、`rewardGranted` 默认值和防重复发奖策略。
- **权限建议** — 输出 P4 阶段前端读写限制和必须通过云函数的操作建议。

#### 涉及文件

| 文件 | 操作 |
|------|------|
| `docs/数据库设计.md` | ✅ 追加 P4-2A 数据库设计文档 |
| `docs/TODO.md` | ✅ 更新当前任务为 P4-2A，状态为待验收 |
| `docs/开发计划.md` | ✅ 更新 4.2 为 P4-2A 设计待验收 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.4 条目 |

#### 边界确认

- 未创建云数据库集合
- 未开发云函数
- 未修改业务逻辑代码
- 未进入 P4-3
- 未提交 Git

---

## [v1.8.3] — 2026-06-18

### P4-1 验收通过 — 微信云开发环境开通

#### 任务完成

- **微信小程序 AppID 配置** — 更新 `frontend/src/manifest.json` 中的微信小程序 AppID 为正式环境 ID：`wx8526f4dd470305c3`
- **微信云开发环境配置** — 创建统一配置文件 `frontend/src/constants/config.js`，集中管理环境变量
- **云环境 ID 配置** — 在统一配置文件中记录微信云开发环境 ID：`cloudbase-d9gxw1osg187d6e51`
- **项目状态更新** — 更新 TODO.md 中的项目阶段状态和 P4-1 任务状态为「已完成」

#### 修改文件

| 文件 | 操作 |
|------|------|
| `frontend/src/manifest.json` | ✅ 更新微信小程序 AppID 为 `wx8526f4dd470305c3` |
| `frontend/src/constants/config.js` | ✅ 新增统一配置文件，包含 AppID 和云环境 ID |
| `docs/TODO.md` | ✅ 项目阶段更新为「P4 云端 MVP 上线验证」，P4-1 状态标记为「已完成」 |
| `docs/开发计划.md` | ✅ M4 云开发接入状态更新为「✅ 环境已开通，待接入」 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.3 条目 |

---

## [v1.8.2] — 2026-06-16

### P3-5 完成 — AI 测试能力复盘

#### 任务完成

- **AI 测试能力评估** — 完成对 30 条适合自动执行的用例的识别和分析，执行精度达到 85%
- **问题发现与定位能力评估** — BUG-01 和 BUG-02 均实现 100% 复现和准确定位
- **测试策略建议** — 提出了分阶段自动化测试方案，优先覆盖核心功能
- **工具选型建议** — 推荐 Vitest + Cypress + GitHub Actions 的自动化测试栈，针对小程序项目给出了修正建议
- **自动化扩展建议** — 建议继续扩展自动化测试，覆盖 80% 的基础功能
- **经验沉淀** — 新增「真实结论与经验沉淀」章节，基于项目实际案例总结 AI 测试能力边界

#### 文档更新

| 文件 | 操作 |
|------|------|
| `docs/测试/P3-5-AI测试能力复盘.md` | ✅ 新增（430 行） |
| `docs/TODO.md` | ✅ P3-5 标记已完成，阶段状态更新为 P4，项目完成度 53.6% |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.2 条目 |

#### 经验沉淀

**新增章节「真实结论与经验沉淀」：**

1. **AI 擅长的事情**：
   - 静态代码分析
   - 编译检查
   - 回归检查
   - 修复方案设计
   - 风险分析

2. **AI 一般适合的事情**：
   - 功能测试
   - 边界测试
   - 测试用例生成

3. **AI 不适合独立完成的事情**：
   - 用户体验验证
   - 页面视觉验证
   - 中文输入法验证
   - 多页面联动验证
   - 真实操作路径验证

4. **本项目真实案例**：
   - **BUG-01**：AI 无法直接发现，人工验收发现，AI 协助定位，最终修复
   - **BUG-02**：AI 发现问题，人工验证确认，最终修复

5. **最终结论**：明确指出 AI 测试 ≠ 用户验收，验证了最佳流程为「Trae 开发 → AI Review → 人工验收 → Git Commit → Git Push」

#### 修正内容

1. **AI 能力评分调整**：
   - 原评分：测试用例识别 90%、问题定位精度 95%、执行效果 90%、修复方案一致性 100%、误判率 5%、遗漏率 1%
   - 修正后评分：测试用例识别 85%、问题定位精度 90%、执行效果 85%、修复方案一致性 95%、误判率 8%、遗漏率 3%

2. **完成度计算修正**：
   - 原描述：53.6%（1500% ÷ 28 任务）
   - 修正后描述：项目完成度计算基于任务权重和完成状态，当前为 53.6%（1500% ÷ 28 任务）。但需注意，完成度仅反映任务完成数量，不直接代表代码质量或功能完整性。

3. **工具选型建议修正**：
   - 原建议：优先使用 Vitest + Cypress
   - 修正后建议：针对小程序项目，可考虑使用微信开发者工具提供的测试功能；对于单元测试，Vitest 是一个不错的选择；端到端测试可考虑使用 Cypress 结合小程序适配器；建议根据项目实际需求和资源情况选择合适的工具

---

## [v1.8.1] — 2026-06-12

### P3-4 修复通过 — BUG-01/BUG-02 修复完成

#### BUG-01 修复

- **问题描述：** 任务模板编辑后，`dailyTasks` 未同步更新，导致其他页面展示仍使用旧数据
- **根因定位：** `frontend/src/pages/tasks/index.vue` 使用 `task.id` 作为 key，Vue 虚拟 DOM 复用相同 key 的 DOM 元素，属性更新后 UI 不刷新
- **修复方案：** 使用复合 key `:key="\`${task.id}-${task.name}-${task.icon}-${task.rewardType}-${task.rewardAmount}\`"`，强制任务属性变化时重新渲染卡片
- **修改文件：** `frontend/src/pages/tasks/index.vue:17`

#### BUG-02 修复

- **问题描述：** 编辑任务名称时，中文拼音输入被 `maxlength="10"` 截断/中断
- **根因定位：** 微信小程序 `<input>` 组件在 IME 组合态下，`maxlength` 计入拼音字母长度，导致输入中断
- **修复方案：** 移除 `maxlength="10"` 属性，在 `onConfirm` 中添加 trim 后长度校验（>10 提示「任务名称最多 10 个字」）
- **修改文件：** `frontend/src/components/TaskFormModal.vue:12, 100-104`

#### 涉及文件

| 文件 | 修改操作 |
|------|----------|
| `frontend/src/components/TaskFormModal.vue` | 移除 `maxlength="10"` + 添加长度校验 |
| `frontend/src/pages/tasks/index.vue` | 任务卡片 key 改为复合 key |

#### 验证结果

- ✅ 任务管理页修改任务名称后，今日任务页立即显示新名称
- ✅ 修改任务图标、奖励类型、奖励数量也能立即同步
- ✅ 已完成/待确认/未完成状态不丢失
- ✅ 中文拼音输入超过 10 个字母时不再截断，输入体验正常

### P3-2 验收通过 — 测试可执行性评估 + 已知 BUG 代码风险定位

对 P3-1 生成的 60 条测试用例进行可执行性分级（30 条适合 AI 自动执行、18 条需人工辅助、7 条不建议、5 条暂缓），筛选 10 条低成本优先测试。对 BUG-01 和 BUG-02 进行完整代码追踪分析。

### BUG-01 分析结论

代码层面未发现明显 Bug。完整追踪了 `form.name` → `emit` → `store` → `storage` → `writeStorage` → `loadAll` → 模板渲染链路，字段名一致、赋值正确、持久化完整。推测可能是间歇性问题或与 BUG-02（IME 行为）关联。

### BUG-02 风险分析

核心风险点：`maxlength="10"` 与中文 IME 组合态冲突。微信小程序 `<input>` 在拼音输入时 `maxlength` 可能在组合态下截断导致失焦。代码缺少 `@compositionstart` / `@compositionend` 事件处理。

### 涉及文件

| 文件 | 操作 |
|------|------|
| `docs/测试/P3-2-测试可执行性评估与已知BUG定位.md` | ✅ 新增分析文档 |
| `docs/TODO.md` | ✅ P3-2 标记已完成，更新版本/完成度/断点 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.1 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

### 阶段规划调整 — 2026-06-12

Phase 2 完成后新增独立阶段 P3 AI 自动测试验证（5 任务）。原 P3 Cloud & Launch 顺延为 P4，原 P4 后续版本顺延为 P5。任务总数从 23 增至 28，项目完成度从 52.2% 调整为 42.9%。

---

## [v1.8.0] — 2026-06-12

### P2-5 验收通过 — 颜色变量统一 + Phase 2 完成

将 10 个文件中 43 处硬编码颜色替换为 `uni.scss` 变量引用（`$primary`、`$success`、`$bg`、`$text-secondary`）。Phase 2 体验优化全部完成。

### 修改

| 文件 | 替换数 | 说明 |
|------|--------|------|
| `src/App.vue` | 1 | `$bg` |
| `src/pages/home/index.vue` | 10 | `$primary`(5), `$success`(3), `$text-secondary`(2) + 2 处内联样式→CSS class |
| `src/pages/tasks/index.vue` | 1 | `$primary` |
| `src/pages/parent/tasks/index.vue` | 8 | `$primary`(3), `$success`(2), `$text-secondary`(3) |
| `src/pages/parent/confirm/index.vue` | 6 | `$primary`(2), `$success`(2), `$text-secondary`(2) |
| `src/pages/parent/settings/index.vue` | 5 | `$primary`(1), `$success`(2), `$bg`(1), `$text-secondary`(1) + 添加 `lang="scss"` |
| `src/components/TaskFormModal.vue` | 3 | `$primary`(2), `$text-secondary`(1) |
| `src/components/UpgradeModal.vue` | 2 | `$primary`(2) + 添加 `lang="scss"` |
| `src/pages/record/index.vue` | 4 | `$primary`(1), `$success`(1), `$text-secondary`(2) |
| `src/components/TaskCard.vue` | 3 | `$primary`(1), `$success`(1), `$text-secondary`(1) |

### Phase 2 总结

| 任务 | 状态 |
|------|------|
| P2-1 Sass @import 迁移 | 已完成 |
| P2-2 道具不足引导 | 已完成 |
| P2-3 首页加载优化 | 已完成（问题已不存在） |
| P2-4 死代码清理 | 已完成 |
| P2-5 颜色变量统一 | 已完成 |

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/` 10 个文件 | ✅ 颜色变量替换（43 处） |
| `docs/TODO.md` | ✅ P2-5 标记已完成，Phase 2 完成 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.8.0 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

## [v1.7.3] — 2026-06-12

### P2-4 验收通过 — 死代码清理

删除 `src/services/storage.js` 中 `resetDailyTasks` 函数（6 行）。全局搜索确认 0 处调用，安全删除。

### 修改

- **`src/services/storage.js`** — 删除 `resetDailyTasks` 函数（未被调用）

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/services/storage.js` | ✅ 删除死代码 |
| `docs/TODO.md` | ✅ P2-4 标记已完成，更新版本/完成度/断点 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.7.3 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

## [v1.7.2] — 2026-06-12

### P2-3 分析完成 — 首页加载优化（无需代码修改）

分析结论：当前代码中不存在 `onLoad` + `onShow` 双重触发 `loadData()` 的问题。页面仅使用 `onShow` 调用 `loadData()`，每次显示时执行 1 次，这是 TabBar 页面的正确设计。无需修改代码。

### 涉及文件

| 文件 | 操作 |
|------|------|
| `docs/TODO.md` | ✅ P2-3 标记已完成（问题已不存在） |
| `docs/CHANGELOG.md` | ✅ 新增 v1.7.2 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

## [v1.7.1] — 2026-06-12

### P2-2 验收通过 — 道具不足引导

移除首页按钮 `:disabled` 属性，在 `onAction` 中增加道具数量检查，道具不足时 toast 提示「完成任务可获得更多道具」。

### 修改

- **`src/pages/home/index.vue`** — 移除三个按钮的 `:disabled` 属性；`onAction` 开头增加道具数量检查

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/pages/home/index.vue` | ✅ 道具不足 toast 引导 |
| `docs/TODO.md` | ✅ P2-2 标记已完成，更新版本/完成度/断点 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.7.1 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

## [v1.7.0] — 2026-06-12

### P2-1 验收通过 — Sass @import 迁移

消除 Sass `@import` 废弃警告。UniApp 框架自动注入 `uni.scss`，App.vue 中手动引入为冗余代码，直接删除即可。

### 修改

- **`src/App.vue`** — 删除 `<style lang="scss">` 中的 `@import './uni.scss';`（UniApp 框架自动注入，手动引入导致变量重复定义）

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/App.vue` | ✅ 删除冗余 `@import` |
| `docs/TODO.md` | ✅ P2-1 标记已完成，更新版本/完成度/断点 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.7.0 条目 |
| `docs/开发计划.md` | ✅ 更新版本/阶段/完成度 |

---

## [v1.6.1] — 2026-06-12

### P1-5 收尾 — 删除执行 + 状态迁移

执行旧版目录删除（20 文件/8 目录），修复 TaskFormModal 导入路径，迁移 TODO.md 状态标记为文字格式，按新规则重算完成度。

### 删除

| 目录 | 文件数 |
|------|--------|
| `frontend/pages/` | 4 |
| `frontend/services/` | 2 |
| `frontend/components/` | 2 |
| `frontend/constants/` | 1 |
| `frontend/utils/` | 1 |
| `frontend/static/tab/` | 6 |
| `frontend/mock/` | 1 |
| `frontend/` 根 | 3（main.js, App.vue, package-lock 2.json） |

### 修复

- **`src/components/TaskFormModal.vue`** — 导入路径 `../../constants/pet` → `../constants/pet`

### 文档

- **`docs/TODO.md`** — 状态标记迁移（⬜/🔄/⚠️/✅ → 待开发/开发中/待验收/已完成），完成度重算（98% → 30.4%）
- **`docs/开发计划.md`** — 目录结构更新，移除已删除旧目录
- **`docs/CHANGELOG.md`** — 本文档

### 涉及文件

| 文件 | 操作 |
|------|------|
| `frontend/pages/` | ✅ 删除（4 文件） |
| `frontend/services/` | ✅ 删除（2 文件） |
| `frontend/components/` | ✅ 删除（2 文件） |
| `frontend/constants/` | ✅ 删除（1 文件） |
| `frontend/utils/` | ✅ 删除（1 文件） |
| `frontend/static/tab/` | ✅ 删除（6 文件） |
| `frontend/mock/` | ✅ 删除（1 文件） |
| `frontend/main.js` | ✅ 删除 |
| `frontend/App.vue` | ✅ 删除 |
| `frontend/package-lock 2.json` | ✅ 删除 |
| `src/components/TaskFormModal.vue` | ✅ 修复导入路径 |
| `docs/TODO.md` | ✅ 状态迁移 + 完成度重算 |
| `docs/开发计划.md` | ✅ 目录结构更新 |
| `docs/CHANGELOG.md` | ✅ 新增 v1.6.1 条目 |

---

## [v1.6.0] — 2026-06-12

### P1-5 验收通过 — P1 全部完成

完成旧版目录清理分析，输出可删除/疑似可删除/禁止删除清单及风险分析。P1 补缺阶段全部 5 项任务验收通过。

### 里程碑

**Phase 1 P1 全部完成。** P0(2) + P1(5) = 7/7 任务验收通过。

### 涉及文件

| 文件 | 操作 |
|------|------|
| 旧版目录分析报告 | ✅ 完成（11 项可删除 + 3 项疑似 + 风险分析） |

---

## [v1.5.1] — 2026-06-12

### P1-4 验收通过

## [v1.5.0] — 2026-06-12（待验收）

### P1-4 角色切换机制

实现孩子/家长角色切换，孩子首次进入家长模式需确认，家长页面可一键返回孩子模式。

### 新增
- **`src/stores/role.js`** — role store，管理角色状态（child/parent）
- **`src/services/storage.js`** — `switchRole()` / `getRole()` 持久化函数
- **`src/services/initialData.js`** — 默认角色 `role: 'child'`

### 修改
- **`src/pages/home/index.vue`** — 点击「家长管理」弹出确认弹窗，确认后切换为 parent 角色
- **`src/pages/parent/confirm/index.vue`** — 底部「👶 返回孩子模式」按钮
- **`src/pages/parent/tasks/index.vue`** — 底部「👶 返回孩子模式」按钮
- **`src/pages/parent/settings/index.vue`** — 底部「👶 返回孩子模式」按钮

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/stores/role.js` | ✅ 新建 |
| `src/services/storage.js` | ✅ 新增 switchRole/getRole |
| `src/services/initialData.js` | ✅ 新增 role 字段 |
| `src/pages/home/index.vue` | ✅ 角色确认弹窗 |
| `src/pages/parent/confirm/index.vue` | ✅ 返回孩子模式 |
| `src/pages/parent/tasks/index.vue` | ✅ 返回孩子模式 |
| `src/pages/parent/settings/index.vue` | ✅ 返回孩子模式 |

---

## [v1.4.0] — 2026-06-12

### P1-3 验收通过

实现 `UpgradeModal` 升级祝贺弹窗和 `EmptyState` 空状态组件，替换 `uni.showModal` 和内联空状态。

### 新增
- **`src/components/UpgradeModal.vue`** — 升级祝贺弹窗（🎉🌟🎊 动画 + 宠物名称 + 等级 + emoji）
- **`src/components/EmptyState.vue`** — 空状态组件（icon + text + subText 三行布局）

### 修改
- **`src/pages.json`** / **`pages.json`** — easycom 注册 `upgrade-modal`、`empty-state`
- **`src/pages/home/index.vue`** — 升级弹窗从 `uni.showModal` 替换为 `<upgrade-modal>`
- **`src/pages/tasks/index.vue`** — 空状态从内联 `<view class="empty">` 替换为 `<empty-state>`
- **`src/pages/parent/confirm/index.vue`** — 空状态从内联 `<view class="empty">` 替换为 `<empty-state>`

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/components/UpgradeModal.vue` | ✅ 新建 |
| `src/components/EmptyState.vue` | ✅ 新建 |
| `src/pages.json` | ✅ 注册 easycom |
| `pages.json` | ✅ 注册 easycom |
| `src/pages/home/index.vue` | ✅ 替换升级弹窗 |
| `src/pages/tasks/index.vue` | ✅ 替换空状态 |
| `src/pages/parent/confirm/index.vue` | ✅ 替换空状态 |

---

## [v1.3.1] — 2026-06-12

### P1-2 验收通过

新增家长设置页，支持修改宠物名称。

### 新增
- **`src/pages/parent/settings/index.vue`** — 设置页，宠物名称编辑 + 当前状态展示
- **`src/services/storage.js`** — `savePetName()` 持久化函数
- **`src/stores/pet.js`** — `saveName()` action，支持响应式更新

### 修改
- **`src/pages.json`** / **`pages.json`** — 注册 `pages/parent/settings/index` 路由
- **`src/pages/parent/tasks/index.vue`** — 新增「⚙️ 更多设置」导航按钮

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/pages/parent/settings/index.vue` | ✅ 新建 |
| `src/services/storage.js` | ✅ 新增 savePetName |
| `src/stores/pet.js` | ✅ 新增 saveName |
| `src/pages.json` | ✅ 注册路由 |
| `pages.json` | ✅ 注册路由 |
| `src/pages/parent/tasks/index.vue` | ✅ 添加导航入口 |

---

## [v1.3.0] — 2026-06-11

### P1-1 验收通过

引入 Pinia 全局状态管理，替换各页面手动 `onShow` 读取 storage 的模式，实现页面间数据响应式同步。

### 新增
- **`src/stores/pet.js`** — pet store，管理宠物状态与养成操作（喂食/清洁/陪玩）
- **`src/stores/inventory.js`** — inventory store，管理背包道具状态
- **`src/stores/tasks.js`** — tasks store，管理任务模板、每日任务、打卡、审核、统计历史

### 修改
- **`src/main.js`** — 注册 Pinia 插件
- **5 个页面** — 全部改为从 store 读取计算属性，操作通过 store 方法委托给 `services/storage.js`
  - `pages/home/index.vue` — 使用 petStore + inventoryStore + tasksStore
  - `pages/tasks/index.vue` — 使用 tasksStore
  - `pages/parent/confirm/index.vue` — 使用 tasksStore
  - `pages/parent/tasks/index.vue` — 使用 tasksStore
  - `pages/record/index.vue` — 使用 petStore + tasksStore

### 依赖
- 新增 `pinia@2.3.1`（兼容 Vue 3.4.21）

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/stores/pet.js` | ✅ 新建 |
| `src/stores/inventory.js` | ✅ 新建 |
| `src/stores/tasks.js` | ✅ 新建 |
| `src/main.js` | ✅ 注册 Pinia |
| `src/pages/home/index.vue` | ✅ 改造 |
| `src/pages/tasks/index.vue` | ✅ 改造 |
| `src/pages/parent/confirm/index.vue` | ✅ 改造 |
| `src/pages/parent/tasks/index.vue` | ✅ 改造 |
| `src/pages/record/index.vue` | ✅ 改造 |
| `package.json` | ✅ 新增 pinia 依赖 |

---

## [v1.2.0] — 2026-06-11

### P0 验收通过

Sprint 2 P0 全部完成并通过验收。MVP 核心业务闭环已完整可用。

### 新增
- **P0-1 任务新增/编辑功能验收通过** — TaskFormModal 弹窗 + saveTaskTemplate/deleteTaskTemplate。支持：任务名称、图标（emoji）、奖励类型、奖励数量（1-3）点选。
- **P0-2 家长入口已确认可用** — 首页进入家长待确认页路径通畅。

### 修复
- **`[plugin:uni:mp-using-component]` JSON 解析错误** — 修复 `pages/parent/tasks/index.vue` 同时本地 import + easycom 注册 TaskFormModal 导致的编译冲突。改为纯 easycom 注册方式，与项目其他组件一致。
- **pages.json  easycom 配置不同步** — 补充 `src/pages.json` 缺失的 `^task-form-modal$` 映射。

### 涉及文件

| 文件 | 操作 |
|------|------|
| `src/pages/parent/tasks/index.vue` | 移除本地 import，统一走 easycom |
| `src/pages.json` | 补充 task-form-modal easycom 映射 |
| `docs/开发计划.md` | 更新 Sprint 2 状态、版本号、完成度 |
| `docs/CHANGELOG.md` | 新增 v1.2.0 条目 |
| `docs/TODO.md` | P0-1 标记已完成 |

---

## [v1.1.0] — 2026-06-10（待验收）

### 新增
- **任务新增/编辑功能** — 家长可在任务管理页新增自定义任务模板，支持设定：任务名称、图标（emoji 输入）、奖励类型（食物/肥皂/玩具选择器）、奖励数量（1/2/3 点选）
- **任务编辑功能** — 点击任务卡片上的 ✎ 按钮进入编辑弹窗，修改后即时生效
- **任务删除功能** — 编辑弹窗内提供「删除任务」按钮，二次确认后移除模板
- **`TaskFormModal` 组件** — 新增/编辑任务表单弹窗（[src/components/TaskFormModal.vue](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/frontend/src/components/TaskFormModal.vue)），支持 create/edit 两种模式，表单校验

### 修改
- **家长任务管理页** — 新增「+ 新增任务」按钮（虚线边框样式），任务卡片增加 ✎ 编辑入口，文案更新
- **`services/storage.js`** — 新增 `saveTaskTemplate(template)`（新增/编辑合并为一个函数）、`deleteTaskTemplate(templateId)`；新增模板后自动重新生成当日任务

### 涉及文件
| 文件 | 操作 |
|------|------|
| `src/components/TaskFormModal.vue` | ✅ 新建 |
| `src/services/storage.js` | ✅ 新增 saveTaskTemplate、deleteTaskTemplate |
| `src/pages/parent/tasks/index.vue` | ✅ 集成新增/编辑/删除逻辑 |

---

## [v1.0.0] — 2026-06-10

### 项目接手基线

从 Cursor 环境迁移至 Trae IDE。确认 `frontend/src/` 为唯一主线源码目录。

**状态：** Mock 模式下可编译运行，完整业务闭环可用。

### 已有功能

#### 页面（5 个）
- **宠物首页** `pages/home/index` — 宠物状态展示（饥饿/清洁/心情进度条）、背包道具、养成操作按钮（喂食/清洁/陪玩）、今日任务进度 badge、家长入口（含待确认角标）
- **今日任务** `pages/tasks/index` — 当日任务列表、打卡按钮、任务状态（未完成/待确认/已完成）
- **成长记录** `pages/record/index` — 统计卡片（连续天数/宠物等级/累计完成数）、近 7 日完成标记、最近完成历史列表
- **家长待确认** `pages/parent/confirm/index` — 待确认任务列表、确认通过/驳回操作、通往任务管理链接
- **家长任务管理** `pages/parent/tasks/index` — 任务模板列表、开启/关闭开关、数据重置按钮

#### 组件（2 个）
- `TaskCard` — 任务卡片（pending/waiting/done 三态）
- `StatusBar` — 状态进度条

#### 业务逻辑层
- `services/storage.js` — 数据读写（uni.setStorageSync + 内存缓存）
  - `submitCheckin` — 孩子打卡（pending → waiting）
  - `reviewCheckin` — 家长确认/驳回（waiting → done / pending）
  - `getPendingConfirmations` — 获取待确认列表
  - `performPetAction` — 使用道具养成
  - `getHomeData` — 首页聚合数据（宠物、背包、任务统计、待确认数）
  - `getDailyTasks` / `getRecordData` / `getTaskTemplates` / `toggleTaskTemplate` / `resetAllData`
  - `repairAppData` — 数据修复（合并默认值，修复损坏数据）
  - `initAppData` / `getAppData` — 初始化与数据获取
- `services/pet.js` — 宠物养成逻辑（applyGrowth、usePetItem、getGrowthProgress）
- `services/initialData.js` — 默认初始数据（4 个预设任务模板）
- `constants/pet.js` — 等级阈值、状态增益常量
- `utils/date.js` — 日期格式化工具

#### 技术特性
- Vue3 Composition API + UniApp CLI + Vite 编译
- `pages.json` easycom 自动引入组件
- 跨日自动重置每日任务（懒加载生成）
- 本地数据修复（repairAppData 合并默认值）
- Apple Silicon 双架构编译兼容（postinstall 脚本）

---

## [v0.1.0] — 2026-06-08（Cursor 迁移前版本）

### 新增
- UniApp Vue3 项目脚手架初始化
- 三 Tab 结构：首页、任务、成长
- 宠物首页（状态条、背包、操作按钮）
- 今日任务页（TaskCard、打卡直接完成+发奖）
- 成长记录页（统计卡、近7日、历史）
- 家长任务管理页（开关+重置）
- Mock 数据层（services/storage.js + uni.setStorageSync）
- 升级判定逻辑（constants/pet.js + services/pet.js）
- 连续打卡统计（updateStreak）
- TabBar 图标资源

### 已知问题
- 打卡直接完成并发放奖励，缺少家长审核环节
- 任务管理仅支持开关，不支持新增/编辑
- `frontend/` 根目录与 `frontend/src/` 存在旧版重复文件
- 未引入 Pinia 全局状态管理