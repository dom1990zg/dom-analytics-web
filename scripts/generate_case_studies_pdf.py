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
         "actually did, how we did it, the data tools we used, what we collected, and the end result. "
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

    y = heading(y, "What We Did")
    y = para(M, y, meta["what"], "Sans", 9.5, BODY, leading=14.5)
    y -= 14

    y = heading(y, "How We Did It")
    y = bullets(M, y, meta["how"], CW, size=9.3)
    y -= 14

    y = heading(y, "Data We Collected")
    y = para(M, y, meta["collected"], "Sans", 9.3, BODY, leading=13.5)
    y -= 14

    y = heading(y, "Tools We Used")
    y = para(M, y, meta["tools"], "Sans", 9.3, BODY, leading=13.5)
    y -= 14

    y = heading(y, "The Result")
    y = para(M, y, meta["result"], "Sans", 9.5, BODY, leading=14.5)

    page_footer(pageno)
    c.showPage()


APAC = {
    "title": "Case Study 01: APAC Telecom",
    "region": "APAC Region", "industry": "Telecommunications",
    "subtitle": "Telecom Network Data Monetization",
    "headline_metric": "+1,500% revenue  ·  +1,150% gross profit",
    "kpis": [("+1,500%", "REVENUE GROWTH"), ("+1,150%", "GROSS PROFIT GROWTH"),
             ("Real-time", "BI & REPORTING LAYER"), ("Unified", "GOVERNED DATA MODEL")],
    "what": "A major telecommunications network was sitting on enormous amounts of traffic and routing "
            "data but had no visibility into how it could drive revenue. Reporting was siloed, data "
            "quality was poor and there was no monetization strategy, so revenue stayed flat despite high "
            "traffic volumes. We took ownership of the data layer and turned that raw data into a "
            "measurable revenue stream.",
    "how": [
        ("Data audit.", "Mapped every traffic and routing source, identified gaps and assessed data quality across the network."),
        ("Clean and restructure.", "Rebuilt the data architecture, removed reporting silos and standardized the data into one governed model."),
        ("Automated pipelines and BI.", "Built automated pipelines and a real-time BI layer that gave the business visibility it had never had before."),
        ("Monetization strategy.", "Designed and implemented a new data-driven monetization strategy on top of the clean foundation."),
    ],
    "collected": "CDR / xDR records, routing and interconnect traffic, traffic and volumes by "
                 "destination, billing records, network KPIs and margins per route.",
    "tools": "QlikSense, Power BI, Python, Pandas, ETL pipelines, PostgreSQL, data modeling, KPI frameworks.",
    "result": "A complete transformation of the network's revenue performance. Data that was previously "
              "invisible became the engine behind a 1,500% revenue increase and 1,150% gross profit "
              "increase, with infrastructure that keeps generating value after the engagement.",
}

MENA = {
    "title": "Case Study 02: MENA Telecom",
    "region": "MENA Region", "industry": "Telecommunications",
    "subtitle": "Telecom Revenue & Data Architecture Overhaul",
    "headline_metric": "+400% revenue  ·  +250% gross profit",
    "kpis": [("+400%", "REVENUE GROWTH"), ("+250%", "GROSS PROFIT GROWTH"),
             ("Zero", "REPORTING SILOS"), ("Unified", "GOVERNED DATA MODEL")],
    "what": "A telecommunications network had significant revenue potential locked inside fragmented, "
            "ungoverned data. Multiple systems produced inconsistent reports, making it impossible to "
            "see where revenue was being lost or where new opportunities existed, so the business was "
            "operating blind. We rebuilt the data foundation and then monetized it.",
    "how": [
        ("Comprehensive data audit.", "Reviewed every system and surfaced hidden revenue streams that were invisible without proper governance."),
        ("Eliminate silos.", "Restructured the entire data architecture and removed the inconsistent, siloed reporting."),
        ("Quality and unified layer.", "Established data quality standards and built a single, unified analytics layer the business could trust."),
        ("Monetization strategy.", "Designed a new monetization strategy based on what the clean data revealed."),
    ],
    "collected": "CDR records, A2P and SMS traffic, routing data, revenue records, carrier and partner "
                 "data, rates per route and data quality metrics.",
    "tools": "Power BI, QlikSense, Python, ETL pipelines, data governance, PostgreSQL, data modeling, Tableau.",
    "result": "The project delivered 400% revenue growth and 250% gross profit increase. Beyond the "
              "numbers, the business was left with a clean, governed data foundation and a monetization "
              "playbook it could apply across other markets.",
}

case_study_page(APAC, 2)
case_study_page(MENA, 3)


# ═════════════════════════ PAGE 6 — STACK + RESULTS ═════════════════════════
y = header_band("Data Tools & Results", "Dom Analytics d.o.o.  |  2026")

y = heading(y, "Data Tools & Stack")
y = para(M, y, "The tools we use, grouped by layer. On the telecom programs the focus was on the BI & "
                "Analytics and Data layers, from ETL pipelines and modeling to KPI and executive reporting.",
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
             "data are confidential and shared on request under NDA."])

page_footer(4)
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
page_footer(5)
c.showPage()

c.save()
print("WROTE", OUT)
