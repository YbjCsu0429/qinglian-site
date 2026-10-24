#!/usr/bin/env python3
"""生成《青"廉"筑梦 · 阶段任务完成情况报告》Word 文档（含封面与汇报提纲）。"""

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

INK = RGBColor(0x1A, 0x1A, 0x1A)
GRAY = RGBColor(0x5A, 0x5A, 0x5A)
LIGHT = RGBColor(0x8A, 0x8A, 0x8A)
ACCENT = RGBColor(0x0F, 0x4B, 0x42)

doc = Document()

sec = doc.sections[0]
sec.page_width = Cm(21.0)
sec.page_height = Cm(29.7)
sec.left_margin = Cm(2.8)
sec.right_margin = Cm(2.8)
sec.top_margin = Cm(2.6)
sec.bottom_margin = Cm(2.5)


def set_font(run, name="宋体", size=12, bold=False, color=INK):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = rpr.makeelement(qn("w:rFonts"), {})
        rpr.append(rfonts)
    rfonts.set(qn("w:eastAsia"), name)
    rfonts.set(qn("w:ascii"), name)
    rfonts.set(qn("w:hAnsi"), name)


def para(text, size=12, bold=False, font="宋体", color=INK,
         align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6,
         first_indent=True, line=1.45):
    p = doc.add_paragraph()
    p.alignment = align
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line
    if first_indent:
        pf.first_line_indent = Pt(size * 2)
    r = p.add_run(text)
    set_font(r, font, size, bold, color)
    return p


def heading(text, level=1):
    sizes = {1: 15, 2: 13}
    before = {1: 16, 2: 10}
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before[level])
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, "黑体", sizes[level], True, ACCENT)
    return p


def bullet(text, size=11):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Pt(18)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.45
    r0 = p.add_run("· ")
    set_font(r0, "宋体", size, False, ACCENT)
    r = p.add_run(text)
    set_font(r, "宋体", size, False, INK)
    return p


def label_para(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.space_before = Pt(6)
    r = p.add_run(text)
    set_font(r, "黑体", 11.5, True, INK)
    return p

def table(headers, rows, widths=None, font_size=9.5):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False

    tblPr = t._tbl.tblPr
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)

    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ""
        p = hdr[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.space_before = Pt(2)
        r = p.add_run(h)
        set_font(r, "黑体", font_size, True, RGBColor(0xFF, 0xFF, 0xFF))
        tcPr = hdr[i]._tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:val"), "clear")
        shd.set(qn("w:fill"), "0F4B42")
        tcPr.append(shd)

    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = ""
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.line_spacing = 1.3
            r = p.add_run(val)
            set_font(r, "宋体", font_size, False, INK)

    if widths:
        for i, w in enumerate(widths):
            t.columns[i].width = Cm(w)
            for cell in t.columns[i].cells:
                cell.width = Cm(w)

    for idx, row in enumerate(t.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(OxmlElement("w:cantSplit"))
        if idx == 0:
            trPr.append(OxmlElement("w:tblHeader"))
    return t


# ==================== 封面 ====================
for _ in range(2):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(6)
r = p.add_run("青“廉”筑梦")
set_font(r, "黑体", 30, True, INK)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(40)
r = p.add_run("——基于廉洁教育馆的大学生廉洁品格全周期涵养体系构建与实践")
set_font(r, "宋体", 12.5, False, GRAY)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(6)
r = p.add_run("阶段任务完成情况报告")
set_font(r, "黑体", 22, True, ACCENT)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(50)
r = p.add_run("（数字平台建设专项）")
set_font(r, "宋体", 12, False, GRAY)

info = [
    ("项目类别", "大学生创新创业训练计划项目"),
    ("项目负责人", "苏重天"),
    ("团队成员", "余伯俊　孟泽通　洪雨蝶　陈承鑫"),
    ("指导教师", "孔志强"),
    ("执行周期", "2026 年 8 月 — 2027 年 3 月"),
    ("报告日期", "2026 年 10 月"),
]
t = doc.add_table(rows=0, cols=2)
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.autofit = False
_tblPr = t._tbl.tblPr
_jc = OxmlElement("w:jc"); _jc.set(qn("w:val"), "center"); _tblPr.append(_jc)
for k, v in info:
    cells = t.add_row().cells
    cells[0].width = Cm(3.6)
    cells[1].width = Cm(8.6)
    for cell, text, bold in ((cells[0], k, True), (cells[1], v, False)):
        cell.text = ""
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(text)
        set_font(r, "宋体", 11.5, bold, INK)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(90)
r = p.add_run("中南大学")
set_font(r, "黑体", 14, True, INK)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(8)
r = p.add_run("2026 年 10 月")
set_font(r, "宋体", 11, False, GRAY)

doc.add_page_break()

# ==================== 正文 ====================
heading("一、任务来源与目标", 1)
para("本项目确立“四维九廉”育人体系，包含九项任务、五个执行阶段。其中“数字科技助廉”明确要求："
     "建设可追溯知识库、开发问答与智能体原型、形成青年化数字内容。本报告即为该项任务的阶段性交付，"
     "同时为其余八项“廉”提供统一的内容出口。")
para("任务启动前，所有设计都停留在 Word 文档里：材料可以打印、可以汇报，却无法被学生自主使用，"
     "也无法在廉洁教育馆现场被访客触达。")
para("因此本阶段的目标被限定得非常具体：把分散在《学生执行计划》与《情景实训实施材料汇编》中的内容，"
     "转化成一个任何人都能打开、现场设备能稳定运行、后续成员能持续更新的数字入口。"
     "换言之，不是“做一个网页”，而是让九廉的工作成果具备被看见、被使用、被核查的形态。")

heading("二、建设过程中克服的主要问题", 1)
para("建设过程并非一次成型。受经费、场地网络、平台政策与设备条件限制，团队共遇到六类实质障碍，"
     "每一类都经过方案比选后才确定路径，现按发生顺序归纳如下。")

table(
    ["序号", "遇到的问题", "具体表现", "解决方式"],
    [
        ["1", "经费有限、无服务器", "无云主机、无域名、无备案条件，传统建站方案不可行",
         "采用纯静态架构：9 个文件、约 160 KB，仅 HTML/CSS/JS，不依赖数据库与后端，服务器成本为零"],
        ["2", "临时地址时效过短", "早期用内网穿透生成的公网地址在数小时内即失效，二维码随之作废",
         "改用平台级静态托管：地址固定、免费、无需续费；二维码重新生成并解码校验"],
        ["3", "平台方案试错", "首选平台经登录态访问、菜单逐项核对、设置页全文检索三重验证，确认其已不提供该服务",
         "及时止损并切换方案，避免在不可用平台上继续投入"],
        ["4", "场馆网络不可控", "教育馆网络存在认证与限速，公网方案在现场可能不可用",
         "增设“导览机模式”：网站可直接读取本地文件，断网照常运行，与公网版本同源"],
        ["5", "访客会误操作设备", "触摸屏前无人值守，访客可能关闭窗口或停留在任意页面",
         "全屏锁定、关闭后自动重启、闲置 150 秒自动回到欢迎页、隐藏手势加密码退出"],
        ["6", "材料无法检索复用", "两份 Word 共 400 余段、22 张表，内容彼此割裂，现场无法按需查找",
         "重构为结构化知识库，按四维九廉分类，并为每条知识标注出处，供检索与问答调用"],
    ],
    widths=[1.1, 3.2, 5.4, 5.7],
)

heading("三、当前进展", 1)

heading("（一）网站已上线并稳定运行", 2)
para("站点已部署至公网，浏览器输入地址即可访问，无需安装、无需登录、无需付费：", space_after=4)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(8)
r = p.add_run("https://ybjcsu0429.github.io/qinglian-site/")
set_font(r, "Consolas", 11, True, ACCENT)

para("全站设七个栏目，内容全部由项目材料改写，而非外部转载。主要交付物如下：")

table(
    ["类别", "交付物", "数量 / 说明"],
    [
        ["网站", "栏目", "7 个（首页、知识库、人物事迹、情景实训、法规制度、廉洁AI、关于项目）"],
        ["内容", "专题文章", "12 篇，其中 9 篇分别对应九廉任务，3 篇为通用知识"],
        ["内容", "人物事迹", "8 位，含古代廉吏、革命传统、时代楷模与湘雅先贤"],
        ["内容", "情景脚本", "3 套，共 9 个决策点，每个选项给出直接后果与深层影响"],
        ["内容", "法规制度摘要", "10 部，逐条列出要点与适用对象"],
        ["数字产品", "廉洁AI 知识条目", "51 条，每条标注出处，检索式问答"],
        ["运行", "导览机模式", "1 套，含开机自启、防退出、闲置归位"],
        ["物料", "二维码与 A5 立牌", "各 1 份，二维码经解码验证"],
        ["访问", "线上地址", "1 个，永久有效、免费"],
    ],
    widths=[2.6, 4.4, 8.4],
)

heading("（二）廉洁AI 采用“检索而非生成”的技术路线", 2)
para("考虑到廉洁领域对错误信息的容忍度极低，问答模块被有意限制为检索式：系统只在知识库中匹配最相关条目，"
     "并同时呈现出处，不进行自由生成。这一取舍牺牲了“聪明感”，换取了每一句回答都可被追溯、可被质疑。"
     "在任何一条回答中，使用者都能点回对应的制度原文或情景脚本。")

heading("（三）导览机模式解决了现场可用性", 2)
para("针对教育馆的触摸屏设备，另行开发了本地导览模式：开机自动全屏进入、关闭后自动重启、"
     "150 秒无操作自动返回欢迎页、左上角连点五次并输入密码方可退出。该模式直接读取本地文件，"
     "不依赖网络，也不依赖项目组成员在场操作。三种运行环境的关系如下：")

table(
    ["使用场景", "访问方式", "网络依赖", "维护方式"],
    [
        ["馆内触摸屏", "读取本地文件，全屏导览", "不依赖，可断网", "拷贝文件夹，双击启动脚本"],
        ["学生手机", "扫码访问公网地址", "依赖移动网络", "自动同步，无需操作"],
        ["电脑 / 投影演示", "浏览器打开同一地址", "依赖网络", "同上"],
    ],
    widths=[4.2, 4.8, 3.4, 3.0],
)

heading("（四）二维码与展示物料已同步", 2)
para("配套生成 A5 展示立牌与独立二维码，立牌底部印制网址以便现场核对版本。"
     "二维码生成后均经解码器验证，确认其指向当前正式地址；同时提供一键换址脚本，"
     "后续若域名变更，可在数分钟内同步更新二维码、立牌与站内图片，避免旧码流出导致访客访问失败。")

heading("四、达到的目的", 1)
para("本阶段的产出并不止于“有了一个网站”。从项目整体看，它实现了三个层面的转变。")

heading("（一）从“做过的事”到“可点开的成果”", 2)
para("九廉的多数工作——研学、讲堂、文创、观影、共读、宣誓——过去只能以简报和照片的形式存在于档案袋里。"
     "现在每一项都对应一个可访问的页面，评审或访客可以当场点开查看，而不必依赖汇报者的叙述。"
     "这对中期检查与结题答辩的意义在于：成果从“可描述”变成了“可验证”。")

heading("（二）从“听讲”到“做选择”", 2)
para("情景实训栏目把材料汇编中的三类脚本完整搬到了线上。使用者需要连续作出三个决定，"
     "每选一次即看到该路径的直接后果与深层影响，全部选完后给出选择画像。"
     "这与“看一篇文章、听一场讲座”有本质区别：前者要求表态，后者要求行动。")

heading("（三）从“一次性活动”到“可复用的教育产品”", 2)
para("项目周期长达一年，若每次活动都重新制作材料，团队将被事务性工作拖垮。"
     "本阶段形成的数字资产具备三个特征：内容与界面分离，修改文章只需编辑一个数据文件；"
     "全站零外部依赖，十年后仍可打开；文件可整体迁移，更换托管平台无需改动代码。"
     "这意味着后续成员接手时，面对的不是一个需要“维护”的系统，而是一份可以继续往里添加的材料。")

heading("五、存在的不足与下一步", 1)
para("本阶段仍有明确短板，需在下一阶段解决：")
bullet("内容编辑门槛偏高：目前新增文章需直接修改数据文件，非技术成员容易出错，拟开发表单式编辑页面")
bullet("图片支持缺失：正文暂不支持插图，需补充图片块并配套图注规范")
bullet("访问数据缺失：尚未接入访问统计，无法量化使用情况，中期前需补齐")
bullet("内容供给依赖人工：网站不会自动更新，需将“每完成一廉、新增一页”纳入固定工作流程")

para("下一阶段的重点不是继续增加功能，而是把“更新内容”这件事的成本降到任何一名团队成员都能完成。"
     "只有当内容能持续进入，这个平台才算真正活下来。", space_before=6)

# ==================== 汇报提纲 ====================
doc.add_page_break()
heading("六、汇报提纲（3—5 分钟）", 1)
para("汇报对象不是技术人员，不必讲实现细节。按“是什么—难在哪—有什么—有什么用—下一步”推进，"
     "全程控制在 4 分钟，留出提问时间。")

heading("（一）时间分配", 2)
table(
    ["时间", "环节", "要说清的一句话"],
    [
        ["0:00–0:30", "一句话定位", "把九廉的课程做成一个任何人能打开、现场能用、断网也能用的数字入口。"],
        ["0:30–1:40", "三个难点", "没有服务器、场馆网络不可控、访客会误操作——各讲一句怎么解决。"],
        ["1:40–2:40", "现场演示", "打开网址，点进情景实训，当场做一次选择。"],
        ["2:40–3:40", "三层转变", "从可描述到可验证、从听讲到做选择、从一次性活动到可复用产品。"],
        ["3:40–4:00", "下一步", "降低内容更新门槛，让每个成员都能往里加东西。"],
    ],
    widths=[2.8, 3.0, 9.6],
    font_size=9,
)

heading("（二）开场白", 2)
para("“各位老师好。这个阶段我们完成的不是一个网页，而是把‘四维九廉’从 Word 文档变成了一个可以现场打开、"
     "可以动手操作、也可以被核查的数字入口。下面我用四分钟说明三件事：我们解决了什么、现在有什么、它有什么用。”")

heading("（三）三个预设问题", 2)
table(
    ["可能被问到", "建议回答"],
    [
        ["和网上现成的廉洁教育平台有什么区别？",
         "区别在结构：内容是九廉的具体做法而非转载；核心是三个可动手决策的情景；问答不做自由生成，每条都能点回出处。"],
        ["以后谁来更新？会不会做了就放着？",
         "内容与界面分离，改文章只动一个数据文件；下一步做表单式编辑页，不写代码也能加内容。"],
        ["如果场馆断网了怎么办？",
         "馆内触摸屏用本地导览模式，断网照常运行；公网版本只服务手机扫码，两条路径互不依赖。"],
    ],
    widths=[5.2, 10.2],
    font_size=9,
)

# ==================== 落款 ====================
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p.paragraph_format.space_before = Pt(24)
r = p.add_run("青“廉”筑梦项目组")
set_font(r, "宋体", 11.5, False, INK)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = p.add_run("2026 年 10 月")
set_font(r, "宋体", 11.5, False, INK)

out = r"C:\Users\boxiya\Documents\deepseek-harness\default-workspace\out\青廉筑梦_阶段任务完成情况报告.docx"
doc.save(out)
print("saved:", out)
