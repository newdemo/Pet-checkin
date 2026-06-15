# 萌宠打卡小程序 — 变更日志

本文档按语义化版本记录所有值得关注的变化。

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