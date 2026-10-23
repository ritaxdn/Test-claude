"""Newsletter médecins N°01 : « Ils ont perdu 15 kilos. Leur visage aussi. » (patients sous GLP-1).

Texte et structure fournis par Cellulift, adaptés aux règles de la marque : pas de fond noir, boutons en
verre, titres et étiquettes rendus aux polices de la marque (images, voir build.text_img).
Écrit newsletter-medecins.html et brevo/newsletter-medecins.html (remplace la version générique de build.py).

Objet A : Ils ont perdu 15 kilos. Leur visage aussi.
Objet B : 1 patient GLP-1 sur 3 est nouveau au cabinet
Objet C : Le « visage GLP-1 », nouveau motif de consultation
"""
import json
import sys
from urllib.parse import quote

import build as b
from build import ASSETS, DEEP, GLASS_CARD, LAVENDER, LINE, RAINBOW, SANS, SITE, SOFT, VIOLET, button, label, rainbow_line, text_img, title

KEY = "medecins"
SUBJECT = "Ils ont perdu 15 kilos. Leur visage aussi."
PREHEADER = "52 % s'inquiètent pour leur visage. Voici comment les accueillir."
UTM = "utm_source=newsletter&utm_medium=email&utm_campaign=n01_glp1"
BODY = "#3A3846"
HERO_TITLE = [("Ils ont perdu 15\u00a0kilos. ", DEEP), ("Leur visage ", VIOLET), ("aussi.", "#E91E8C")]
CARD = f"border-radius:28px;border-collapse:separate;{GLASS_CARD}"


def link(path, content):
    sep = "&" if "?" in path else "?"
    return f"{SITE}{path}{sep}{UTM}&utm_content=medecins-{content}"


DEMO = link("/fr/contact?sujet=demo&machine=hanover-5g", "demo")
DEMO_CENTRI = link("/fr/contact?sujet=demo&machine=centrifugel", "demo-centrifugel")
FICHE_HANOVER = link("/fr/technologies/hanover-5g", "fiche-hanover")
FICHE_CENTRI = link("/fr/technologies/centrifugel", "fiche-centrifugel")
INSCRIPTION = link("/fr/academy", "inscription-confrere")
# Chaque lien mène à une demande de rendez-vous (formulaire du site) ou à WhatsApp avec un message prérempli.
def wa(message):
    return "https://wa.me/212670842795?text=" + quote(f"Bonjour Cellulift, {message} (newsletter médecins N°01)")


WHATSAPP = wa("je souhaite réserver une démonstration du protocole GLP-1 : HANOVER 5G et CENTRIFUGEL.")
WA_HANOVER = wa("je souhaite voir la HANOVER 5G en démonstration.")
WA_CENTRI = wa("je souhaite voir la CENTRIFUGEL et le Biofiller X7 en démonstration.")
WA_FORMATION = wa("je souhaite recevoir le programme de formation Cellulift Academy (endolift et Biofiller X7).")
WA_BILAN = wa("BILAN : je souhaite recevoir la fiche « Bilan visage GLP-1 ».")


def p(text, size=15, color=BODY, top=14, weight=300):
    return f'<p style="margin:{top}px 0 0;font-family:{SANS};font-size:{size}px;line-height:1.6;font-weight:{weight};color:{color};">{text}</p>'


def kicker(text, color=SOFT, dot=VIOLET, maxw=520):
    return label(f'<span style="color:{dot};">&#9679;</span>&nbsp; {text}', color, 11, maxw)


def numbered(i, head, text):
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}"><tr>
<td valign="top" width="64" style="padding:24px 0 24px 26px;">{text_img(f"0{i}", "display", 26, RAINBOW[i - 1], 60)}</td>
<td style="padding:22px 26px 22px 8px;">{title(head, 17, DEEP, 0, 430)}
<div style="padding-top:8px;font-family:{SANS};font-size:14px;line-height:22px;font-weight:300;color:{SOFT};">{text}</div></td>
</tr></table>"""


def machine(slug, name, kick, text, cta, demo, fiche, whatsapp):
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}"><tr>
<td class="col" width="40%" align="center" valign="middle" style="padding:22px;"><a href="{demo}" target="_blank"><img src="{ASSETS}/machine-{slug}.jpg" width="190" alt="{name}" style="display:block;width:190px;max-width:100%;height:auto;border:0;border-radius:20px;"></a></td>
<td class="col" valign="middle" style="padding:24px 28px 26px 4px;">
{label(kick, SOFT, 10, 300)}{title(name, 24, DEEP, 8, 300)}
<div style="padding-top:8px;font-family:{SANS};font-size:14px;line-height:21px;font-weight:300;color:{SOFT};">{text}</div>
<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>{button(cta, demo, "glass", 240, compact=True)}
<div style="padding-top:12px;font-family:{SANS};font-size:13px;color:{SOFT};">Plus rapide&nbsp;: <a href="{whatsapp}" target="_blank" style="color:{DEEP};font-weight:600;">WhatsApp</a> · <a href="{fiche}" target="_blank" style="color:{SOFT};">Fiche technique</a></div>
</td></tr></table>"""


def step(i, name):
    c = RAINBOW[i - 1]
    return (f'<td class="step" width="25%" valign="top" style="padding-right:8px;">{text_img(f"0{i}", "display", 24, c, 60)}'
            f'<div style="height:2px;line-height:2px;font-size:0;background:{c};margin:6px 0 0;">&nbsp;</div>'
            f'<div style="padding-top:8px;font-family:{SANS};font-size:13px;font-weight:600;color:{DEEP};">{name}</div></td>')


def build_n01():
    salutation = "{% if contact.NOM %}Docteur {{ contact.NOM }}{% else %}Bonjour Docteur{% endif %},"
    strong = f'<strong style="font-weight:600;color:{DEEP};">Le cabinet qui sait leur répondre les garde.</strong>'
    intro2 = p("Ces patients ne viennent pas pour «&nbsp;un peu d'acide hyaluronique&nbsp;». Ils viennent avec une demande précise, "
               "souvent pour la première fois. " + strong)
    return f"""<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<title>{SUBJECT} — Cellulift Academy N°01</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  body{{margin:0;padding:0;background:#ECEEF3;}}
  a{{color:{DEEP};}}
  @media (max-width:620px){{
    .w{{width:100%!important;table-layout:fixed!important;}}
    img{{max-width:100%!important;height:auto!important;}}
    .px{{padding-left:20px!important;padding-right:20px!important;}}
    .col{{display:block!important;width:100%!important;box-sizing:border-box;}}
    .stack-gap{{padding:16px 0 0!important;}}
    .step{{display:inline-block!important;width:46%!important;padding-bottom:14px!important;}}
    .btn{{display:block!important;width:100%!important;}}
    .btn table{{margin:0 auto!important;}}
  }}
</style>
</head>
<body style="margin:0;padding:0;background:#ECEEF3;">

<!-- Pré-header (masqué) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">{PREHEADER}&#8202;&#847;&#8202;&#847;&#8202;&#847;&#8202;&#847;&#8202;&#847;&#8202;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ECEEF3" style="background:#ECEEF3;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

  <!-- HEADER -->
  <tr><td class="px" style="padding:4px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><a href="{link('/fr/academy', 'logo')}" target="_blank"><img src="{SITE}/email/cellulift-signature-logo.png" width="170" alt="CELLULIFT — Metamorphosis Technology" style="display:block;width:170px;height:auto;border:0;"></a></td>
      <td align="right" style="font-family:{SANS};font-size:12px;"><a href="{{{{ mirror }}}}" style="color:{SOFT};">Version web</a></td>
    </tr></table>
  </td></tr>

  <!-- HERO -->
  <tr><td style="padding:0 0 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}">
      <tr><td class="px" style="padding:34px 30px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td class="col" valign="middle" width="58%">
            {kicker("Édition médecins · N°01")}
            {text_img("Ils ont perdu 15 kilos. Leur visage aussi.", "display", 38, DEEP, 320, top=14, parts=HERO_TITLE)}
            {p("Le patient GLP-1 arrive en consultation. Le protocole pour l'accueillir, la technologie pour le traiter, la formation pour le maîtriser.", 15, SOFT, 16)}
          </td>
          <td class="col stack-gap" valign="middle" width="42%" align="center" style="padding-left:16px;">
            <a href="{DEMO}" target="_blank"><img src="{ASSETS}/machine-hanover-5g.jpg" width="210" alt="HANOVER 5G — laser endolift" style="display:block;width:210px;max-width:100%;height:auto;border:0;border-radius:22px;"></a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0;">{rainbow_line(2)}</td></tr>
    </table>
  </td></tr>

  <!-- INTRO -->
  <tr><td class="px" style="padding:28px 28px 8px;">
    <p style="margin:0;font-family:{SANS};font-size:16px;font-weight:600;color:{DEEP};">{salutation}</p>
    {p("Sémaglutide, tirzépatide&nbsp;: la perte de poids a changé de vitesse. Le visage, lui, n'a pas eu le temps de suivre. Joues creusées, ovale qui se relâche, traits fatigués.")}
    {intro2}
  </td></tr>

  <!-- CHIFFRES -->
  <tr><td style="padding:24px 0 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}">
      <tr>
        <td class="col" width="50%" align="center" style="padding:28px 16px;border-right:1px solid {LINE};">
          {text_img("52 %", "display", 52, VIOLET, 240, center=True)}
          <div style="font-family:{SANS};font-size:13px;line-height:19px;color:{SOFT};padding-top:10px;">des patients sous GLP-1 s'inquiètent<br>pour leur visage<sup>1</sup></div>
        </td>
        <td class="col" width="50%" align="center" style="padding:28px 16px;">
          {text_img("1 sur 3", "display", 52, "#E91E8C", 240, center=True)}
          <div style="font-family:{SANS};font-size:13px;line-height:19px;color:{SOFT};padding-top:10px;">est un patient nouveau<br>pour le cabinet<sup>1</sup></div>
        </td>
      </tr>
      <tr><td colspan="2" align="center" style="padding:0 24px 22px;">{text_img("Enquête auprès des praticiens · Congrès AAD 2026", "mono", 10, SOFT, 480, center=True)}</td></tr>
    </table>
  </td></tr>

  <!-- DOSSIER -->
  <tr><td class="px" style="padding:36px 28px 6px;">
    {kicker("Le dossier du mois")}
    {title("Visage GLP-1 : ce qui change dans votre protocole", 28, DEEP, 10, 520)}
  </td></tr>
  <tr><td style="padding:16px 0 0;">
    {numbered(1, "Remplir ne suffit plus", "Après une perte rapide, le visage perd à la fois du volume et de la tenue. Multiplier les seringues sur une peau qui ne tient plus, c'est prendre le risque du visage «&nbsp;surchargé&nbsp;».")}
    <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
    {numbered(2, "Retendre d'abord", "Le laser endolift 1470&nbsp;nm agit sous la peau&nbsp;: il cible les graisses localisées et stimule la rétraction cutanée. Une première série chez des patients sous sémaglutide ou tirzépatide rapporte une amélioration des contours et de la fermeté — sur 10 patients, à confirmer à plus grande échelle.<sup>2</sup>")}
    <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
    {numbered(3, "Régénérer ensuite", "Le plasma du patient, préparé au cabinet, devient un gel autologue (Biofiller&nbsp;X7) pour restaurer la qualité de peau et le volume. Pas de produit étranger à l'organisme&nbsp;: un argument que vos patients comprennent immédiatement.")}
  </td></tr>

  <!-- PROTOCOLE / MACHINES -->
  <tr><td class="px" style="padding:40px 28px 6px;">
    {kicker("Le protocole en deux technologies")}
    {title("Retendre. Régénérer.", 28, DEEP, 10, 520)}
  </td></tr>
  <tr><td style="padding:16px 0 0;">
    {machine("hanover-5g", "HANOVER 5G", "01 · Retendre · Laser endolift", "Double longueur d'onde 980 et 1470&nbsp;nm. Double menton, ovale, bras&nbsp;: un acte en cabinet, sans éviction socio-professionnelle.", "Voir l'Hanover en démo", DEMO, FICHE_HANOVER, WA_HANOVER)}
    <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
    {machine("centrifugel", "CENTRIFUGEL", "02 · Régénérer · Plasma", "Centrifugeuse 4&nbsp;000&nbsp;tr/min pour le PRP et le Biofiller&nbsp;X7. Couvercle verrouillé, arrêt automatique&nbsp;: la préparation devient un geste de routine.", "Voir le protocole en démo", DEMO_CENTRI, FICHE_CENTRI, WA_CENTRI)}
  </td></tr>

  <!-- ACADEMY / FORMATION -->
  <tr><td style="padding:36px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}overflow:hidden;">
      <tr><td style="padding:0;border-radius:28px 28px 0 0;overflow:hidden;">{rainbow_line(3)}</td></tr>
      <tr><td class="px" style="padding:30px 32px 32px;">
        {kicker("Cellulift Academy")}
        {title("La machine ne fait pas le résultat. La main, si.", 26, DEEP, 10, 500)}
        {p("Sur 1&nbsp;000 patients traités par endolift, une revue présentée à l'IMCAS relève 4,2&nbsp;% de complications et conclut que la sécurité dépend de la maîtrise des zones anatomiques à risque, notamment le rebord mandibulaire.<sup>3</sup> C'est pour cela que chaque équipement Cellulift s'accompagne d'un parcours de formation.", 14, SOFT)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;"><tr>
          {step(1, "Installation au cabinet")}{step(2, "Formation initiale")}{step(3, "Protocoles")}{step(4, "Perfection&shy;nement")}
        </tr></table>
        <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
        {button("Recevoir le programme de formation", WA_FORMATION, "glass", 320)}
        <div style="padding-top:12px;font-family:{SANS};font-size:13px;color:{SOFT};">Ou réservez un échange avec un formateur&nbsp;: <a href="{link('/fr/contact?sujet=masterclass', 'rdv-formation')}" style="color:{DEEP};font-weight:600;">demande de rendez-vous</a></div>
      </td></tr>
    </table>
  </td></tr>

  <!-- LEAD MAGNET PAR RÉPONSE -->
  <tr><td style="padding:12px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{LAVENDER}" style="background:{LAVENDER};border-radius:28px;border-collapse:separate;border:1px solid #FFFFFF;">
      <tr><td class="px" style="padding:30px 32px;">
        {kicker("Réservé aux abonnés", VIOLET, "#E91E8C")}
        {title("La fiche « Bilan visage GLP-1 »", 22, DEEP, 10, 500)}
        {p("Les 5 questions à poser en première consultation pour choisir entre retendre, régénérer ou combiner. Une page, à garder sur votre bureau.", 14, SOFT, 10)}
        {p("Répondez simplement «&nbsp;BILAN&nbsp;» à cet e-mail. Nous vous l'envoyons.", 15, DEEP, 14, 600)}
        <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
        {button("Recevoir la fiche sur WhatsApp", WA_BILAN, "glass", 300, compact=True)}
      </td></tr>
    </table>
  </td></tr>

  <!-- RDV / DEMO FINAL -->
  <tr><td style="padding:12px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="{CARD}">
      <tr><td class="px" align="center" style="padding:34px 32px;">
        {title("Voyez-le avant d'en parler à vos patients.", 26, DEEP, 0, 480, center=True)}
        <p style="margin:12px auto 0;max-width:440px;font-family:{SANS};font-size:14px;line-height:22px;font-weight:300;color:{SOFT};">Une démonstration de 45 minutes, dans votre cabinet ou dans nos agences de Casablanca, Marrakech et Tanger. Indications, réglages, rentabilité&nbsp;: vos questions, nos réponses chiffrées.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:22px auto 0;"><tr><td class="btn" align="center">{button("Réserver ma démonstration", DEMO, "glass", 280)}</td></tr></table>
        <div style="padding-top:14px;font-family:{SANS};font-size:13px;color:{SOFT};">Plus rapide&nbsp;: <a href="{WHATSAPP}" style="color:{DEEP};font-weight:600;">WhatsApp</a> · <a href="tel:+212522490109" style="color:{DEEP};font-weight:600;">05 22 49 01 09</a></div>
      </td></tr>
    </table>
  </td></tr>

  <!-- PROCHAIN NUMÉRO -->
  <tr><td class="px" style="padding:30px 28px 0;">
    {kicker("Dans le N°02", SOFT, "#E91E8C")}
    <div style="padding-top:8px;font-family:{SANS};font-size:16px;font-weight:600;color:{DEEP};">Biofiller ou acide hyaluronique&nbsp;: volumiser ou régénérer&nbsp;?</div>
    <div style="padding-top:4px;font-family:{SANS};font-size:14px;line-height:21px;font-weight:300;color:{SOFT};">Le comparatif que vos patients vont vous demander. Un confrère devrait le lire&nbsp;? Transférez-lui cet e-mail&nbsp;: il peut <a href="{INSCRIPTION}" style="color:{DEEP};">s'inscrire à la newsletter ici</a>.</div>
  </td></tr>

  <!-- SOURCES + FOOTER -->
  <tr><td class="px" style="padding:30px 28px 0;">{rainbow_line(1)}</td></tr>
  <tr><td class="px" style="padding:16px 28px 0;font-family:{SANS};font-size:11px;line-height:17px;color:{SOFT};">
    Sources&nbsp;: 1. <a href="https://news.abbvie.com/2026-03-30-Allergan-Aesthetics-Releases-Findings-on-the-Safety-and-Efficacy-of-Repeat-TrenibotE-Treatments-and-Data-on-Medical-Weight-Loss-Aesthetics-Patient-Behaviors-at-the-2026-American-Academy-of-Dermatology-Meeting-AAD" style="color:{SOFT};">Population Trends in Facial Aesthetic Concerns Among Patients Receiving GLP-1 Agonists, poster AAD 2026 (Allergan Aesthetics)</a> ; <a href="https://modernaesthetics.com/news/aad-2026-survey-highlights-facial-concerns-among-glp-1-weight-loss-patients/2486397/" style="color:{SOFT};">enquête auprès de 406 praticiens (Modern Aesthetics)</a>. 2. <a href="https://en.pharmateca.ru/articles/vozmojnosti-lazernoi-terapii-v-esteticheskoi-korrekcii-involutivnyh-izmenenii-lica-u-pacientov-na-fone-medikamentoznogo-snijeniya-vesa.html" style="color:{SOFT};">Laser therapy for involutional facial changes in patients undergoing medical weight loss (Pharmateca)</a>. 3. <a href="https://www.imcas.com/zh/academy/library/videos/video/19293" style="color:{SOFT};">Challenges and Complication Management in Endolift (IMCAS Academy)</a>.
  </td></tr>
  <tr><td class="px" align="center" style="padding:24px 28px 32px;font-family:{SANS};font-size:12px;line-height:19px;color:{SOFT};">
    <strong style="color:{DEEP};">Cellulift</strong> · N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca · <a href="{link('/fr', 'footer')}" style="color:{SOFT};">cellulift.ma</a> · <a href="https://www.instagram.com/cellulift.academy/" style="color:{SOFT};">Instagram @cellulift.academy</a><br>
    Vous recevez cet e-mail car vous êtes en relation avec Cellulift ou inscrit(e) à la newsletter de Cellulift Academy.<br>
    <a href="{{{{ unsubscribe }}}}" style="color:{SOFT};">Se désinscrire</a> · <a href="{SITE}/fr/privacy" style="color:{SOFT};">Confidentialité</a>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


if __name__ == "__main__":
    html = build_n01()
    if "--collect" in sys.argv:  # ajoute ses textes à rendre à ceux de build.py
        jobs_file = b.OUT / "text-jobs.json"
        jobs = json.loads(jobs_file.read_text()) if jobs_file.exists() else {}
        jobs.update(b.TEXT_JOBS)
        jobs_file.write_text(json.dumps(jobs, ensure_ascii=False, indent=1), encoding="utf-8")
        print(len(b.TEXT_JOBS), "textes (N°01)")
        sys.exit()
    # Version Brevo : les variables sont déjà au format Brevo. Version générique : variables neutres.
    (b.OUT / "brevo" / "newsletter-medecins.html").write_text(html, encoding="utf-8")
    generic = html.replace("{% if contact.NOM %}Docteur {{ contact.NOM }}{% else %}Bonjour Docteur{% endif %},", "Docteur {{NOM}},")
    generic = generic.replace("{{ mirror }}", "{{VERSION_WEB}}").replace("{{ unsubscribe }}", "{{DESINSCRIPTION}}")
    (b.OUT / "newsletter-medecins.html").write_text(generic, encoding="utf-8")
    print("newsletter-medecins.html —", SUBJECT)
