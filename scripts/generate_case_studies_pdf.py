# -*- coding: utf-8 -*-
"""Dom Analytics — Case Studies PDF.

Light, corporate layout matching the Dom Analytics consulting-proposal template:
navy header/footer bands, teal section headings with underline rules, clean
zebra tables and teal bullet lists. No "//" labels, no em dashes.
"""
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Palette (sampled from the proposal template) ──
NAVY   = (26/255, 42/255, 59/255)      # #1A2A3B  header / footer / table head
TEAL   = (43/255, 183/255, 205/255)    # #2BB7CD  headings, rules, accents
TEAL_D = (20/255, 140/255, 158/255)    # darker teal for small text on white
DOT    = (63/255, 197/255, 213/255)    # bullet dots
LIGHT  = (239/255, 249/255, 251/255)   # #EFF9FB  band / zebra tint
TINT   = (215/255, 238/255, 241/255)   # #D7EEF1  label cell tint
BODY   = (26/255, 26/255, 26/255)      # body text
MUTE   = (110/255, 120/255, 130/255)   # muted gray
BORDER = (210/255, 218/255, 224/255)   # table borders
WHITE  = (1, 1, 1)
GREEN  = (32/255, 160/255, 90/255)

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO  = os.path.join(ROOT, "public", "logo.png")
LOGOW = os.path.join(ROOT, "public", "logo-white.png")
OUT   = os.path.join(ROOT, "public", "Dom_Analytics_Case_Studies_2026.pdf")

# ── Fonts: Liberation Sans (Arial-metric, full Croatian diacritics) ──
LF = "/usr/share/fonts/truetype/liberation"
pdfmetrics.registerFont(TTFont("Sans",   os.path.join(LF, "LiberationSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Sans-B", os.path.join(LF, "LiberationSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Sans-I", os.path.join(LF, "LiberationSans-Italic.ttf")))

W, H = A4
M = 50
CW = W - 2 * M  # content width

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Dom Analytics — Case Studies 2026")
c.setAuthor("Dom Analytics d.o.o.")
c.setSubject("Telecom Data Monetization — Case Studies")

logo_w = ImageReader(LOGOW)
logo_d = ImageReader(LOGO)
lw_iw, lw_ih = logo_w.getSize()
LRATIO = lw_ih / lw_iw


# ───────────────────────── primitives ─────────────────────────
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


def text(x, y, s, font="Sans", size=10, color=BODY):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawString(x, y, s)


def text_c(x, y, s, font="Sans", size=10, color=BODY):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawCentredString(x, y, s)


def text_r(x, y, s, font="Sans", size=10, color=BODY):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawRightString(x, y, s)


def wrap(s, font, size, maxw):
    out, cur = [], ""
    for w_ in s.split():
        t = (cur + " " + w_).strip()
        if pdfmetrics.stringWidth(t, font, size) <= maxw:
            cur = t
        else:
            if cur:
                out.append(cur)
            cur = w_
    if cur:
        out.append(cur)
    return out


def para(x, y, s, font="Sans", size=9.5, color=BODY, maxw=CW, leading=14):
    for ln in wrap(s, font, size, maxw):
        text(x, y, ln, font, size, color)
        y -= leading
    return y


# ───────────────────────── building blocks ─────────────────────────
def header_band(title, subtitle):
    bh = 74
    rect(0, H - bh, W, bh, NAVY)
    iw = 84
    ih = iw * LRATIO
    c.drawImage(logo_w, M, H - bh / 2 - ih / 2, iw, ih, mask='auto')
    lx = M + iw + 22
    text(lx, H - 34, title, "Sans-B", 17, WHITE)
    text(lx, H - 52, subtitle, "Sans", 9, (200/255, 215/255, 225/255))
    return H - bh - 34


def heading(y, label):
    text(M, y, label, "Sans-B", 13.5, TEAL_D)
    rect(M, y - 7, CW, 1.6, TEAL)
    return y - 24


def bullets(x, y, items, maxw, gap=15, size=9.3):
    for it in items:
        c.setFillColorRGB(*DOT)
        c.circle(x + 3, y + 3, 2.6, stroke=0, fill=1)
        if isinstance(it, tuple):
            lead, rest = it
            text(x + 13, y, lead, "Sans-B", size, BODY)
            lw = pdfmetrics.stringWidth(lead + " ", "Sans-B", size)
            first = wrap(rest, "Sans", size, maxw - 13 - lw)
            if first:
                text(x + 13 + lw, y, first[0], "Sans", size, BODY)
            yy = y - gap
            for ln in first[1:]:
                text(x + 13, yy, ln, "Sans", size, BODY)
                yy -= gap
            y = yy
        else:
            lines = wrap(it, "Sans", size, maxw - 13)
            text(x + 13, y, lines[0], "Sans", size, BODY)
            yy = y - gap
            for ln in lines[1:]:
                text(x + 13, yy, ln, "Sans", size, BODY)
                yy -= gap
            y = yy
    return y


def subheader_band(y, left, right=None):
    h = 24
    rect(M, y - h, CW, h, LIGHT, stroke=BORDER, sw=0.6)
    rect(M, y - h, 3.5, h, TEAL)
    text(M + 14, y - h + 8, left, "Sans-B", 10.5, NAVY)
    if right:
        text_r(M - 12 + CW, y - h + 8.5, right, "Sans-B", 10, TEAL_D)
    return y - h - 16


def def_table(y, rows, label_w=92):
    for i, (lab, txt) in enumerate(rows):
        lines = wrap(txt, "Sans", 9.3, CW - label_w - 26)
        rh = max(30, len(lines) * 13.5 + 14)
        rect(M, y - rh, CW, rh, WHITE if i % 2 else LIGHT)
        rect(M, y - rh, label_w, rh, TINT)
        c.setStrokeColorRGB(*BORDER)
        c.setLineWidth(0.6)
        c.rect(M, y - rh, CW, rh, stroke=1, fill=0)
        c.line(M + label_w, y - rh, M + label_w, y)
        text(M + 12, y - 17, lab, "Sans-B", 9.3, NAVY)
        ty = y - 17
        for ln in lines:
            text(M + label_w + 13, ty, ln, "Sans", 9.3, BODY)
            ty -= 13.5
        y -= rh
    return y - 6


def data_table(y, headers, rows, widths, align=None):
    """Navy header row + zebra body rows."""
    align = align or ["l"] * len(headers)
    xs = [M]
    for w in widths:
        xs.append(xs[-1] + w)
    hh = 22
    rect(M, y - hh, CW, hh, NAVY)
    for i, hd in enumerate(headers):
        if align[i] == "r":
            text_r(xs[i + 1] - 10, y - hh + 7.5, hd, "Sans-B", 8.8, WHITE)
        else:
            text(xs[i] + 12, y - hh + 7.5, hd, "Sans-B", 8.8, WHITE)
    y -= hh
    for r_i, row in enumerate(rows):
        cell_lines = [wrap(str(cell), "Sans", 8.8, widths[i] - 22) for i, cell in enumerate(row)]
        rh = max(22, max(len(cl) for cl in cell_lines) * 12 + 11)
        rect(M, y - rh, CW, rh, LIGHT if r_i % 2 else WHITE)
        for i, cl in enumerate(cell_lines):
            ty = y - 15
            for ln in cl:
                if align[i] == "r":
                    text_r(xs[i + 1] - 12, ty, ln, "Sans", 8.8, BODY)
                else:
                    text(xs[i] + 12, ty, ln, "Sans", 8.8, BODY)
                ty -= 12
        y -= rh
    c.setStrokeColorRGB(*BORDER)
    c.setLineWidth(0.6)
    c.rect(M, y, CW, 0.1, stroke=0, fill=0)
    return y - 6


def kpi_strip(y, tiles):
    n = len(tiles)
    gap = 12
    tw = (CW - gap * (n - 1)) / n
    th = 58
    for i, (val, lab) in enumerate(tiles):
        x0 = M + i * (tw + gap)
        rect(x0, y - th, tw, th, LIGHT, r=6, stroke=(190/255, 220/255, 226/255), sw=0.8)
        rect(x0, y - th, 3, th, TEAL)
        text_c(x0 + tw / 2, y - 30, val, "Sans-B", 19, TEAL_D)
        text_c(x0 + tw / 2, y - 47, lab, "Sans", 6.8, MUTE)
    return y - th - 16


def footnote(y, lines):
    for ln in lines:
        for s in wrap(ln, "Sans-I", 7.6, CW):
            text(M, y, s, "Sans-I", 7.6, MUTE)
            y -= 11
        y -= 2
    return y


def page_footer(n):
    text(M, 30, "Dom Analytics d.o.o.  ·  Confidential", "Sans", 7.2, MUTE)
    text_r(W - M, 30, f"{n}", "Sans", 7.2, MUTE)
    rect(M, 40, CW, 0.6, BORDER)


def contact_band(y):
    bh = 58
    rect(0, y - bh, W, bh, NAVY)
    iw = 70
    ih = iw * LRATIO
    c.drawImage(logo_w, M, y - bh / 2 - ih / 2, iw, ih, mask='auto')
    lx = M + iw + 22
    text(lx, y - 22, "Domagoj Krušić  |  CEO & Director, Dom Analytics d.o.o.", "Sans-B", 9.5, WHITE)
    text(lx, y - 38, "info@domanalytics.com   |   www.domanalytics.com   |   Poreč · Zagreb · Global Remote",
         "Sans", 8, (200/255, 215/255, 225/255))


# ═════════════════════════ PAGE 1 — OVERVIEW ═════════════════════════
y = header_band("CASE STUDIES & DATA PROJECTS", "Prepared by: Dom Analytics d.o.o.  |  2026")

y = heading(y, "Overview")
y = para(M, y,
         "This document summarizes two telecom data engagements delivered by Dom Analytics: what we "
         "actually did, the data tools we used, what we collected, and how the dashboards we build look. "
         "Both programs followed the same methodology and produced measurable revenue impact, with peak "
         "results of +1,500% revenue growth and +1,150% gross profit growth.",
         "Sans", 9.6, BODY, leading=14.5)
y -= 12

y = heading(y, "Our Methodology")
y = bullets(M, y, [
    ("Data Audit.", "We map every data source and identify gaps, poor quality and reporting silos, building a clear picture of what exists and where the quick wins are."),
    ("Clean & Govern.", "We build pipelines that clean, deduplicate and standardize the data, and establish quality standards and governance rules."),
    ("Real-time BI Layer.", "We restructure the architecture and build a unified analytics layer: dashboards, KPI frameworks and real-time reporting leadership can trust."),
    ("AI & Monetization.", "On a clean foundation we design the monetization strategy and uncover hidden revenue streams that were invisible without governance."),
], CW)
y -= 14

y = heading(y, "What We Collect (Telecom)")
y = para(M, y, "Across both engagements we unified the following data types into a single, governed model:",
         "Sans", 9.3, BODY, leading=13)
y -= 4
col_items_l = ["CDR / xDR call records", "Routing & interconnect data", "Billing & revenue records", "Network KPIs and quality metrics"]
col_items_r = ["A2P & SMS traffic", "Traffic & volumes by destination", "Margins & rates per route", "Partner / carrier data"]
y_l = bullets(M, y, col_items_l, CW / 2 - 10, size=9.3)
bullets(M + CW / 2 + 10, y, col_items_r, CW / 2 - 10, size=9.3)
y = y_l - 6

page_footer(1)
c.showPage()


# ═════════════════════════ CASE STUDY RENDERER ═════════════════════════
def case_study_page(meta, pageno):
    y = header_band(meta["title"], meta["region"] + "   ·   " + meta["industry"])

    y = subheader_band(y, meta["subtitle"], meta["headline_metric"])
    y = kpi_strip(y, meta["kpis"])

    y = heading(y, "The Engagement")
    y = def_table(y, [
        ("Challenge", meta["challenge"]),
        ("Approach", meta["approach"]),
        ("Result", meta["result"]),
    ])
    y -= 8

    y = heading(y, "What We Collected")
    y = para(M, y, meta["collected"], "Sans", 9.3, BODY, leading=13)
    y -= 10

    y = heading(y, "Data Tools Used")
    y = para(M, y, meta["tools"], "Sans", 9.3, BODY, leading=13)

    page_footer(pageno)
    c.showPage()


def dashboard_page(meta, pageno):
    y = header_band("Dashboard Preview", meta["region"] + "   ·   " + meta["industry"])
    y = heading(y, meta["dash_title"])
    y = para(M, y, meta["dash_sub"], "Sans", 9.3, BODY, leading=13.5)
    y -= 8

    dx, dw = M, CW
    dh = 470
    dy = y - dh
    rect(dx, dy, dw, dh, WHITE, r=8, stroke=BORDER, sw=1)
    # title bar
    rect(dx, dy + dh - 30, dw, 30, LIGHT, r=8)
    rect(dx, dy + dh - 30, dw, 18, LIGHT)
    c.setStrokeColorRGB(*BORDER)
    c.setLineWidth(0.6)
    c.line(dx, dy + dh - 30, dx + dw, dy + dh - 30)
    text(dx + 14, dy + dh - 20, meta["dash_name"], "Sans-B", 9, NAVY)
    c.setFillColorRGB(*GREEN)
    c.circle(dx + dw - 78, dy + dh - 15, 2.4, stroke=0, fill=1)
    text(dx + dw - 70, dy + dh - 18, "LIVE · realtime", "Sans-B", 7, TEAL_D)

    inner_x = dx + 16
    inner_w = dw - 32
    top = dy + dh - 46

    # KPI tiles
    kpis = meta["dash_kpis"]
    gap = 12
    kw = (inner_w - gap * (len(kpis) - 1)) / len(kpis)
    kh = 56
    for i, (v, l, delta) in enumerate(kpis):
        x0 = inner_x + i * (kw + gap)
        rect(x0, top - kh, kw, kh, LIGHT, r=6, stroke=BORDER, sw=0.6)
        text(x0 + 11, top - 24, v, "Sans-B", 15, NAVY)
        text(x0 + 11, top - 40, l, "Sans", 6.4, MUTE)
        text_r(x0 + kw - 9, top - 15, delta, "Sans-B", 6.6, GREEN)
    chart_top = top - kh - 16

    # bar chart
    bar_w = inner_w * 0.60
    bx_h = 160
    bar_y = chart_top - bx_h
    rect(inner_x, bar_y, bar_w, bx_h, WHITE, r=6, stroke=BORDER, sw=0.6)
    text(inner_x + 12, chart_top - 16, meta["bar_title"], "Sans-B", 8.5, NAVY)
    vals = meta["bars"]
    n = len(vals)
    plot_l = inner_x + 16
    plot_b = bar_y + 24
    plot_w = bar_w - 32
    plot_h = bx_h - 56
    mx = max(vals)
    bw = plot_w / n * 0.58
    step = plot_w / n
    c.setStrokeColorRGB(*BORDER)
    c.setLineWidth(0.5)
    c.line(plot_l, plot_b, plot_l + plot_w, plot_b)
    for i, v in enumerate(vals):
        bh = plot_h * (v / mx)
        x0 = plot_l + i * step + (step - bw) / 2
        rect(x0, plot_b, bw, bh, TEAL)
        rect(x0, plot_b + bh - 3, bw, 3, TEAL_D)
    text(inner_x + 12, bar_y + 8, meta["bar_axis"], "Sans", 6, MUTE)

    # donut
    don_x = inner_x + bar_w + 16
    don_w = inner_w - bar_w - 16
    rect(don_x, bar_y, don_w, bx_h, WHITE, r=6, stroke=BORDER, sw=0.6)
    text(don_x + 12, chart_top - 16, meta["donut_title"], "Sans-B", 8.5, NAVY)
    ccx = don_x + don_w * 0.32
    ccy = bar_y + bx_h * 0.44
    rad = 34
    segs = meta["donut"]
    palette = [TEAL, TEAL_D, (150/255, 210/255, 220/255), NAVY, (90/255, 120/255, 140/255)]
    start = 90
    total = sum(s[1] for s in segs)
    for i, (lbl, val) in enumerate(segs):
        ext = -360.0 * val / total
        c.setFillColorRGB(*palette[i % len(palette)])
        c.wedge(ccx - rad, ccy - rad, ccx + rad, ccy + rad, start, ext, stroke=0, fill=1)
        start += ext
    c.setFillColorRGB(*WHITE)
    c.circle(ccx, ccy, rad * 0.56, stroke=0, fill=1)
    lx = don_x + don_w * 0.58
    ly = bar_y + bx_h - 36
    for i, (lbl, val) in enumerate(segs):
        c.setFillColorRGB(*palette[i % len(palette)])
        c.rect(lx, ly - i * 15, 7, 7, stroke=0, fill=1)
        text(lx + 11, ly - i * 15, f"{lbl}  {int(100*val/total)}%", "Sans", 6.6, BODY)

    # line chart
    ln_y = bar_y - 16
    ln_h = 132
    ln_bot = ln_y - ln_h
    rect(inner_x, ln_bot, inner_w, ln_h, WHITE, r=6, stroke=BORDER, sw=0.6)
    text(inner_x + 12, ln_y - 16, meta["line_title"], "Sans-B", 8.5, NAVY)
    lv = meta["line"]
    lp_l = inner_x + 16
    lp_b = ln_bot + 20
    lp_w = inner_w - 32
    lp_h = ln_h - 50
    lmx, lmn = max(lv), min(lv)
    pts = [(lp_l + lp_w * i / (len(lv) - 1), lp_b + lp_h * (v - lmn) / (lmx - lmn + 1e-6)) for i, v in enumerate(lv)]
    c.setStrokeColorRGB(*BORDER)
    c.setLineWidth(0.5)
    c.line(lp_l, lp_b, lp_l + lp_w, lp_b)
    c.setFillColorRGB(*TEAL, alpha=0.14)
    p = c.beginPath()
    p.moveTo(pts[0][0], lp_b)
    for px, py in pts:
        p.lineTo(px, py)
    p.lineTo(pts[-1][0], lp_b)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setFillColorRGB(0, 0, 0, alpha=1)
    c.setStrokeColorRGB(*TEAL_D)
    c.setLineWidth(1.6)
    for i in range(len(pts) - 1):
        c.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])
    for px, py in pts:
        c.setFillColorRGB(*TEAL_D)
        c.circle(px, py, 1.7, stroke=0, fill=1)

    footnote(dy - 14, ["Representative, anonymized view. Actual client data is confidential."])
    page_footer(pageno)
    c.showPage()


APAC = {
    "title": "Case Study 01: APAC Telecom",
    "region": "APAC Region", "industry": "Telecommunications",
    "subtitle": "Telecom Network Data Monetization",
    "headline_metric": "+1,500% revenue  ·  +1,150% gross profit",
    "kpis": [("+1,500%", "REVENUE GROWTH"), ("+1,150%", "GROSS PROFIT GROWTH"),
             ("Realtime", "BI VISIBILITY"), ("0 to 1", "MONETIZATION STRATEGY")],
    "challenge": "A major telecommunications network was sitting on enormous amounts of traffic and "
                 "routing data but had no visibility into how it could drive revenue. Reporting was "
                 "siloed, data quality was poor and the monetization strategy was non-existent. Revenue "
                 "was flat despite high traffic volumes.",
    "approach": "We ran a full data audit, then cleaned and restructured the data architecture, built "
                "automated pipelines and created a real-time BI layer that gave the business visibility "
                "it had never had before. On that foundation we designed and implemented a new "
                "data-driven monetization strategy.",
    "result": "A complete transformation of the network's revenue performance. Data that was previously "
              "invisible became the engine behind a 1,500% revenue increase and 1,150% gross profit "
              "increase, with infrastructure that keeps generating value after the engagement.",
    "collected": "CDR / xDR records, routing and interconnect traffic, traffic and volumes by "
                 "destination, billing records, network KPIs and margins per route.",
    "tools": "QlikSense, Power BI, Python, Pandas, ETL pipelines, PostgreSQL, data modeling, KPI frameworks.",
    "dash_title": "Network Revenue & Monetization Dashboard",
    "dash_sub": "The real-time BI layer unifies traffic, routing and billing into a single view, from "
                "executive level down to the individual route.",
    "dash_name": "APAC · Network Revenue Monitor",
    "dash_kpis": [("$4.8M", "MONTHLY REVENUE", "+1,500%"), ("68%", "GROSS MARGIN", "+1,150%"),
                  ("1.2B", "MINUTES / MONTH", "+240%"), ("312", "ACTIVE ROUTES", "+88%")],
    "bar_title": "Revenue by month (12 mo.)",
    "bars": [12, 14, 18, 22, 30, 41, 55, 70, 88, 110, 140, 180],
    "bar_axis": "Jan to Dec",
    "donut_title": "Revenue by destination",
    "donut": [("APAC", 42), ("EU", 26), ("MENA", 18), ("Other", 14)],
    "line_title": "Traffic volume (minutes / day)",
    "line": [20, 24, 22, 30, 35, 33, 42, 48, 55, 60, 72, 80, 95, 110],
}

MENA = {
    "title": "Case Study 02: MENA Telecom",
    "region": "MENA Region", "industry": "Telecommunications",
    "subtitle": "Telecom Revenue & Data Architecture Overhaul",
    "headline_metric": "+400% revenue  ·  +250% gross profit",
    "kpis": [("+400%", "REVENUE GROWTH"), ("+250%", "GROSS PROFIT GROWTH"),
             ("0", "REPORTING SILOS"), ("1", "UNIFIED DATA MODEL")],
    "challenge": "A telecommunications network had significant revenue potential locked inside "
                 "fragmented, ungoverned data. Multiple systems produced inconsistent reports, making it "
                 "impossible to see where revenue was being lost or where new opportunities existed. The "
                 "business was operating blind.",
    "approach": "We conducted a comprehensive data audit that uncovered hidden revenue streams, "
                "restructured the entire architecture, eliminated reporting silos, established data "
                "quality standards and built a unified analytics layer. A new monetization strategy was "
                "designed based on what the clean data revealed.",
    "result": "The project delivered 400% revenue growth and 250% gross profit increase. Beyond the "
              "numbers, the business was left with a clean, governed data foundation and a monetization "
              "playbook it could apply across other markets.",
    "collected": "CDR records, A2P and SMS traffic, routing data, revenue records, carrier and partner "
                 "data, rates per route and data quality metrics.",
    "tools": "Power BI, QlikSense, Python, ETL pipelines, data governance, PostgreSQL, data modeling, Tableau.",
    "dash_title": "Revenue Assurance & Architecture Dashboard",
    "dash_sub": "After eliminating the silos, the unified analytics layer surfaces revenue leakage, data "
                "quality and monetization opportunities in real time.",
    "dash_name": "MENA · Revenue Assurance",
    "dash_kpis": [("$2.1M", "MONTHLY REVENUE", "+400%"), ("54%", "GROSS MARGIN", "+250%"),
                  ("99.2%", "DATA QUALITY", "+31%"), ("0", "REPORT SILOS", "-100%")],
    "bar_title": "Revenue by month (12 mo.)",
    "bars": [20, 22, 25, 28, 33, 38, 44, 52, 60, 68, 78, 90],
    "bar_axis": "Jan to Dec",
    "donut_title": "Revenue by segment",
    "donut": [("Voice", 38), ("A2P SMS", 31), ("Data", 19), ("Other", 12)],
    "line_title": "Revenue leakage recovered",
    "line": [60, 55, 50, 44, 40, 33, 30, 24, 20, 16, 12, 9, 7, 5],
}

case_study_page(APAC, 2)
dashboard_page(APAC, 3)
case_study_page(MENA, 4)
dashboard_page(MENA, 5)


# ═════════════════════════ PAGE 6 — STACK + RESULTS ═════════════════════════
y = header_band("Data Tools & Results", "Dom Analytics d.o.o.  |  2026")

y = heading(y, "Data Tools & Stack")
y = para(M, y, "The tools we use, grouped by layer. On the telecom programs the focus was on the BI & "
                "Analytics and Data layers, from ETL pipelines and modeling to executive dashboards.",
         "Sans", 9.3, BODY, leading=13)
y -= 8
y = data_table(y,
               ["Layer", "Tools"],
               [["BI & Analytics", "QlikSense, Power BI, Tableau, Google Analytics, Pandas, Data Modeling, ETL Pipelines"],
                ["AI & Data", "Python, TensorFlow, PyTorch, OpenAI, LangChain, Scikit-learn, Hugging Face"],
                ["Backend & Cloud", "Node.js, PostgreSQL, AWS, Vercel, Docker, REST APIs, GraphQL"],
                ["Business & Strategy", "Business Intelligence, Business Analytics, KPI Frameworks, Market Research, Salesforce, HubSpot"]],
               [130, CW - 130])
y -= 16

y = heading(y, "Results at a Glance")
y = data_table(y,
               ["Engagement", "Revenue Growth", "Gross Profit", "Region"],
               [["Telecom Network Data Monetization", "+1,500%", "+1,150%", "APAC"],
                ["Telecom Revenue & Architecture Overhaul", "+400%", "+250%", "MENA"]],
               [240, 100, 90, CW - 430],
               align=["l", "r", "r", "l"])
y -= 6
footnote(y, ["Figures reflect delivered outcomes on real engagements. Client identities and underlying "
             "data are confidential; dashboard previews are representative and anonymized."])

page_footer(6)
c.showPage()


# ═════════════════════════ PAGE 7 — ENGAGEMENT + CONTACT ═════════════════════════
y = header_band("How We Engage", "Dom Analytics d.o.o.  |  2026")
y = heading(y, "Engagement Model")
y = para(M, y,
         "Engagements can be structured as project-based work with a defined scope, timeline and "
         "deliverables; flexible hourly advisory billed monthly; or a monthly retainer providing "
         "dedicated availability across all service areas. A short discovery call (30 minutes, no "
         "charge) is recommended as a first step to align on priorities and scope.",
         "Sans", 9.6, BODY, leading=15)
y -= 14

y = heading(y, "Why Dom Analytics")
y = bullets(M, y, [
    ("Inside the data layer.", "We do not advise from the outside. We clean, govern and rebuild the data foundation before layering analytics, AI and monetization on top."),
    ("Proven revenue impact.", "Telecom programs delivered between +400% and +1,500% revenue growth by turning untapped data into a revenue engine."),
    ("15+ years across 40+ countries.", "Hands-on data leadership in telecom, enterprise and technology, including complex multi-market environments."),
], CW)

contact_band(150)
page_footer(7)
c.showPage()

c.save()
print("WROTE", OUT)
