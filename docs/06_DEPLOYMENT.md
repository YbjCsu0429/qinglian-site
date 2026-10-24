# 06 · 部署与发布

网站是**纯静态页面**，可放在任何静态托管上，也可直接双击 `index.html` 打开。
当前使用 **GitHub Pages**。

---

## 1. 当前部署状态

| 项 | 值 |
|---|---|
| 线上地址 | <https://ybjcsu0429.github.io/qinglian-site/> |
| 代码仓库 | <https://github.com/YbjCsu0429/qinglian-site> |
| 托管方式 | GitHub Pages（免费、无需备案、无需续费） |
| 部署分支 | `master`，目录 `/`（根目录） |
| 本地源文件 | `site/`（工作区） |
| 部署副本 | `gitee-deploy/`（推送在此执行） |

> **关键**：`index.html` 必须在仓库根目录。若移入子目录，Pages 会失效。

---

## 2. 发布更新（最常用）

```powershell
# 1. 把 site/ 的改动同步到部署副本
Copy-Item "<工作区>\site\*" "<工作区>\gitee-deploy\" -Recurse -Force

# 2. 提交并推送
cd "<工作区>\gitee-deploy"
git add -A
git commit -m "更新说明"
git -c http.proxy=http://127.0.0.1:7892 push github master
```

**为什么要带 `-c http.proxy`**：本机开着系统代理（`127.0.0.1:7892`），
但 **git 不读系统代理**，不加这个参数会 `Connection was reset`。

推送成功后 1–2 分钟，线上自动更新。可用下面命令确认：

```powershell
curl.exe -s -o NUL -w "%{http_code}" https://ybjcsu0429.github.io/qinglian-site/
```

`200` 即正常。

---

## 3. 本地预览

```powershell
cd site
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080
```

直接双击 `index.html` 也可以（用的是哈希路由，不依赖服务器）。

---

## 4. 回滚

### 回到上一个版本

```powershell
git log --oneline -5          # 找到目标提交
git revert <commit>           # 生成一个反向提交（推荐，保留历史）
# 或
git reset --hard <commit>     # 强制回退（谨慎，会丢历史）
git -c http.proxy=http://127.0.0.1:7892 push github master --force
```

### 单个文件回到旧版

```powershell
git checkout <commit> -- assets/js/data.js
```

---

## 5. 凭据

推送需要 GitHub 令牌，存放在：

```
.cache/gh_token.txt        明文令牌（40 位）
.cache/git-credentials     git 读取的凭据文件
```

**令牌永不过期**，但只存在本机。换电脑需重新生成：

1. <https://github.com/settings/tokens> → Generate new token (classic)
2. 勾选 `repo`，期限选 No expiration
3. 复制令牌，替换上面两个文件的内容

**安全提示**：令牌等于仓库写权限。不要发人、不要提交进仓库。
怀疑泄露立刻在 GitHub 上 Delete。

---

## 6. 换托管平台

不需要改任何代码。可选方案：

| 平台 | 费用 | 国内速度 | 备注 |
|---|---|---|---|
| GitHub Pages | 免费 | 一般（约 1 秒） | 当前使用 |
| 腾讯云 COS / EdgeOne | 几元/月 | 快 | 需实名 |
| Cloudflare Pages | 免费 | 不稳定 | 需账号 |
| Vercel / Netlify | 免费 | 一般 | 需账号 |

**不要用**：Cloudflare 快速隧道（几小时失效）、Gitee Pages（个人版已关闭）。

### 换平台后的三件事

1. 更新 `assets/js/data.js` 里的 `qrUrl`
2. 重新生成二维码：`python tools/make_qr.py <新地址> --install`
3. 重新打印立牌

---

## 7. 二维码更新

```powershell
python tools/make_qr.py https://新地址 --install
```

这条命令会：

- 生成 `qr-code.png`（纯二维码）
- 生成 `立牌-A5.png`（可打印）
- 覆盖 `assets/img/qr.png`
- 把新地址写进 `data.js` 的 `qrUrl`

**生成后必须验证**（用手机扫一次，或解码器确认）。

---

## 8. 故障排查

| 现象 | 原因 | 处理 |
|---|---|---|
| 推送报 `Connection was reset` | 未带代理参数 | 加 `-c http.proxy=...` |
| 推送报 `403` | 令牌无 `repo` 权限 | 重新生成令牌，勾选 repo |
| 推送报 `401` | 令牌失效 | 重新生成 |
| 推送成功但线上没变 | Pages 构建中 / 缓存 | 等 2 分钟，`Ctrl+F5` |
| 线上 404 | `index.html` 不在根目录 | 检查仓库结构 |
| 页面全白 | JS 报错 | `F12` 看控制台 |

详细方案见 [09_KNOWN_ISSUES](09_KNOWN_ISSUES.md)。
