#!/usr/bin/env python3
"""极简「代码画图」工具箱：用 Pillow 把结构画成 PNG。

为什么不用浏览器: 当前沙箱禁止 Chrome 需要的命名管道, 无法无头截图。
为什么不用 matplotlib/graphviz: 本机未安装, 且沙箱无外网装不了。
Pillow 是随运行时自带的, 够画卡片/流程/箭头/表格这类"帮助理解"的图。

坐标一律按设计单位 (例如 1280x700) 给, 内部 3 倍超采样再缩小, 边缘才不毛糙。
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = 3  # 超采样倍数
FONT_REG = r"C:\Windows\Fonts\msyh.ttc"      # 微软雅黑
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"   # 微软雅黑 Bold

_fonts: dict[tuple[int, bool], ImageFont.FreeTypeFont] = {}


def font(size: float, bold: bool = False) -> ImageFont.FreeTypeFont:
    key = (int(size * S), bold)
    if key not in _fonts:
        path = FONT_BOLD if bold and Path(FONT_BOLD).exists() else FONT_REG
        _fonts[key] = ImageFont.truetype(path, key[0])
    return _fonts[key]


class Fig:
    def __init__(self, width: int, height: int, bg: str = "#ffffff"):
        self.w, self.h = width, height
        self.img = Image.new("RGB", (width * S, height * S), bg)
        self.d = ImageDraw.Draw(self.img)

    # ---------- primitives ----------
    def _b(self, v: float) -> int:
        return int(round(v * S))

    def rect(self, x, y, w, h, fill=None, outline=None, radius=0, width=1.5):
        box = [self._b(x), self._b(y), self._b(x + w), self._b(y + h)]
        if radius:
            self.d.rounded_rectangle(box, radius=self._b(radius), fill=fill,
                                     outline=outline, width=max(1, self._b(width)))
        else:
            self.d.rectangle(box, fill=fill, outline=outline, width=max(1, self._b(width)))

    def shadow(self, x, y, w, h, radius=14, dy=3, blur=7, opacity=0.10):
        layer = Image.new("RGBA", self.img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.rounded_rectangle([self._b(x), self._b(y + dy), self._b(x + w), self._b(y + h + dy)],
                            radius=self._b(radius), fill=(15, 23, 42, int(255 * opacity)))
        layer = layer.filter(ImageFilter.GaussianBlur(self._b(blur)))
        self.img = Image.alpha_composite(self.img.convert("RGBA"), layer).convert("RGB")
        self.d = ImageDraw.Draw(self.img)

    def line(self, x1, y1, x2, y2, color="#94a3b8", width=1.5):
        self.d.line([self._b(x1), self._b(y1), self._b(x2), self._b(y2)],
                    fill=color, width=max(1, self._b(width)))

    def arrow(self, x1, y1, x2, y2, color="#94a3b8", width=1.6, head=7):
        ang = math.atan2(y2 - y1, x2 - x1)
        bx, by = x2 - head * 0.9 * math.cos(ang), y2 - head * 0.9 * math.sin(ang)
        self.line(x1, y1, bx, by, color, width)
        p1 = (self._b(x2), self._b(y2))
        p2 = (self._b(x2 - head * math.cos(ang - 0.42)), self._b(y2 - head * math.sin(ang - 0.42)))
        p3 = (self._b(x2 - head * math.cos(ang + 0.42)), self._b(y2 - head * math.sin(ang + 0.42)))
        self.d.polygon([p1, p2, p3], fill=color)

    def text(self, x, y, s, size=14, color="#0f172a", bold=False, anchor="lt", spacing=0):
        self.d.text((self._b(x), self._b(y)), s, font=font(size, bold), fill=color, anchor=anchor, spacing=spacing)

    def text_w(self, s, size=14, bold=False) -> float:
        return self.d.textlength(s, font=font(size, bold)) / S

    def pill(self, x, y, label, size=12, fg="#059669", bg="#dcfce7", h=23, padx=13):
        w = self.text_w(label, size, True) + padx * 2
        self.rect(x, y, w, h, fill=bg, radius=h / 2)
        self.text(x + w / 2, y + h / 2 + 0.5, label, size, fg, True, anchor="mm")
        return w

    def dot(self, cx, cy, r, fill):
        self.d.ellipse([self._b(cx - r), self._b(cy - r), self._b(cx + r), self._b(cy + r)], fill=fill)

    def paste(self, im: Image.Image, x: float, y: float, size: float | None = None):
        """在设计坐标处贴一张图（内部按超采样放大）。"""
        if size:
            px = int(size * S)
            im = im.convert("RGB").resize((px, px), Image.LANCZOS)
        self.img.paste(im, (self._b(x), self._b(y)))
        self.d = ImageDraw.Draw(self.img)

    # ---------- export ----------
    def save(self, dst: str | Path):
        dst = Path(dst)
        dst.parent.mkdir(parents=True, exist_ok=True)
        out = self.img.resize((self.w, self.h), Image.LANCZOS)
        out.save(dst, "PNG", optimize=True)
        return dst
