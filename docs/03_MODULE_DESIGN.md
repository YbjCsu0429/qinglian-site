# 03 · 模块设计

全站只有 **4 个源文件 + 1 个入口**，职责划分如下。

---

## 模块总览

| 模块 | 文件 | 职责 | 行数（约） |
|---|---|---|---|
| 入口 | `index.html` | 页面骨架、导航、搜索层 | 90 |
| 内容 | `assets/js/data.js` | 所有文字数据 | 660 |
| 视图 | `assets/js/app.js` | 路由、渲染、事件绑定 | 700 |
| 检索 | `assets/js/ai.js` | 廉洁AI 的匹配算法 | 120 |
| 样式 | `assets/css/site.css` | 全部视觉规则 | 900 |

**依赖方向是单向的**：

```
data.js  ←  app.js  →  ai.js
              │
           index.html
              │
           site.css
```

`data.js` 不依赖任何东西；`app.js` 依赖 data 和 ai；`ai.js` 只依赖 data（通过全局 `KB`）。

---

## 1. `index.html` —— 入口与骨架

### 职责

- 定义页面结构：`header` / `main#view` / `footer` / `searchOverlay`
- 按顺序加载三个 JS 文件
- **不含任何正文内容**

### 关键约定

| 元素 | 用途 | 不可改名 |
|---|---|---|
| `#view` | 所有页面渲染到这里 | ✅ |
| `#nav` | 顶部导航 | ✅ |
| `#searchOverlay` | 搜索层 | ✅ |
| `#searchInput` | 搜索输入框 | ✅ |

### 为什么内容不写在 HTML 里

如果每个页面一个 HTML 文件，加一篇文章就要新建文件、改导航、改列表——三处容易漏。
现在内容集中在 `data.js`，加文章只动一处。

---

## 2. `assets/js/data.js` —— 内容层

### 职责

存放全部数据，**不包含任何逻辑**。

### 导出的全局常量

| 常量 | 内容 | 被谁使用 |
|---|---|---|
| `SITE` | 项目信息、二维码地址 | `app.js`（页脚、二维码区） |
| `DIMS` | 四维描述 | `app.js`（首页） |
| `JIU` | 九廉卡片 | `app.js`（首页） |
| `ARTICLES` | 文章（含正文块） | `app.js`、搜索 |
| `FIGURES` | 人物事迹 | `app.js`、搜索 |
| `SCENARIOS` | 情景脚本 | `app.js`、搜索 |
| `RULES` | 法规制度 | `app.js`、搜索 |
| `KB` | 知识条目 | `ai.js`（检索）、搜索 |

字段定义见 [04_DATA_SPEC](04_DATA_SPEC.md)。

### 修改风险

`data.js` 是纯 JavaScript 对象字面量，**少一个逗号整站白屏**。
改之前必须备份，改完必须刷新验证。

---

## 3. `assets/js/app.js` —— 视图层

### 职责

1. **路由**：解析 `location.hash`，决定渲染哪个页面
2. **渲染**：把数据变成 HTML 字符串
3. **交互**：绑定筛选、折叠、情景选择、搜索等事件

### 内部结构

```
工具函数        esc / byId / parseHash / setNav
视图函数        viewHome / viewLibrary / viewArticle / viewFigures
                viewScenarioList / viewScenario / viewRules / viewAI / viewAbout
交互绑定        bindLibrary / bindRules / bindScenario / bindAI / initKiosk
搜索            SEARCH_INDEX / doSearch / openSearch
启动            render()（入口）
```

### 路由表

| hash | 视图 | 说明 |
|---|---|---|
| `#/home` | `viewHome` | 首页 |
| `#/library` | `viewLibrary` | 知识库（支持 `?dim=` 筛选） |
| `#/article/:id` | `viewArticle` | 文章详情 |
| `#/figures` | `viewFigures` | 人物事迹 |
| `#/scenario` | `viewScenarioList` | 情景列表 |
| `#/scenario/:id` | `viewScenario` | 情景互动 |
| `#/rules` | `viewRules` | 法规制度 |
| `#/ai` | `viewAI` | 廉洁AI |
| `#/about` | `viewAbout` | 关于项目 |

### 扩展点：新增一个页面

1. 写 `viewXxx()` 返回 HTML 字符串
2. 在 `render()` 里增加一个 `else if`
3. 在 `index.html` 的导航里加一个链接
4. 在 `setNav()` 的标题映射里加一项

---

## 4. `assets/js/ai.js` —— 检索层

### 职责

把用户问题切成关键词，在 `KB` 中做加权匹配，返回最相关的一条并附出处。

**不做任何生成。** 答案文本直接来自 `KB` 条目。

### 算法

```
1. 分词：中文按 1/2/3 字切片，拉丁词按空格切
2. 去停用词（的、是、什么、怎么……）
3. 打分：命中 tags ×6，命中问题 ×3，命中答案 ×1.2
4. 长度归一化，避免长条目通吃
5. 取最高分；低于阈值 5 则返回"没找到"
```

### 局限

- 同义表述不识别（问"红包"能中，问"礼金"可能不中）
- 不做多轮对话
- 阈值固定，无法自适应

改进方式：扩充 `KB` 的 `tags`，比改算法更有效。

---

## 5. `assets/css/site.css` —— 样式层

### 结构

```
:root           设计变量（颜色、字体、阴影、圆角）
基础重置
header / hero / section / 卡片 / 文章 / 情景 / 法规 / AI / 搜索 / 页脚
响应式断点：1080px / 680px
kiosk 覆盖：body.kiosk 下放大字号与点击区
```

### 设计变量

| 变量 | 值 | 用途 |
|---|---|---|
| `--ink` | `#0e1a24` | 主文字 |
| `--paper` | `#fbfaf6` | 背景 |
| `--qing` | `#0f6b5f` | 主色（青） |
| `--zhu` | `#a8322d` | 强调（朱，印章色） |
| `--serif` | 宋体族 | 标题 |
| `--sans` | 苹方/微软雅黑 | 正文 |

**改配色只需改 `:root` 里的变量**，不要逐条改选择器。

---

## 6. `kiosk/` —— 导览脚本

| 文件 | 职责 |
|---|---|
| `启动导览.bat` | 双击入口（调用 vbs 隐藏窗口） |
| `start-kiosk.vbs` | 无窗口启动 PowerShell |
| `start-kiosk.ps1` | 找浏览器、设置电源、循环启动 |
| `停止导览.bat` | 创建停止标记 + 结束浏览器 |
| `1-安装开机自启.bat` | 在启动文件夹创建快捷方式 |

详见 [07_KIOSK_RUNBOOK](07_KIOSK_RUNBOOK.md)。

---

## 7. `tools/` —— 生成脚本

| 脚本 | 用途 | 依赖 |
|---|---|---|
| `make_qr.py` | 生成二维码与 A5 立牌，可写回站点 | segno、Pillow |
| `fig.py` | 画图工具库（卡片、文字、箭头） | Pillow |
| `build_report_docx.py` | 生成阶段报告 Word | python-docx |

**这些脚本不参与网站运行**，只在本地生成物料时使用。
