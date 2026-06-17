# P3-3 已知 BUG 复现验证报告

> 生成日期：2026-06-16
> 基于版本：v1.8.1
> 验证方式：人工在微信开发者工具中操作 + AI 代码静态分析
> 验证范围：BUG-01（任务模板编辑后 dailyTasks 未同步）、BUG-02（拼音输入被 maxlength 截断）

---

## 一、BUG-01 复现验证

### 1.1 原始描述

> 编辑打卡任务名称后，保存后不生效

### 1.2 修正后描述

> 任务模板 taskTemplates 修改成功，但已生成的每日任务 dailyTasks 未同步更新，导致其他页面展示仍使用旧数据。

### 1.3 复现步骤

| 步骤 | 操作 | 结果 |
|------|------|------|
| 1 | 进入家长任务管理页 | 正常 |
| 2 | 点击某任务的 ✎ 编辑按钮 | 弹窗打开，显示当前名称 |
| 3 | 修改任务名称为 `test123`（纯英文） | 输入框显示 `test123` |
| 4 | 点击「确认」 | 弹窗关闭 |
| 5 | 观察家长任务管理页任务卡片 | ✅ 名称更新为 `test123` |
| 6 | 切换到「任务」Tab | ❌ 任务名称仍为旧名称 |
| 7 | 切换到「首页」 | ❌ 首页相关展示仍为旧名称 |
| 8 | 重新编译并运行 | ❌ 现象仍存在 |

### 1.4 额外发现

修改任务奖励数量也存在同样问题：奖励数量从 1 改为 3 后，只在家长任务管理页生效，其他页面仍不生效。

### 1.5 影响字段

| 字段 | 模板更新 | dailyTask 同步 | 影响 |
|------|----------|----------------|------|
| name | ✅ | ❌ | 孩子任务页/首页显示旧名称 |
| rewardAmount | ✅ | ❌ | 孩子任务页显示旧奖励数量 |
| icon | ✅ | ❌ | 孩子任务页显示旧图标 |
| rewardType | ✅ | ❌ | 孩子任务页显示旧奖励类型 |

### 1.6 根因定位

**文件：** `frontend/src/services/storage.js`

**函数：** `ensureDailyTasks(data, today)` [L96-125](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/frontend/src/services/storage.js#L96-L125)

**问题代码：** [L110-112](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/frontend/src/services/storage.js#L110-L112)

```javascript
data.dailyTasks = enabledTemplates.map((tpl) => {
    const existing = existingMap[tpl.id]
    if (existing) return existing  // ← BUG：直接返回旧 dailyTask，不更新 name/icon/rewardType/rewardAmount
    return {
      id: `d_${tpl.id}_${today}`,
      templateId: tpl.id,
      taskDate: today,
      name: tpl.name,        // ← 只有新任务才从模板读取
      icon: tpl.icon,
      rewardType: tpl.rewardType,
      rewardAmount: tpl.rewardAmount,
      status: 'pending'
    }
  })
```

**调用链：**

```
saveTaskTemplate(template)
  → Object.assign(existing, { name, icon, rewardType, rewardAmount })  // 模板更新 ✅
  → ensureDailyTasks(data, data.taskDate)
    → 遍历模板，发现已有 dailyTask
    → return existing  // 返回旧对象，不更新字段 ❌
  → writeStorage(data)  // 持久化的是旧 dailyTask ❌
```

**结论：** `ensureDailyTasks` 在遇到已存在的 dailyTask 时直接返回旧对象，不从模板同步更新 `name`/`icon`/`rewardType`/`rewardAmount`。模板更新成功（所以任务管理页正确），但 dailyTask 未同步（所以其他页面显示旧数据）。

### 1.7 复现结论

| 项目 | 结果 |
|------|------|
| 是否复现 | ✅ **已复现** |
| 复现概率 | 100%（每次编辑模板后，已存在的 dailyTask 都不会同步） |
| 根因 | `ensureDailyTasks` L112 `return existing` 不更新已存在 dailyTask 的字段 |
| 严重程度 | 中（功能可用但数据不一致，跨日后自动修复） |

---

## 二、BUG-02 复现验证

### 2.1 原始描述

> 编辑任务名称时，中文拼音输入过长后输入框疑似失焦/输入中断

### 2.2 修正后描述

> 编辑任务名称时，使用中文拼音输入法，拼音组合态字符被 `maxlength="10"` 计入限制，导致输入被截断/中断。

### 2.3 复现步骤

| 步骤 | 操作 | 结果 |
|------|------|------|
| 1 | 在家长任务管理页，点击 ✎ 编辑某任务 | 弹窗打开 |
| 2 | 使用系统中文输入法（拼音），输入较长拼音 | 拼音组合态字符达到一定长度后无法继续输入 |
| 3 | 尝试输入超过 10 个拼音字母 | 输入被截断/中断 |

### 2.4 根因定位

**文件：** `frontend/src/components/TaskFormModal.vue`

**问题代码：** [L12](file:///Users/zs/Desktop/Trae_实验室/宠物打卡/frontend/src/components/TaskFormModal.vue#L12)

```html
<input class="input" v-model="form.name" placeholder="例如：刷牙" maxlength="10" />
```

**根因：** 微信小程序 `<input>` 组件的 `maxlength` 属性在中文 IME 组合态下，会将拼音字母也计入字符数限制。当用户输入拼音如 `ceshirenwumingcheng`（18 个字母）时，即使最终只对应 6 个中文字符，`maxlength="10"` 也会在拼音字母达到 10 个时截断输入。

**代码层面缺失：** 未监听 `@compositionstart` / `@compositionend` 事件，无法在 IME 组合态期间绕过 `maxlength` 限制。

### 2.5 复现结论

| 项目 | 结果 |
|------|------|
| 是否复现 | ✅ **已复现** |
| 复现概率 | 100%（拼音输入超过 10 个字母时必然触发） |
| 根因 | `maxlength="10"` 在 IME 组合态下计入拼音字母 |
| 严重程度 | 低（仅影响编辑任务名称时的输入体验，任务名称通常较短） |

---

## 三、BUG-01 与 BUG-02 关联分析

| 维度 | BUG-01 | BUG-02 |
|------|--------|--------|
| 关联性 | 如果用户因 BUG-02 输入中断，可能误以为名称已修改并点击确认，但实际名称未变更 | BUG-02 可能导致用户无法完整输入新名称 |
| 独立性 | BUG-01 即使纯英文输入也存在（dailyTasks 不同步） | BUG-02 仅影响中文拼音输入体验 |
| 修复优先级 | 高（数据不一致） | 中（输入体验） |

**结论：两个 BUG 独立存在，但 BUG-02 可能加剧 BUG-01 的用户感知。**

---

## 四、P3-3 总结

| 项目 | 结果 |
|------|------|
| BUG-01 是否复现 | ✅ 已复现 |
| BUG-01 准确现象 | 模板更新成功，dailyTasks 未同步 |
| BUG-01 根因 | `ensureDailyTasks` L112 不更新已存在 dailyTask 字段 |
| BUG-02 是否复现 | ✅ 已复现 |
| BUG-02 准确现象 | 拼音输入被 `maxlength="10"` 截断 |
| BUG-02 根因 | 微信小程序 IME 组合态下 maxlength 计入拼音字母 |
| 本次是否修改代码 | ❌ 否 |
| 是否执行自动化测试 | ❌ 否 |
| 是否建议进入 P3-4 | ✅ **是** — 两个 BUG 均已复现，根因明确，可进入修复方案阶段 |

---

## 五、P3-4 建议

### BUG-01 修复方向

在 `ensureDailyTasks` 中，对已存在的 dailyTask 从模板同步更新字段：

```javascript
// 当前代码
if (existing) return existing

// 建议修改为
if (existing) {
  existing.name = tpl.name
  existing.icon = tpl.icon
  existing.rewardType = tpl.rewardType
  existing.rewardAmount = tpl.rewardAmount
  return existing
}
```

### BUG-02 修复方向

方案 A：移除 `maxlength="10"`，改用 `@input` 事件手动截断（需处理 composition 事件）
方案 B：保留 `maxlength`，在 `onConfirm` 中校验长度（简单但输入体验不变）
方案 C：增加 `maxlength` 到 20，降低触发概率（折中方案）

---

> 复现验证完成。未修改代码、未修复 Bug。建议进入 P3-4 修复方案阶段。
