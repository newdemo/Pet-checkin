# UX-1B 宠物页高保真重构执行版 Spec

## 1. 任务信息

| 字段 | 内容 |
|------|------|
| 任务编号 | UX-1B |
| 任务名称 | 宠物页高保真重构 |
| 任务类型 | UX 产品体验与视觉重构专项 |
| 当前阶段 | Spec 确认阶段 |
| 页面目标 | 实现“小梨的家” |
| 产品定位 | 宠物状态中心、家园展示中心、家具展示中心、照顾互动中心 |
| 重要边界 | 不修改 TabBar，不改任务页/成长页/我的页，不改数据库/云函数/Mock 数据结构 |

## 2. 背景

UX-1A 首页样板间方向已确认通过。

UX-1B 进入宠物页高保真重构，目标是把“宠物页”做成“小梨的家”。

该页面不是传统数据面板，也不是首页的简单复制，而是承接首页中更深入的宠物状态解释、家园展示、家具布置和照顾互动。

UX-1B 页面关键词：

```text
小梨的家 / 状态解释 / 家园布置 / 家具展示 / 照顾互动
```

设计方向延续 UX-1A：

```text
Finch × Tamagotchi Modern
```

核心原则：

- 宠物是页面视觉中心
- 状态数值只解释宠物当前感受
- 家具与家园表现成长结果
- 照顾动作继续复用现有业务逻辑
- 暂不引入真实收藏系统

## 3. 参考资料优先级

1. Codex 五页设计图，宠物页为主，以设计图为最高准则
2. `docs/design/pet-checkin-five-page-design-system.md`
3. `docs/design/pet-xiaoli-emotion-states.md`
4. `docs/specs/UX-1A_home-high-fidelity-refactor.md`
5. UX-1A 首页实现：`frontend/src/pages/home/index.vue`
6. 当前业务逻辑：`frontend/src/stores/*`、`frontend/src/services/*`

如设计图与文档描述冲突，以设计图为准。

## 4. UX-1B 实现范围

本阶段实现：

1. 顶部状态 Chip
   - 饱腹
   - 清洁
   - 心情
   - 成长值
2. 家园主舞台
   - 小梨主视觉区域
   - 情绪气泡
   - 家园背景
   - 家具展示位
   - 待解锁区域
3. 家园布置模块
   - 小窝
   - 星星灯
   - 玩具角
   - 使用静态配置
   - 不实现真实收藏系统
4. 今日照顾提示
   - 今天想换个小窝
   - 小梨想要新玩具
   - 今天很开心
5. 三个照顾动作
   - 喂食
   - 清洁
   - 陪玩
   - 继续复用现有业务逻辑

## 5. 必须保留内容

UX-1B 必须保留并复用：

| 能力 | 当前来源 | UX-1B 策略 |
|------|----------|------------|
| 宠物数据 | `usePetStore()` | 复用 |
| 背包数据 | `useInventoryStore()` | 复用 |
| 任务数据 | `useTasksStore()` | 复用，可用于今日照顾提示 |
| 数据初始化 | `initAppData()` | 复用 |
| 喂食/清洁/陪玩 | `petStore.performAction(type)` | 复用 |
| 道具不足提示 | `uni.showToast({ title: '完成任务可获得更多道具' })` | 保留 |
| 升级弹窗 | `upgrade-modal` | 保留 |
| 成长进度 | `petStore.growthProgress` | 复用 |
| 当前宠物状态 | `pet.hunger` / `pet.cleanliness` / `pet.mood` | 复用并转为状态 Chip |

## 6. 明确禁止内容

UX-1B 不允许：

1. 修改数据库
2. 修改云函数
3. 修改 Mock 数据结构
4. 修改任务页
5. 修改成长页
6. 修改我的页
7. 修改 TabBar
8. 修改 `stores/*` 的数据结构
9. 修改 `services/*` 的业务逻辑
10. 新增真实收藏系统
11. 新增真实金币系统
12. 新增真实家具解锁逻辑
13. 引入版权不明的外部图片素材

## 7. 关键技术边界说明

当前项目页面结构中没有宠物页：

```text
frontend/src/pages/home/index.vue
frontend/src/pages/tasks/index.vue
frontend/src/pages/record/index.vue
frontend/src/pages/parent/*
```

当前 TabBar 仍为：

```text
首页 / 任务 / 成长
```

UX-1B 要实现宠物页，需要新增普通页面：

```text
frontend/src/pages/pet/index.vue
```

UniApp 小程序页面必须在 `pages.json` 的 `pages` 数组中注册，否则无法访问和构建。因此 UX-1B 编码阶段预计需要修改：

```text
frontend/src/pages.json
```

但修改范围仅限：

```text
pages 数组新增 pages/pet/index
```

不允许修改：

```text
tabBar.list
```

也就是说：

- UX-1B 会新增宠物页
- UX-1B 会注册宠物页为普通页面
- UX-1B 不会把宠物页加入 TabBar
- UX-1B 不做五 Tab 改造

如果用户要求“完全不修改 pages.json”，则宠物页无法作为 UniApp 页面正常访问，需要另行确认替代方案。

## 8. 页面结构设计

UX-1B 页面目标结构：

```text
宠物页 page
├── 页面头部
│   ├── 标题：小梨的家
│   └── 副标题：今天也要好好照顾小梨
│
├── 顶部状态 Chip 区
│   ├── 饱腹 chip
│   ├── 清洁 chip
│   ├── 心情 chip
│   └── 成长值 chip
│
├── 家园主舞台
│   ├── 家园背景
│   ├── 窗户/置物架/地毯/灯光
│   ├── 小梨主视觉
│   ├── 情绪气泡
│   ├── 已拥有家具展示位
│   └── 待解锁家具轮廓
│
├── 家园布置模块
│   ├── 模块标题：家园布置
│   ├── 说明：用收集到的家具，布置属于小梨的家吧
│   ├── 小窝卡片
│   ├── 星星灯卡片
│   ├── 玩具角卡片
│   └── 待解锁卡片
│
├── 今日照顾提示
│   ├── 状态提示文案
│   ├── 今日任务进度
│   └── 奖励/成长提示
│
├── 三个照顾动作
│   ├── 喂食
│   ├── 清洁
│   └── 陪玩
│
└── 升级弹窗
```

## 9. 具体实施步骤

### Step 1：新增宠物页文件

新增文件：

```text
frontend/src/pages/pet/index.vue
```

说明：

- 该文件是 UX-1B 的主要实现文件
- 视觉风格延续 UX-1A 首页
- 业务逻辑复用首页中的 `loadData()`、`onAction(type)`、`petEmoji`、`emotionState` 等模式
- 不抽公共组件，先保持宠物页独立实现，待 UX-1B 验收后再评估是否抽象共用组件

### Step 2：注册普通页面路由

修改文件：

```text
frontend/src/pages.json
```

只允许在 `pages` 数组中新增：

```json
{
  "path": "pages/pet/index",
  "style": {
    "navigationBarTitleText": "小梨的家",
    "navigationBarBackgroundColor": "#FF8C42",
    "navigationBarTextStyle": "white"
  }
}
```

禁止修改：

```text
tabBar.list
```

UX-1B 不改变三 Tab 结构。

### Step 3：实现顶部状态 Chip

状态 Chip 使用现有字段派生：

| Chip | 文案 | 数据来源 | 展示方式 |
|------|------|----------|----------|
| 饱腹 | `pet.hunger / 100` | `pet.hunger` | 橙色进度条 |
| 清洁 | `pet.cleanliness / 100` | `pet.cleanliness` | 薄荷进度条 |
| 心情 | `pet.mood / 100` | `pet.mood` | 柔金进度条 |
| 成长值 | `growthProgress.current / growthProgress.total` | `petStore.growthProgress` | 暖金进度条 |

说明：

- 当前字段名 `hunger` 仍保持不变
- UI 层文案显示为“饱腹”
- 不修改 Mock 数据字段

### Step 4：实现家园主舞台

主舞台设计参考 UX-1A，但宠物页更强调“完整家园”。

建议结构：

```text
pet-stage
├── room-light
├── window
├── shelf
├── pet-bed
├── star-lamp
├── toy-corner
├── unlock-shelf-ghost
├── emotion-bubble
└── pet-visual
```

实现策略：

- 使用 CSS 渐变构建家园背景
- 使用 CSS 几何图形构建窗户、地毯、置物架、家具位
- 使用 emoji + CSS 宠物主体作为临时小梨主视觉
- 使用虚线轮廓表示待解锁区域
- 不引入外部素材

### Step 5：实现家园布置模块

使用静态配置，不接入真实收藏系统。

建议配置：

```js
const furnitureItems = [
  {
    key: 'nest',
    name: '小窝',
    level: 'Lv.2',
    icon: '🏠',
    status: 'owned',
    desc: '小梨休息的小角落'
  },
  {
    key: 'lamp',
    name: '星星灯',
    level: 'Lv.1',
    icon: '⭐',
    status: 'owned',
    desc: '夜晚会发光的温柔小灯'
  },
  {
    key: 'toy',
    name: '玩具角',
    level: 'Lv.1',
    icon: '🏐',
    status: 'owned',
    desc: '陪小梨玩耍的地方'
  },
  {
    key: 'locked',
    name: '待解锁',
    level: '',
    icon: '🔒',
    status: 'locked',
    desc: '继续照顾小梨解锁新家具'
  }
]
```

说明：

- 该配置只存在于宠物页文件内部
- 不写入 store
- 不写入 Mock 数据
- 不做真实拥有/解锁判断

### Step 6：实现今日照顾提示

提示文案根据现有状态派生：

| 状态 | 提示文案 |
|------|----------|
| happy | 今天很开心，小梨想看看新布置 |
| hungry | 小梨肚子有点空，先喂点食物吧 |
| needClean | 小梨想洗香香，保持干净会更开心 |
| bored | 小梨想要新玩具，陪它玩一会儿吧 |

可辅助展示：

- 今日任务完成进度：`tasksStore.taskStats`
- 提示语：`完成照顾任务，可以获得更多道具`

不在宠物页直接完成任务。

### Step 7：实现三个照顾动作

继续复用 UX-1A 的动作逻辑：

```text
onAction(type)
```

必须保持：

- `feed` 消耗 `food`
- `wash` 消耗 `soap`
- `play` 消耗 `toy`
- 道具不足 toast：`完成任务可获得更多道具`
- 成功后刷新 `inventoryStore.load()`
- 升级时展示 `upgrade-modal`
- 未升级时展示成功 toast

按钮展示：

| 操作 | 文案 | 道具 |
|------|------|------|
| feed | 喂食 | `inventory.food` |
| wash | 清洁 | `inventory.soap` |
| play | 陪玩 | `inventory.toy` |

### Step 8：构建与回归

编码完成后运行：

```bash
npm run build:mp-weixin
```

如项目后续新增 lint/typecheck 脚本，则也需要运行。

回归：

- 宠物页构建通过
- 首页不受影响
- 任务页不受影响
- 成长页不受影响
- TabBar 仍为三项
- 宠物页三个照顾动作可用
- 升级弹窗可用
- 道具不足提示可用

## 10. 修改文件清单

### 必改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `docs/specs/UX-1B_pet-page-high-fidelity-refactor.md` | 新增 | 本执行版 Spec |
| `frontend/src/pages/pet/index.vue` | 新增 | 宠物页主实现 |
| `frontend/src/pages.json` | 修改 | 仅在 `pages` 数组注册普通宠物页 |

### 不建议修改文件

| 文件 | 说明 |
|------|------|
| `frontend/src/pages/home/index.vue` | UX-1A 已通过，UX-1B 尽量不改首页 |
| `frontend/src/uni.scss` | 暂不扩展全局样式，避免影响其它页面 |

### 禁止修改文件/目录

| 文件/目录 | 说明 |
|----------|------|
| `frontend/src/stores/*` | 不改 store 结构 |
| `frontend/src/services/*` | 不改业务服务 |
| `frontend/src/pages/tasks/index.vue` | 不改任务页 |
| `frontend/src/pages/record/index.vue` | 不改成长页 |
| `frontend/src/pages/parent/*` | 不改家长页 |
| 数据库设计相关文件 | 不改数据库 |
| 云函数相关文件 | 不改云函数 |

### 项目管理文档

按照项目规则，编码完成后通常需要同步维护：

```text
docs/TODO.md
docs/开发计划.md
docs/CHANGELOG.md
```

但本 Spec 阶段只创建 Spec，不更新这些项目管理文档。待用户确认进入编码阶段后，再按任务完成情况统一维护。

## 11. 需要复用的逻辑

### 11.1 数据加载逻辑

宠物页应复用：

```js
initAppData()
petStore.load()
inventoryStore.load()
tasksStore.loadAll()
```

与 UX-1A 首页保持一致。

### 11.2 宠物形象逻辑

复用 UX-1A 的等级 emoji 映射：

```js
const emojis = ['🐣', '🐥', '🐤', '🦊', '🌟']
```

说明：

- 当前没有正式小梨素材
- UX-1B 继续使用 CSS + emoji 作为临时主视觉
- 后续正式素材到位后再替换为图片/动画

### 11.3 情绪状态派生逻辑

复用 UX-1A 的状态派生规则：

```text
cleanliness <= 35 → needClean
hunger <= 35 → hungry
mood <= 35 → bored
默认 → happy
```

说明：

- 不新增 fatigue/sick 字段
- 不引入生病/疲劳状态
- 保持现有 Mock 数据结构不变

### 11.4 照顾动作逻辑

复用 `petStore.performAction(type)`。

必须保留：

```js
const itemMap = { feed: 'food', wash: 'soap', play: 'toy' }
```

并保持道具不足提示：

```js
uni.showToast({ title: '完成任务可获得更多道具', icon: 'none' })
```

### 11.5 升级弹窗

继续使用：

```text
<upgrade-modal />
```

参数保持：

```text
visible
pet-name
level
emoji
close
```

## 12. 临时素材策略

当前没有正式素材包，UX-1B 继续使用临时视觉方案。

策略：

1. 不引入外部图片
2. 不使用风格不一致素材
3. 使用 CSS 渐变、柔光、圆角、几何图形构建家园背景
4. 使用 emoji + CSS 形体构建临时小梨
5. 使用统一风格的家具卡片和虚线解锁位
6. 为后续正式素材替换保留清晰类名和结构

正式素材缺口：

| 素材 | UX-1B 临时方案 | 后续正式方案 |
|------|----------------|--------------|
| 小梨宠物页主视觉 | CSS + emoji | 3D 小梨图片/动画帧 |
| 家园背景 | CSS 渐变/几何图形 | 正式房间背景图 |
| 小窝 | emoji + 卡片 | 家具素材图 |
| 星星灯 | emoji + 卡片 | 星星灯 PNG/WebP |
| 玩具角 | emoji + 卡片 | 玩具角素材 |
| 待解锁家具 | CSS 虚线框 | 半透明家具轮廓 |

## 13. 验收标准

### 13.1 范围验收

必须满足：

- 新增宠物页
- 宠物页注册为普通页面
- 不修改 TabBar 三项结构
- 不新增我的页
- 不修改任务页
- 不修改成长页
- 不修改家长页
- 不修改数据库
- 不修改云函数
- 不修改 Mock 数据结构
- 不新增真实收藏系统

### 13.2 视觉验收

宠物页应满足：

- 页面明确表达“小梨的家”
- 宠物主视觉占据主要视觉权重
- 状态 Chip 紧凑，不压过宠物主视觉
- 有家园背景氛围
- 有家具展示位
- 有待解锁区域
- 家园布置模块包含小窝、星星灯、玩具角
- 有今日照顾提示
- 三个照顾动作按钮清晰可点
- 整体风格与 UX-1A 首页一致

### 13.3 功能验收

必须验证：

1. 宠物页能正常构建
2. 宠物页能加载 Mock 数据
3. 饱腹/清洁/心情/成长值显示正确
4. 情绪气泡根据状态变化
5. 家园布置模块显示静态家具配置
6. 今日照顾提示显示当前状态文案
7. 喂食按钮调用原有 `feed` 逻辑
8. 清洁按钮调用原有 `wash` 逻辑
9. 陪玩按钮调用原有 `play` 逻辑
10. 道具不足时提示“完成任务可获得更多道具”
11. 道具足够时状态更新
12. 升级时弹出升级弹窗
13. 首页、任务页、成长页不受影响
14. TabBar 仍为：首页 / 任务 / 成长

### 13.4 构建验收

必须执行：

```bash
npm run build:mp-weixin
```

构建结果应为成功。

如出现 Sass legacy API warning，只要构建成功，不视为 UX-1B 阻塞问题。

### 13.5 微信开发者工具验收

编码完成后需要用户在微信开发者工具中验证：

- 宠物页是否可访问
- 宠物页视觉是否符合 Codex 宠物页方向
- CSS 临时素材在小程序环境中显示是否稳定
- 三个照顾动作是否正常
- TabBar 是否仍未改变

## 14. 风险与应对

| 风险 | 说明 | 应对 |
|------|------|------|
| 用户要求不改 TabBar，但宠物页需要路由注册 | UniApp 新页面必须注册到 pages 数组 | 只新增普通页面，不改 `tabBar.list` |
| 无正式素材导致还原度有限 | 当前没有小梨/家园/家具正式素材 | 使用 UX-1A 同风格 CSS 临时素材 |
| 首页与宠物页视觉重复 | 两页都有宠物舞台 | 首页偏“首屏邀请”，宠物页偏“状态解释 + 家园布置” |
| 静态家具被误认为真实收藏 | UX-1B 不做收藏系统 | 文案表达为“家园布置”，不展示真实收集进度 |
| 宠物页暂无入口 | 不改 TabBar，首页未必有入口 | 编码阶段可先通过页面路径验证；如需首页入口，需用户另行确认是否允许改首页 |
| 业务逻辑被误改 | 照顾动作复用现有逻辑 | 不修改 store/service，只在页面内调用 |

## 15. 编码阶段建议顺序

用户确认 Spec 后，建议按以下顺序执行：

1. 新增 `frontend/src/pages/pet/index.vue`
2. 在 `frontend/src/pages.json` 的 `pages` 数组注册普通页面
3. 复制并适配 UX-1A 的数据加载与照顾动作逻辑
4. 实现顶部状态 Chip
5. 实现家园主舞台
6. 实现家园布置静态模块
7. 实现今日照顾提示
8. 实现三大照顾动作按钮
9. 接入 `upgrade-modal`
10. 检查未修改禁止文件
11. 运行 `npm run build:mp-weixin`
12. 输出修改文件、实现说明、回归结果、构建结果和微信开发者工具验证建议

## 16. 本 Spec 确认后的下一步

等待用户确认本 Spec。

用户确认后，进入 UX-1B 编码阶段。

编码阶段允许修改：

```text
frontend/src/pages/pet/index.vue
frontend/src/pages.json
```

其中 `pages.json` 仅允许新增普通页面注册，不允许修改 TabBar。

如用户希望宠物页从首页可点击进入，则需要额外确认是否允许修改：

```text
frontend/src/pages/home/index.vue
```

默认 UX-1B 不修改首页。
