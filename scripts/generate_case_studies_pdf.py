# -*- coding: utf-8 -*-
"""Generate the Dom Analytics Case Studies PDF (EN), branded to match the website."""
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Brand palette (matches src/app/globals.css) ──
BG     = (0x0a/255, 0x0a/255, 0x0f/255)
BG2    = (0x11/255, 0x11/255, 0x18/255)
BG3    = (0x1a/255, 0x1a/255, 0x24/255)
CARD   = (0x16/255, 0x16/255, 0x20/255)
CYAN   = (0x00/255, 0xc2/255, 0xcb/255)
CYAN_B = (0x00/255, 0xe5/255, 0xff/255)
TEXT   = (0xe8/255, 0xe8/255, 0xef/255)
DIM    = (0x7a/255, 0x7a/255, 0x8e/255)
DIM2   = (0x4a/255, 0x60/255, 0x80/255)
LINE   = (0x2a/255, 0x2a/255, 0x38/255)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, "public", "logo.png")
OUT  = os.path.join(ROOT, "public", "Dom_Analytics_Case_Studies_2026.pdf")

# ── Fonts ──
FD = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("Sans",   os.path.join(FD, "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("Sans-B", os.path.join(FD, "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Mono",   os.path.join(FD, "DejaVuSansMono.ttf")))
pdfmetrics.registerFont(TTFont("Mono-B", os.path.join(FD, "DejaVuSansMono-Bold.ttf")))

W, H = A4  # 595 x 842
M = 50     # page margin

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Dom Analytics — Case Studies 2026")
c.setAuthor("Dom Analytics")
c.setSubject("Case Studies — Telecom Data Monetization")


# ───────────────────────── helpers ─────────────────────────
def rect(x, y, w, h, fill, r=0, stroke=None, sw=1):
    if fill is not None:
        c.setFillColorRGB(*fill)
    if stroke is not None:
        c.setStrokeColorRGB(*stroke)
        c.setLineWidth(sw)
    if r:
        c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1 if fill else 0)
    else:
        c.rect(x, y, w, h, stroke=1 if stroke else 0, fill=1 if fill else 0)


def bg_page(fill=BG):
    rect(0, 0, W, H, fill)


def text(x, y, s, font="Sans", size=10, color=TEXT):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawString(x, y, s)


def text_c(x, y, s, font="Sans", size=10, color=TEXT):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawCentredString(x, y, s)


def text_r(x, y, s, font="Sans", size=10, color=TEXT):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawRightString(x, y, s)


def wrap(s, font, size, maxw):
    words = s.split()
    lines, cur = [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if pdfmetrics.stringWidth(test, font, size) <= maxw:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


def para(x, y, s, font="Sans", size=9.5, color=DIM, maxw=400, leading=15):
    for ln in wrap(s, font, size, maxw):
        text(x, y, ln, font, size, color)
        y -= leading
    return y


def chip_w(label):
    return pdfmetrics.stringWidth(label, "Mono", 6.5) + 16


def chip(x, y, label, col=CYAN, fill=None):
    w = chip_w(label)
    if fill:
        c.setFillColorRGB(fill[0], fill[1], fill[2], alpha=0.12)
        c.roundRect(x, y - 2, w, 15, 7.5, stroke=0, fill=1)
        c.setFillColorRGB(0, 0, 0, alpha=1)
    rect(x, y - 2, w, 15, None, r=7.5, stroke=col, sw=0.6)
    text(x + 8, y + 2.5, label, "Mono", 6.5, col)
    return x + w + 7


def flow_chips(items, x0, y, col, fill=None, line_h=22):
    """Lay out chips left-to-right, wrapping when needed. Measures before drawing."""
    x = x0
    for label in items:
        w = chip_w(label)
        if x + w > W - M:
            x = x0
            y -= line_h
        chip(x, y, label, col, fill)
        x += w + 7
    return y


def header(label):
    text(M, H - 46, "Dom", "Sans-B", 13, TEXT)
    wdt = pdfmetrics.stringWidth("Dom", "Sans-B", 13)
    text(M + wdt + 1, H - 46, "Analytics", "Sans-B", 13, CYAN)
    text_r(W - M, H - 45, label, "Mono", 7, DIM)
    rect(M, H - 56, W - 2 * M, 1, LINE)


def footer(pageno):
    rect(M, 44, W - 2 * M, 1, LINE)
    text(M, 30, "© 2026 Dom Analytics  ·  Poreč · Zagreb · Global Remote", "Mono", 6.5, DIM2)
    text_r(W - M, 30, "info@domanalytics.com", "Mono", 6.5, DIM2)
    text_c(W / 2, 30, f"{pageno:02d}", "Mono", 6.5, DIM2)


def section_label(x, y, s, col=CYAN):
    text(x, y, "// " + s, "Mono", 7.5, col)


def orb(cx, cy, rad, col, alpha_steps=18):
    for i in range(alpha_steps, 0, -1):
        a = (i / alpha_steps)
        c.setFillColorRGB(col[0], col[1], col[2], alpha=0.045 * (1 - a) + 0.01)
        c.circle(cx, cy, rad * a, stroke=0, fill=1)
    c.setFillColorRGB(0, 0, 0, alpha=1)


# ───────────────────────── COVER ─────────────────────────
bg_page()
orb(W * 0.78, H * 0.80, 230, CYAN)
orb(W * 0.15, H * 0.20, 200, CYAN_B)

c.setFillColorRGB(*CYAN, alpha=0.05)
for gx in range(60, int(W), 46):
    for gy in range(80, int(H), 46):
        c.circle(gx, gy, 0.8, stroke=0, fill=1)
c.setFillColorRGB(0, 0, 0, alpha=1)

img = ImageReader(LOGO)
iw, ih = img.getSize()
ratio = ih / iw
card_w = 230
img_w = card_w - 36
img_h = img_w * ratio
card_h = img_h + 36
cx = (W - card_w) / 2
cy = H - 250
rect(cx, cy, card_w, card_h, (1, 1, 1), r=14)
c.drawImage(img, cx + 18, cy + 18, img_w, img_h, mask='auto')

text_c(W / 2, cy - 50, "CASE STUDIES", "Mono", 10, CYAN)
c.setFillColorRGB(*TEXT)
c.setFont("Sans-B", 34)
c.drawCentredString(W / 2, cy - 96, "Data Projects")
c.drawCentredString(W / 2, cy - 134, "& Results")

sub = "What we actually did, the data tools we used, what we collected and how the dashboards we build look."
yy = cy - 174
for ln in wrap(sub, "Sans", 11, 390):
    text_c(W / 2, yy, ln, "Sans", 11, DIM)
    yy -= 17

strip_y = 120
items = [("1500%", "Peak revenue growth"), ("40+", "Countries"),
         ("15+", "Years of experience"), ("2", "Telecom networks")]
seg = (W - 2 * M) / len(items)
for i, (v, l) in enumerate(items):
    x0 = M + seg * i
    text_c(x0 + seg / 2, strip_y, v, "Sans-B", 22, CYAN_B)
    text_c(x0 + seg / 2, strip_y - 16, l, "Mono", 7, DIM)
rect(M, strip_y - 36, W - 2 * M, 1, LINE)
text_c(W / 2, 70, "CONFIDENTIAL  ·  PREPARED 2026  ·  DOM ANALYTICS", "Mono", 7, DIM2)
c.showPage()


# ───────────────────────── PAGE 2 — APPROACH ─────────────────────────
bg_page()
header("OUR APPROACH / METHODOLOGY")
orb(W * 0.9, H * 0.25, 180, CYAN)

y = H - 100
section_label(M, y, "HOW WE WORK")
y -= 30
text(M, y, "From raw data to revenue", "Sans-B", 22, TEXT)
y -= 26
y = para(M, y,
         "Both engagements below followed the same methodology we developed over 15+ years working "
         "inside telecom data. We don't advise from the outside — we go into the data layer and build "
         "the foundation on which analytics, AI and monetization actually work.",
         "Sans", 10, DIM, maxw=W - 2 * M, leading=15)

y -= 14
steps = [
    ("01", "Data Audit", "We map every data source and identify gaps, poor quality and silos. We get a clear picture of what exists and where the quick wins are."),
    ("02", "Clean & Govern", "We build pipelines that clean, deduplicate and standardize the data, and establish quality standards and governance rules."),
    ("03", "Real-time BI layer", "We restructure the architecture and build a unified analytics layer — dashboards, KPI frameworks and reporting leadership can trust."),
    ("04", "AI & Monetization", "On a clean foundation we design the monetization strategy and uncover hidden revenue streams that were invisible without governance."),
]
col_w = (W - 2 * M - 14) / 2
ch_h = 96
for i, (num, t, d) in enumerate(steps):
    col = i % 2
    row = i // 2
    x0 = M + col * (col_w + 14)
    y0 = y - row * (ch_h + 14) - ch_h
    rect(x0, y0, col_w, ch_h, CARD, r=12, stroke=LINE, sw=0.8)
    rect(x0, y0 + ch_h - 3, col_w, 3, CYAN)
    text(x0 + 16, y0 + ch_h - 26, num, "Sans-B", 18, CYAN)
    text(x0 + 50, y0 + ch_h - 24, t, "Sans-B", 11.5, TEXT)
    yy = y0 + ch_h - 44
    for ln in wrap(d, "Sans", 8.5, col_w - 32):
        text(x0 + 16, yy, ln, "Sans", 8.5, DIM)
        yy -= 12

y = y - 2 * (ch_h + 14) - 18

band_h = 150
rect(M, y - band_h, W - 2 * M, band_h, BG2, r=12, stroke=LINE, sw=0.8)
text(M + 18, y - 30, "What we collected (telecom)", "Sans-B", 12, TEXT)
text(M + 18, y - 46, "Data types we unified into a single model:", "Sans", 8.5, DIM)
collected = [
    "CDR / xDR call records", "A2P & SMS traffic", "Routing & interconnect data",
    "Traffic & volumes by destination", "Billing & revenue records", "Margins & rates per route",
    "Network KPIs / quality", "Partner / carrier data",
]
cx0 = M + 18
cy0 = y - 70
per_row = 2
cwidth = (W - 2 * M - 36) / per_row
for i, item in enumerate(collected):
    col = i % per_row
    row = i // per_row
    xx = cx0 + col * cwidth
    yy = cy0 - row * 18
    c.setFillColorRGB(*CYAN)
    c.circle(xx + 3, yy + 3, 2, stroke=0, fill=1)
    text(xx + 12, yy, item, "Sans", 8.5, TEXT)

footer(2)
c.showPage()


# ───────────────────────── CASE STUDY RENDERER ─────────────────────────
def kpi_tiles(x, y, w, tiles, accent=CYAN_B):
    n = len(tiles)
    gap = 12
    tw = (w - gap * (n - 1)) / n
    th = 70
    for i, (val, lab) in enumerate(tiles):
        x0 = x + i * (tw + gap)
        rect(x0, y - th, tw, th, CARD, r=10, stroke=LINE, sw=0.8)
        rect(x0, y - 3, tw, 3, accent)
        text_c(x0 + tw / 2, y - 36, val, "Sans-B", 24, accent)
        text_c(x0 + tw / 2, y - 54, lab, "Mono", 6.8, DIM)
    return y - th


def case_study(meta):
    bg_page()
    header(meta["hdr"])
    orb(W * 0.12, H * 0.18, 170, CYAN)

    y = H - 96
    text(M, y, meta["region"] + "  ·  " + meta["industry"], "Mono", 8, CYAN)
    y -= 26
    text(M, y, meta["title"], "Sans-B", 19, TEXT)
    y -= 24

    y = kpi_tiles(M, y, W - 2 * M, meta["kpis"]) - 22

    for lab, body in meta["blocks"]:
        section_label(M, y, lab)
        y -= 16
        y = para(M, y, body, "Sans", 9, DIM, maxw=W - 2 * M, leading=13.5)
        y -= 12

    section_label(M, y, "WHAT WE COLLECTED")
    y -= 16
    y = flow_chips(meta["collected"], M, y, CYAN, fill=CYAN)
    y -= 26

    section_label(M, y, "DATA TOOLS USED ON THIS PROJECT")
    y -= 16
    flow_chips(meta["tools"], M, y, CYAN_B)

    footer(meta["pageno"])
    c.showPage()


def dashboard_page(meta):
    """A representative (anonymized) dashboard mockup page."""
    bg_page()
    header(meta["hdr"])
    y = H - 96
    section_label(M, y, "WHAT THE DASHBOARD LOOKS LIKE")
    y -= 26
    text(M, y, meta["dash_title"], "Sans-B", 18, TEXT)
    y -= 22
    y = para(M, y, meta["dash_sub"], "Sans", 9, DIM, maxw=W - 2 * M, leading=13.5)
    y -= 6

    dx, dw = M, W - 2 * M
    dh = 430
    dy = y - dh
    rect(dx, dy, dw, dh, BG2, r=12, stroke=LINE, sw=1)
    rect(dx, dy + dh - 34, dw, 34, BG3, r=12)
    rect(dx, dy + dh - 34, dw, 22, BG3)
    for i, dot in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        c.setFillColorRGB(dot[0] / 255, dot[1] / 255, dot[2] / 255)
        c.circle(dx + 16 + i * 14, dy + dh - 17, 4, stroke=0, fill=1)
    text(dx + 70, dy + dh - 21, meta["dash_name"], "Sans-B", 9, TEXT)
    text_r(dx + dw - 14, dy + dh - 21, "● LIVE  ·  realtime", "Mono", 6.5, CYAN)

    inner_x = dx + 16
    inner_w = dw - 32
    top = dy + dh - 50

    kpis = meta["dash_kpis"]
    gap = 12
    kw = (inner_w - gap * (len(kpis) - 1)) / len(kpis)
    kh = 56
    for i, (v, l, delta) in enumerate(kpis):
        x0 = inner_x + i * (kw + gap)
        rect(x0, top - kh, kw, kh, BG3, r=8, stroke=LINE, sw=0.6)
        text(x0 + 12, top - 22, v, "Sans-B", 16, CYAN_B)
        text(x0 + 12, top - 38, l, "Mono", 6, DIM)
        text_r(x0 + kw - 10, top - 14, delta, "Mono", 6.5, (0.18, 0.78, 0.35))
    chart_top = top - kh - 16

    bar_w = inner_w * 0.60
    bar_x = inner_x
    bx_h = 150
    bar_y = chart_top - bx_h
    rect(bar_x, bar_y, bar_w, bx_h, BG3, r=8, stroke=LINE, sw=0.6)
    text(bar_x + 12, chart_top - 16, meta["bar_title"], "Sans-B", 8.5, TEXT)
    vals = meta["bars"]
    n = len(vals)
    plot_l = bar_x + 16
    plot_b = bar_y + 22
    plot_w = bar_w - 32
    plot_h = bx_h - 50
    mx = max(vals)
    bw = plot_w / n * 0.55
    step = plot_w / n
    for i, v in enumerate(vals):
        bh = plot_h * (v / mx)
        x0 = plot_l + i * step + (step - bw) / 2
        rect(x0, plot_b, bw, bh, CYAN)
        rect(x0, plot_b, bw, min(bh, 4), CYAN_B)
    text(bar_x + 12, bar_y + 7, meta["bar_axis"], "Mono", 5.8, DIM2)

    don_x = inner_x + bar_w + 16
    don_w = inner_w - bar_w - 16
    rect(don_x, bar_y, don_w, bx_h, BG3, r=8, stroke=LINE, sw=0.6)
    text(don_x + 12, chart_top - 16, meta["donut_title"], "Sans-B", 8.5, TEXT)
    ccx = don_x + don_w * 0.34
    ccy = bar_y + bx_h * 0.46
    rad = 36
    segs = meta["donut"]
    palette = [CYAN_B, CYAN, (0.0, 0.55, 0.62), (0.20, 0.35, 0.5), (0.30, 0.30, 0.42)]
    start = 90
    total = sum(s[1] for s in segs)
    for i, (lbl, val) in enumerate(segs):
        ext = -360.0 * val / total
        c.setFillColorRGB(*palette[i % len(palette)])
        c.wedge(ccx - rad, ccy - rad, ccx + rad, ccy + rad, start, ext, stroke=0, fill=1)
        start += ext
    c.setFillColorRGB(*BG3)
    c.circle(ccx, ccy, rad * 0.55, stroke=0, fill=1)
    lx = don_x + don_w * 0.60
    ly = bar_y + bx_h - 34
    for i, (lbl, val) in enumerate(segs):
        c.setFillColorRGB(*palette[i % len(palette)])
        c.rect(lx, ly - i * 16, 7, 7, stroke=0, fill=1)
        text(lx + 12, ly - i * 16, f"{lbl} {int(100*val/total)}%", "Sans", 6.5, DIM)

    ln_y = bar_y - 16
    ln_h = 120
    ln_bot = ln_y - ln_h
    rect(inner_x, ln_bot, inner_w, ln_h, BG3, r=8, stroke=LINE, sw=0.6)
    text(inner_x + 12, ln_y - 16, meta["line_title"], "Sans-B", 8.5, TEXT)
    line_vals = meta["line"]
    lp_l = inner_x + 16
    lp_b = ln_bot + 18
    lp_w = inner_w - 32
    lp_h = ln_h - 44
    lmx = max(line_vals)
    lmn = min(line_vals)
    pts = []
    for i, v in enumerate(line_vals):
        px = lp_l + lp_w * i / (len(line_vals) - 1)
        py = lp_b + lp_h * (v - lmn) / (lmx - lmn + 0.0001)
        pts.append((px, py))
    c.setFillColorRGB(*CYAN, alpha=0.12)
    p = c.beginPath()
    p.moveTo(pts[0][0], lp_b)
    for px, py in pts:
        p.lineTo(px, py)
    p.lineTo(pts[-1][0], lp_b)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setFillColorRGB(0, 0, 0, alpha=1)
    c.setStrokeColorRGB(*CYAN_B)
    c.setLineWidth(1.6)
    for i in range(len(pts) - 1):
        c.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])
    for px, py in pts:
        c.setFillColorRGB(*CYAN_B)
        c.circle(px, py, 1.8, stroke=0, fill=1)

    text(M, dy - 16, "Representative, anonymized view — actual client data is confidential.",
         "Sans", 7.5, DIM2)

    footer(meta["dpageno"])
    c.showPage()


APAC = {
    "hdr": "CASE STUDY 01 / APAC",
    "region": "APAC REGION", "industry": "TELECOMMUNICATIONS",
    "title": "Telecom Network Data Monetization",
    "kpis": [("1500%", "REVENUE INCREASE"), ("1150%", "GROSS PROFIT INCREASE"),
             ("Realtime", "BI VISIBILITY"), ("0 → 1", "MONETIZATION STRATEGY")],
    "blocks": [
        ("THE CHALLENGE",
         "A major telecommunications network in the APAC region was sitting on enormous amounts of "
         "traffic and routing data but had no visibility into how that data could drive revenue. "
         "Reporting was siloed, data quality was poor and the monetization strategy was non-existent. "
         "Revenue was flat despite high traffic volumes."),
        ("OUR APPROACH",
         "We started with a full data audit — mapping every source and identifying gaps. We then cleaned "
         "and restructured the data architecture, built automated pipelines and created a real-time BI "
         "layer that gave the business visibility it had never had before. On that foundation we designed "
         "and implemented a new data-driven monetization strategy."),
        ("THE RESULT",
         "The engagement delivered a complete transformation of the network's revenue performance. Data "
         "that was previously invisible became the engine behind a 1500% revenue increase and 1150% gross "
         "profit increase. The new data infrastructure continues to generate value long after the "
         "engagement concluded."),
    ],
    "collected": ["CDR / xDR records", "Routing data", "Traffic by destination",
                  "Interconnect traffic", "Billing records", "Network KPIs", "Margins per route"],
    "tools": ["QlikSense", "Power BI", "Python", "Pandas", "ETL Pipelines",
              "PostgreSQL", "Data Modeling", "KPI Frameworks"],
    "pageno": 3,
    "dpageno": 4,
    "dash_title": "Network Revenue & Monetization dashboard",
    "dash_sub": "The real-time BI layer we built unifies traffic, routing and billing into a single view "
                "— from executive level down to the individual route.",
    "dash_name": "APAC · Network Revenue Monitor",
    "dash_kpis": [("$4.8M", "MONTHLY REVENUE", "▲ 1500%"), ("68%", "GROSS MARGIN", "▲ 1150%"),
                  ("1.2B", "MIN / MONTH", "▲ 240%"), ("312", "ACTIVE ROUTES", "▲ 88%")],
    "bar_title": "Revenue by month (12 mo.)",
    "bars": [12, 14, 18, 22, 30, 41, 55, 70, 88, 110, 140, 180],
    "bar_axis": "Jan — Dec",
    "donut_title": "Revenue by destination",
    "donut": [("APAC", 42), ("EU", 26), ("MENA", 18), ("Other", 14)],
    "line_title": "Traffic volume (min/day)",
    "line": [20, 24, 22, 30, 35, 33, 42, 48, 55, 60, 72, 80, 95, 110],
}

MENA = {
    "hdr": "CASE STUDY 02 / MENA",
    "region": "MENA REGION", "industry": "TELECOMMUNICATIONS",
    "title": "Telecom Revenue & Data Architecture Overhaul",
    "kpis": [("400%", "REVENUE INCREASE"), ("250%", "GROSS PROFIT INCREASE"),
             ("0", "REPORTING SILOS"), ("1", "UNIFIED MODEL")],
    "blocks": [
        ("THE CHALLENGE",
         "A telecommunications network in the MENA region had significant revenue potential locked inside "
         "fragmented, ungoverned data. Multiple systems were producing inconsistent reports, making it "
         "impossible to identify where revenue was being lost or where new opportunities existed. The "
         "business was operating blind."),
        ("OUR APPROACH",
         "We conducted a comprehensive data audit that uncovered hidden revenue streams — simply invisible "
         "without proper data governance. We restructured the entire architecture, eliminated reporting "
         "silos, established data quality standards and built a unified analytics layer. A new monetization "
         "strategy was then designed based on what the clean data revealed."),
        ("THE RESULT",
         "The project delivered 400% revenue growth and 250% gross profit increase. Beyond the numbers, "
         "the business was left with a clean, governed data foundation it could keep building on, and a "
         "monetization playbook it could apply across other markets."),
    ],
    "collected": ["CDR records", "A2P / SMS traffic", "Routing data", "Revenue records",
                  "Carrier / partner data", "Rates per route", "Data quality metrics"],
    "tools": ["Power BI", "QlikSense", "Python", "ETL Pipelines", "Data Governance",
              "PostgreSQL", "Data Modeling", "Tableau"],
    "pageno": 5,
    "dpageno": 6,
    "dash_title": "Revenue Assurance & Architecture dashboard",
    "dash_sub": "After eliminating the silos, the unified analytics layer surfaces revenue leakage, data "
                "quality and monetization opportunities in real time.",
    "dash_name": "MENA · Revenue Assurance",
    "dash_kpis": [("$2.1M", "MONTHLY REVENUE", "▲ 400%"), ("54%", "GROSS MARGIN", "▲ 250%"),
                  ("99.2%", "DATA QUALITY", "▲ 31%"), ("0", "REPORT SILOS", "▼ 100%")],
    "bar_title": "Revenue by month (12 mo.)",
    "bars": [20, 22, 25, 28, 33, 38, 44, 52, 60, 68, 78, 90],
    "bar_axis": "Jan — Dec",
    "donut_title": "Revenue by segment",
    "donut": [("Voice", 38), ("A2P SMS", 31), ("Data", 19), ("Other", 12)],
    "line_title": "Revenue leakage recovered",
    "line": [60, 55, 50, 44, 40, 33, 30, 24, 20, 16, 12, 9, 7, 5],
}

case_study(APAC)
dashboard_page(APAC)
case_study(MENA)
dashboard_page(MENA)


# ───────────────────────── DATA STACK PAGE ─────────────────────────
bg_page()
header("DATA TOOLS / STACK")
orb(W * 0.85, H * 0.8, 190, CYAN)
y = H - 100
section_label(M, y, "OUR STACK")
y -= 30
text(M, y, "The data tools we use", "Sans-B", 22, TEXT)
y -= 24
y = para(M, y,
         "The tools listed on our site, grouped by layer. On the telecom projects the focus was on the "
         "BI & Analytics and Data layers — from ETL pipelines and modeling to executive dashboards.",
         "Sans", 10, DIM, maxw=W - 2 * M, leading=15)
y -= 10

cats = [
    ("BI & Analytics", ["QlikSense", "Power BI", "Tableau", "Google Analytics", "Pandas", "Data Modeling", "ETL Pipelines"]),
    ("AI & Data", ["Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain", "Scikit-learn", "Hugging Face"]),
    ("Backend & Cloud", ["Node.js", "PostgreSQL", "AWS", "Vercel", "Docker", "REST APIs", "GraphQL"]),
    ("Business & Strategy", ["Business Intelligence", "Business Analytics", "KPI Frameworks", "Market Research", "Salesforce", "HubSpot"]),
]
col_w = (W - 2 * M - 14) / 2
box_h = 150
for i, (name, its) in enumerate(cats):
    col = i % 2
    row = i // 2
    x0 = M + col * (col_w + 14)
    y0 = y - row * (box_h + 14) - box_h
    rect(x0, y0, col_w, box_h, CARD, r=12, stroke=LINE, sw=0.8)
    rect(x0, y0 + box_h - 3, col_w, 3, CYAN)
    text(x0 + 16, y0 + box_h - 26, name, "Sans-B", 12, TEXT)
    yy = y0 + box_h - 50
    for it in its:
        c.setFillColorRGB(*CYAN)
        c.circle(x0 + 19, yy + 3, 2, stroke=0, fill=1)
        text(x0 + 30, yy, it, "Sans", 9, TEXT)
        yy -= 16
footer(7)
c.showPage()


# ───────────────────────── CLOSING PAGE ─────────────────────────
bg_page()
orb(W * 0.5, H * 0.62, 260, CYAN)
orb(W * 0.2, H * 0.25, 160, CYAN_B)

card_w = 180
img_w = card_w - 30
img_h = img_w * ratio
card_h = img_h + 30
cx = (W - card_w) / 2
cy = H - 230
rect(cx, cy, card_w, card_h, (1, 1, 1), r=12)
c.drawImage(img, cx + 15, cy + 15, img_w, img_h, mask='auto')

text_c(W / 2, cy - 50, "Ready to be next?", "Sans-B", 26, TEXT)
yy = cy - 80
for ln in wrap("Tell us where your data is today and we'll show you where it can take you. Let's talk "
               "about your data and what it could be doing for your business.",
               "Sans", 11, 400):
    text_c(W / 2, yy, ln, "Sans", 11, DIM)
    yy -= 18

cc_w = 360
cc_x = (W - cc_w) / 2
cc_y = yy - 140
rect(cc_x, cc_y, cc_w, 110, CARD, r=14, stroke=LINE, sw=1)
rect(cc_x, cc_y + 110 - 3, cc_w, 3, CYAN)
text_c(W / 2, cc_y + 80, "Dom Analytics", "Sans-B", 15, TEXT)
contacts = [
    ("Email", "info@domanalytics.com"),
    ("Web", "domanalytics.com"),
    ("Location", "Poreč · Zagreb · Global Remote"),
]
yy2 = cc_y + 58
for k, v in contacts:
    text_c(W / 2, yy2, f"{k}:  {v}", "Sans", 9.5, DIM)
    yy2 -= 17

text_c(W / 2, 70, "© 2026 DOM ANALYTICS  ·  INNOVATE, ANALYZE, SUCCEED", "Mono", 7, DIM2)
c.showPage()

c.save()
print("WROTE", OUT)
