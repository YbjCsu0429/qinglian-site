#!/usr/bin/env python3
"""生成参观二维码与展台立牌。

用法:
    python tools/make_qr.py https://your-site.example.com
    python tools/make_qr.py https://xxx.gitee.io/qinglian --name 青廉筑梦 · 廉洁知识导航

输出:
    out/qr-code.png      纯二维码（透明背景留白）
    out/立牌-A5.png      可打印的 A5 立牌（300dpi 设计稿，按 A5 打印即可）
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import segno
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fig as F  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
INK = "#0e1a24"
MUTED = "#6c7883"
QING = "#0f6b5f"
ZHU = "#a8322d"
LINE = "#e2ddd0"


def make_qr(url: str, dst: Path, scale: int = 16) -> Path:
    qr = segno.make(url, error="h")
    qr.save(dst, scale=scale, border=4, dark="#0e1a24", light="#ffffff")
    return dst


def make_poster(qr_png: Path, url: str, dst: Path, title: str) -> Path:
    # A5 竖版，150dpi 设计稿（874 × 1240），内部 3 倍超采样
    W, H = 874, 1240
    f = F.Fig(W, H, "#fbfaf6")

    # 顶部墨色区块
    f.rect(0, 0, W, 250, fill=INK)
    f.rect(64, 64, 54, 54, fill=ZHU, radius=9)
    f.text(91, 91, "廉", 30, "#ffffff", True, anchor="mm")
    f.text(136, 62, "青廉筑梦", 26, "#ffffff", True)
    f.text(136, 98, "廉洁知识导航", 13, "#7fd4c6")

    f.text(64, 150, title, 27, "#ffffff", True)
    f.text(64, 194, "扫码进入 · 手机也能看", 15, "#9fb3bf")

    # 二维码卡片
    f.shadow(118, 300, 638, 640, radius=18, opacity=0.10)
    f.rect(118, 300, 638, 640, fill="#ffffff", outline=LINE, radius=18)
    f.paste(Image.open(qr_png), 187, 340, size=500)

    f.text(437, 866, "微信 / 相机 扫一扫", 16, MUTED, anchor="mm")

    # 三步说明
    steps = [
        ("01", "扫码", "用手机相机或微信扫描二维码"),
        ("02", "进入", "打开「廉洁知识导航」首页"),
        ("03", "参观", "读文章 · 做情景判断 · 问廉洁AI"),
    ]
    y = 962
    for no, name, desc in steps:
        f.dot(76, y + 9, 4, QING)
        f.text(96, y, f"{name}", 16, INK, True)
        f.text(150, y + 1, desc, 14, MUTED)
        y += 46

    # 底部
    f.line(64, 1096, W - 64, 1096, LINE, 1.2)
    f.text(64, 1116, "中南大学 · 大学生创新创业训练计划项目", 12, MUTED)
    f.text(64, 1140, "青“廉”筑梦——基于廉洁教育馆的大学生廉洁品格全周期涵养体系", 11.5, MUTED)
    f.text(64, 1176, url.replace("https://", "").replace("http://", ""), 10.5, "#9aa4ac")

    return f.save(dst)


def install_into_site(qr_png: Path, url: str) -> None:
    """把二维码放进站点，并写入 data.js 的 qrUrl。"""
    import re
    import shutil

    img_dir = ROOT / "site" / "assets" / "img"
    img_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(qr_png, img_dir / "qr.png")

    data = ROOT / "site" / "assets" / "js" / "data.js"
    text = data.read_text(encoding="utf-8")
    text = re.sub(r"qrUrl:\s*'[^']*'", f"qrUrl: '{url}'", text, count=1)
    data.write_text(text, encoding="utf-8")
    print(f"OK  installed into site (qr.png + data.js qrUrl)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("url", help="网站公网地址，例如 https://xxx.gitee.io/qinglian")
    ap.add_argument("--title", default="廉洁知识导航", help="立牌主标题")
    ap.add_argument("--out-dir", type=Path, default=ROOT / "out")
    ap.add_argument("--install", action="store_true", help="同时写入站点（首页与导览欢迎页显示二维码）")
    a = ap.parse_args()

    out = a.out_dir
    out.mkdir(parents=True, exist_ok=True)
    qr_png = make_qr(a.url, out / "qr-code.png")
    print(f"OK  {qr_png}")

    poster = make_poster(qr_png, a.url, out / "立牌-A5.png", a.title)
    print(f"OK  {poster}")

    if a.install:
        install_into_site(qr_png, a.url)


if __name__ == "__main__":
    main()
