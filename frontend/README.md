# 萌宠打卡 — 前端（UniApp Vue3）

最小可运行版本，使用 `frontend/mock` 初始数据 + `uni.setStorageSync` 本地持久化，不接云开发。

## 功能

- 首页：宠物状态、背包、喂食 / 清洁 / 陪玩
- 任务：刷牙、阅读、收拾玩具、运动，完成后获得道具
- 成长：连续打卡、等级、近 7 日记录
- 家长任务管理：开关每日任务

## 方式一：HBuilderX（推荐新手）

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 菜单 **文件 → 打开目录**，选择本目录 `frontend`
3. 确认 `manifest.json` 中 `vueVersion` 为 `3`
4. 菜单 **运行 → 运行到小程序模拟器 → 微信开发者工具**
5. 首次需在微信开发者工具中开启 **服务端口**：设置 → 安全设置 → 服务端口（开启）
6. 若提示未配置 AppID，可使用测试号或留空使用游客模式

> HBuilderX 会自动编译，无需手动 `npm install`。

### 依赖说明（Apple Silicon Mac）

终端里 Node 通常是 **arm64**，而 HBuilderX 在 M 系列芯片上常以 **x64（Rosetta）** 运行。因此 `npm install` 默认只装 arm64 原生包，HBuilderX 编译时会报 esbuild / rollup 架构不匹配。

项目已通过 `postinstall` 脚本（`scripts/ensure-native-deps.mjs`）自动补装 x64 包：
- `@esbuild/darwin-x64`
- `@rollup/rollup-darwin-x64`

若 HBuilderX 仍报 esbuild 版本不匹配，在 `frontend` 目录手动执行（版本号以 `node_modules/vite/node_modules/esbuild/package.json` 为准）：

```bash
node scripts/ensure-native-deps.mjs
```

**HBuilderX（Rosetta）处理建议：**

1. **推荐**：保持现状，依赖 `postinstall` 双架构包（终端 arm64 + HBuilderX x64 都能编译）。
2. **备选**：在终端用 x64 模式重装依赖，与 HBuilderX 保持一致：
   ```bash
   arch -x86_64 zsh
   cd frontend && rm -rf node_modules package-lock.json
   npm cache clean --force && npm install
   ```
3. **长期方案**：在「应用程序」中右键 HBuilderX →「显示简介」→ 取消勾选「使用 Rosetta 打开」，让 HBuilderX 也以 arm64 运行（需 HBuilderX 版本支持）。

## 方式二：CLI + 微信开发者工具

```bash
cd frontend
npm install
npm run dev:mp-weixin
```

编译产物目录：
- 开发：`dist/dev/mp-weixin`（`npm run dev:mp-weixin`）
- 构建：`dist/build/mp-weixin`（`npm run build:mp-weixin`）

1. 打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. **导入项目** → 选择 `frontend/dist/dev/mp-weixin`
3. AppID 可选测试号，勾选「不校验合法域名」

## 体验闭环

1. 打开 **任务** Tab，点击「完成」领取道具
2. 回到 **首页**，点击喂食 / 清洁 / 陪玩消耗道具
3. 观察饥饿 / 清洁 / 心情 / 成长值变化，成长值满后升级
4. **成长** Tab 查看打卡记录
5. 首页右上角 **家长管理** 可开关任务

## 目录说明

```
frontend/
├── src/
│   ├── pages/           # 页面
│   ├── components/      # 组件
│   ├── services/        # 业务与存储
│   ├── constants/       # 常量
│   └── static/tab/      # TabBar 图标
├── mock/                # 初始 Mock 数据
├── pages.json           # 在 src/pages.json
└── manifest.json        # 在 src/manifest.json
```

## 数据存储

- Key：`pet_checkin_data`
- 可在家长管理页点击「重置所有数据」恢复初始状态
