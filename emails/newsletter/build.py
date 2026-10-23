"""Génère les templates de newsletter Cellulift Academy (un par segment).

E-mail « bulletproof » : tableaux, styles en ligne, 600 px, images hébergées sur cellulift.ma.
Gmail et Outlook ignorent les polices du site et les dégradés : le titre d'ouverture est donc une
image (hero/, rendue avec Archivo et le dégradé irisé), le reste du texte reste du vrai texte.
Variables à remplacer par celles de l'outil d'e-mailing : {{PRENOM}}, {{DESINSCRIPTION}}, {{VERSION_WEB}}.
"""
import os
from pathlib import Path

SITE = "https://www.cellulift.ma"
OUT = Path(__file__).parent
# Images d'ouverture : public/email/newsletter/ sur le site (NEWSLETTER_ASSETS pour un aperçu local).
ASSETS = os.environ.get("NEWSLETTER_ASSETS", f"{SITE}/email/newsletter")

PEARL, DEEP, SOFT, LINE = "#ECEEF3", "#1D1B26", "#5D5B6B", "#DCDDE4"
IRIS = ["#7FE3F0", "#A797FF", "#F29BD0", "#FFC58F"]  # iris pastel (anneau des boutons, repères)
LAVENDER = "#F1EFFE"
RAINBOW = ["#00BCD4", "#7B61FF", "#E91E8C", "#FF5722", "#FFC107"]
VIOLET = "#6B5CFF"
SANS = "'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"
DISPLAY = "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif"
MONO = "'JetBrains Mono', 'Courier New', monospace"


def utm(path, segment, content):
    sep = "&" if "?" in path else "?"
    url = path if path.startswith("http") else SITE + path
    if not url.startswith(SITE):
        return url
    return f"{url}{sep}utm_source=newsletter&utm_medium=email&utm_campaign=academy-newsletter&utm_content={segment}-{content}"


def rainbow_line(height=2):
    # Vrai dégradé dans les clients modernes, 4 aplats successifs dans Gmail et Outlook.
    cells = "".join(
        f'<td height="{height}" bgcolor="{a}" style="height:{height}px;line-height:{height}px;font-size:0;'
        f'background:{a};background-image:linear-gradient(90deg,{a},{b});">&nbsp;</td>'
        for a, b in zip(RAINBOW, RAINBOW[1:])
    )
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{cells}</tr></table>'


def label(text, color=SOFT, size=11):
    return (f'<div style="font-family:{MONO};font-size:{size}px;line-height:1.5;letter-spacing:2px;'
            f'text-transform:uppercase;color:{color};">{text}</div>')


def title(text, size=24, color=DEEP, top=10):
    return (f'<div style="font-family:{DISPLAY};font-size:{size}px;line-height:1.12;font-weight:700;letter-spacing:-0.4px;'
            f'text-transform:uppercase;color:{color};margin-top:{top}px;">{text}</div>')


def button(text, href, style="glass", width=230):
    """Bouton en verre, comme le CTA du site : pastille blanche translucide, bord blanc lumineux, reflet en haut,
    ombre douce, texte Deep et pastille ronde blanche avec la flèche. (Le paramètre style est conservé pour
    compatibilité : tous les boutons sont en verre.)"""
    glass = ("background:#F6F7FA;background-image:linear-gradient(145deg,rgba(255,255,255,.96),rgba(255,255,255,.62));"
             "border:1px solid #FFFFFF;box-shadow:inset 0 1px 0 #FFFFFF,0 0 0 1px rgba(29,27,38,.07),0 14px 30px -16px rgba(29,27,38,.38);")
    arrow = (f'<td width="34" valign="middle" style="padding:0 6px 0 0;">'
             f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="34" height="34" align="center" valign="middle" bgcolor="#FFFFFF" '
             f'style="width:34px;height:34px;border-radius:50%;background:#FFFFFF;box-shadow:0 4px 10px -4px rgba(29,27,38,.3);'
             f'font-family:{SANS};font-size:15px;font-weight:700;line-height:34px;color:{VIOLET};">'
             f'<a href="{href}" target="_blank" style="color:{VIOLET};text-decoration:none;display:block;">&#8599;</a></td></tr></table></td>')
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td bgcolor="#F6F7FA" style="border-radius:999px;{glass}">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{href}" style="height:46px;v-text-anchor:middle;width:{width}px;" arcsize="50%" strokecolor="#DCDDE4" fillcolor="#F6F7FA"><center style="color:{DEEP};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">{text} &#8599;</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle" style="padding:6px 14px 6px 22px;"><a href="{href}" target="_blank" style="display:inline-block;white-space:nowrap;font-family:{SANS};font-size:15px;font-weight:600;line-height:34px;color:{DEEP};text-decoration:none;">{text}</a></td>
{arrow}</tr></table><!--<![endif]-->
</td></tr></table>"""


def spacer(h):
    return f'<tr><td height="{h}" style="height:{h}px;line-height:{h}px;font-size:0;">&nbsp;</td></tr>'


def tech_row(t, seg, i):
    """Fiche en zigzag : scène de la machine (image) d'un côté, texte de l'autre ; empilées sur mobile, image d'abord."""
    href = utm(f"/fr/technologies/{t['slug']}", seg, t["slug"])
    points = "".join(
        f'<tr><td width="20" valign="top" style="font-family:{SANS};font-size:14px;line-height:1.5;color:{VIOLET};">&#10022;</td>'
        f'<td style="font-family:{SANS};font-size:14px;line-height:1.5;color:{DEEP};padding-bottom:6px;">{p}</td></tr>'
        for p in t["points"]
    )
    flip = i % 2 == 1
    kicker = f"0{i + 1} &middot; {t['cat']}"
    img = (f'<td class="col" width="260" valign="middle" dir="ltr" style="padding:0;">'
           f'<a href="{href}" target="_blank"><img src="{ASSETS}/machine-{t["slug"]}.jpg" width="260" alt="{t["name"]}" '
           f'style="display:block;width:100%;max-width:260px;height:auto;border:0;border-radius:28px;margin:0 auto;"></a></td>')
    txt = (f'<td class="col tcell" valign="middle" dir="ltr" style="padding:{"0 26px 0 6px" if flip else "0 6px 0 26px"};text-align:left;">'
           f'{label(kicker, SOFT, 10)}{title(t["name"], 26, DEEP, 8)}'
           f'<div style="font-family:{SANS};font-size:15px;line-height:1.55;color:{SOFT};margin-top:8px;">{t["line"]}</div>'
           f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">{points}</table>'
           f'<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>{button("Voir la fiche", href, "iris", 170)}</td>')
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="{"rtl" if flip else "ltr"}">'
            f'<tr>{img}{txt}</tr></table>')


def partners_strip(seg):
    names = ["LGL Expert", "Scelia", "IALIDRA", "ARTHROMED", "IYADA", "GALENICA", "SOSKIN"]
    row = " &nbsp;&middot;&nbsp; ".join(names)
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid {LINE};border-bottom:1px solid {LINE};"><tr><td align="center" style="padding:20px 8px;">
{label('Nos partenaires', SOFT, 10)}
<div style="font-family:{MONO};font-size:12px;line-height:1.9;letter-spacing:1.5px;text-transform:uppercase;color:{DEEP};margin-top:8px;">{row}</div>
</td></tr></table>"""


def academy_block(seg):
    """Parcours Academy sur carte blanche : liseré arc-en-ciel, 4 étapes numérotées en couleurs de la marque."""
    steps = ["Installation", "Formation initiale", "Protocoles", "Perfectionnement"]
    cell = lambda i: (
        f'<td class="step" width="25%" valign="top" style="padding:0 6px 14px 0;">'
        f'<div style="font-family:{DISPLAY};font-size:34px;font-weight:700;line-height:1;color:{RAINBOW[i]};">0{i + 1}</div>'
        f'<div style="height:3px;line-height:3px;font-size:0;background:{IRIS[i]};width:44px;margin:10px 0 8px;border-radius:3px;">&nbsp;</div>'
        f'<div style="font-family:{SANS};font-size:15px;font-weight:600;line-height:1.3;color:{DEEP};">{steps[i]}</div></td>'
    )
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background:#FFFFFF;border:1px solid {LINE};border-radius:28px;border-collapse:separate;overflow:hidden;">
<tr><td style="padding:0;border-radius:28px 28px 0 0;overflow:hidden;">{rainbow_line(4)}</td></tr>
<tr><td style="padding:30px 30px 26px;">
{label('<span style="color:' + VIOLET + ';">&#9679;</span>&nbsp; Le parcours Cellulift Academy')}
{title("Une machine n'est jamais une garantie de résultat.", 24, DEEP, 12)}
<div style="font-family:{SANS};font-size:15px;line-height:1.6;color:{SOFT};margin-top:10px;">Les résultats et la sécurité patient dépendent de la maîtrise du praticien. Chaque acquisition Cellulift s'accompagne d'un parcours de formation.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>{cell(0)}{cell(1)}{cell(2)}{cell(3)}</tr></table>
<div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
{button("Découvrir l'Academy", utm('/fr/academy', seg, 'academy'), 'iris')}
</td></tr></table>"""


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
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@118,700&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  body {{ margin:0; padding:0; background:{PEARL}; }}
  a {{ color:{DEEP}; }}
  @media (max-width:620px) {{
    .wrap {{ width:100% !important; }}
    .px {{ padding-left:14px !important; padding-right:14px !important; }}
    .col {{ display:block !important; width:100% !important; box-sizing:border-box; }}
    .photo {{ border-radius:23px 23px 0 0 !important; }}
    .tcell {{ padding:18px 6px 0 !important; }}
    .step {{ display:inline-block !important; width:48% !important; }}
    .btn {{ display:block !important; width:100% !important; }}
    .btn table {{ margin:0 auto !important; }}
  }}
</style>
</head>"""

    techs = "\n{}\n".format(spacer(26)).join(
        f'<tr><td class="px" style="padding:0 24px;">{tech_row(t, s["key"], i)}</td></tr>' for i, t in enumerate(s["techs"])
    )
    body = f"""
<body style="margin:0;padding:0;background:{PEARL};">
<!-- Pré-en-tête (aperçu dans la boîte de réception) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">{s['preheader']}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{PEARL}" style="background:{PEARL};">
<tr><td align="center" style="padding:20px 0;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<!-- En-tête -->
<tr><td class="px" style="padding:0 24px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><a href="{utm('/fr/academy', s['key'], 'logo')}" target="_blank"><img src="{SITE}/email/cellulift-signature-logo.png" width="170" alt="CELLULIFT — Metamorphosis Technology" style="display:block;width:170px;height:auto;border:0;"></a></td>
<td valign="middle" align="right" style="font-family:{SANS};font-size:12px;color:{SOFT};"><a href="{{{{VERSION_WEB}}}}" style="color:{SOFT};text-decoration:underline;">Version web</a></td>
</tr></table></td></tr>

<!-- Ouverture : titre en image (polices et dégradé de la marque, identiques dans toutes les messageries) -->
<tr><td class="px" style="padding:0 24px;">
<a href="{utm('/fr/academy', s['key'], 'hero')}" target="_blank"><img src="{ASSETS}/hero-{s['key']}.jpg" width="552" alt="{s['edition']} — {s['title_a']} {s['title_b']}" style="display:block;width:100%;max-width:552px;height:auto;border:0;border-radius:24px;"></a></td></tr>

<!-- Mot d'ouverture -->
<tr><td class="px" style="padding:30px 28px 6px;">
<div style="font-family:{SANS};font-size:17px;line-height:1.6;color:{DEEP};font-weight:600;">Bonjour {{{{PRENOM}}}},</div>
<div style="font-family:{SANS};font-size:16px;line-height:1.7;color:{SOFT};margin-top:8px;">{s['intro']}</div>
<div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
{button('Demander une démonstration', utm('/fr/contact', s['key'], 'demo'), 'iris', 290)}
</td></tr>
{spacer(34)}

<!-- Technologies -->
<tr><td class="px" style="padding:0 28px 16px;">
{label('<span style="color:' + VIOLET + ';">&#9679;</span>&nbsp; ' + s['tech_eyebrow'])}
{title(s['tech_title'], 26)}
</td></tr>
{techs}
{spacer(30)}
<tr><td class="px" style="padding:0 24px;">{partners_strip(s['key'])}</td></tr>
{spacer(30)}

<!-- Parcours Academy -->
<tr><td class="px" style="padding:0 24px;">{academy_block(s['key'])}</td></tr>
{spacer(40)}

<!-- Contact : bandeau lavande -->
<tr><td class="px" style="padding:0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{LAVENDER}" style="background:{LAVENDER};border-radius:28px;border-collapse:separate;"><tr><td align="center" style="padding:34px 24px 26px;">
{title(s['cta_title'], 22, DEEP, 0)}
<div style="font-family:{SANS};font-size:15px;line-height:1.6;color:{SOFT};margin:10px auto 22px;max-width:440px;">{s['cta_text']}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
<td class="btn" align="center" style="padding:0 6px 10px;">{button('Écrire sur WhatsApp', 'https://wa.me/212670842795', 'iris')}</td>
<td class="btn" align="center" style="padding:0 6px 10px;">{button("Contacter l'équipe", utm('/fr/contact', s['key'], 'contact'), 'plain')}</td>
</tr></table>
</td></tr></table>
</td></tr>
{spacer(32)}
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


# Fiches : textes repris des fiches machines du site (src/content/technology-sheets.ts).
# w = largeur de la photo pour 260 px de haut (proportions de l'original).
T = {
    "hanover": {"w": 208, "slug": "hanover-5g", "name": "HANOVER 5G", "cat": "Solutions lasers", "img": "/images/technologies/hanover-5g/v2-00.jpg",
                "line": "Laser endolift 980 nm et 1470 nm.",
                "points": ["Lipolyse : double menton, bras, corps", "Traitement laser endoveineux (EVLT)", "Varicosités, télangiectasies, angiomes"]},
    "sevenwaves": {"w": 173, "slug": "sevenwaves", "name": "SEVENWAVES", "cat": "Solutions lasers", "img": "/images/technologies/sevenwaves/00.jpg",
                   "line": "4 technologies dans un seul équipement : diode, Nd:YAG, IPL et radiofréquence.",
                   "points": ["Épilation permanente, tous phototypes", "Taches pigmentaires, détatouage, Carbon Peel", "Rajeunissement et remodelage visage et corps"]},
    "pressoligne": {"w": 173, "slug": "pressoligne-5", "name": "PRESSOLIGNE 5", "cat": "Amincissement avancé", "img": "/images/technologies/pressoligne-5/00.jpg",
                    "line": "Pressothérapie professionnelle pour drainer tout le corps.",
                    "points": ["Jambes lourdes et rétention d'eau", "Fatigue musculaire", "Fermeté de la peau"]},
    "tanita": {"w": 208, "slug": "tanita", "wide": True, "name": "TANITA", "cat": "Amincissement avancé", "img": "/images/technologies/tanita/00.jpg",
               "line": "Moniteur de composition corporelle sans fil.",
               "points": ["Bilan de composition corporelle", "Suivi des programmes minceur", "Suivi nutritionnel et sportif"]},
    "laqueen": {"w": 208, "slug": "la-queen", "name": "LA QUEEN", "cat": "Solutions lasers", "img": "/images/technologies/la-queen/v2-00.jpg",
                "line": "4 technologies, 4000 W : épilation, vasculaire, pigments et IPL.",
                "points": ["Épilation définitive, tous phototypes", "Varicosités et télangiectasies", "Détatouage toutes couleurs, Carbon Peel"]},
    "slimax": {"w": 173, "slug": "slimax-lipo-7", "name": "SLIMAX LIPO 7", "cat": "Amincissement avancé", "img": "/images/technologies/slimax-lipo-7/00.jpg",
               "line": "4 technologies réunies pour traiter graisse et relâchement.",
               "points": ["Abdomen, flancs et dos", "Intérieur et extérieur des cuisses", "Relâchement cutané"]},
}

# hero_size : taille du titre dans l'image d'ouverture (hero/render.cjs).
SEGMENTS = [
    {
        "key": "medecins", "file": "newsletter-medecins.html", "edition": "Édition médecins", "hero_size": 66,
        "subject": "HANOVER 5G, SEVENWAVES : les plateformes laser du mois",
        "preheader": "Endolift, plateformes multi-technologies, et le parcours de formation qui accompagne chaque installation.",
        "title_a": "La technologie s’acquiert.", "title_b": "La maîtrise se construit.",
        "intro": "Ce mois-ci, la Cellulift Academy vous présente deux plateformes laser au cœur des protocoles actuels, et le parcours de formation qui accompagne chaque installation.",
        "tech_eyebrow": "Focus technologies", "tech_title": "Les plateformes laser du mois", "techs": [T["hanover"], T["sevenwaves"]],
        "cta_title": "Une question sur un protocole ?", "cta_text": "Notre équipe vous répond sur les réglages, les indications et les prérequis des formations.",
    },
    {
        "key": "kines", "file": "newsletter-kines.html", "edition": "Édition kinésithérapeutes", "hero_size": 74,
        "subject": "Drainage et composition corporelle : la sélection du mois",
        "preheader": "Pressothérapie et analyse corporelle : deux technologies corps pour votre cabinet.",
        "title_a": "Mesurer, drainer,", "title_b": "suivre chaque patient.",
        "intro": "Pressothérapie, analyse de la composition corporelle : ce mois-ci, la Cellulift Academy met en avant deux technologies corps qui s'intègrent à une pratique de kinésithérapie, avec la formation pour les maîtriser.",
        "tech_eyebrow": "Focus technologies", "tech_title": "Technologies corps", "techs": [T["pressoligne"], T["tanita"]],
        "cta_title": "Un projet pour votre cabinet ?", "cta_text": "Parlons des technologies adaptées à vos patients, de la formation et de l'accompagnement après installation.",
    },
    {
        "key": "centres", "file": "newsletter-centres-esthetiques.html", "edition": "Édition centres esthétiques", "hero_size": 60,
        "subject": "Épilation et amincissement : les incontournables du centre",
        "preheader": "LA QUEEN et SLIMAX LIPO 7 : deux technologies pour développer votre offre.",
        "title_a": "Une technologie rentable,", "title_b": "c’est une technologie maîtrisée.",
        "intro": "Choisir la bonne machine ne suffit pas : les protocoles et la formation de l'équipe font la différence. Ce mois-ci, nous vous présentons deux technologies incontournables du centre, et le parcours de formation qui les accompagne.",
        "tech_eyebrow": "Focus technologies", "tech_title": "Les incontournables du centre", "techs": [T["laqueen"], T["slimax"]],
        "cta_title": "Vous préparez une nouvelle offre ?", "cta_text": "Épilation, amincissement, soins visage : notre équipe vous aide à choisir la technologie et à la rentabiliser.",
    },
]

# Variables Brevo : « Bonjour Prénom, » (« Bonjour, » sans prénom), lien de désinscription, version web.
BREVO = {"Bonjour {{PRENOM}},": "Bonjour{% if contact.PRENOM %} {{ contact.PRENOM }}{% endif %},", "{{DESINSCRIPTION}}": "{{ unsubscribe }}", "{{VERSION_WEB}}": "{{ mirror }}"}

if __name__ == "__main__":
    (OUT / "brevo").mkdir(exist_ok=True)
    for seg in SEGMENTS:
        html = build(seg)
        (OUT / seg["file"]).write_text(html, encoding="utf-8")
        for a, b in BREVO.items():
            html = html.replace(a, b)
        (OUT / "brevo" / seg["file"]).write_text(html, encoding="utf-8")
        print(seg["file"], "—", seg["subject"])
