# UX-1A 首页高保真重构执行版 Spec

## 1. 任务信息

| 字段 | 内容 |
|------|------|
| 任务编号 | UX-1A |
| 任务名称 | 首页高保真重构 |
| 任务类型 | UX 产品体验与视觉重构专项 |
| 当前阶段 | Spec 确认阶段 |
| 开发目标 | 将首页重构为 Codex 新设计方向的“宠物家园首屏样板间” |
| 执行边界 | 只改首页，不做五 Tab，不新增宠物页，不改任务页，不改成长页，不新增我的页 |

## 2. 背景与设计方向

UX 专项已正式立项。

本次 UX-1A 的目标不是完整实现五页新架构，而是先将首页做成新产品方向的样板间，用于验证整体视觉方向、宠物陪伴感、家园氛围和照顾动作表达。

设计方向：

```text
Finch × Tamagotchi Modern
```

核心原则：

- 宠物是主角
- 任务是照顾宠物的手段
- 家园建设驱动成长
- 强化陪伴感与情绪反馈

首页定位：

```text
首页是宠物家园首屏，不是任务入口，也不是状态仪表盘。
```

孩子打开首页时，第一眼应感受到“小梨在等我”，然后自然看到“我可以喂食、清洁、陪玩”和“今天照顾小梨还能获得奖励”。

## 3. 参考资料优先级

1. 用户提供的五页高保真设计图，以设计图为最高准则
2. `docs/design/pet-checkin-five-page-design-system.md`
3. `docs/design/pet-xiaoli-emotion-states.md`
4. 当前首页源码：`frontend/src/pages/home/index.vue`
5. 当前业务逻辑：`frontend/src/stores/*`、`frontend/src/services/*`

如设计图与文档描述冲突，以设计图为准。

## 4. UX-1A 实现范围

本阶段只实现以下内容：

1. 首页宠物家园首屏
2. 小梨主视觉区域
3. 家园背景区域
4. 顶部状态 chip
5. 情绪气泡
6. 三个照顾动作按钮
7. 今日照顾任务托盘
8. 任务预览 1-2 条

## 5. 必须保留内容

UX-1A 必须保留以下现有能力，不允许破坏：

1. 现有喂食 / 清洁 / 陪玩逻辑
2. 现有任务进度逻辑
3. 现有道具不足提示逻辑
4. 现有升级弹窗能力
5. 现有 Mock 数据结构
6. 现有三 Tab 结构
7. 当前首页进入家长确认页的能力可以保留，但视觉上应弱化为次级入口

现有核心逻辑来源：

| 能力 | 当前来源 | UX-1A 策略 |
|------|----------|------------|
| 数据初始化 | `initAppData()` | 保留 |
| 宠物数据加载 | `petStore.load()` | 保留 |
| 背包数据加载 | `inventoryStore.load()` | 保留 |
| 任务数据加载 | `tasksStore.loadAll()` | 保留 |
| 喂食/清洁/陪玩 | `petStore.performAction(type)` | 保留 |
| 道具不足提示 | `uni.showToast({ title: '完成任务可获得更多道具' })` | 保留 |
| 升级弹窗 | `upgrade-modal` | 保留 |
| 今日任务进度 | `tasksStore.taskStats` | 保留 |
| 待确认数量 | `tasksStore.pendingConfirmsCount` | 保留，用于弱化家长入口 |

## 6. 暂不实现内容

UX-1A 明确不做：

1. 五 Tab 改造
2. 宠物页
3. 我的页
4. 收藏系统
5. 金币真实系统
6. 家具真实解锁
7. 数据库字段调整
8. 云函数调整
9. 任务页高保真重构
10. 成长页高保真重构
11. 新增真实素材包管理系统
12. 新增真实动画资源
13. 修改 `frontend/src/pages.json` 的 TabBar 结构

## 7. 当前首页问题总结

当前首页是“宠物状态仪表盘 + 背包 + 操作按钮”的组合，信息较完整，但不符合新方向中的“宠物家园首屏”。

当前首页主要问题：

- 宠物主视觉弱，当前是 emoji 圆形头像
- 家园感不足，没有完整场景空间
- 状态数值强于情绪反馈
- 背包模块占据独立区域，偏工具感
- 任务进度表达偏“任务管理”
- 家长入口视觉权重偏高
- 页面缺少“今天小梨想做什么”的情绪气泡

UX-1A 的重构重点是将首页从“数据展示”转为“陪伴场景”。

## 8. 首页目标信息架构

UX-1A 首页建议结构如下：

```text
首页 page
├── 顶部状态区
│   ├── 页面标题：宠物打卡 / 小梨的家园氛围标题
│   ├── Lv 状态 chip
│   ├── 今日照顾进度 chip
│   ├── 心情状态 chip
│   └── 弱化家长入口
│
├── 宠物家园主舞台
│   ├── 家园背景
│   ├── 临时小梨主视觉
│   ├── 情绪气泡
│   ├── 家具/装饰占位
│   └── 解锁轮廓占位
│
├── 三个照顾动作按钮
│   ├── 喂食
│   ├── 清洁
│   └── 陪玩
│
├── 今日照顾任务托盘
│   ├── 标题：今日照顾
│   ├── 进度：done / total
│   ├── 任务预览 1-2 条
│   └── 奖励提示
│
└── 升级弹窗
```

## 9. 具体实施步骤

### Step 1：重构首页模板结构

目标文件：

```text
frontend/src/pages/home/index.vue
```

执行内容：

- 保留 `<upgrade-modal />`
- 保留 `onShow(loadData)`
- 保留现有 stores 引入
- 将旧结构中的 `pet-card`、`status-card`、`inventory-card`、`action-row` 重组为新首页结构
- 顶部加入状态 chip 区
- 中部加入宠物家园主舞台
- 主舞台下方加入三个照顾动作按钮
- 底部加入今日照顾任务托盘

不做内容：

- 不新增页面
- 不改路由
- 不改 TabBar
- 不改任务页

### Step 2：新增首页派生展示数据

目标文件：

```text
frontend/src/pages/home/index.vue
```

新增 computed 仅用于页面展示，不改变 Mock 数据结构：

| computed | 用途 | 数据来源 |
|----------|------|----------|
| `emotionState` | 首页情绪状态 | `pet.hunger` / `pet.cleanliness` / `pet.mood` |
| `emotionText` | 情绪气泡文案 | `emotionState` |
| `moodChipText` | 顶部心情 chip | `emotionState` |
| `recommendedAction` | 视觉上高亮推荐动作 | `emotionState` |
| `previewTasks` | 今日照顾任务预览 | `tasksStore.dailyTasks.slice(0, 2)` |
| `careProgressText` | 今日照顾进度 | `taskStats.done` / `taskStats.total` |
| `stageText` | 临时阶段文案 | `pet.level` 派生 |

情绪状态派生规则建议：

```text
cleanliness <= 35 → needClean
hunger <= 35 → hungry
mood <= 35 → bored
默认 → happy
```

说明：

- UX-1A 不新增 fatigue/sick 字段
- 疲劳、生病状态留到后续宠物状态系统扩展
- 当前只从已有三个数值中派生首页文案和推荐动作

### Step 3：保留并包裹现有照顾动作逻辑

目标文件：

```text
frontend/src/pages/home/index.vue
```

保留函数：

```text
onAction(type)
```

必须保持：

- `feed` 消耗 `food`
- `wash` 消耗 `soap`
- `play` 消耗 `toy`
- 道具不足时提示：`完成任务可获得更多道具`
- 成功后刷新背包
- 升级时展示 `upgrade-modal`
- 未升级时展示成功 toast

只允许调整：

- 按钮布局
- 按钮样式
- 按钮文案
- 当前推荐动作高亮样式

不允许调整：

- actionType 命名
- itemMap 映射
- performAction 业务逻辑
- Mock 数据结构

### Step 4：实现宠物家园主舞台

目标文件：

```text
frontend/src/pages/home/index.vue
```

主舞台结构建议：

```text
home-stage
├── stage-bg-layer
├── window-light
├── shelf-decoration
├── furniture-placeholder
├── pet-visual-placeholder
├── emotion-bubble
└── unlock-ghost
```

实现策略：

- 使用 CSS 渐变构建暖奶油家园背景
- 使用简单几何图形模拟窗户、地毯、置物架、植物、家具轮廓
- 使用统一风格的 emoji/文字/几何形状作为临时小梨主视觉
- 临时视觉必须整体保持柔和、圆润、低噪音
- 不引入外部不一致图片

### Step 5：实现顶部状态 chip

顶部 chip 内容建议：

| chip | 内容 | 数据来源 |
|------|------|----------|
| 等级 | `Lv.${pet.level}` | `pet.level` |
| 今日照顾 | `${done}/${total}` | `taskStats` |
| 心情 | `心情很好` / `有点饿` / `想玩` / `想洗澡` | `emotionState` |

注意：

- UX-1A 不做金币真实系统
- 不展示假金币数值，避免与真实数据冲突
- 如设计上需要资源感，可展示当前背包总数或道具小 chip，但不命名为“金币”

### Step 6：实现情绪气泡

情绪气泡文案建议：

| emotionState | 文案 |
|--------------|------|
| happy | 小梨想和你一起布置新家 |
| hungry | 小梨肚子有点空，可以喂点东西吗？ |
| needClean | 小梨想洗香香，保持干净会更开心 |
| bored | 小梨想和你玩一会儿 |

实现要求：

- 气泡位于小梨主视觉附近
- 不遮挡主要按钮
- 文案温柔，不制造焦虑
- 不出现恐吓式反馈

### Step 7：实现今日照顾任务托盘

目标：

- 将“今日任务”弱化为“今日照顾”
- 首页只展示 1-2 条任务预览
- 完整任务仍在任务 Tab 中完成

托盘内容：

```text
今日照顾任务
完成照顾，小梨会长大一点
进度 done / total
任务预览 1-2 条
```

任务预览字段：

| 字段 | 来源 |
|------|------|
| 任务图标 | `task.icon` |
| 任务名 | `task.name` |
| 奖励类型 | `task.rewardType` |
| 奖励数量 | `task.rewardAmount` |
| 状态 | `task.status` |

状态文案：

| task.status | 首页展示文案 |
|-------------|--------------|
| pending | 去照顾 |
| waiting | 等确认 |
| done | 已完成 |

注意：

- 首页任务预览不直接调用 `submitCheckin`
- 首页不替代任务页
- 如点击任务预览，可选择 `uni.switchTab({ url: '/pages/tasks/index' })`，但 UX-1A 可先不加跳转，避免额外路由风险

### Step 8：样式重构

目标文件：

```text
frontend/src/pages/home/index.vue
```

视觉关键词：

- 暖奶油背景
- 柔白卡片
- 大圆角
- 胶囊按钮
- 低噪音阴影
- 大留白
- 宠物主视觉占首屏最大面积

建议颜色：

| 用途 | 颜色 |
|------|------|
| 页面背景 | `#fff8f0` / `#fff5e8` |
| 内容面 | `#ffffff` / `rgba(255,255,255,0.88)` |
| 珊瑚橙 | `#ff8c42` |
| 薄荷绿 | `#4ecdc4` |
| 柔金色 | `#ffd166` / `#ffbf3f` |
| 文本主色 | `#2f241d` |
| 文本次色 | `#9a8f86` |

现有变量：

```scss
$primary: #ff8c42;
$success: #4ecdc4;
$bg: #fff8f0;
$text-secondary: #999;
```

UX-1A 可在页面 scoped style 内补充局部颜色，不要求先扩展全局变量。

## 10. 预计修改文件清单

### 必改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `docs/specs/UX-1A_home-high-fidelity-refactor.md` | 新增 | 本执行版 Spec |
| `frontend/src/pages/home/index.vue` | 修改 | 首页高保真重构主文件 |

### 可能修改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `frontend/src/uni.scss` | 暂不建议修改 | UX-1A 可先使用页面局部样式，避免影响全局 |
| `frontend/src/static/` | 暂不建议新增 | 当前无正式素材包，优先用 CSS 占位实现 |

### 明确不修改文件

| 文件/目录 | 说明 |
|----------|------|
| `frontend/src/pages.json` | 不改路由，不改 TabBar，不新增页面 |
| `frontend/src/pages/tasks/index.vue` | 不改任务页 |
| `frontend/src/pages/record/index.vue` | 不改成长页 |
| `frontend/src/pages/parent/*` | 不改家长页 |
| `frontend/src/stores/*` | 不改 store 结构 |
| `frontend/src/services/*` | 不改业务服务层 |
| `frontend/src/constants/pet.js` | 不改成长/道具常量 |
| `docs/TODO.md` | Spec 阶段暂不更新，待用户确认正式进入开发后再按规则统一维护 |
| `docs/开发计划.md` | Spec 阶段暂不更新，待用户确认正式进入开发后再按规则统一维护 |
| `docs/CHANGELOG.md` | Spec 阶段暂不更新，待用户确认正式进入开发后再按规则统一维护 |

## 11. 首页组件拆分方案

UX-1A 有两种组件拆分策略。

### 方案 A：页面内逻辑分区，不新增组件

实现方式：

- 只修改 `frontend/src/pages/home/index.vue`
- 在 template 中按区块拆分
- 在 script 中使用 computed 分组
- 在 style 中使用 BEM 风格类名组织

建议页面内区块：

```text
home-hero-header
home-status-chips
home-stage
home-care-actions
home-care-tray
home-task-preview
```

优点：

- 文件改动最小
- 不新增组件注册
- 不影响 easycom
- 适合 UX-1A 快速验证首页方向
- 回滚简单

缺点：

- `home/index.vue` 文件会变长
- 后续宠物页复用主舞台时，需要再抽组件

### 方案 B：新增首页专用组件

可能新增：

```text
frontend/src/components/home/HomePetStage.vue
frontend/src/components/home/HomeCareActions.vue
frontend/src/components/home/HomeCareTray.vue
```

优点：

- 结构更清晰
- 后续宠物页可复用部分视觉结构

缺点：

- UX-1A 改动文件增加
- 需要确认 easycom 或手动 import
- 目前只是样板间，过早抽象可能导致返工

### UX-1A 推荐方案

推荐采用方案 A：页面内逻辑分区，不新增组件。

原因：

1. 用户明确要求本阶段只改首页
2. 当前没有正式素材包，组件抽象边界不稳定
3. UX-1A 的核心是验证方向，不是沉淀组件库
4. 后续 UX-1B 宠物页启动时，再根据首页稳定结构抽出 `PetStage` 更稳妥

### 后续可抽组件边界

UX-1A 验收通过后，UX-1B 可考虑抽出：

| 组件 | 用途 |
|------|------|
| `PetHomeStage` | 首页/宠物页共用宠物舞台 |
| `CareActionButtons` | 首页/宠物页共用照顾按钮 |
| `StatusChipGroup` | 首页/宠物页共用状态 chip |
| `CareTaskTray` | 首页/任务页共用照顾任务预览 |

## 12. 临时素材策略

当前没有正式素材包，UX-1A 允许使用临时视觉素材或占位素材实现版式。

### 12.1 总原则

1. 不随便使用风格不一致的素材
2. 如需要占位，必须明确标注为临时素材
3. 优先使用设计图风格接近的本地素材或简单渐变/卡片/CSS 实现
4. 为后续替换正式小梨、家园背景、家具素材预留清晰资源入口
5. 不引入版权不明的外部图片
6. 不新增真实素材包管理系统

### 12.2 UX-1A 推荐临时实现

#### 小梨主视觉

临时策略：

- 使用页面内 `petVisualConfig` 或 computed 统一管理临时形象
- 使用 emoji + CSS 圆形身体/柔光背景实现临时视觉
- 文案或类名中标记为 placeholder
- 不使用风格不一致的网络图片

建议形式：

```text
柔黄色圆形主体 + emoji 表情/小鸡符号 + 光晕 + 地毯阴影
```

正式替换入口：

```text
petVisualConfig.imageUrl
petVisualConfig.placeholderEmoji
petVisualConfig.stateClass
```

UX-1A 先不真正引入 `imageUrl` 文件，但在结构上保留可替换位置。

#### 家园背景

临时策略：

- 使用 CSS 渐变模拟奶油色房间
- 使用 CSS 形状模拟窗户、墙面光影、地毯、置物架
- 使用简单图标或几何图形模拟小窝、星星灯、植物

正式替换入口：

```text
stage-background layer
furniture-slot layer
unlock-ghost layer
```

#### 家具与解锁位

临时策略：

- 已拥有家具：使用统一的柔和卡片/几何图形
- 未解锁家具：使用虚线轮廓 + 锁图标
- 不做真实家具解锁逻辑

#### 任务图标

临时策略：

- 复用当前任务模板中的 emoji 图标
- 使用统一的圆角图标容器包裹，提升一致性
- 不引入新任务插画

#### 顶部状态 chip 图标

临时策略：

- 使用 emoji 或 CSS 小图形
- 保持尺寸、圆角、颜色系统一致

### 12.3 素材缺口记录

UX-1A 开发完成后仍存在以下正式素材缺口：

| 素材 | UX-1A 临时方案 | 后续正式方案 |
|------|----------------|--------------|
| 小梨主视觉 | CSS/emoji placeholder | 3D 小梨图片或动画帧 |
| 家园背景 | CSS 渐变与几何图形 | 正式家园背景图 |
| 家具素材 | CSS 占位/emoji | 家具 PNG/WebP 资源 |
| 解锁轮廓 | CSS 虚线框 | 正式半透明家具轮廓 |
| 任务插画 | 当前 emoji | 小梨任务插画 |

## 13. 页面交互规则

### 13.1 喂食 / 清洁 / 陪玩

交互保持现状：

```text
点击按钮 → 检查背包道具 → 道具不足 toast / 执行动作 → 刷新背包 → 升级弹窗或成功 toast
```

### 13.2 今日照顾任务托盘

首页任务托盘只做展示：

- 展示任务预览
- 展示任务状态
- 展示奖励
- 展示进度

UX-1A 不在首页直接完成任务，避免改变当前任务页职责。

### 13.3 家长入口

当前首页已有家长入口。

UX-1A 策略：

- 保留入口和原有跳转逻辑
- 视觉弱化为右上角小图标或轻量文字入口
- 如有待确认数量，可显示小 badge
- 不迁移到我的页，因为 UX-1A 不新增我的页

## 14. 验收标准

### 14.1 范围验收

- 只修改首页相关代码和本 Spec 文档
- 不新增宠物页
- 不新增我的页
- 不修改任务页
- 不修改成长页
- 不修改 `pages.json` 的 TabBar 三项结构
- 不修改 Mock 数据结构
- 不修改数据库设计
- 不修改云函数

### 14.2 视觉验收

首页应满足：

- 第一屏明显以小梨/宠物主视觉为核心
- 有明确家园背景氛围
- 有顶部状态 chip
- 有情绪气泡
- 三个照顾动作按钮为大胶囊形态
- 有“今日照顾”任务托盘
- 任务预览只展示 1-2 条
- 整体风格接近 Codex 设计方向：温暖、干净、轻盈、大圆角、低噪音
- 页面不再像状态仪表盘或普通任务管理页

### 14.3 功能验收

必须验证通过：

1. 首页正常加载 Mock 数据
2. 宠物名称、等级、成长进度相关展示正常
3. 今日照顾进度展示与当前任务数据一致
4. 喂食按钮仍调用原有 `feed` 逻辑
5. 清洁按钮仍调用原有 `wash` 逻辑
6. 陪玩按钮仍调用原有 `play` 逻辑
7. 道具不足时仍提示“完成任务可获得更多道具”
8. 道具足够时照顾动作成功，宠物状态更新
9. 成长值达到升级条件时仍弹出升级弹窗
10. 家长入口仍可进入家长确认页
11. 三个 Tab 仍为：首页 / 任务 / 成长
12. 任务页、成长页、家长页不受影响

### 14.4 技术验收

开发完成后需要执行：

- 检查 `frontend/package.json` 中可用脚本
- 运行项目已有 lint/typecheck/build 中可执行的校验命令
- 如没有明确 lint/typecheck，则至少运行可用 build 命令
- 如构建命令受微信小程序环境限制，需要明确说明未执行原因

### 14.5 回归验收

需要回归以下路径：

```text
首页加载
首页点击喂食/清洁/陪玩
道具不足提示
任务页查看今日任务
家长确认页查看待确认
成长页查看记录
底部三 Tab 切换
```

## 15. 风险与应对

| 风险 | 说明 | 应对 |
|------|------|------|
| 无正式素材导致高保真不足 | 当前无小梨和家园正式资源 | 用统一 CSS placeholder 实现版式，明确临时素材入口 |
| 首页文件变长 | 推荐不新增组件，首页会更长 | 使用清晰 class 命名和 computed 分组，UX-1B 再抽组件 |
| 误改业务逻辑 | 首页重构可能影响喂食/任务进度 | 保留原函数和 store 调用，只改展示层 |
| 假金币误导 | 设计图有金币，但当前无金币系统 | UX-1A 不展示真实金币数值，不新增金币字段 |
| 家长入口弱化后不可发现 | UX-1A 不能新增我的页承载家长入口 | 保留右上角轻量入口和待确认 badge |
| 首页任务预览与任务页状态不一致 | 如果不复用 dailyTasks 会有风险 | 直接从 `tasksStore.dailyTasks` 派生 `previewTasks` |

## 16. 开发执行建议

UX-1A 编码建议按以下顺序执行：

1. 备份理解当前 `home/index.vue` 的 template/script/style 结构
2. 先改 template 骨架，保留所有现有方法
3. 增加展示用 computed，不修改 store/service
4. 重写 scoped style，实现家园首屏
5. 本地检查首页编译错误
6. 验证喂食/清洁/陪玩逻辑
7. 验证任务进度和任务预览
8. 验证三 Tab 未变化
9. 运行可用构建/校验命令
10. 开发完成后再按项目规则更新 TODO / 开发计划 / CHANGELOG

## 17. 本 Spec 确认后的下一步

等待用户确认本 Spec。

用户确认后，进入 UX-1A 编码阶段。

编码阶段允许修改：

```text
frontend/src/pages/home/index.vue
```

如实施过程中发现确需新增局部组件或新增临时资源文件，必须先说明原因并等待确认后再扩大范围。
