# 萌宠打卡小程序 — TODO

> 最后更新：2026-06-11
> 基于：[开发计划.md](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/docs/开发计划.md)

---

## P0 — 阻塞 MVP 验收

| 序号 | 任务 | 详情 | 依赖 | 状态 |
|------|------|------|------|------|
| P0-1 | **任务新增/编辑** | TaskFormModal 弹窗 + saveTaskTemplate/deleteTaskTemplate + 家长任务管理页新增/编辑/删除入口。支持：任务名称、图标 emoji、奖励类型、奖励数量（1-3）。 | — | ✅ 已完成 |
| P0-2 | **家长入口验证** | 首页进入家长待确认页路径通畅，暂无需额外弹窗（MVP 阶段儿童误操作概率低，待真机测试后评估）。 | — | ✅ 已完成 |

---

## P1 — Sprint 2/3 补缺

| 序号 | 任务 | 详情 | 依赖 |
|------|------|------|------|
| P1-1 | **引入 Pinia 状态管理** | 创建 `pet`、`tasks`、`inventory` stores，替换当前各页面手动 `onShow` 重新读取数据。实现页面间数据响应式同步。 | — |
| P1-2 | **家长设置页** | 新建 `pages/parent/settings/index`，支持修改宠物名称。 | P1-1 建议先引入 Store |
| P1-3 | **全局组件** | 实现 `UpgradeModal`（升级祝贺弹窗）、`EmptyState`（空状态插画占位）。当前临时用 `uni.showModal` 和页面内联空状态。 | — |
| P1-4 | **角色切换机制** | 实现孩子/家长模式切换（可合并到首页弹窗或设置页），不需要账号体系，仅本地标记当前角色。 | P1-2 |
| P1-5 | **清理旧版目录** | 删除 `frontend/pages/`、`frontend/services/`、`frontend/components/`、`frontend/App.vue`、`frontend/main.js`、`frontend/pages.json`、`frontend/manifest.json`、`frontend/uni.scss` 等不参与编译的旧文件。**必须等项目功能稳定后再执行。** | 功能稳定 |

---

## P2 — 体验优化

| 序号 | 任务 | 详情 | 依赖 |
|------|------|------|------|
| P2-1 | **Sass @import 迁移** | 将 `@import './uni.scss'` 改为 `@use` 语法，消除 6 条 Sass 废弃警告。 | — |
| P2-2 | **道具不足引导** | 首页按钮 `disabled` 时，点击弹出 toast 提示「完成任务可获得更多道具」。当前仅置灰按钮。 | — |
| P2-3 | **首页加载优化** | 首页 `onLoad` + `onShow` 双重触发 `loadData()`，首次加载执行两次。移除 `onLoad` 调用或添加防重复逻辑。 | — |
| P2-4 | **报废 `resetDailyTasks` 清理** | `storage.js` 中 `resetDailyTasks` 函数定义但从未被调用，属于死代码。 | — |
| P2-5 | **uniapp 颜色变量统一** | 将各页面硬编码的 `#FF8C42`、`#4ECDC4` 等颜色替换为 `uni.scss` 变量引用。 | — |

---

## P3 — Cloud & Launch

| 序号 | 任务 | 详情 | 依赖 |
|------|------|------|------|
| P3-1 | **微信云开发环境开通** | 注册/开通云开发，创建 `family`、`pet`、`inventory`、`task_template`、`daily_task`、`checkin`、`streak_stat` 集合。 | 微信 AppID |
| P3-2 | **login 云函数** | 获取 openid，初始化 family / pet / inventory 记录。 | P3-1 |
| P3-3 | **核心云函数迁移** | 实现以下云函数替代 services/storage.js：`submitCheckin`、`reviewCheckin`、`useItem`、`manageTaskTemplate`、`getHomeData`、`getDailyTasks`、`getGrowthRecord` | P3-1, P3-2 |
| P3-4 | **前端 services 切换** | 通过环境变量 `DATA_SOURCE=cloud` 切换为云函数调用，保留 Mock 模式兼容。 | P3-3 |
| P3-5 | **真机预览与兼容性测试** | iPhone + Android 主流机型。检查按钮大小、文案、色彩、TabBar 点击。 | P3-1 |
| P3-6 | **提交微信审核** | 小程序类目审核、隐私协议、合规自查。 | P3-5 |

---

## P4 — 后续版本

| 序号 | 任务 | 详情 |
|------|------|------|
| P4-1 | **状态自然衰减** | 饥饿/清洁/心情随时间下降（参考 PRD §4.5） |
| P4-2 | **每日提醒订阅消息** | 微信订阅消息提醒孩子完成今日任务 |
| P4-3 | **多孩子档案** | 一个家庭多个孩子独立记录 |
| P4-4 | **成就徽章** | 连续打卡 7 天/30 天等成就 |
| P4-5 | **分享海报** | 成长记录生成分享图 |

---

## 图例

- ✅ 已完成
- ⚠️ 部分完成
- ❌ / — 未开始