# 青廉筑梦 · 廉洁知识导航

> 基于廉洁教育馆的大学生廉洁品格全周期涵养体系 —— 数字平台部分

**在线地址**：<https://ybjcsu0429.github.io/qinglian-site/>

中南大学 · 大学生创新创业训练计划项目　｜　2026.8 — 2027.3

---

## 这是什么

把《学生执行计划（四维九廉任务版）》与《情景实训悟廉 实施材料汇编》两份文档中的内容，
转成一个**任何人都能打开、现场设备能稳定运行、后续成员能持续更新**的数字入口。

- **手机 / 电脑**：扫码或直接访问线上地址
- **馆内触摸屏**：读取本地文件，**断网可用**，开机自动全屏
- **廉洁AI**：51 条带出处的知识条目，检索式问答，不做自由生成

---

## 目录结构

```
.
├── index.html              # 网站入口（必须在根目录，否则 GitHub Pages 失效）
├── assets/                 # 网站资源
│   ├── css/site.css        # 全部样式
│   ├── js/data.js          # ★ 全部内容都在这里（改内容只动这个文件）
│   ├── js/app.js           # 路由与页面渲染
│   ├── js/ai.js            # 廉洁AI 的检索逻辑
│   └── img/qr.png          # 站内二维码
├── kiosk/                  # 馆内导览机脚本（启动、自启、停止）
├── docs/                   # 技术文档（见下方索引）
├── tools/                  # 生成脚本（二维码、立牌、Word 材料）
├── materials/              # 交付物（Word 报告、二维码、立牌）
└── references/             # 参考资料说明（原始 docx 不入库）
```

---

## 快速开始

**本地预览**（不用装任何东西）：

```bash
# 直接双击 index.html 即可；或用本地服务器
python -m http.server 8080
```

**修改内容**：编辑 `assets/js/data.js`，刷新页面即可生效。详见 [docs/05_CONTENT_GUIDE.md](docs/05_CONTENT_GUIDE.md)。

**发布更新**：

```bash
git add -A
git commit -m "更新说明"
git -c http.proxy=http://127.0.0.1:7892 push github master
```

推送后 1–2 分钟，线上自动更新。

---

## 文档索引

| 文档 | 内容 | 读者 |
|---|---|---|
| [00_INDEX](docs/00_INDEX.md) | 文档导航与阅读顺序 | 所有人 |
| [01_OVERVIEW](docs/01_OVERVIEW.md) | 项目背景、四维九廉、交付范围 | 新成员、评审 |
| [02_ARCHITECTURE](docs/02_ARCHITECTURE.md) | 系统架构、三条访问路径 | 接手开发者 |
| [03_MODULE_DESIGN](docs/03_MODULE_DESIGN.md) | 四个模块的职责与调用关系 | 接手开发者 |
| [04_DATA_SPEC](docs/04_DATA_SPEC.md) | 数据结构与字段规范 | 改内容的人 |
| [05_CONTENT_GUIDE](docs/05_CONTENT_GUIDE.md) | 怎么加文章、改文案 | 内容成员 |
| [06_DEPLOYMENT](docs/06_DEPLOYMENT.md) | 部署、发布、回滚 | 维护者 |
| [07_KIOSK_RUNBOOK](docs/07_KIOSK_RUNBOOK.md) | 馆内设备运行与故障处理 | 现场值班 |
| [08_PROJECT_PLAN](docs/08_PROJECT_PLAN.md) | 九廉任务与阶段计划 | 项目组 |
| [09_KNOWN_ISSUES](docs/09_KNOWN_ISSUES.md) | 已知限制与不打算做的事 | 所有人 |
| [10_CHANGELOG](docs/10_CHANGELOG.md) | 版本变更记录 | 所有人 |

---

## 三条设计原则

1. **零依赖** —— 纯 HTML/CSS/JS，无框架、无构建、无数据库；十年后仍能打开。
2. **可核查** —— 廉洁AI 只检索不生成，每条回答都附出处。
3. **可迁移** —— 整个目录可拷到任何静态托管，不改一行代码。

详见 [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md)。

---

## 维护约定

- 改内容前先备份 `data.js`
- 每完成一项"廉"，新增一页，不要攒到结题
- 版本变更写入 [10_CHANGELOG](docs/10_CHANGELOG.md)
- 遇到问题先查 [09_KNOWN_ISSUES](docs/09_KNOWN_ISSUES.md)
