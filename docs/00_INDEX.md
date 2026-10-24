# 00 · 文档导航

本文档体系服务于两件事：**版本管理** 与 **人员交接**。

如果你只读一份，读 [01_OVERVIEW](01_OVERVIEW.md)。
如果你要改内容，读 [05_CONTENT_GUIDE](05_CONTENT_GUIDE.md)。
如果你要接手代码，按 02 → 03 → 04 的顺序读。

---

## 阅读路径

### 路径 A：我是新加入的成员（30 分钟）

1. [01_OVERVIEW](01_OVERVIEW.md) —— 项目是什么、现在到哪一步
2. [08_PROJECT_PLAN](08_PROJECT_PLAN.md) —— 九廉任务与时间节点
3. [05_CONTENT_GUIDE](05_CONTENT_GUIDE.md) —— 我能改什么、怎么改

### 路径 B：我要接手技术维护（1 小时）

1. [02_ARCHITECTURE](02_ARCHITECTURE.md) —— 整体骨架
2. [03_MODULE_DESIGN](03_MODULE_DESIGN.md) —— 四个文件各管什么
3. [04_DATA_SPEC](04_DATA_SPEC.md) —— 数据结构
4. [06_DEPLOYMENT](06_DEPLOYMENT.md) —— 怎么发布
5. [09_KNOWN_ISSUES](09_KNOWN_ISSUES.md) —— 别踩的坑

### 路径 C：我是现场值班（10 分钟）

1. [07_KIOSK_RUNBOOK](07_KIOSK_RUNBOOK.md) —— 开机、退出、故障处理
2. [09_KNOWN_ISSUES](09_KNOWN_ISSUES.md) 的"现场问题"一节

---

## 全部文档

| 编号 | 文档 | 一句话 |
|---|---|---|
| 00 | 本文 | 导航 |
| 01 | OVERVIEW | 项目背景与交付范围 |
| 02 | ARCHITECTURE | 系统架构与三条访问路径 |
| 03 | MODULE_DESIGN | 四个模块的职责 |
| 04 | DATA_SPEC | 数据结构与字段规范 |
| 05 | CONTENT_GUIDE | 内容编辑操作手册 |
| 06 | DEPLOYMENT | 部署、发布、回滚 |
| 07 | KIOSK_RUNBOOK | 馆内导览运行手册 |
| 08 | PROJECT_PLAN | 九廉任务与阶段计划 |
| 09 | KNOWN_ISSUES | 已知限制 |
| 10 | CHANGELOG | 版本记录 |

---

## 文档维护规则

1. 改代码必须同步改对应文档，否则视为未完成
2. 每次发布在 [10_CHANGELOG](10_CHANGELOG.md) 增加一条
3. 文档编号不复用；废弃文档标记"已废弃"而不是删除
