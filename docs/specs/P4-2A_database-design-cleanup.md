# P4-2A 数据库设计执行版清理 Spec

## 1. 目标

将 P4-2A 数据库设计整理为 P4 执行版唯一依据，消除旧版集合、旧字段命名、旧状态流转和非 P4 必须云函数带来的实现歧义。

本次完成后，P4-2B 只能依据 `docs/P4-2A_最小数据库集合设计.md` 创建集合。

## 2. 范围

本次范围包括：

- 创建 `docs/P4-2A_最小数据库集合设计.md` 作为 P4 执行版唯一数据库设计文档。
- 将 P4-2B 允许创建的集合限定为：
  - `pet`
  - `inventory`
  - `taskTemplates`
  - `dailyTasks`
  - `checkinRecords`
- 统一 P4 执行字段为 camelCase。
- 为 `taskTemplates` 补充 `childId` 字段。
- 统一状态流转：
  - `dailyTasks.status`：`pending` / `submitted` / `approved`
  - `checkinRecords.status`：`submitted` / `approved` / `rejected`
  - 驳回后 `dailyTasks.status` 回到 `pending`
- 保留 `rewardGranted` 防重复发奖规则。
- 将 P4 云函数清单限定为：
  - `login`
  - `getHomeData`
  - `submitCheckin`
  - `reviewCheckin`
- 将其他云函数标记为 P5 或未来扩展，不进入 P4-3。
- 将权限部分收敛为策略描述，具体权限配置留到 P4-4。
- 更新 P4 Issue #2 为：P4-2A 设计文档修订中，等待用户确认。
- 同步项目管理文档状态。

## 3. 不做什么

本次不做：

- 不进入 P4-2B。
- 不创建云数据库集合。
- 不创建索引。
- 不配置数据库权限。
- 不开发云函数。
- 不修改前端或后端业务逻辑代码。
- 不修改 Mock 数据逻辑。
- 不提交 Git。
- 不 push。
- 不安装 OpenSpec。
- 不执行 `openspec init`。

## 4. 执行设计

### 4.1 文档结构设计

新建 `docs/P4-2A_最小数据库集合设计.md`，作为 P4 执行版唯一数据库设计文档。

文档需要包含：

1. 执行边界
2. P4-2B 允许创建集合清单
3. 历史参考内容处理说明
4. 命名规范
5. 五个集合详细设计
6. 索引设计
7. 初始化数据设计
8. 状态流转设计
9. 防重复发奖设计
10. P4 云函数边界
11. 权限策略
12. P4-2B 执行前检查清单
13. 验收标准

### 4.2 历史内容处理

以下内容不进入 P4 执行版，只允许作为历史参考：

- `family`
- `streak_stat`
- `daily_summary`
- `inventory_log`
- `task_template`
- `daily_task`
- `checkin`
- `waiting` / `done` 状态
- snake_case 字段命名
- `getFamilyIds()` 权限草案

`docs/数据库设计.md` 保留为历史与演进记录，但需要在开头明确标记：P4 执行依据以 `docs/P4-2A_最小数据库集合设计.md` 为准。

### 4.3 P4 执行集合设计

P4-2B 只允许创建以下集合：

- `pet`
- `inventory`
- `taskTemplates`
- `dailyTasks`
- `checkinRecords`

所有字段统一使用 camelCase。

### 4.4 taskTemplates 修订

`taskTemplates` 必须增加：

| 字段名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| `childId` | string | 是 | `child_default_${openid}` | 孩子 ID，与其他集合保持一致 |

### 4.5 状态流转收敛

P4 执行状态只保留：

- `dailyTasks.status`：`pending` / `submitted` / `approved`
- `checkinRecords.status`：`submitted` / `approved` / `rejected`

驳回后：

- `checkinRecords.status = rejected`
- `dailyTasks.status = pending`
- `dailyTasks.checkinRecordId = null`

### 4.6 云函数边界收敛

P4 只保留：

- `login`
- `getHomeData`
- `submitCheckin`
- `reviewCheckin`

以下函数标记为 P5 或未来扩展，不进入 P4-3：

- `useItem`
- `manageTaskTemplate`
- `getGrowthRecord`
- `generateDailyTasks`
- 其他非 P4 最小闭环必须函数

### 4.7 权限策略收敛

权限部分只保留策略描述：

- 前端不直接写核心集合。
- 核心读写通过云函数。
- 具体权限配置放到 P4-4。

## 5. 影响文件范围

允许修改：

- `docs/specs/P4-2A_database-design-cleanup.md`
- `docs/P4-2A_最小数据库集合设计.md`
- `docs/数据库设计.md`
- `docs/TODO.md`
- `docs/开发计划.md`
- `docs/CHANGELOG.md`
- GitHub Issue #2 正文

不允许修改：

- `frontend/**`
- `backend/**`
- 云函数目录
- 云数据库集合
- 小程序业务逻辑文件

## 6. 任务清单

- [x] 读取项目规则和现有文档状态。
- [x] 创建执行版 Spec 文档。
- [x] 创建 `docs/P4-2A_最小数据库集合设计.md`。
- [x] 标记 `docs/数据库设计.md` 为历史参考，P4 执行以新文档为准。
- [x] 同步 `docs/TODO.md` 当前状态。
- [x] 同步 `docs/开发计划.md` 当前状态。
- [x] 同步 `docs/CHANGELOG.md`。
- [x] 更新 GitHub Issue #2 摘要状态。
- [x] 检查变更范围。

## 7. 验收标准

- `docs/P4-2A_最小数据库集合设计.md` 已成为 P4 执行版唯一数据库设计文档。
- P4-2B 只允许创建 5 个集合：`pet`、`inventory`、`taskTemplates`、`dailyTasks`、`checkinRecords`。
- 旧集合与旧命名已明确标记为历史参考，不作为 P4 执行依据。
- 所有 P4 执行字段统一为 camelCase。
- `taskTemplates.childId` 已补充。
- 状态流转只保留 P4 执行状态。
- `rewardGranted` 防重复发奖规则保留。
- P4 云函数清单只保留 `login`、`getHomeData`、`submitCheckin`、`reviewCheckin`。
- 权限部分只保留策略描述，具体权限配置留到 P4-4。
- GitHub Issue #2 已更新为设计文档修订中，等待用户确认。
- 未创建集合。
- 未开发云函数。
- 未修改业务逻辑代码。
- 未提交 Git。
- 未 push。

## 8. 风险与回滚

### 风险

- 新旧文档并存时，后续执行者可能误读旧版 `docs/数据库设计.md`。
- Issue 中若粘贴大量正文，可能与本地文档不一致。
- 旧状态或旧集合若未明确排除，P4-2B 可能误创建多余集合。

### 回滚

- 本次仅修改文档和 Issue，无数据库或代码副作用。
- 如用户不认可修订，可通过 Git diff 定位并回退文档变更。
- GitHub Issue #2 可再次更新为上一版摘要。

## 9. 用户确认状态

当前状态：用户已明确要求执行 P4-2A 数据库设计清理。本 Spec 为执行版记录，完成后等待用户确认修订结果，不进入 P4-2B。
