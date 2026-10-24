# tools · 生成脚本

这些脚本**不参与网站运行**，只在本地生成物料时使用。
运行环境：Python 3.10+，依赖 `Pillow`、`segno`、`python-docx`。

---

## make_qr.py —— 二维码与立牌

```bash
python tools/make_qr.py https://ybjcsu0429.github.io/qinglian-site/ --install
```

| 参数 | 说明 |
|---|---|
| `<url>` | 必填，网站地址 |
| `--install` | 同时写入站点（覆盖 `assets/img/qr.png` 并更新 `data.js` 的 `qrUrl`） |
| `--out-dir` | 输出目录，默认 `out/` |
| `--title` | 立牌主标题 |

**输出**：

- `qr-code.png` —— 纯二维码
- `立牌-A5.png` —— 可打印的 A5 立牌

**更换域名后必须重新执行一次**，否则二维码指向旧地址。

---

## fig.py —— 画图工具库

被 `make_qr.py` 调用，提供圆角卡片、文字、印章、阴影等绘图函数。

基于 Pillow，内部 3 倍超采样后缩放，保证边缘不毛糙。

**不单独运行。**

---

## build_report_docx.py —— 生成阶段报告

```bash
python tools/build_report_docx.py
```

生成《阶段任务完成情况报告》，输出到 `out/`。

修改报告内容时，直接改脚本里的文字，重新运行即可——比在 Word 里改格式更可控。

---

## 注意事项

- 脚本中的路径是 Windows 绝对路径，换电脑需修改
- `make_qr.py --install` 会**直接改写** `data.js`，执行前建议先备份
- 生成的图片建议人工检查一次（二维码可能因尺寸过小扫不出）
