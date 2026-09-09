"""Reusable Black Swan Causal Labs report template; render the retained reports.

Requires reportlab. Run from any directory; PDF outputs are mirrored to the site.
Typography, palette, margins, header and footer are shared by both reports.
"""
import re
import shutil
from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
INK = colors.HexColor('#111412')
TEAL = colors.HexColor('#0b665d')
PAPER = colors.HexColor('#f4f1e8')
LINE = colors.HexColor('#d6d9d4')
STYLES = {
    'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=10, leading=14.3, textColor=INK, spaceAfter=9, allowWidows=0, allowOrphans=0),
    'title': ParagraphStyle('Title', fontName='Times-Roman', fontSize=30, leading=33, textColor=INK, spaceAfter=14),
    'heading': ParagraphStyle('Heading', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=TEAL, spaceBefore=12, spaceAfter=7, keepWithNext=True),
    'note': ParagraphStyle('Note', fontName='Helvetica', fontSize=9, leading=13, textColor=TEAL, backColor=PAPER, borderPadding=9, spaceBefore=5, spaceAfter=16),
    'cell': ParagraphStyle('Cell', fontName='Helvetica', fontSize=8.3, leading=11, textColor=INK),
    'tablehead': ParagraphStyle('TableHead', fontName='Helvetica-Bold', fontSize=8.3, leading=11, textColor=colors.white),
}

def inline(text):
    text = text.replace('—', ' - ').replace('–', '-').replace('\u2011','-').replace('’',"'").replace('“','"').replace('”','"')
    text = escape(text)
    def link(m):
        label, url = m.groups()
        if url.endswith('.md'):
            url = 'https://black-swan-causal-labs.github.io/RWE-MCP-Registry/public-data/' + url.replace('.md','.pdf')
        return f'<link href="{url}" color="#0b665d"><u>{label}</u></link>'
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    return text

def page(canvas, doc):
    canvas.saveState()
    width, height = doc.pagesize
    canvas.setFillColor(PAPER); canvas.rect(0,height-64,width,64,fill=1,stroke=0)
    canvas.setFillColor(INK); canvas.setFont('Helvetica-Bold',10)
    canvas.drawString(48,height-31,'BLACK SWAN')
    canvas.setFillColor(TEAL); canvas.setFont('Helvetica',10)
    canvas.drawString(123,height-31,'CAUSAL LABS')
    canvas.setFont('Helvetica',8); canvas.drawRightString(width-48,height-31,'RWE MCP REGISTRY')
    canvas.setStrokeColor(TEAL); canvas.line(48,height-52,width-48,height-52)
    canvas.setStrokeColor(LINE); canvas.line(48,43,width-48,43)
    canvas.setFillColor(TEAL); canvas.setFont('Helvetica',8)
    canvas.drawString(48,29,'blackswancausallabs.com')
    canvas.linkURL('https://blackswancausallabs.com',(48,25,190,39),relative=0)
    canvas.setFillColor(INK); canvas.drawRightString(width-48,29,f'{doc.short_title}  |  {doc.page}')
    canvas.restoreState()

def build(name, title, subtitle):
    source = ROOT/'public-data'/f'{name}.md'
    lines = source.read_text().splitlines()
    target = ROOT/'public-data'/f'{name}.pdf'
    doc = SimpleDocTemplate(str(target),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=82,bottomMargin=60,title=title,author='Black Swan Causal Labs',subject=subtitle)
    doc.short_title = 'Relevance audit' if name.startswith('relevance') else 'Search coverage'
    story = [Paragraph(inline(title),STYLES['title']),Paragraph(inline(subtitle),STYLES['note'])]
    i=1; seen_rounds=set()
    while i<len(lines):
        line=lines[i].strip();i+=1
        if not line: continue
        if line.startswith('|'):
            table_lines=[line]
            while i<len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip());i+=1
            rows=[]
            for l in table_lines:
                if re.match(r'^\|[\s:|\-]+\|$',l):continue
                rows.append([Paragraph(inline(x.strip()),STYLES['tablehead' if not rows else 'cell']) for x in l.strip('|').split('|')])
            table=Table(rows,colWidths=[112,157,247],repeatRows=1,hAlign='LEFT')
            table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),TEAL),('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,PAPER]),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,-1),(-1,-1),.5,LINE)]))
            story += [table,Spacer(1,12)];continue
        if line.startswith('## '):
            story.append(Paragraph(inline(line[3:]),STYLES['heading']));continue
        round_match=re.match(r'(?:Expansion round|Round) (\d+) (?:completed|also|is|closed)',line)
        if round_match and round_match[1] not in seen_rounds:
            seen_rounds.add(round_match[1]);story.append(Paragraph('Expansion round '+round_match[1],STYLES['heading']))
        if line.startswith('Search observations, individual reviews'):
            story.append(Paragraph('Interpretation and remaining work',STYLES['heading']))
        if line.startswith('> '): story.append(Paragraph(inline(line[2:]),STYLES['note']))
        elif line.startswith('- '): story.append(Paragraph(inline(line[2:]),STYLES['body'],bulletText='•'))
        else: story.append(Paragraph(inline(line),STYLES['body']))
    doc.build(story,onFirstPage=page,onLaterPages=page)
    shutil.copy2(target,ROOT/'public/public-data'/target.name)
    print(target)

if __name__=='__main__':
    build('relevance-audit-2026-09-08','RWE relevance audit','September 8, 2026 | Core catalogue, discovery archive and borderline review')
    build('search-coverage-2026-09-07','Search coverage and remaining work','September 7-8, 2026 | Historical discovery campaign and documented coverage limits')
