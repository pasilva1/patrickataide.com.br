from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "assets" / "patrick-ataide-cv.pdf"
NAVY = colors.HexColor("#0A1128")
CYAN = colors.HexColor("#00B4D8")
SAGE = colors.HexColor("#B8C7B0")
TEXT = colors.HexColor("#29313D")
MUTED = colors.HexColor("#667085")

styles = {
    "name": ParagraphStyle(
        "Name", fontName="Helvetica-Bold", fontSize=22, leading=26,
        textColor=colors.white,
    ),
    "role": ParagraphStyle(
        "Role", fontName="Helvetica", fontSize=9.4, leading=12,
        textColor=SAGE,
    ),
    "contact": ParagraphStyle(
        "Contact", fontName="Helvetica", fontSize=8.2, leading=11,
        textColor=colors.white,
    ),
    "section": ParagraphStyle(
        "Section", fontName="Helvetica-Bold", fontSize=9.3, leading=12,
        textColor=CYAN, spaceBefore=5, spaceAfter=3, keepWithNext=True,
    ),
    "body": ParagraphStyle(
        "Body", fontName="Helvetica", fontSize=8.7, leading=12,
        textColor=TEXT, alignment=TA_LEFT, spaceAfter=3,
    ),
    "job": ParagraphStyle(
        "Job", fontName="Helvetica-Bold", fontSize=9.2, leading=11,
        textColor=NAVY, spaceBefore=4, keepWithNext=True,
    ),
    "meta": ParagraphStyle(
        "Meta", fontName="Helvetica-Oblique", fontSize=8, leading=10,
        textColor=MUTED, spaceAfter=2, keepWithNext=True,
    ),
    "bullet": ParagraphStyle(
        "Bullet", fontName="Helvetica", fontSize=8.2, leading=10.8,
        textColor=TEXT, leftIndent=12, firstLineIndent=0, spaceAfter=1.5,
    ),
}


def section(story, title):
    story.append(Paragraph(escape(title.upper()), styles["section"]))
    story.append(HRFlowable(width="100%", thickness=0.7, color=CYAN, spaceAfter=5))


def bullet(text):
    return Paragraph(escape(text), styles["bullet"], bulletText="•")


def job(story, title, company, dates, responsibilities):
    items = [
        Paragraph(escape(title), styles["job"]),
        Paragraph(escape(f"{company} | {dates}"), styles["meta"]),
    ]
    items.extend(bullet(item) for item in responsibilities)
    items.append(Spacer(1, 4))
    story.append(KeepTogether(items))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(CYAN)
    canvas.setLineWidth(0.7)
    canvas.line(17 * mm, 13 * mm, A4[0] - 17 * mm, 13 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(17 * mm, 8 * mm, "Patrick André Ataíde da Silva")
    canvas.drawRightString(A4[0] - 17 * mm, 8 * mm, str(doc.page))
    canvas.restoreState()


doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=17 * mm,
    leftMargin=17 * mm,
    topMargin=15 * mm,
    bottomMargin=19 * mm,
    title="Currículo - Patrick André Ataíde da Silva",
    author="Patrick André Ataíde da Silva",
)

header = Table(
    [
        [Paragraph("PATRICK ANDRÉ ATAÍDE DA SILVA", styles["name"])],
        [Paragraph(
            "Especialista em Automação, Integração de Sistemas e Desenvolvimento Backend Python",
            styles["role"],
        )],
        [Paragraph(
            "Olinda/PE  |  (81) 98930-4727  |  patrickataide.ti@gmail.com  |  www.patrickataide.com.br",
            styles["contact"],
        )],
    ],
    colWidths=[doc.width],
)
header.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), NAVY),
    ("BOX", (0, 0), (-1, -1), 0, NAVY),
    ("LEFTPADDING", (0, 0), (-1, -1), 14),
    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ("TOPPADDING", (0, 0), (-1, 0), 11),
    ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
    ("TOPPADDING", (0, 1), (-1, 1), 0),
    ("BOTTOMPADDING", (0, 1), (-1, 1), 4),
    ("TOPPADDING", (0, 2), (-1, 2), 0),
    ("BOTTOMPADDING", (0, 2), (-1, 2), 10),
    ("LINEBELOW", (0, -1), (-1, -1), 2, CYAN),
]))

story = [header, Spacer(1, 10)]
section(story, "Resumo profissional")
story.append(Paragraph(
    escape(
        "Profissional de TI com mais de 20 anos de experiência, especializado em automação de processos, integração de sistemas, desenvolvimento backend em Python e arquitetura de soluções. Atuação consolidada com FastAPI, Flask, Selenium, Playwright, Docker, APIs REST, Oracle, SQL Server e PostgreSQL, aliada a sólida base em infraestrutura de TI, ambientes Linux e Windows."
    ),
    styles["body"],
))

section(story, "Objetivo profissional")
story.append(Paragraph(
    escape("Arquiteto de Automações | Arquiteto de Soluções | Engenheiro de Integração | Analista de Sistemas Sênior | Desenvolvedor Backend Python"),
    styles["body"],
))

section(story, "Experiência profissional")
job(story, "Consultor de Sistemas Sênior - QAE, Quality Assurance Engineer", "Deloitte", "Março de 2026 - Atual", [
    "Liderança na implementação de práticas de Governança de QA, definição de padrões de automação, estratégia de testes e testabilidade.",
    "Análise de requisitos, planejamento e execução de testes; criação de boilerplates; implantação de data-testid/data-attributes; automação com Cypress, Playwright e Selenium; gestão de defeitos e colaboração com equipes de Produto, negócios e tecnologia para garantir entregas com alta qualidade e confiabilidade.",
])
job(story, "Analista de Sistemas de Automação Pleno", "Central IT", "Fevereiro de 2024 - Fevereiro de 2026", [
    "Condução de projetos de integração e automação com sistemas ERP (Sankhya, ComplianceHCM e Keeps).",
    "Elaboração de consultas e rotinas em Oracle, SQL Server e PostgreSQL.",
    "Desenvolvimento de soluções em Python (Flask, FastAPI, Selenium, Playwright e Docker Compose).",
    "Modelagem de dados e implementação de fluxos automatizados.",
])
job(story, "Analista de Infraestrutura", "Central IT", "Março de 2021 - Fevereiro de 2024", [
    "Gestão de backup corporativo e políticas de proteção de dados.",
    "Automação de relatórios e administração de ambientes de infraestrutura.",
])

story.append(PageBreak())
section(story, "Experiência profissional - continuação")
job(story, "Analista de TI - Regional Nordeste", "Elis", "Maio de 2018 - Março de 2021", [
    "Gestão de infraestrutura de TI em 11 filiais da regional Nordeste.",
    "Arquitetura de rede, firewall, servidores e tecnologia RFID.",
    "Implantação de projetos e coordenação de equipes terceirizadas.",
])
job(story, "Analista de Suporte Sênior", "Hospital do Câncer de Pernambuco", "Abril de 2014 - Janeiro de 2017", [
    "Administração de servidores corporativos.",
    "Implantação de servidor de intranet e sistema de inventário.",
    "Estruturação e organização da rede corporativa.",
])
job(story, "Administrador de Redes", "NSLOG", "Fevereiro de 2012 - Abril de 2014", [
    "Implantação de Data Center e supervisão de equipes terceirizadas.",
    "Administração do parque tecnológico de todas as filiais, atendendo às áreas de logística, transporte, higienização e táxi aéreo.",
])

section(story, "Formação acadêmica")
story.append(Paragraph(escape("Graduação em Redes de Computadores - Universidade Joaquim Nabuco (2009)."), styles["body"]))
story.append(Paragraph(escape("Pós-graduação Lato Sensu em Teste e Qualidade de Software - UNINASSAU (2024)."), styles["body"]))

section(story, "Certificações e cursos")
story.append(bullet("Engenheiro DevOps (Docker, Kubernetes, AWS, Jenkins e Ansible)."))
story.append(bullet("Segurança Web - Especialista em Segurança de Aplicações."))

section(story, "Habilidades técnicas")
for item in [
    "Inteligência Artificial: OpenAI, Hugging Face e LangChain.",
    "Automação de Processos: Power Automate e RPA (PyAutoGUI).",
    "Desenvolvimento: Python, Flask, FastAPI (Swagger), Pandas e Requests.",
    "Bancos de Dados: SQL Server, Oracle SQL e PostgreSQL.",
    "Ferramentas e Plataformas: Postman, Keycloak, Selenium e Docker Compose.",
]:
    story.append(bullet(item))

section(story, "Reconhecimentos")
story.append(Paragraph(
    escape("Premiado em hackathon de Inteligência Artificial, com destaque em competição voltada ao desenvolvimento de soluções aplicadas de IA."),
    styles["body"],
))

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"CV gerado: {OUTPUT} ({OUTPUT.stat().st_size} bytes)")