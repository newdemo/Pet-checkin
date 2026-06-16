# P3-2 测试可执行性评估与已知 BUG 代码风险定位

> 生成日期：2026-06-12
> 基于版本：v1.8.0
> 分析范围：P3-1 测试用例可执行性 + BUG-01/BUG-02 代码定位
> 分析方法：代码静态分析，不执行测试，不修复代码

---

## 一、测试用例可执行性分级

基于 P3-1 生成的 60 条测试用例，按 AI 自动执行可行性分为四级：

### ✅ 适合 AI 自动执行（30 条）

| 编号 | 用例 | 理由 |
|------|------|------|
| TC-FUNC-001 | 宠物状态展示 | 检查 DOM 元素和数值 |
| TC-FUNC-002 | 宠物信息展示 | 检查 DOM 元素和数值 |
| TC-FUNC-003 | 背包道具展示 | 检查 DOM 元素和数值 |
| TC-FUNC-004 | 喂食 | 检查操作前后数值变化 |
| TC-FUNC-005 | 清洁 | 检查操作前后数值变化 |
| TC-FUNC-006 | 陪玩 | 检查操作前后数值变化 |
| TC-FUNC-008 | 任务列表展示 | 检查 DOM 元素 |
| TC-FUNC-009 | 打卡 | 检查状态变化 |
| TC-FUNC-010 | 任务状态展示 | 检查 DOM 元素 |
| TC-FUNC-011 | 新增任务 | 检查操作前后列表变化 |
| TC-FUNC-012 | 编辑任务 | 检查操作前后名称变化 |
| TC-FUNC-014 | 开关任务 | 检查列表变化 |
| TC-FUNC-015 | 确认通过 | 检查道具数量变化 |
| TC-FUNC-016 | 驳回 | 检查状态变化 |
| TC-FUNC-017 | 修改宠物名称 | 检查名称变化 |
| TC-FUNC-018 | 成长记录统计 | 检查 DOM 数值 |
| TC-ERR-001 | 空名称校验 | 检查 toast 提示 |
| TC-ERR-004 | 编辑时空名称 | 检查 toast 提示 |
| TC-ERR-005 | 道具不足提示 | 检查 toast 提示 |
| TC-ERR-006 | 重复打卡 | 检查按钮状态 |
| TC-ERR-007 | 重复确认 | 检查道具不重复发放 |
| TC-BOUND-001 | 道具数量边界 | 检查数值变化 |
| TC-BOUND-005 | 空任务列表 | 检查 EmptyState |
| TC-BOUND-006 | 空待确认列表 | 检查 EmptyState |
| TC-PERSIST-001 | 页面切换持久化 | 检查数值一致性 |
| TC-PERSIST-002 | 子页面返回持久化 | 检查数值一致性 |
| TC-NAV-001 | TabBar 切换 | 检查页面渲染 |
| TC-ROLE-001 | 默认角色 | 检查角色状态 |
| TC-UX-006 | 编译无警告 | 检查编译输出 |
| TC-REGRESS-002 | 编译验证 | 检查编译输出 |

### ⚠️ 需要人工辅助（18 条）

| 编号 | 用例 | 原因 |
|------|------|------|
| TC-FUNC-007 | 宠物升级 | 需多次操作构造成长值 |
| TC-FUNC-013 | 删除任务 | 需确认弹窗交互 |
| TC-ERR-002 | 超长名称 | 需验证截断行为 |
| TC-ERR-003 | 特殊字符 | 需验证 XSS 安全性 |
| TC-ERR-008 | 空宠物名称 | 需验证校验行为 |
| TC-BOUND-002 | 状态值上限 | 需构造边界数据 |
| TC-BOUND-003 | 状态值下限 | 需构造边界数据 |
| TC-BOUND-004 | 成长值边界升级 | 需精确控制成长值 |
| TC-PERSIST-003 | 跨日重置 | 需操作 storage |
| TC-PERSIST-004 | 数据修复 | 需操作 storage |
| TC-PERSIST-005 | 数据重置 | 需确认弹窗交互 |
| TC-NAV-002 | 首页→家长待确认 | 需角色切换弹窗 |
| TC-NAV-003 | 待确认→任务管理 | 需页面跳转 |
| TC-NAV-004 | 任务管理→设置 | 需页面跳转 |
| TC-ROLE-002 | child→parent | 需角色切换弹窗 |
| TC-ROLE-003 | parent→child | 需角色切换 |
| TC-ROLE-004 | 角色持久化 | 需多步操作 |
| TC-ROLE-005 | 三个页面返回按钮 | 需遍历页面 |

### ❌ 不建议自动执行（7 条）

| 编号 | 用例 | 原因 |
|------|------|------|
| TC-UX-003 | 升级弹窗动画 | 需视觉判断动画效果 |
| TC-UX-004 | 按钮大小 | 可检查 CSS 但需人工确认实际体验 |
| TC-UX-005 | 颜色一致性 | 需人工视觉对比 |
| TC-BUG-003 | BUG-02 拼音输入复现 | 需模拟中文 IME 行为 |
| TC-BUG-004 | BUG-02 边界探索 | 需模拟中文 IME 行为 |
| TC-REGRESS-001 | 完整业务闭环 | 步骤过多，适合人工端到端测试 |
| TC-REGRESS-003 | Pinia 状态管理 | 可检查但需多页面交互 |

### 🔄 高消耗测试，暂缓执行（5 条）

| 编号 | 用例 | 原因 |
|------|------|------|
| TC-UX-001 | 道具不足引导 | 需先消耗道具到 0 |
| TC-UX-002 | 空状态展示 | 需清空数据 |
| TC-BUG-001 | BUG-01 复现 | 需在 P3-3 中专项执行 |
| TC-BUG-002 | BUG-01 深度复现 | 需在 P3-3 中专项执行 |
| TC-REGRESS-004 | easycom 组件注册 | 编译时已自动验证 |

---

## 二、建议优先执行的低成本测试（10 条）

从 60 条中筛选 10 条低成本、高价值测试，建议在 P3-3 中优先执行：

| 优先级 | 编号 | 用例 | 成本 | 价值 |
|--------|------|------|------|------|
| 1 | TC-FUNC-011 | 新增任务 | 低 | 验证核心 CRUD |
| 2 | TC-FUNC-012 | 编辑任务 | 低 | 直接关联 BUG-01 |
| 3 | TC-FUNC-013 | 删除任务 | 低 | 验证核心 CRUD |
| 4 | TC-ERR-001 | 空名称校验 | 低 | 验证表单校验 |
| 5 | TC-ERR-002 | 超长名称 | 低 | 验证边界行为 |
| 6 | TC-BUG-001 | BUG-01 复现 | 低 | 专项 Bug 验证 |
| 7 | TC-BUG-002 | BUG-01 深度复现 | 中 | 确定 Bug 触发条件 |
| 8 | TC-ERR-005 | 道具不足提示 | 低 | 验证 P2-2 成果 |
| 9 | TC-FUNC-014 | 开关任务 | 低 | 验证核心功能 |
| 10 | TC-FUNC-009 | 打卡 | 低 | 验证核心流程 |

---

## 三、暂缓执行的高消耗测试

### 不建议一次性执行全量 60 条

- 60 条测试中约 30 条涉及多步操作或跨页面交互
- 一次性执行耗时长，且大量测试结果重复（如多个道具使用测试逻辑相同）
- 建议按模块分批执行，优先覆盖核心流程和 Bug 相关用例

### 中文输入法 IME 行为不建议自动化强测

- TC-BUG-003 和 TC-BUG-004 需要模拟中文输入法的 compositionstart/compositionend 事件
- 微信小程序 `<input>` 组件的 IME 行为与 Web 不同，自动化工具难以准确模拟
- 建议以人工复现为主，AI 辅助分析代码层面的风险点

### 视觉一致性测试不建议交给 AI 单独判断

- TC-UX-003（升级弹窗动画）、TC-UX-005（颜色一致性）需要人工视觉判断
- AI 可以检查 CSS 变量引用是否正确，但无法判断实际渲染效果
- 建议编译后人工逐页检查

### 升级触发类测试需要构造数据，暂缓执行

- TC-FUNC-007、TC-BOUND-004 需要精确控制成长值到升级阈值
- 需要多次操作或直接修改 storage 数据
- 建议在 P3-3 中根据需要决定是否执行

---

## 四、BUG-01 代码定位分析

> 问题：编辑打卡任务名称后，保存后不生效

### 4.1 完整数据流追踪

```
用户点击编辑
  ↓
parent/tasks/index.vue L80-83: onEdit(tpl)
  editingTemplate.value = { ...tpl }     ← 浅拷贝模板
  modalVisible.value = true
  ↓
TaskFormModal.vue L118-123: watch(visible)
  resetForm() 被触发
  ↓
TaskFormModal.vue L83-94: resetForm()
  form.value = { name: props.template.name || '', ... }  ← 从 prop 初始化表单
  ↓
用户修改名称（v-model="form.name"）
  ↓
TaskFormModal.vue L96-112: onConfirm()
  emit('confirm', { id, name: form.value.name.trim(), ... })  ← 发出最新数据
  ↓
parent/tasks/index.vue L90-99: onSaveTemplate(formData)
  tasksStore.saveTaskTemplate(formData)  ← 调用 store
  ↓
stores/tasks.js L104-110: saveTaskTemplate(template)
  doSaveTaskTemplate(template)           ← 调用 storage 层
  loadAll()                              ← 重新加载
  ↓
storage.js L325-366: saveTaskTemplate(template)
  const data = getAppData()              ← 获取缓存数据
  const existing = data.taskTemplates.find(t => t.id === template.id)
  Object.assign(existing, { name: template.name.trim(), ... })  ← 原地更新
  ensureDailyTasks(data, data.taskDate)  ← 重新生成每日任务
  writeStorage(data)                     ← 持久化 + 更新 memoryCache
  ↓
stores/tasks.js L38-47: loadAll()
  taskTemplates.value = getTaskTemplates()  ← 从 storage 重新读取
  ↓
parent/tasks/index.vue 模板渲染
  <text class="tpl-name">{{ tpl.name }}</text>  ← 显示更新后的名称
```

### 4.2 逐环节检查

| 环节 | 文件 | 行号 | 检查项 | 结论 |
|------|------|------|--------|------|
| 编辑入口 | parent/tasks/index.vue | L80-83 | `{ ...tpl }` 浅拷贝是否正确 | ✅ 模板字段均为基本类型，浅拷贝安全 |
| 表单初始化 | TaskFormModal.vue | L83-94 | `resetForm()` 是否正确读取 `props.template.name` | ✅ 字段名 `name` 一致 |
| 表单绑定 | TaskFormModal.vue | L12 | `v-model="form.name"` 是否正确绑定 | ✅ 双向绑定 |
| 表单提交 | TaskFormModal.vue | L105-111 | `emit('confirm', ...)` 是否传出 `form.value.name.trim()` | ✅ 正确传出 |
| 父组件接收 | parent/tasks/index.vue | L90-99 | `onSaveTemplate(formData)` 是否接收 `formData.name` | ✅ 透传 |
| Store 调用 | stores/tasks.js | L104-110 | `doSaveTaskTemplate(template)` 传入完整数据 | ✅ |
| Storage 查找 | storage.js | L336 | `data.taskTemplates.find(t => t.id === template.id)` | ✅ 按 id 查找 |
| Storage 更新 | storage.js | L339-344 | `Object.assign(existing, { name: template.name.trim(), ... })` | ✅ 原地更新 |
| 每日任务同步 | storage.js | L363 | `ensureDailyTasks(data, data.taskDate)` | ✅ 同步更新 dailyTasks 中的 name |
| 持久化 | storage.js | L364 | `writeStorage(data)` → `memoryCache = data` | ✅ 缓存和 storage 同步更新 |
| Store 重载 | stores/tasks.js | L107 | `loadAll()` → `getTaskTemplates()` | ✅ 从 storage 重新读取 |
| 模板渲染 | parent/tasks/index.vue | L15 | `{{ tpl.name }}` | ✅ 显示 store 中的 name |

### 4.3 代码层面结论

**通过完整代码追踪，未发现明显的数据流断点或逻辑错误。** 从 `form.name` → `emit` → `store` → `storage` → `writeStorage` → `loadAll` → 模板渲染的整条链路，字段名一致、赋值正确、持久化完整。

### 4.4 可能原因推测

由于代码层面未发现明显 Bug，推测可能原因：

| 可能性 | 推测 | 验证方式 |
|--------|------|----------|
| **A. 间歇性问题** | 特定操作顺序或时序下偶发 | 需人工多次复现，记录操作步骤 |
| **B. 微信 DevTools 缓存** | 开发者工具未刷新 storage 视图 | 在 DevTools Storage 面板手动检查数据 |
| **C. 编辑后未关闭弹窗即判断** | 用户可能在弹窗未关闭时观察列表 | 确认操作步骤：是否等弹窗关闭后才检查 |
| **D. 编辑的是不同任务** | 可能误编辑了其他任务 | 确认编辑前后任务名称和图标 |
| **E. IME 输入未确认** | 拼音输入后未按回车/空格确认，直接点确认按钮 | 这是 BUG-02 的可能关联场景 |

### 4.5 推荐验证方式

1. **最小复现步骤：**
   - 进入家长任务管理页
   - 点击某个任务的 ✎ 编辑按钮
   - 修改任务名称为纯英文/数字（排除 IME 干扰）
   - 点击"确认"
   - 等待弹窗关闭
   - 检查任务卡片名称是否更新

2. **数据验证：**
   - 在微信开发者工具 Storage 面板查看 `pet-checkin-data` 的 `taskTemplates` 数组
   - 确认对应 id 的任务 `name` 字段是否已更新

3. **如果纯英文/数字编辑正常但中文编辑异常：**
   - 则 BUG-01 与 BUG-02 可能有关联
   - 中文输入法的 composition 事件可能导致 `form.name` 在点击确认时未包含最新输入

### 4.6 影响范围

如果 BUG-01 确实存在，影响范围：
- **直接影响：** 家长任务管理页的任务名称显示
- **间接影响：** 孩子任务页的任务名称（因为 `ensureDailyTasks` 会从模板同步 `name`）
- **不影响：** 任务的其他属性（图标、奖励类型、奖励数量）

---

## 五、BUG-02 代码风险分析

> 问题：编辑任务名称时，中文拼音输入过长后输入框疑似失焦/输入中断

### 5.1 输入框代码

```html
<!-- TaskFormModal.vue L12 -->
<input class="input" v-model="form.name" placeholder="例如：刷牙" maxlength="10" />
```

### 5.2 逐项风险检查

| 检查项 | 代码位置 | 分析 | 风险等级 |
|--------|----------|------|----------|
| v-model 绑定 | L12 | `v-model="form.name"` — 标准双向绑定，无额外事件处理 | ✅ 正常 |
| maxlength | L12 | `maxlength="10"` — 限制最大 10 字符 | ⚠️ 中 |
| watch 重置 formData | L118-123 | `watch(() => props.visible, ...)` — 仅在 visible 变化时触发，不影响输入过程 | ✅ 正常 |
| props 变化导致重渲染 | L55-58 | `template` prop 在弹窗打开后不变 | ✅ 正常 |
| key 变化导致重渲染 | — | 组件无 `:key` 绑定，不会因 key 变化重建 | ✅ 正常 |
| v-if 条件渲染 | L2 | `v-if="visible"` — 弹窗打开后 visible 保持 true，不会切换 | ✅ 正常 |
| 父组件状态更新影响 | parent/tasks L90-99 | `onSaveTemplate` 仅在确认时调用，输入过程中不触发 | ✅ 正常 |
| 格式化逻辑 | — | 无 `@input`、`@change` 处理函数，无格式化逻辑 | ✅ 正常 |
| composition 事件处理 | — | **未监听 `@compositionstart` / `@compositionend`** | ⚠️ 高 |

### 5.3 核心风险点

#### 风险 1：`maxlength="10"` + 中文 IME

**这是最可能的原因。** 微信小程序的 `<input>` 组件在处理中文拼音输入时，`maxlength` 限制的是 **输入框中的实际字符数**，但 IME 组合态下的拼音字母也会占用输入框空间。

**场景复现：**
1. 用户输入拼音 "renwumingcheng"（14 个字母）
2. IME 组合态下，输入框中显示拼音字母
3. `maxlength="10"` 可能在组合态下截断输入
4. 导致输入框行为异常（失焦或输入中断）

**这是微信小程序已知的 IME 兼容性问题**，并非应用层代码 Bug。

#### 风险 2：缺少 composition 事件处理

标准 Vue Web 开发中，处理中文输入的标准做法是：

```javascript
// 标准做法（当前代码未实现）
const isComposing = ref(false)

function onCompositionStart() { isComposing.value = true }
function onCompositionEnd(e) { 
  isComposing.value = false
  form.value.name = e.target.value 
}
```

当前代码未处理 composition 事件，完全依赖 `v-model` 的默认行为。在微信小程序环境中，`<input>` 的 `v-model` 对 IME 组合态的处理可能与 Web 不同。

#### 风险 3：`form.value` 整体替换

```javascript
// TaskFormModal.vue L83-94
function resetForm() {
  if (props.template) {
    form.value = {  // ← 整体替换 form.value 对象
      name: props.template.name || '',
      ...
    }
  }
}
```

虽然 `resetForm` 仅在弹窗打开时调用一次，但 `form.value = { ... }` 这种整体替换方式会创建一个全新的响应式对象。如果微信小程序框架在某种边缘情况下重新触发了 `resetForm`（如组件重新挂载），会导致输入内容丢失。

**当前代码中未发现会触发重新 `resetForm` 的路径**，但这是潜在风险点。

### 5.4 是否能仅靠代码确认

| 问题 | 能否仅靠代码确认 | 说明 |
|------|-----------------|------|
| `maxlength` + IME 冲突 | ❌ 不能 | 需要实际测试微信小程序 IME 行为 |
| composition 事件缺失 | ✅ 能确认 | 代码中确实未处理 composition 事件 |
| `form.value` 替换风险 | ✅ 能确认 | 代码中确实使用整体替换 |
| 实际是否触发失焦 | ❌ 不能 | 需要实际测试 |

### 5.5 是否需要人工复现

**需要。** BUG-02 的核心问题（中文 IME 行为）无法通过代码静态分析完全确认。必须由人工在微信开发者工具或真机上进行实际输入测试。

### 5.6 推荐验证方式

1. **确认触发条件：**
   - 在微信开发者工具中打开 TaskFormModal 编辑模式
   - 使用系统中文输入法（拼音）
   - 输入不同长度的拼音：5 字符、10 字符、15 字符、20 字符
   - 记录每次是否触发失焦/中断

2. **对比测试：**
   - 使用纯英文输入相同长度 → 验证是否触发
   - 使用纯中文（复制粘贴）→ 验证是否触发
   - 关闭 `maxlength="10"` → 验证是否触发

3. **确认环境：**
   - 微信开发者工具版本
   - 操作系统和输入法
   - 真机 vs 模拟器

### 5.7 后续修复建议（不执行）

如果确认是 `maxlength` + IME 冲突：

```html
<!-- 方案 A：移除 maxlength，改用 @input 中手动截断 -->
<input 
  class="input" 
  v-model="form.name" 
  placeholder="例如：刷牙"
  @compositionstart="onCompositionStart"
  @compositionend="onCompositionEnd"
/>
```

```javascript
const isComposing = ref(false)
function onCompositionStart() { isComposing.value = true }
function onCompositionEnd(e) {
  isComposing.value = false
  form.value.name = e.detail.value.slice(0, 10)
}
```

如果确认是微信小程序框架层面的问题，则需要在微信开放社区反馈，应用层代码无法完全解决。

---

## 六、P3-3 建议

基于以上分析，建议 P3-3 按以下低成本策略执行：

### 执行范围

| 项目 | 建议 |
|------|------|
| BUG-01 复现 | ✅ **优先执行** — 使用纯英文/数字名称编辑，排除 IME 干扰 |
| BUG-02 复现 | ⚠️ **人工辅助** — AI 提供验证步骤，人工执行输入测试 |
| 全量 60 条测试 | ❌ **不执行** — 仅执行建议的 10 条低成本测试 |
| 代码修复 | ❌ **不修复** — 除非用户确认进入 P3-4 |

### 建议的 P3-3 执行步骤

1. **BUG-01 复现（AI 主导）：**
   - 按 4.5 节的最小复现步骤操作
   - 先使用纯英文名称测试
   - 再使用中文名称测试
   - 对比结果，判断是否与 IME 相关

2. **BUG-02 验证（人工主导）：**
   - AI 输出验证步骤清单
   - 人工在微信开发者工具中执行输入测试
   - 记录触发条件和环境信息
   - AI 根据人工反馈进行代码层面分析

3. **低成本测试执行（AI 主导）：**
   - 执行 10 条建议测试中的 5-6 条
   - 优先覆盖任务 CRUD 和 Bug 相关用例

4. **不执行全量测试、不修复代码**

---

> 分析完成。未修改代码、未修复 Bug、未执行测试。等待人工确认后进入 P3-3。
