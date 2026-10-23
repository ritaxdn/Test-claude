"""Génère les templates de newsletter Cellulift Academy (un par segment).

E-mail « bulletproof » : tableaux, styles en ligne, 600 px, images hébergées sur cellulift.ma.
Variables à remplacer par celles de l'outil d'e-mailing : {{PRENOM}}, {{DESINSCRIPTION}}, {{VERSION_WEB}}.
"""
from pathlib import Path

SITE = "https://www.cellulift.ma"
OUT = Path(__file__).parent

PEARL, PEARL2, DEEP, SOFT, LINE = "#ECEEF3", "#E2E4EB", "#1D1B26", "#5D5B6B", "#DCDDE4"
RAINBOW = ["#00BCD4", "#7B61FF", "#E91E8C", "#FF5722", "#FFC107"]
VIOLET = "#6B5CFF"
SANS = "'Instrument Sans', Arial, Helvetica, sans-serif"
DISPLAY = "'Archivo', Arial, Helvetica, sans-serif"
MONO = "'JetBrains Mono', 'Courier New', monospace"


def utm(path, segment, content):
    sep = "&" if "?" in path else "?"
    url = path if path.startswith("http") else SITE + path
    if not url.startswith(SITE):
        return url
    return f"{url}{sep}utm_source=newsletter&utm_medium=email&utm_campaign=academy-newsletter&utm_content={segment}-{content}"


def rainbow_line(height=2):
    # Vrai dégradé dans les clients modernes, 4 aplats successifs dans Outlook.
    cells = "".join(
        f'<td height="{height}" bgcolor="{a}" style="height:{height}px;line-height:{height}px;font-size:0;'
        f'background:{a};background-image:linear-gradient(90deg,{a},{b});">&nbsp;</td>'
        for a, b in zip(RAINBOW, RAINBOW[1:])
    )
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{cells}</tr></table>'


def label(text, color=SOFT, size=11):
    return (f'<div style="font-family:{MONO};font-size:{size}px;line-height:1.5;letter-spacing:2px;'
            f'text-transform:uppercase;color:{color};">{text}</div>')


def button(text, href, solid=True):
    bg, fg, border = (DEEP, "#FFFFFF", DEEP) if solid else ("#FFFFFF", DEEP, "#C9CAD3")
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="{bg}" style="border-radius:999px;border:1px solid {border};">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{href}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="{bg}"><center style="color:{fg};font-family:Arial,sans-serif;font-size:15px;">{text} &#8599;</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="{href}" target="_blank" style="display:inline-block;white-space:nowrap;padding:14px 28px;font-family:{SANS};font-size:15px;font-weight:500;line-height:20px;color:{fg};text-decoration:none;border-radius:999px;">{text}&nbsp;&nbsp;&#8599;</a><!--<![endif]-->
</td></tr></table>"""


def card(inner, pad=28, bg="#FFFFFF"):
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="background:{bg};border:1px solid {LINE};border-radius:24px;"><tr>'
            f'<td style="padding:{pad}px;">{inner}</td></tr></table>')


def spacer(h):
    return f'<tr><td height="{h}" style="height:{h}px;line-height:{h}px;font-size:0;">&nbsp;</td></tr>'


def session_block(s, seg):
    meta = " · ".join(x for x in [s.get("time"), s.get("place"), f'{s["seats"]} places' if s.get("seats") else None] if x)
    sub = (f'<div style="font-family:{SANS};font-size:15px;line-height:1.5;color:{SOFT};margin-top:10px;">{s["subtitle"]}</div>'
           if s.get("subtitle") else "")
    meta_html = (f'<div style="margin-top:14px;">{label(meta, DEEP, 11)}</div>' if meta else "")
    href = utm(s.get("link") or "/fr/academy", seg, "session-vedette")
    inner = f"""{label('<span style="color:' + VIOLET + ';">&#9679;</span>&nbsp; Prochaine formation')}
<div style="font-family:{MONO};font-size:13px;letter-spacing:1px;color:{DEEP};margin-top:18px;text-transform:uppercase;">{s['date']}</div>
<div style="font-family:{DISPLAY};font-size:24px;line-height:1.15;font-weight:600;letter-spacing:-0.4px;color:{DEEP};margin-top:8px;">{s['title']}</div>
{sub}{meta_html}
<div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
{button('Réserver ma place', href)}"""
    return card(inner)


def agenda(sessions, seg):
    rows = ""
    for i, s in enumerate(sessions):
        border = f"border-top:1px solid {LINE};" if i else ""
        where = f' · {s["place"]}' if s.get("place") else ""
        rows += f"""<tr><td style="{border}padding:16px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="128" valign="top" style="font-family:{MONO};font-size:11px;line-height:1.6;letter-spacing:1px;text-transform:uppercase;color:{SOFT};">{s['short']}{where}</td>
<td valign="top" style="font-family:{SANS};font-size:15px;line-height:1.45;color:{DEEP};padding-left:12px;">
<a href="{utm(s.get('link') or '/fr/academy', seg, 'agenda')}" target="_blank" style="color:{DEEP};text-decoration:none;">{s['title']}&nbsp;<span style="color:{VIOLET};">&#8599;</span></a></td>
</tr></table></td></tr>"""
    inner = f"""{label('Agenda Academy')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">{rows}</table>
<div style="font-family:{SANS};font-size:14px;margin-top:6px;"><a href="{utm('/fr/academy', seg, 'calendrier')}" target="_blank" style="color:{VIOLET};text-decoration:underline;">Voir tout le calendrier</a></div>"""
    return card(inner)


def tech_cards(techs, seg):
    cols = ""
    for i, t in enumerate(techs):
        pad = "padding-right:8px;" if i == 0 else "padding-left:8px;"
        href = utm(f"/fr/technologies/{t['slug']}", seg, t["slug"])
        cols += f"""<td class="col" width="50%" valign="top" style="{pad}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border:1px solid {LINE};border-radius:24px;"><tr>
<td align="center" style="padding:20px 20px 0;background:{PEARL2};border-radius:24px 24px 0 0;">
<a href="{href}" target="_blank"><img src="{SITE}{t['img']}" width="{t['w']}" height="220" alt="{t['name']}" style="display:block;width:{t['w']}px;height:220px;border:0;"></a></td></tr>
<tr><td style="padding:20px 22px 24px;">
{label(t['cat'], SOFT, 10)}
<div style="font-family:{DISPLAY};font-size:18px;font-weight:600;letter-spacing:0.5px;color:{DEEP};margin-top:6px;text-transform:uppercase;">{t['name']}</div>
<div style="font-family:{SANS};font-size:14px;line-height:1.5;color:{SOFT};margin-top:8px;">{t['line']}</div>
<div style="font-family:{SANS};font-size:14px;margin-top:14px;"><a href="{href}" target="_blank" style="color:{DEEP};text-decoration:none;border-bottom:1px solid {VIOLET};">Voir la fiche&nbsp;&#8599;</a></div>
</td></tr></table></td>"""
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{cols}</tr></table>'


def journey():
    steps = ["Installation", "Formation initiale", "Protocoles", "Perfectionnement"]
    tds = "".join(
        f'<td class="step" width="25%" valign="top" style="padding:0 4px;">'
        f'<div style="font-family:{MONO};font-size:11px;color:{VIOLET};letter-spacing:1px;">0{i + 1}</div>'
        f'<div style="height:2px;line-height:2px;font-size:0;background:{RAINBOW[i]};background-image:linear-gradient(90deg,{RAINBOW[i]},{RAINBOW[i + 1]});margin:8px 0 10px;">&nbsp;</div>'
        f'<div style="font-family:{SANS};font-size:14px;line-height:1.35;color:{DEEP};">{s}</div></td>'
        for i, s in enumerate(steps)
    )
    inner = f"""{label('Le parcours Academy')}
<div style="font-family:{DISPLAY};font-size:20px;line-height:1.2;font-weight:600;color:{DEEP};margin-top:12px;text-transform:uppercase;letter-spacing:-0.2px;">Une machine n'est jamais une garantie de résultat.</div>
<div style="font-family:{SANS};font-size:15px;line-height:1.6;color:{SOFT};margin-top:10px;">Les résultats et la sécurité patient dépendent de la maîtrise du praticien. Chaque acquisition Cellulift s'accompagne d'un parcours de formation.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;"><tr>{tds}</tr></table>"""
    return card(inner)


def build(seg):
    s = seg
    head = f"""<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>{s['subject']}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@118,600&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  body {{ margin:0; padding:0; background:{PEARL}; }}
  a {{ color:{DEEP}; }}
  @media (max-width:620px) {{
    .wrap {{ width:100% !important; }}
    .px {{ padding-left:16px !important; padding-right:16px !important; }}
    .col {{ display:block !important; width:100% !important; padding:0 0 16px !important; }}
    .step {{ display:inline-block !important; width:46% !important; padding-bottom:14px !important; }}
    .h1 {{ font-size:30px !important; }}
    .btn {{ display:block !important; width:100% !important; }}
    .btn table {{ margin:0 auto !important; }}
  }}
</style>
</head>"""

    body = f"""
<body style="margin:0;padding:0;background:{PEARL};">
<!-- Pré-en-tête (aperçu dans la boîte de réception) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">{s['preheader']}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{PEARL}" style="background:{PEARL};background-image:radial-gradient(circle at 85% 0%,rgba(123,97,255,.10),transparent 45%),radial-gradient(circle at 0% 50%,rgba(0,188,212,.08),transparent 40%),radial-gradient(circle at 100% 100%,rgba(233,30,140,.07),transparent 45%);">
<tr><td align="center" style="padding:24px 0;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<tr><td class="px" align="right" style="padding:0 24px 12px;font-family:{SANS};font-size:12px;color:{SOFT};">
<a href="{{{{VERSION_WEB}}}}" style="color:{SOFT};text-decoration:underline;">Voir dans le navigateur</a></td></tr>

<!-- En-tête -->
<tr><td class="px" align="center" style="padding:20px 24px 18px;">
<a href="{utm('/fr/academy', s['key'], 'logo')}" target="_blank"><img src="{SITE}/email/cellulift-signature-logo.png" width="240" alt="CELLULIFT — Metamorphosis Technology" style="display:block;width:240px;height:auto;border:0;"></a>
<div style="margin-top:14px;">{label('Academy · Newsletter · ' + s['edition'], SOFT, 10)}</div>
</td></tr>
<tr><td class="px" style="padding:0 24px;">{rainbow_line()}</td></tr>

<!-- Ouverture -->
<tr><td class="px" style="padding:36px 24px 8px;">
{label('<span style="color:' + VIOLET + ';">&#9679;</span>&nbsp; ' + s['eyebrow'])}
<div class="h1" style="font-family:{DISPLAY};font-size:36px;line-height:1.02;font-weight:600;letter-spacing:-1px;text-transform:uppercase;color:{DEEP};margin-top:14px;">{s['title_a']} <span style="color:{VIOLET};">{s['title_b']}</span></div>
<div style="font-family:{SANS};font-size:16px;line-height:1.65;color:{DEEP};margin-top:22px;">Bonjour {{{{PRENOM}}}},</div>
<div style="font-family:{SANS};font-size:16px;line-height:1.65;color:{SOFT};margin-top:10px;">{s['intro']}</div>
</td></tr>
{spacer(24)}

<!-- Formation à la une -->
<tr><td class="px" style="padding:0 24px;">{session_block(s['featured'], s['key'])}</td></tr>
{spacer(16)}

<!-- Agenda -->
<tr><td class="px" style="padding:0 24px;">{agenda(s['agenda'], s['key'])}</td></tr>
{spacer(40)}

<!-- Technologies -->
<tr><td class="px" style="padding:0 24px 16px;">
{label(s['tech_eyebrow'])}
<div style="font-family:{DISPLAY};font-size:22px;line-height:1.15;font-weight:600;letter-spacing:-0.3px;text-transform:uppercase;color:{DEEP};margin-top:10px;">{s['tech_title']}</div>
</td></tr>
<tr><td class="px" style="padding:0 24px;">{tech_cards(s['techs'], s['key'])}</td></tr>
{spacer(24)}

<!-- Parcours -->
<tr><td class="px" style="padding:0 24px;">{journey()}</td></tr>
{spacer(40)}

<!-- Contact -->
<tr><td class="px" align="center" style="padding:0 24px;">
<div style="font-family:{DISPLAY};font-size:22px;line-height:1.15;font-weight:600;letter-spacing:-0.3px;text-transform:uppercase;color:{DEEP};">{s['cta_title']}</div>
<div style="font-family:{SANS};font-size:15px;line-height:1.6;color:{SOFT};margin:10px auto 22px;max-width:440px;">{s['cta_text']}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
<td class="btn" align="center" style="padding:0 6px 10px;">{button('Écrire sur WhatsApp', 'https://wa.me/212670842795')}</td>
<td class="btn" align="center" style="padding:0 6px 10px;">{button("Contacter l'équipe", utm('/fr/contact', s['key'], 'contact'), solid=False)}</td>
</tr></table>
</td></tr>
{spacer(36)}
<tr><td class="px" style="padding:0 24px;">{rainbow_line(1)}</td></tr>

<!-- Pied de page -->
<tr><td class="px" align="center" style="padding:24px 24px 8px;font-family:{SANS};font-size:12px;line-height:1.7;color:{SOFT};">
<a href="https://www.instagram.com/cellulift.academy/" target="_blank" style="color:{DEEP};text-decoration:none;">Instagram @cellulift.academy</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{utm('/fr', s['key'], 'footer')}" target="_blank" style="color:{DEEP};text-decoration:none;">cellulift.ma</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="tel:+212522490109" style="color:{DEEP};text-decoration:none;">+212 5 22 49 01 09</a><br>
Cellulift · N°02 Rue Savoie, Quartier des Hôpitaux · Casablanca, Maroc<br><br>
Vous recevez cet e-mail car vous êtes en relation avec Cellulift ou inscrit(e) à la newsletter de la Cellulift Academy.<br>
<a href="{{{{DESINSCRIPTION}}}}" style="color:{SOFT};text-decoration:underline;">Se désinscrire</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{SITE}/fr/privacy" style="color:{SOFT};text-decoration:underline;">Confidentialité</a>
</td></tr>
{spacer(24)}

</table>
</td></tr></table>
</body>
</html>"""
    return head + body


S_LASER = {"date": "Samedi 7 novembre 2026", "short": "7 nov. 2026", "title": "Laser × médecine régénérative : l'énergie peut-elle potentialiser la biostimulation ?",
           "subtitle": "Avec le Dr Mohamed Dadoun", "place": "Marrakech",
           "link": "https://cal.com/laser-medecine-regenerative-l-energie-peut-elle-potentialiser-la-biostimulation"}
S_EXCELLIA = {"date": "Lundi 26 octobre 2026", "short": "26 oct. 2026", "title": "Technologie, pricing & protocoles : les 3 leviers d'un centre de bien-être performant",
              "subtitle": "Masterclass Excellia Academy · Pourquoi certaines technologies deviennent rentables… et d'autres restent inutilisées ?"}

T = {
    "hanover": {"w": 176, "slug": "hanover-5g", "name": "HANOVER 5G", "cat": "Solutions lasers", "img": "/images/technologies/hanover-5g/v2-00.jpg", "line": "Laser endolift 980 nm et 1470 nm."},
    "sevenwaves": {"w": 147, "slug": "sevenwaves", "name": "SEVENWAVES", "cat": "Solutions lasers", "img": "/images/technologies/sevenwaves/00.jpg", "line": "4 technologies dans un seul équipement : diode, Nd:YAG, IPL et radiofréquence."},
    "pressoligne": {"w": 147, "slug": "pressoligne-5", "name": "PRESSOLIGNE 5", "cat": "Amincissement avancé", "img": "/images/technologies/pressoligne-5/00.jpg", "line": "Pressothérapie professionnelle pour drainer tout le corps."},
    "tanita": {"w": 176, "slug": "tanita", "name": "TANITA", "cat": "Amincissement avancé", "img": "/images/technologies/tanita/00.jpg", "line": "Moniteur de composition corporelle sans fil."},
    "laqueen": {"w": 176, "slug": "la-queen", "name": "LA QUEEN", "cat": "Solutions lasers", "img": "/images/technologies/la-queen/v2-00.jpg", "line": "4 technologies, 4000 W : épilation, vasculaire, pigments et IPL."},
    "slimax": {"w": 147, "slug": "slimax-lipo-7", "name": "SLIMAX LIPO 7", "cat": "Amincissement avancé", "img": "/images/technologies/slimax-lipo-7/00.jpg", "line": "4 technologies réunies pour traiter graisse et relâchement."},
}

SEGMENTS = [
    {
        "key": "medecins", "file": "newsletter-medecins.html", "edition": "Édition médecins",
        "subject": "Laser × médecine régénérative : la prochaine masterclass",
        "preheader": "Le 7 novembre à Marrakech avec le Dr Dadoun, et les technologies laser du moment.",
        "eyebrow": "Pour les médecins", "title_a": "La technologie s'acquiert.", "title_b": "La maîtrise se construit.",
        "intro": "Ce mois-ci, la Cellulift Academy vous propose de croiser énergie et biostimulation : une masterclass clinique avec le Dr Mohamed Dadoun, et deux plateformes laser au cœur des protocoles actuels.",
        "featured": S_LASER, "agenda": [S_LASER, S_EXCELLIA],
        "tech_eyebrow": "Focus technologies", "tech_title": "Les plateformes laser du mois", "techs": [T["hanover"], T["sevenwaves"]],
        "cta_title": "Une question sur un protocole ?", "cta_text": "Notre équipe vous répond sur les réglages, les indications et les prérequis des formations.",
    },
    {
        "key": "kines", "file": "newsletter-kines.html", "edition": "Édition kinésithérapeutes",
        "subject": "Corps, drainage, composition corporelle : la sélection du mois",
        "preheader": "Les technologies corps qui complètent votre pratique, et les prochaines dates de formation.",
        "eyebrow": "Pour les kinésithérapeutes", "title_a": "Mesurer, drainer,", "title_b": "suivre chaque patient.",
        "intro": "Pressothérapie, analyse de la composition corporelle : ce mois-ci, la Cellulift Academy met en avant les technologies corps qui s'intègrent à une pratique de kinésithérapie, avec les formations pour les maîtriser.",
        "featured": S_EXCELLIA, "agenda": [S_EXCELLIA, S_LASER],
        "tech_eyebrow": "Focus technologies", "tech_title": "Technologies corps", "techs": [T["pressoligne"], T["tanita"]],
        "cta_title": "Un projet pour votre cabinet ?", "cta_text": "Parlons des technologies adaptées à vos patients, de la formation et de l'accompagnement après installation.",
    },
    {
        "key": "centres", "file": "newsletter-centres-esthetiques.html", "edition": "Édition centres esthétiques",
        "subject": "Technologie, pricing & protocoles : la masterclass du 26 octobre",
        "preheader": "Pourquoi certaines technologies deviennent rentables… et d'autres restent inutilisées ?",
        "eyebrow": "Pour les centres esthétiques", "title_a": "Une technologie rentable,", "title_b": "c'est une technologie maîtrisée.",
        "intro": "Choisir la bonne machine ne suffit pas : le prix des séances, les protocoles et la formation de l'équipe font la différence. C'est le thème de la prochaine masterclass, et des deux technologies que nous mettons en avant ce mois-ci.",
        "featured": S_EXCELLIA, "agenda": [S_EXCELLIA, S_LASER],
        "tech_eyebrow": "Focus technologies", "tech_title": "Les incontournables du centre", "techs": [T["laqueen"], T["slimax"]],
        "cta_title": "Vous préparez une nouvelle offre ?", "cta_text": "Épilation, amincissement, soins visage : notre équipe vous aide à choisir la technologie et à la rentabiliser.",
    },
]

# Variables Brevo : prénom (vide si inconnu), lien de désinscription, version web.
BREVO = {"{{PRENOM}}": "{{ contact.PRENOM | default : '' }}", "{{DESINSCRIPTION}}": "{{ unsubscribe }}", "{{VERSION_WEB}}": "{{ mirror }}"}

if __name__ == "__main__":
    (OUT / "brevo").mkdir(exist_ok=True)
    for seg in SEGMENTS:
        html = build(seg)
        (OUT / seg["file"]).write_text(html, encoding="utf-8")
        for a, b in BREVO.items():
            html = html.replace(a, b)
        (OUT / "brevo" / seg["file"]).write_text(html, encoding="utf-8")
        print(seg["file"], "—", seg["subject"])
