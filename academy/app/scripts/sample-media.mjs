// Génère des vidéos (WebM, lisibles par tous les navigateurs de test) et un PDF d'exemple dans private-media/ (développement et tests uniquement).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

mkdirSync("private-media/videos", { recursive: true });
mkdirSync("private-media/docs/exemple", { recursive: true });
const clips = [["lecon-1.webm", "Lecon 1 - Bienvenue", "0x7B61FF"], ["lecon-2.webm", "Lecon 2 - Securite", "0x00BCD4"], ["lecon-3.webm", "Lecon 3 - Protocole", "0xE91E8C"]];
for (const [file, label, color] of clips) {
  const out = `private-media/videos/${file}`;
  if (existsSync(out)) continue;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "lavfi", "-i", `color=c=${color}:s=640x360:d=12:r=25`, "-f", "lavfi", "-i", "sine=frequency=440:duration=12",
    "-vf", `drawtext=text='${label}':fontcolor=white:fontsize=30:x=(w-tw)/2:y=(h-th)/2,drawtext=text='%{pts\\:hms}':fontcolor=white:fontsize=20:x=20:y=20`,
    "-c:v", "libvpx-vp9", "-b:v", "300k", "-deadline", "realtime", "-c:a", "libopus", "-shortest", out]);
  console.log("vidéo", out);
}
// PDF minimal (une page de texte).
const text = "BT /F1 18 Tf 72 760 Td (Fiche protocole - exemple) Tj 0 -30 Td /F1 12 Tf (Document d'exemple pour le developpement de CELLULIFT Academy.) Tj ET";
const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  `<< /Length ${text.length} >>\nstream\n${text}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
let pdf = "%PDF-1.4\n"; const offs = [];
objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
const xref = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
writeFileSync("private-media/docs/exemple/fiche-protocole.pdf", pdf);
console.log("pdf private-media/docs/exemple/fiche-protocole.pdf");
