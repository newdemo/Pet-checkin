# P4-MVP 云端落地子集

## 1. 文档定位

本文档是 P4 阶段云端落地的设计依据，基于已有 [P4-2A_最小数据库集合设计.md](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/docs/P4-2A_最小数据库集合设计.md) 提取最小可落地子集。

**本文档只做设计，不做实现。** 实现拆分为 P4-2B / P4-3 / P4-4 / P4-5 四个独立阶段，每个阶段有明确边界。

| 项目 | 结论 |
|------|------|
| 是否重新设计数据库 | 否，基于 P4-2A 提取子集 |
| 是否创建集合 | 否（P4-2B 做） |
| 是否开发云函数 | 否（P4-3 做） |
| 是否修改前端代码 | 否（P4-4 做） |
| 是否提交 Git | 否 |
| 当前数据源 | Mock 模式（不改） |

---

## 2. 当前 Mock 数据结构全景

当前前端通过 `services/storage.js` 操作一个 JSON 对象，存储在 `uni.setStorageSync` 中：

```javascript
{
  taskDate: "2026-06-21",           // 当前日期，用于跨日判断
  pet: {
    name: '小萌',                    // 宠物名称
    level: 1,                        // 等级 1-5
    growthValue: 0,                  // 当前等级内成长值
    hunger: 80,                      // 饥饿值 0-100
    cleanliness: 80,                 // 清洁值 0-100
    mood: 80                         // 心情值 0-100
  },
  inventory: {
    food: 0,                         // 食物数量
    soap: 0,                         // 肥皂数量
    toy: 0                           // 玩具数量
  },
  taskTemplates: [
    { id, name, icon, rewardType, rewardAmount, enabled, sortOrder }
  ],
  dailyTasks: [
    { id, templateId, taskDate, name, icon, rewardType, rewardAmount, status }
    // status: 'pending' | 'waiting' | 'done'
  ],
  streakStat: {
    currentStreak: 0,                // 当前连续天数
    longestStreak: 0,                // 历史最长连续
    totalCompleted: 0,               // 累计完成数
    lastCheckinDate: null            // 最近打卡日期
  },
  dailySummaries: [
    { date, completedCount, totalCount, hasCheckin }
  ],
  history: [
    { id, date, taskName, rewardType, rewardAmount, type }
  ],
  role: 'child' | 'parent'           // 当前角色
}
```

---

## 3. Mock ↔ P4-2A 集合映射关系

| Mock 数据块 | P4-2A 集合 | 映射方式 | 备注 |
|-------------|-----------|----------|------|
| `pet` | `pet` | 直接映射 | 字段名 `growthValue` ↔ `exp` 不一致 |
| `inventory` | `inventory` | 直接映射 | 字段完全一致 |
| `taskTemplates` | `taskTemplates` | 直接映射 | Mock 用 `id`，云数据库用 `_id` |
| `dailyTasks` | `dailyTasks` | 直接映射 | 状态值不一致：`waiting`/`done` ↔ `submitted`/`approved` |
| （嵌入 dailyTasks） | `checkinRecords` | 拆分映射 | Mock 中打卡记录嵌入 dailyTasks.status，云端独立为 checkinRecords |
| `streakStat` | 无独立集合 | 云函数计算 | 从 checkinRecords 聚合计算 |
| `dailySummaries` | 无独立集合 | 云函数计算 | 从 dailyTasks 聚合计算 |
| `history` | 无独立集合 | 云函数计算 | 从 checkinRecords 派生 |
| `role` | 无独立集合 | 暂留本地 | P4 不迁移到云端 |

---

## 4. 集合落地字段子集

### 4.0 总览

P4 创建 **5 个集合**，与 P4-2A 完全一致：

| 集合名 | 创建 | 落地字段数 | 暂缓字段数 | 用途 |
|--------|:---:|:---:|:---:|------|
| `pet` | ✅ | 12 | 2 | 宠物状态与成长数据 |
| `inventory` | ✅ | 9 | 1 | 道具背包数据 |
| `taskTemplates` | ✅ | 12 | 2 | 任务模板数据 |
| `dailyTasks` | ✅ | 14 | 3 | 当日任务实例数据 |
| `checkinRecords` | ✅ | 13 | 2 | 打卡提交与审核记录 |
| **合计** | **5** | **60** | **10** | |

### 4.1 pet — 落地字段（12 个）/ 暂缓（2 个）

| 字段名 | 类型 | 必填 | 默认值 | 落地 | 说明 |
|--------|------|------|--------|:---:|------|
| `_id` | string | 自动 | — | ✅ | 云数据库自动生成 |
| `openid` | string | 是 | — | ✅ | 微信用户 openid |
| `familyId` | string | 是 | `family_${openid}` | ✅ | 家庭 ID |
| `childId` | string | 是 | `child_default_${openid}` | ✅ | 孩子 ID |
| `name` | string | 是 | `小萌` | ✅ | 宠物名称 |
| `level` | number | 是 | `1` | ✅ | 宠物等级 1-5 |
| `exp` | number | 是 | `0` | ✅ | 成长值（Mock 中为 `growthValue`） |
| `hunger` | number | 是 | `80` | ✅ | 饥饿值 0-100 |
| `cleanliness` | number | 是 | `80` | ✅ | 清洁值 0-100 |
| `mood` | number | 是 | `80` | ✅ | 心情值 0-100 |
| `createdAt` | date | 是 | 服务端时间 | ✅ | 创建时间 |
| `updatedAt` | date | 是 | 服务端时间 | ✅ | 更新时间 |
| `avatarStage` | number | 否 | `1` | ⏸️ | Mock 未使用，无前端消费 |
| `statusVersion` | number | 否 | `1` | ⏸️ | Mock 未使用，无前端消费 |

### 4.2 inventory — 落地字段（9 个）/ 暂缓（1 个）

| 字段名 | 类型 | 必填 | 默认值 | 落地 | 说明 |
|--------|------|------|--------|:---:|------|
| `_id` | string | 自动 | — | ✅ | 云数据库自动生成 |
| `openid` | string | 是 | — | ✅ | 微信用户 openid |
| `familyId` | string | 是 | `family_${openid}` | ✅ | 家庭 ID |
| `childId` | string | 是 | `child_default_${openid}` | ✅ | 孩子 ID |
| `food` | number | 是 | `2` | ✅ | 食物数量 |
| `soap` | number | 是 | `1` | ✅ | 肥皂数量 |
| `toy` | number | 是 | `0` | ✅ | 玩具数量 |
| `createdAt` | date | 是 | 服务端时间 | ✅ | 创建时间 |
| `updatedAt` | date | 是 | 服务端时间 | ✅ | 更新时间 |
| `items` | object | 否 | `{}` | ⏸️ | 扩展预留，Mock 未使用 |

### 4.3 taskTemplates — 落地字段（12 个）/ 暂缓（2 个）

| 字段名 | 类型 | 必填 | 默认值 | 落地 | 说明 |
|--------|------|------|--------|:---:|------|
| `_id` | string | 自动 | — | ✅ | 云数据库自动生成 |
| `openid` | string | 是 | — | ✅ | 微信用户 openid |
| `familyId` | string | 是 | `family_${openid}` | ✅ | 家庭 ID |
| `childId` | string | 是 | `child_default_${openid}` | ✅ | 孩子 ID |
| `name` | string | 是 | — | ✅ | 任务名称 |
| `icon` | string | 是 | `⭐` | ✅ | 任务图标 emoji |
| `rewardType` | string | 是 | `food` | ✅ | 奖励类型：`food`/`soap`/`toy` |
| `rewardAmount` | number | 是 | `1` | ✅ | 奖励数量 1-3 |
| `enabled` | boolean | 是 | `true` | ✅ | 是否启用 |
| `sortOrder` | number | 是 | `0` | ✅ | 排序值 |
| `createdAt` | date | 是 | 服务端时间 | ✅ | 创建时间 |
| `updatedAt` | date | 是 | 服务端时间 | ✅ | 更新时间 |
| `source` | string | 是 | `default` | ⏸️ | Mock 未使用 |
| `version` | number | 否 | `1` | ⏸️ | Mock 未使用 |

### 4.4 dailyTasks — 落地字段（14 个）/ 暂缓（3 个）

| 字段名 | 类型 | 必填 | 默认值 | 落地 | 说明 |
|--------|------|------|--------|:---:|------|
| `_id` | string | 自动 | — | ✅ | 云数据库自动生成 |
| `openid` | string | 是 | — | ✅ | 微信用户 openid |
| `familyId` | string | 是 | `family_${openid}` | ✅ | 家庭 ID |
| `childId` | string | 是 | `child_default_${openid}` | ✅ | 孩子 ID |
| `taskDate` | string | 是 | 当日日期 | ✅ | 任务日期 `YYYY-MM-DD` |
| `templateId` | string | 是 | — | ✅ | 来源任务模板 ID |
| `name` | string | 是 | 模板快照 | ✅ | 任务名称快照 |
| `icon` | string | 是 | 模板快照 | ✅ | 任务图标快照 |
| `rewardType` | string | 是 | 模板快照 | ✅ | 奖励类型快照 |
| `rewardAmount` | number | 是 | 模板快照 | ✅ | 奖励数量快照 |
| `status` | string | 是 | `pending` | ✅ | `pending`/`submitted`/`approved` |
| `checkinRecordId` | string | 否 | `null` | ✅ | 关联 checkinRecords._id |
| `createdAt` | date | 是 | 服务端时间 | ✅ | 创建时间 |
| `updatedAt` | date | 是 | 服务端时间 | ✅ | 更新时间 |
| `submittedAt` | date | 否 | `null` | ⏸️ | status 已足够表达 |
| `approvedAt` | date | 否 | `null` | ⏸️ | status 已足够表达 |
| `rejectedAt` | date | 否 | `null` | ⏸️ | status 已足够表达 |

### 4.5 checkinRecords — 落地字段（13 个）/ 暂缓（2 个）

| 字段名 | 类型 | 必填 | 默认值 | 落地 | 说明 |
|--------|------|------|--------|:---:|------|
| `_id` | string | 自动 | — | ✅ | 云数据库自动生成 |
| `openid` | string | 是 | — | ✅ | 微信用户 openid |
| `familyId` | string | 是 | `family_${openid}` | ✅ | 家庭 ID |
| `childId` | string | 是 | `child_default_${openid}` | ✅ | 孩子 ID |
| `dailyTaskId` | string | 是 | — | ✅ | 关联 dailyTasks._id |
| `taskDate` | string | 是 | 当日日期 | ✅ | 打卡日期 `YYYY-MM-DD` |
| `taskName` | string | 是 | dailyTasks.name | ✅ | 任务名称快照 |
| `status` | string | 是 | `submitted` | ✅ | `submitted`/`approved`/`rejected` |
| `rewardType` | string | 是 | dailyTasks.rewardType | ✅ | 待发放奖励类型 |
| `rewardAmount` | number | 是 | dailyTasks.rewardAmount | ✅ | 待发放奖励数量 |
| `rewardGranted` | boolean | 是 | `false` | ✅ | 是否已发奖（防重复） |
| `createdAt` | date | 是 | 服务端时间 | ✅ | 提交时间 |
| `updatedAt` | date | 是 | 服务端时间 | ✅ | 更新时间 |
| `reviewer` | string | 否 | `parent` | ⏸️ | Mock 未使用 |
| `reviewedAt` | date | 否 | `null` | ⏸️ | Mock 未使用 |

---

## 5. 字段名映射表（Mock ↔ Cloud）

云函数返回数据时必须映射为 Mock 兼容格式：

| Mock 字段名 | Cloud 字段名 | 映射方向 | 说明 |
|------------|-------------|:---:|------|
| `pet.growthValue` | `pet.exp` | Cloud→Mock | 云函数读取 `exp`，返回时写为 `growthValue` |
| `dailyTasks.status: 'waiting'` | `dailyTasks.status: 'submitted'` | Cloud→Mock | 云函数读取 `submitted`，返回时写为 `waiting` |
| `dailyTasks.status: 'done'` | `dailyTasks.status: 'approved'` | Cloud→Mock | 云函数读取 `approved`，返回时写为 `done` |
| `dailyTasks.id` | `dailyTasks._id` | Cloud→Mock | 云数据库 `_id` → 前端 `id` |
| `taskTemplates.id` | `taskTemplates._id` | Cloud→Mock | 云数据库 `_id` → 前端 `id` |
| `checkinRecords` | 无 Mock 对应 | 内部使用 | Mock 中打卡记录嵌入 dailyTasks，云端独立存储 |
| `streakStat.*` | 无 Cloud 字段 | 云函数计算 | 从 checkinRecords 聚合计算后返回 |
| `dailySummaries.*` | 无 Cloud 字段 | 云函数计算 | 从 dailyTasks 聚合计算后返回 |
| `history.*` | 无 Cloud 字段 | 云函数计算 | 从 checkinRecords 派生后返回 |
| `role` | 无 Cloud 字段 | 暂留本地 | P4 不迁移，继续用本地 storage |

---

## 6. 状态值映射表

### 6.1 dailyTasks.status

| Mock 状态 | Cloud 状态 | 含义 | 流转 |
|-----------|-----------|------|------|
| `pending` | `pending` | 待完成 | 孩子可打卡 |
| `waiting` | `submitted` | 已提交待确认 | 家长可确认/驳回 |
| `done` | `approved` | 已确认完成 | 终态 |

### 6.2 checkinRecords.status（Mock 中无此集合）

| Cloud 状态 | 含义 | 流转 |
|-----------|------|------|
| `submitted` | 孩子已提交 | 家长可确认/驳回 |
| `approved` | 家长确认通过 | 终态，rewardGranted=true |
| `rejected` | 家长驳回 | 终态，dailyTasks 回退到 pending |

---

## 7. 云函数设计（P4-3 实现）

### 7.1 云函数清单

| 云函数 | 实现阶段 | 用途 | 输入 | 输出（Mock 兼容格式） |
|--------|:---:|------|------|------|
| `login` | P4-3 | 获取 openid，首次初始化 5 集合数据 | 无（从 wx context 获取 openid） | `{ openid, isNewUser }` |
| `getHomeData` | P4-3 | 聚合首页数据 | `{ openid }` | `{ pet, inventory, taskStats, pendingConfirms }` |
| `submitCheckin` | P4-3 | 孩子提交打卡 | `{ openid, dailyTaskId }` | `{ ok, message }` |
| `reviewCheckin` | P4-3 | 家长确认/驳回 | `{ openid, dailyTaskId, approved }` | `{ ok, message, rewardType?, rewardAmount? }` |

### 7.2 login 云函数职责

首次调用时按顺序初始化：

1. 计算 `familyId = "family_${openid}"`
2. 计算 `childId = "child_default_${openid}"`
3. 向 `pet` 插入默认宠物文档
4. 向 `inventory` 插入默认背包文档
5. 向 `taskTemplates` 插入 5 条默认模板（刷牙/阅读/收拾玩具/运动/练字）
6. 向 `dailyTasks` 插入当日任务（从启用模板生成）
7. 已初始化用户跳过 3-6，仅返回 `{ openid, isNewUser }`

### 7.3 getHomeData 云函数职责

1. 读取 `pet`（按 openid 查询）
2. 读取 `inventory`（按 openid 查询）
3. 读取当日 `dailyTasks`（按 openid + taskDate 查询）
4. 计算 `taskStats: { total, done, pending }`
5. 计算 `pendingConfirms`（status='submitted' 数量）
6. 检查跨日：若 dailyTasks 为空，从 taskTemplates 生成当日任务
7. 返回 Mock 兼容格式（`growthValue` 而非 `exp`，`waiting`/`done` 而非 `submitted`/`approved`）

### 7.4 submitCheckin 云函数职责

1. 校验 dailyTask 存在且 status='pending'
2. 创建 checkinRecords 文档（status='submitted', rewardGranted=false）
3. 更新 dailyTasks.status='submitted', checkinRecordId=新记录ID
4. 返回 `{ ok: true, message: '打卡成功，等爸爸妈妈确认吧～' }`

### 7.5 reviewCheckin 云函数职责

**确认通过：**
1. 校验 dailyTask.status='submitted'
2. 查询关联 checkinRecord，校验 status='submitted' 且 rewardGranted=false
3. 更新 inventory[rewardType] += rewardAmount
4. 更新 dailyTasks.status='approved'
5. 更新 checkinRecords.status='approved', rewardGranted=true
6. 返回 `{ ok: true, message: '确认通过！...', rewardType, rewardAmount }`

**驳回：**
1. 校验 dailyTask.status='submitted'
2. 更新 checkinRecords.status='rejected'（rewardGranted 保持 false）
3. 更新 dailyTasks.status='pending', checkinRecordId=null
4. 返回 `{ ok: true, message: '已驳回，孩子可以重新打卡' }`

---

## 8. 暂缓内容清单

### 8.1 永久不创建的集合

| 历史集合 | 处理 |
|----------|------|
| `family` | ❌ openid/familyId/childId 已嵌入各集合 |
| `streak_stat` | ❌ 云函数从 checkinRecords 计算 |
| `daily_summary` | ❌ 云函数从 dailyTasks 计算 |
| `inventory_log` | ❌ P5 再评估 |

### 8.2 暂缓字段（10 个）

| 集合 | 暂缓字段 | 原因 |
|------|----------|------|
| `pet` | `avatarStage`, `statusVersion` | Mock 未使用，无前端消费 |
| `inventory` | `items` | 扩展预留，Mock 未使用 |
| `taskTemplates` | `source`, `version` | Mock 未使用，无前端消费 |
| `dailyTasks` | `submittedAt`, `approvedAt`, `rejectedAt` | status 已足够表达状态 |
| `checkinRecords` | `reviewer`, `reviewedAt` | Mock 未使用，无前端消费 |

### 8.3 暂缓云函数（归入 P5）

| 云函数 | 原因 |
|--------|------|
| `useItem` | P4-2A 明确归入 P5 |
| `manageTaskTemplate` | P4-2A 明确归入 P5 |
| `getGrowthRecord` | P4-2A 明确归入 P5 |
| `generateDailyTasks` | 由 getHomeData 懒生成替代 |

### 8.4 暂缓数据块（Mock 中存在，不迁移到云端）

| Mock 数据块 | 处理方式 |
|------------|----------|
| `role` | 继续本地 storage |
| `streakStat` | 云函数计算返回 |
| `dailySummaries` | 云函数计算返回 |
| `history` | 云函数派生返回 |

---

## 9. P4 阶段划分与边界

P4 拆分为 4 个独立子阶段，每个阶段有明确输入、输出和边界：

### 9.1 阶段总览

```
P4-2A（当前）  →  P4-2B        →  P4-3         →  P4-4            →  P4-5
  设计验收        创建集合+索引     开发云函数       前端接入云函数      真机测试+审核
  不改代码        不改代码          不改前端代码     改前端 services     不改后端
  不建集合        不写云函数        不改前端代码     切换 DATA_SOURCE    不改后端
  不写云函数      不改前端代码                                         不改前端
```

### 9.2 P4-2B — 创建云数据库集合与索引

| 项目 | 内容 |
|------|------|
| **输入** | 本文档第 4 章（集合字段设计）、第 10 章（索引设计） |
| **做什么** | 在微信云开发控制台创建 5 个集合 + 7 条索引 |
| **不改什么** | 不写云函数、不改前端代码、不配置权限 |
| **产出** | 5 个空集合就绪，7 条索引生效 |

| 集合 | 落地字段数 | 索引数 |
|------|:---:|:---:|
| `pet` | 12 | 1（openid 唯一） |
| `inventory` | 9 | 1（openid 唯一） |
| `taskTemplates` | 12 | 1（openid+enabled） |
| `dailyTasks` | 14 | 2（openid+taskDate；openid+taskDate+templateId 唯一） |
| `checkinRecords` | 13 | 2（dailyTaskId；openid+status） |

### 9.3 P4-3 — 开发云函数

| 项目 | 内容 |
|------|------|
| **输入** | 本文档第 7 章（云函数设计） |
| **做什么** | 编写并部署 4 个云函数：`login`、`getHomeData`、`submitCheckin`、`reviewCheckin` |
| **不改什么** | 不改前端代码。前端继续走 Mock，云函数独立部署后可手动测试 |
| **产出** | 4 个云函数部署到云开发环境，可通过云函数测试面板验证 |

云函数返回格式必须兼容 Mock（见第 5 章映射表）。

### 9.4 P4-4 — 前端接入云函数

| 项目 | 内容 |
|------|------|
| **输入** | P4-3 已部署的 4 个云函数 |
| **做什么** | 修改 `frontend/src/services/storage.js`，新增 cloud 实现分支；修改 `frontend/src/constants/config.js`，`DATA_SOURCE` 从 `'mock'` 切换为 `'cloud'` |
| **不改什么** | 不改页面代码、不改组件、不改 stores、不改 UI |
| **产出** | 前端通过 `DATA_SOURCE=cloud` 调用云函数，Mock 模式保留可回退 |

**P4-4 完成后各页面数据来源（目标状态）：**

| 页面 | 数据需求 | 来源 | 说明 |
|------|----------|:---:|------|
| **home/index.vue** | pet, inventory, taskStats, pendingConfirms | ☁️ 云函数 | `getHomeData` |
| **tasks/index.vue** | dailyTasks, submitCheckin | ☁️ 云函数 | `getHomeData` + `submitCheckin` |
| **parent/confirm/index.vue** | pendingConfirmations, reviewCheckin | ☁️ 云函数 | `getHomeData` + `reviewCheckin` |
| **parent/tasks/index.vue** | taskTemplates, CRUD | 📦 Mock | `manageTaskTemplate` 归入 P5 |
| **parent/settings/index.vue** | pet.name | 📦 Mock | 宠物名称修改归入 P5 |
| **record/index.vue** | streakStat, history, weekDays | 📦 Mock | `getGrowthRecord` 归入 P5 |
| **pet/index.vue** | pet, inventory, performAction | 🔀 混合 | 读取走云函数；`performPetAction` 走 Mock（`useItem` 归入 P5） |

> **P4-4 混合模式限制（已知且接受）：** `reviewCheckin` 在云端更新 inventory 后，若用户立即使用道具（走 Mock），会读到旧数据。P5 解决完整一致性。

### 9.5 P4-5 — 真机测试与微信审核

| 项目 | 内容 |
|------|------|
| **输入** | P4-4 前端已接入云函数 |
| **做什么** | iPhone + Android 真机预览、兼容性测试、边界 case 验证、提交微信审核 |
| **不改什么** | 不改后端、不改前端 |
| **产出** | 测试报告、审核提交 |

---

## 10. 索引设计（P4-2B 创建）

| 集合 | 索引 | 类型 | 用途 |
|------|------|------|------|
| `pet` | `openid` | 唯一索引 | 按用户查询宠物 |
| `inventory` | `openid` | 唯一索引 | 按用户查询背包 |
| `taskTemplates` | `openid + enabled` | 普通索引 | 查询启用模板 |
| `dailyTasks` | `openid + taskDate` | 普通索引 | 查询当日任务 |
| `dailyTasks` | `openid + taskDate + templateId` | 唯一索引 | 防重复生成 |
| `checkinRecords` | `dailyTaskId` | 普通索引 | 查询任务关联打卡 |
| `checkinRecords` | `openid + status` | 普通索引 | 查询待审核列表 |

---

## 11. 验收标准

| 验收项 | 状态 |
|--------|:---:|
| 5 个集合字段子集已明确（60 落地 / 10 暂缓） | 待用户确认 |
| 4 个云函数职责已明确 | 待用户确认 |
| 字段名映射表已输出（Mock ↔ Cloud） | 待用户确认 |
| 状态值映射表已输出 | 待用户确认 |
| 暂缓集合/字段/云函数已明确 | 待用户确认 |
| P4-2B / P4-3 / P4-4 / P4-5 边界已明确 | 待用户确认 |
| P4-4 混合模式限制已说明 | 待用户确认 |
| 索引设计已输出 | 待用户确认 |
| 未创建数据库集合 | ✅ 已满足 |
| 未开发云函数 | ✅ 已满足 |
| 未修改前端代码 | ✅ 已满足 |
| 未提交 Git | ✅ 已满足 |

---

## 12. 关键决策待确认

1. **字段名 `exp` vs `growthValue`：** 云数据库使用 `exp`（P4-2A 规范），云函数返回时映射为 `growthValue`（Mock 兼容）。是否同意？

2. **状态值 `submitted`/`approved` vs `waiting`/`done`：** 云数据库使用 `submitted`/`approved`（P4-2A 规范），云函数返回时映射为 `waiting`/`done`（Mock 兼容）。是否同意？

3. **P4-4 混合模式：** `useItem` 和 `manageTaskTemplate` 归入 P5，导致 P4-4 完成后存在云端+Mock 混合。是否接受此限制？

4. **`role` 数据：** P4 不迁移角色数据到云端，继续使用本地 storage。是否同意？

5. **`streakStat`/`dailySummaries`/`history`：** 不创建独立集合，由云函数从已有集合计算。是否同意？
