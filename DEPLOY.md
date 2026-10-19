# 部署说明 · 青廉筑梦

站点是**纯静态页面**（HTML + CSS + JS，无后端、无数据库），所以可以放在任何静态托管上，也可以直接双击 `index.html` 打开。

---

## 一、现在就能用的公网地址（临时）

```
https://inter-potatoes-gloves-scholarship.trycloudflare.com
```

这是用 Cloudflare 快速隧道（quick tunnel）把本机 `127.0.0.1:8080` 映射出去得到的地址。

- ✅ 任何人现在就能打开，手机也可以
- ⚠️ **临时**：本机这个进程关掉、电脑关机或休眠，地址立即失效
- ⚠️ 每次重启隧道，域名会变

所以它适合**今天演示、给老师看一眼**，不适合作为结题材料里的长期地址。

---

## 二、永久部署：三种方案

### 方案 A：Gitee Pages（国内访问最快，推荐）

适合：主要给国内老师、同学看。

1. 注册 Gitee 并完成**实名认证**（必需，否则不能开 Pages）
2. 新建仓库，例如 `qinglian-site`，设为**公开**
3. 把 `site/` 里的所有文件上传到仓库根目录（`.html/.css/.js` 都在根目录，不要多套一层文件夹）
4. 仓库 → 服务 → Gitee Pages → 部署分支选 `master`，目录留空 → 启动
5. 得到 `https://你的用户名.gitee.io/qinglian-site`

> 缺点：Gitee Pages 每次更新代码后需要手动点「更新」重新部署；免费版不开 HTTPS 以外的自定义域名。

### 方案 B：GitHub Pages（最省事）

适合：团队已经在用 GitHub，或者不介意国内偶尔慢。

```bash
cd site
git init
git add .
git commit -m "init: 青廉筑梦廉洁知识导航"
git branch -M main
git remote add origin https://github.com/你的用户名/qinglian-site.git
git push -u origin main
```

然后仓库 → Settings → Pages → Source 选 `Deploy from a branch` → `main` / `(root)` → Save。
约 1 分钟后可访问 `https://你的用户名.github.io/qinglian-site/`。

### 方案 C：腾讯云 COS / 阿里云 OSS 静态网站托管

适合：项目有经费、需要自己的域名、要放进结题材料作为正式成果。

1. 开通 COS（对象存储），新建存储桶，权限设为**公有读**
2. 开启「静态网站」功能，默认首页填 `index.html`
3. 上传 `site/` 下所有文件
4. 用默认域名访问（形如 `xxx.cos-website.ap-chengdu.myqcloud.com`）
5. 若绑定自己的域名：国内节点需要**域名备案**

> 另外：Vercel / Netlify 也可以一键拖拽上传，但国内访问不稳定，不建议作为主要地址。

---

## 三、本地预览

```powershell
cd site
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080
```

直接双击 `index.html` 也能用（用的是 hash 路由，不需要服务器）。

---

## 四、怎么改内容

所有文字都在 `assets/js/data.js` 一个文件里，改完刷新即可，不需要构建：

| 变量 | 内容 |
|---|---|
| `SITE` | 项目名、负责人、成员 |
| `DIMS` | 四维描述 |
| `JIU` | 九廉卡片（名称、维度、负责人、周期、摘要） |
| `ARTICLES` | 文章正文（`body` 里用 `{t:'p'|'h2'|'ul'|'callout'|'quote', c:...}` 组织） |
| `FIGURES` | 人物事迹 |
| `SCENARIOS` | 情景实训（决策点、选项、后果、规则依据） |
| `RULES` | 法规制度 |
| `KB` | 廉洁AI 的知识库，`tags` 影响检索命中率 |

改完务必检查引号与逗号，浏览器控制台（F12）会直接报错位置。

---

## 五、目录结构

```
site/
├── index.html              入口与页面骨架
├── assets/
│   ├── css/site.css        全部样式（含响应式）
│   └── js/
│       ├── data.js         内容数据（改这里）
│       ├── ai.js           廉洁AI 检索逻辑
│       └── app.js          路由与视图渲染
└── DEPLOY.md               本文件
```

---

## 六、几点说明

- **无需备案**：使用 `gitee.io` / `github.io` / `trycloudflare.com` 这类平台子域名时不需要备案；绑定自己的域名走国内服务器才需要。
- **没有后端**：廉洁AI 是纯前端检索，不联网、不记录，不存在数据合规问题。这也是设计上的克制——见「数字科技助廉」文章。
- **移动端已适配**：390px 宽度下排版正常。
