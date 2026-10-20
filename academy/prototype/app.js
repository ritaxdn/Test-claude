// CELLULIFT ACADEMY — interactive prototype (learner side + shared core).
// Everything runs in the browser with sample data. Nothing here is a real
// authentication, payment, DRM or email integration.

const D = window.ACADEMY_DATA;
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const course = (id) => D.courses.find((c) => c.id === id);
const device = (id) => D.devices.find((d) => d.id === id);
const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`);
const fmtMAD = (n) => `${n.toLocaleString("fr-MA").replace(/ | /g, " ")} MAD`;
const fmtDate = (s, opts = { day: "numeric", month: "short", year: "numeric" }) => new Date(s + "T12:00:00").toLocaleDateString("en-GB", opts);
const today = () => new Date().toISOString().slice(0, 10);

/* ───────────────────────── Icons ───────────────────────── */
const P = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14 7 22l5-3 5 3-1.5-8",
  cpu: "M7 7h10v10H7zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4",
  cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  play: "M8 5v14l11-7z",
  pause: "M7 5h4v14H7zM13 5h4v14h-4z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  log: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  arrow: "M7 17 17 7M9 7h8v8",
  right: "M9 6l6 6-6 6",
  left: "M15 6l-6 6 6 6",
  down: "M6 9l6 6 6-6",
  x: "M6 6l12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  file: "M6 3h9l4 4v14H6zM14 3v5h5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  layers: "M12 3 2 8l10 5 10-5zM2 13l10 5 10-5",
  out: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  plus: "M12 5v14M5 12h14",
  key: "M15 9a4 4 0 1 1-3.5 6H9v2H7v2H4v-3l6.5-6.5A4 4 0 0 1 15 9z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
  pin: "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  quiz: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  note: "M5 4h14v12l-4 4H5zM15 20v-4h4M8 9h8M8 13h5",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.2 19.8l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.3 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.2 7.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.3V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
};
const icon = (n, s = 18) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n] || ""}"/></svg>`;

let logoN = 0;
const logo = (size = "", tag = "Academy", gid = `lg${++logoN}`) => `
  <a href="#/dashboard" class="logo ${size}" aria-label="CELLULIFT Academy">
    <span class="word">Cellulift</span>
    <svg class="ecg" width="${size ? 220 : 150}" height="${size ? 24 : 16}" viewBox="0 0 160 20" fill="none" aria-hidden="true">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#00BCD4"/><stop offset=".25" stop-color="#7B61FF"/><stop offset=".5" stop-color="#E91E8C"/><stop offset=".75" stop-color="#FF5722"/><stop offset="1" stop-color="#FFC107"/></linearGradient></defs>
      <path d="M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160" stroke="url(#${gid})" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="tag">${tag}</span>
  </a>`;

/* ───────────────────────── State ───────────────────────── */
const KEY = "cellulift-academy-proto-v1";
function seedPersona(p) {
  const done = {};
  Object.entries(p.progress).forEach(([cid, n]) => {
    const c = course(cid);
    done[cid] = c.modules.flatMap((m) => m.lessons).slice(0, n).map((l) => l.id);
  });
  return {
    entitlements: p.entitlements.map((e) => ({ ...e, at: "2026-01-01" })),
    devices: p.devices.map((d) => ({ ...d })),
    pending: [...p.pending],
    done,
    last: {},
    notes: { "hanover-5g-operator": [{ lesson: "3.2", at: "06:12", body: "Phototype IV: start lower and read the test spot at 48 h." }] },
    verification: p.verification,
    sessions: [],
    read: [],
  };
}
function freshState() {
  const equipRules = {};
  D.courses.forEach((c) => (c.access.devices || []).forEach((d) => (equipRules[`${d}|${c.id}`] = true)));
  return {
    authed: false,
    persona: "partner",
    mode: "learner",
    people: { partner: seedPersona(D.personas.partner), open: seedPersona(D.personas.open) },
    custom: null,
    certs: D.certificates.map((c) => ({ ...c })),
    equipRules,
    users: D.users.map((u) => ({ ...u })),
    queue: D.verificationQueue.map((v) => ({ ...v })),
    sales: D.sales.map((s) => ({ ...s })),
    audit: D.audit.map((a) => ({ ...a })),
    alerts: D.alerts.map((a) => ({ ...a })),
    grants: [{ user: "Dr Omar Tazi", course: "sevenwaves-mastery", by: "Meryem (admin)", reason: "Pilot group", until: "2027-01-31" }],
    protection: { drm: true, watermark: true, wmName: true, wmEmail: false, wmId: true, wmTime: true, streams: 1, devices: 3, ttl: 4, travel: true, pdfStamp: true, rightClick: false },
    published: Object.fromEntries(D.courses.map((c) => [c.id, true])),
  };
}
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || freshState(); } catch { S = freshState(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const ui = { reg: { step: 1, data: {} }, filters: { q: "", family: "All", level: "All", access: "All", mine: false }, tab: "notes", playing: false, pos: 0, quiz: null, adminQ: "", acctTab: "profile", notifOpen: false };

function me() {
  if (S.persona === "custom" && S.custom) return S.custom.profile;
  return D.personas[S.persona];
}
function mine() {
  if (S.persona === "custom" && S.custom) return S.custom.state;
  return S.people[S.persona];
}

/* ───────────────────────── Access engine ─────────────────────────
   Mirrors canAccess() from docs/01-product-architecture.md §3.3.
   In production this runs on the server for every page, API call and playback token. */
function access(c, u = me(), st = mine()) {
  const a = c.access;
  const ent = st.entitlements.find((e) => e.course === c.id && !e.revoked);
  const equipNames = D.devices.filter((d) => S.equipRules[`${d.id}|${c.id}`]).map((d) => d.name);
  if (a.professions && !a.professions.includes(u.profession))
    return { state: "locked", badge: "Locked", cls: "locked", reason: "Reserved for physicians", ent };
  if (a.verifiedOnly && st.verification !== "verified")
    return { state: "locked", badge: "Locked", cls: "locked", reason: "Professional verification required", cta: "verify", ent };
  if (ent) {
    if (ent.source === "equipment") return { state: "open", badge: `Included · ${ent.ref}`, cls: "included", label: `Included with your ${ent.ref}`, ent };
    if (ent.source === "purchase") return { state: "open", badge: "Purchased", cls: "purchased", label: "Purchased", ent };
    if (ent.source === "manual") return { state: "open", badge: "Granted", cls: "included", label: "Access granted by CELLULIFT", ent };
    return { state: "open", badge: "Free", cls: "free", label: "Enrolled · free course", ent };
  }
  // Equipment owned but rule added later by admin → entitlement would be generated server-side.
  const owned = st.devices.find((d) => S.equipRules[`${d.device}|${c.id}`]);
  if (owned) return { state: "open", badge: `Included · ${device(owned.device).name}`, cls: "included", label: `Included with your ${device(owned.device).name}`, ent: { source: "equipment", ref: device(owned.device).name } };
  if (st.pending.find((p) => p.course === c.id)) return { state: "pending", badge: "Enrollment pending", cls: "pending", reason: st.pending.find((p) => p.course === c.id).reason };
  if (a.rules.includes("free")) return { state: "free", badge: "Free", cls: "free", cta: "enrol" };
  if (a.rules.includes("paid")) return { state: "buy", badge: fmtMAD(a.price), cls: "", cta: "buy", also: equipNames };
  if (equipNames.length || a.rules.includes("manual_only"))
    return { state: "exclusive", badge: "Partner exclusive", cls: "exclusive", reason: equipNames.length ? `Included with ${equipNames.join(" or ")}` : "By invitation from CELLULIFT", also: equipNames };
  return { state: "locked", badge: "Locked", cls: "locked", reason: "Not available" };
}
const progressOf = (c, st = mine()) => Math.round(((st.done[c.id] || []).length / c.lessonCount) * 100);
const lessons = (c) => c.modules.flatMap((m) => m.lessons);
const nextLesson = (c, st = mine()) => lessons(c).find((l) => !(st.done[c.id] || []).includes(l.id)) || lessons(c)[0];
const myCourses = () => D.courses.filter((c) => access(c).state === "open");
const myCerts = () => S.certs.filter((x) => x.user === me().id);

function audit(action, target, note = "") {
  const now = new Date();
  S.audit.unshift({ at: `${today()} ${now.toTimeString().slice(0, 5)}`, actor: S.mode === "admin" ? "Meryem (admin)" : me().name, action, target, note });
}

/* ───────────────────────── UI helpers ───────────────────────── */
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<i></i><span>${msg}</span>`;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 3600);
}
function overlay(html, kind = "modal") {
  closeOverlay();
  const w = document.createElement("div");
  w.id = "overlay";
  w.innerHTML = `<div class="scrim" data-a="close"></div><div class="${kind}" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(w);
  w.querySelector("input,select,textarea,button:not([data-a=close])")?.focus();
}
function closeOverlay() { $("#overlay")?.remove(); }
const badge = (acc) => `<span class="badge ${acc.cls}">${acc.cls === "locked" ? icon("lock", 11) : ""}${esc(acc.badge)}</span>`;
const simNote = (t) => `<div class="callout sim">${icon("eye", 18)}<div><b>Simulated in prototype.</b> ${t}</div></div>`;
const bar = (p) => `<div class="progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;

function courseCard(c) {
  const acc = access(c);
  const p = acc.state === "open" ? progressOf(c) : null;
  const t = D.trainers[c.trainer];
  let foot;
  if (acc.state === "open") foot = `<span class="mono">${p === 100 ? "Completed" : p ? p + "% complete" : "Not started"}</span><span class="btn sm">${p ? "Continue" : "Start"} ${icon("right", 14)}</span>`;
  else if (acc.state === "buy") foot = `<span class="mono">${fmtMAD(c.access.price)}</span><span class="btn sm">View</span>`;
  else if (acc.state === "free") foot = `<span class="mono">Free</span><span class="btn sm">Enrol</span>`;
  else foot = `<span class="small muted">${esc(acc.reason || "")}</span><span class="btn sm">Details</span>`;
  return `
  <a class="glass course-card" href="#/course/${c.id}">
    <div class="cover"><img src="img/${c.img}.jpg" alt="" loading="lazy"><div class="tl">${badge(acc)}</div><span class="fam tag">${esc(c.family)} · ${esc(c.format)}</span></div>
    <div class="body">
      <h3>${esc(c.title)}</h3>
      <div class="small muted">${esc(t.name)}</div>
      <div class="facts"><span>${fmtMin(c.duration)}</span><span>${c.modules.length} modules</span><span>${c.level}</span></div>
      ${p !== null ? bar(p) : ""}
      <div class="foot">${foot}</div>
    </div>
  </a>`;
}

/* ───────────────────────── Learner shell ───────────────────────── */
const learnerNav = [
  ["dashboard", "home", "Home"],
  ["catalog", "grid", "Catalogue"],
  ["learning", "book", "My learning"],
  ["certificates", "award", "Certificates"],
  ["equipment", "cpu", "My equipment"],
  ["sessions", "cal", "Live & in-person"],
];
function shell(active, content, opts = {}) {
  const u = me();
  const isAdmin = S.mode === "admin";
  const nav = isAdmin ? window.ADMIN_NAV : learnerNav;
  const unread = (D.notifications[S.persona] || []).filter((n) => n.unread && !mine().read.includes(n.t)).length;
  return `
  <div class="shell ${opts.immersive ? "immersive" : ""}">
    <aside class="sidebar" aria-label="Main navigation">
      ${logo("", isAdmin ? "Academy · Admin" : "Academy")}
      <div class="mode"><a href="#/dashboard" class="${isAdmin ? "" : "on"}" data-a="mode" data-v="learner">Learner</a><a href="#/admin" class="${isAdmin ? "on" : ""}" data-a="mode" data-v="admin">Admin</a></div>
      <nav class="nav">
        <span class="label mono">${isAdmin ? "Administration" : "Learning"}</span>
        ${nav.map(([r, i, l, count]) => `<a href="#/${r}" class="${active === r ? "on" : ""}">${icon(i)}${l}${count ? `<span class="count">${count()}</span>` : ""}</a>`).join("")}
        <span class="label mono">Account</span>
        ${isAdmin ? `<a href="#/verify/CA-2026-7F3K-91QD">${icon("shield")}Public verification</a>` : `<a href="#/account" class="${active === "account" ? "on" : ""}">${icon("user")}Profile & security</a>`}
        <a href="#/login" data-a="logout">${icon("out")}Sign out</a>
      </nav>
      <div class="side-foot">
        ${isAdmin ? `<div class="avatar">MA</div><div><div class="small" style="font-weight:600">Meryem Alami</div><div class="mono" style="font-size:9.5px">Administrator · sample</div></div>`
          : `<div class="avatar">${u.initials}</div><div style="min-width:0"><div class="small" style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(u.name)}</div><div class="mono" style="font-size:9.5px">${mine().devices.length ? "Partner" : "Open Academy"}${mine().verification === "verified" ? " · Verified" : ""}</div></div>`}
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn menu-btn" data-a="nav" aria-label="Open menu">${icon("menu")}</button>
        <span class="tb-logo">${logo("", "Academy")}</span>${opts.immersive ? `<a class="btn sm" href="#/dashboard">${icon("left", 14)} Dashboard</a>` : ""}
        <div class="search">${icon("search", 16)}<input class="input" placeholder="${isAdmin ? "Search users, courses, serial numbers…" : "Search courses, technologies, trainers…"}" data-a="topsearch" aria-label="Search"></div>
        <div class="sp"></div>
        ${isAdmin ? `<span class="badge ok">${icon("shield", 11)}2FA active</span>` : ""}
        <div style="position:relative">
          <button class="icon-btn" data-a="notif" aria-label="Notifications">${icon("bell")}${!isAdmin && unread ? '<span class="pip"></span>' : ""}</button>
          ${ui.notifOpen && !isAdmin ? notifPop() : ""}
        </div>
        <a href="${isAdmin ? "#/admin" : "#/account"}" class="avatar" aria-label="Account">${isAdmin ? "MA" : u.initials}</a>
      </header>
      ${opts.raw ? content : `<main class="page" id="page">${content}</main>`}
    </div>
  </div>
  ${isAdmin ? "" : `<nav class="tabbar glass" aria-label="Mobile navigation">
    ${[["dashboard", "home", "Home"], ["catalog", "grid", "Catalogue"], ["learning", "book", "Learning"], ["certificates", "award", "Certificates"], ["account", "user", "Account"]]
      .map(([r, i, l]) => `<a href="#/${r}" class="${active === r ? "on" : ""}">${icon(i, 20)}${l}</a>`).join("")}
  </nav>`}`;
}
function notifPop() {
  const list = D.notifications[S.persona] || [];
  return `<div class="glass notif-pop">
    <div class="row between" style="padding:10px 12px"><span class="eyebrow">Notifications</span><button class="btn ghost sm" data-a="readall">Mark all read</button></div>
    ${list.length ? list.map((n) => `<a href="${n.link}" class="n ${n.unread && !mine().read.includes(n.t) ? "unread" : ""}" data-a="readone" data-v="${esc(n.t)}"><div><div class="small" style="font-weight:600">${esc(n.t)}</div><div class="small muted">${esc(n.b)}</div><div class="mono" style="font-size:9.5px;margin-top:4px">${n.when}</div></div></a>`).join("") : `<div class="n small muted">You're all caught up.</div>`}
  </div>`;
}

/* ───────────────────────── Auth views ───────────────────────── */
function authFrame(inner) {
  return `<div class="auth">
    <section class="auth-side">
      <div class="orb" aria-hidden="true"></div>
      ${logo("lg", "Metamorphosis Technology · Academy")}
      <div class="hero">
        <div class="eyebrow"><span class="dot-live"></span>academy.cellulift.ma</div>
        <h1 class="display h1" style="margin-top:16px;font-size:clamp(2.2rem,3.6vw,3.3rem)">One account.<br><span class="iridescent">Every technology</span><br>you master.</h1>
        <p class="muted" style="margin-top:18px;max-width:440px">Training programmes, clinical protocols and certificates for medical and aesthetic professionals, by CELLULIFT.</p>
        <div class="models">
          <div class="glass card-sm row" style="align-items:flex-start">${icon("cpu", 20)}<div><b class="small">Partner access</b><div class="small muted">Device programmes unlocked by the CELLULIFT technologies you own.</div></div></div>
          <div class="glass card-sm row" style="align-items:flex-start">${icon("book", 20)}<div><b class="small">Open Academy</b><div class="small muted">Free and paid courses and masterclasses for every professional.</div></div></div>
        </div>
      </div>
      <div class="mono">© CELLULIFT · Morocco</div>
    </section>
    <section class="auth-main">${inner}</section>
  </div>`;
}
function viewLogin() {
  return authFrame(`<div class="glass auth-card">
    <div class="eyebrow">Sign in</div>
    <h2 class="display h2" style="margin:12px 0 6px">Welcome back</h2>
    <p class="small muted" style="margin-bottom:22px">Use the email registered with CELLULIFT.</p>
    <form class="stack" style="gap:14px" data-form="login">
      <div class="field"><label for="em">Professional email</label><input id="em" class="input" type="email" value="s.benali@clinique-sample.ma" autocomplete="email" required></div>
      <div class="field"><label for="pw">Password</label><input id="pw" class="input" type="password" value="demo-password" autocomplete="current-password" required></div>
      <div class="row between"><label class="check"><input type="checkbox" checked> Keep me signed in on this device</label><a href="#/forgot" class="small" style="text-decoration:underline">Forgot password?</a></div>
      <button class="btn solid" style="height:46px">Sign in</button>
    </form>
    <div class="signal" style="margin:22px 0"></div>
    <div class="eyebrow" style="margin-bottom:10px">Demo personas</div>
    <div class="stack" style="gap:8px">
      <button class="btn" data-a="login" data-v="partner" style="justify-content:flex-start">${icon("cpu", 16)} Dr Salma Benali — partner doctor (HANOVER 5G)</button>
      <button class="btn" data-a="login" data-v="open" style="justify-content:flex-start">${icon("book", 16)} Youssef Amrani — Open Academy, unverified</button>
      <button class="btn" data-a="loginadmin" style="justify-content:flex-start">${icon("shield", 16)} Meryem Alami — CELLULIFT administrator</button>
    </div>
    <p class="small muted" style="margin-top:20px">New to the Academy? <a href="#/register" style="text-decoration:underline;color:var(--deep)">Create a professional account</a></p>
  </div>`);
}
function viewForgot() {
  return authFrame(`<div class="glass auth-card">
    <div class="eyebrow">Password recovery</div>
    <h2 class="display h2" style="margin:12px 0 14px">Reset your password</h2>
    <form class="stack" style="gap:14px" data-form="forgot">
      <div class="field"><label for="fe">Email</label><input id="fe" class="input" type="email" required placeholder="name@clinic.ma"><span class="hint">We'll send a single-use link valid for 30 minutes. For privacy, the message is the same whether or not the address exists.</span></div>
      <button class="btn solid">Send reset link</button>
    </form>
    <div style="margin-top:16px">${simNote("No email is sent.")}</div>
    <p class="small" style="margin-top:16px"><a href="#/login" style="text-decoration:underline">Back to sign in</a></p>
  </div>`);
}
const PROFESSIONS = [["doctor", "Physician"], ["nurse", "Nurse"], ["aesthetician", "Aesthetician"], ["physiotherapist", "Physiotherapist"], ["other", "Other healthcare professional"]];
function viewRegister() {
  const { step, data: d } = ui.reg;
  const steps = ["Account", "Practice", "Verification"];
  let body;
  if (step === 1) body = `
    <div class="form-grid">
      <div class="field full"><label for="r-name">Full name</label><input id="r-name" name="name" class="input" required value="${esc(d.name || "")}" placeholder="Dr Firstname Lastname"></div>
      <div class="field full"><label for="r-email">Professional email</label><input id="r-email" name="email" type="email" class="input" required value="${esc(d.email || "")}" placeholder="name@clinic.ma"></div>
      <div class="field full"><label for="r-pw">Password</label><input id="r-pw" name="pw" type="password" class="input" required minlength="10" data-a="pwstrength" placeholder="At least 10 characters">
        <div class="strength" id="strength"><i></i><i></i><i></i><i></i></div><span class="hint">Use a passphrase. Checked against known breached passwords in production.</span></div>
    </div>`;
  else if (step === 2) body = `
    <div class="form-grid">
      <div class="field"><label for="r-prof">Profession</label><select id="r-prof" name="profession" class="input" required>${PROFESSIONS.map(([v, l]) => `<option value="${v}" ${d.profession === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="field"><label for="r-spec">Specialty</label><input id="r-spec" name="specialty" class="input" value="${esc(d.specialty || "")}" placeholder="e.g. Dermatology"></div>
      <div class="field full"><label for="r-org">Clinic or organisation</label><input id="r-org" name="org" class="input" value="${esc(d.org || "")}" placeholder="Clinic, centre or hospital"></div>
      <div class="field"><label for="r-country">Country</label><select id="r-country" name="country" class="input">${[["MA", "Morocco"], ["SN", "Senegal"], ["CI", "Côte d'Ivoire"], ["TN", "Tunisia"], ["FR", "France"], ["OT", "Other"]].map(([v, l]) => `<option value="${v}" ${d.country === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="field"><label for="r-city">City</label><input id="r-city" name="city" class="input" value="${esc(d.city || "")}"></div>
    </div>`;
  else body = `
    <p class="small muted" style="margin-bottom:14px">Some programmes (energy-based devices, injectables) are reserved for verified professionals. You can verify now or later from your profile.</p>
    <div class="form-grid">
      <div class="field"><label for="r-body">Registration body</label><input id="r-body" name="regBody" class="input" placeholder="e.g. CNOM" value="${esc(d.regBody || "")}"></div>
      <div class="field"><label for="r-num">Registration number</label><input id="r-num" name="regNum" class="input" value="${esc(d.regNum || "")}"></div>
      <div class="field full"><label for="r-doc">Supporting document <span class="muted">(optional)</span></label><input id="r-doc" type="file" class="input" style="padding:10px" accept=".pdf,.jpg,.png"><span class="hint">Stored in a private bucket, visible only to the verification team.</span></div>
      <label class="check full"><input type="checkbox" required> I accept the Terms and the Privacy notice (Law 09-08, CNDP).</label>
    </div>`;
  return authFrame(`<div class="glass auth-card">
    <div class="eyebrow">Create your account · step ${step} of 3</div>
    <h2 class="display h2" style="margin-top:12px">${["Your account", "Your practice", "Professional status"][step - 1]}</h2>
    <div class="steps">${steps.map((s, i) => `<div class="${i < step ? "on" : ""}"><i></i><span class="mono">${s}</span></div>`).join("")}</div>
    <form data-form="register" class="stack" style="gap:18px">
      ${body}
      <div class="row between">
        ${step > 1 ? `<button type="button" class="btn ghost" data-a="regback">${icon("left", 14)} Back</button>` : `<a href="#/login" class="small" style="text-decoration:underline">I already have an account</a>`}
        <div class="row">${step === 3 ? `<button type="submit" name="skip" value="1" class="btn ghost" formnovalidate>Skip for now</button>` : ""}<button class="btn solid">${step === 3 ? "Create account" : "Continue"}</button></div>
      </div>
    </form>
  </div>`);
}
function viewVerifyEmail() {
  const d = ui.reg.data;
  return authFrame(`<div class="glass auth-card" style="text-align:center">
    <div class="ring" style="--p:100;margin:0 auto 18px"><span>${icon("check", 22)}</span></div>
    <div class="eyebrow">Check your inbox</div>
    <h2 class="display h2" style="margin:12px 0">Verify your email</h2>
    <p class="muted small">We sent a verification link to <b>${esc(d.email || "your address")}</b>. The link expires in 24 hours.</p>
    <div style="margin:20px 0">${simNote("No email is sent. Use the button to simulate clicking the link.")}</div>
    <button class="btn solid" data-a="verifyemail">Open verification link</button>
  </div>`);
}

/* ───────────────────────── Dashboard ───────────────────────── */
function viewDashboard() {
  const u = me(), st = mine();
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const inProgress = myCourses().filter((c) => progressOf(c) > 0 && progressOf(c) < 100);
  const cont = inProgress.sort((a, b) => progressOf(b) - progressOf(a))[0] || myCourses()[0];
  const done = myCourses().filter((c) => progressOf(c) === 100);
  const hours = myCourses().reduce((s, c) => s + lessons(c).filter((l) => (st.done[c.id] || []).includes(l.id)).reduce((a, l) => a + l.min, 0), 0);
  const recs = D.courses.filter((c) => !["open"].includes(access(c).state) && S.published[c.id]).sort((a, b) => ["free", "buy", "pending", "exclusive", "locked"].indexOf(access(a).state) - ["free", "buy", "pending", "exclusive", "locked"].indexOf(access(b).state)).slice(0, 3);
  const sess = D.sessions.filter((s) => s.date >= today()).slice(0, 3);
  return `
  <div class="page-head">
    <div><div class="eyebrow"><span class="dot-live"></span>${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
      <h1 class="display h1">${greet}, <span class="iridescent">${esc(u.title ? u.title + " " + u.name.split(" ").slice(-1) : u.first)}</span></h1></div>
    <a class="btn" href="#/catalog">${icon("grid", 16)} Browse catalogue</a>
  </div>
  ${st.verification !== "verified" ? `<div class="callout warn" style="margin-bottom:20px">${icon("shield", 18)}<div style="flex:1"><b>Verify your professional status</b> to unlock courses reserved for verified practitioners.</div><a href="#/account" data-a="accttab" data-v="verification" class="btn sm">Verify now</a></div>` : ""}
  ${cont ? `
  <section class="glass continue" aria-label="Continue learning">
    <div class="cover"><img src="img/${cont.img}.jpg" alt=""></div>
    <div class="body">
      <div class="row wrap">${badge(access(cont))}<span class="tag">Continue learning</span></div>
      <h2 class="display h2">${esc(cont.title)}</h2>
      <div class="small muted">Next: <b style="color:var(--deep)">${esc(nextLesson(cont).id)} · ${esc(nextLesson(cont).title)}</b> · ${D.trainers[cont.trainer].name}</div>
      <div class="row" style="gap:16px"><div style="flex:1;max-width:420px">${bar(progressOf(cont))}</div><span class="mono">${progressOf(cont)}%</span></div>
      <div><a class="cta" href="#/learn/${cont.id}/${nextLesson(cont).id}">Resume lesson <span class="arrow">${icon("arrow", 16)}</span></a></div>
    </div>
  </section>` : `<section class="glass card"><h2 class="h3">Start your first course</h2><p class="muted small">Free introductory modules are available in the catalogue.</p><a class="btn solid" style="margin-top:12px" href="#/catalog">Explore</a></section>`}
  <div class="grid g4 kpis stagger" style="margin:20px 0 28px">
    ${[["In progress", inProgress.length, "book"], ["Completed", done.length, "check"], ["Certificates", myCerts().length, "award"], ["Learning time", fmtMin(hours), "clock"]].map(([l, v, i]) => `<div class="glass kpi"><div class="row between"><span class="eyebrow">${l}</span>${icon(i, 16)}</div><div class="v">${v}</div></div>`).join("")}
  </div>
  <div class="cols-main">
    <div class="stack">
      <div class="section-title"><h2 class="display h2">My courses</h2><a class="small" href="#/learning" style="text-decoration:underline">View all</a></div>
      <div class="grid g2 stagger">${myCourses().slice(0, 4).map(courseCard).join("")}</div>
      <div class="section-title" style="margin-top:12px"><h2 class="display h2">Recommended for you</h2><span class="mono">Based on your practice</span></div>
      <div class="grid g3 stagger">${recs.map(courseCard).join("")}</div>
    </div>
    <div class="stack">
      <section class="glass card">
        <div class="row between" style="margin-bottom:6px"><span class="eyebrow">Upcoming training</span><a href="#/sessions" class="small" style="text-decoration:underline">All</a></div>
        <div class="list">${sess.map(sessionItem).join("")}</div>
      </section>
      <section class="glass card">
        <div class="eyebrow" style="margin-bottom:6px">Notifications</div>
        <div class="list">${(D.notifications[S.persona] || []).slice(0, 3).map((n) => `<a class="item" href="${n.link}"><div style="flex:1"><div class="small" style="font-weight:600">${esc(n.t)}</div><div class="small muted">${esc(n.b)}</div></div><span class="mono">${n.when}</span></a>`).join("") || `<div class="item small muted">Nothing new.</div>`}</div>
      </section>
      <section class="glass card">
        <div class="eyebrow" style="margin-bottom:10px">My equipment</div>
        ${st.devices.length ? st.devices.map((d) => `<div class="row" style="padding:8px 0"><img src="img/${d.device}.jpg" alt="" style="width:36px;height:44px;object-fit:contain"><div style="flex:1"><div class="small" style="font-weight:600">${device(d.device).name}</div><div class="mono" style="font-size:9.5px">S/N ${d.serial}</div></div><span class="badge ok">Linked</span></div>`).join("")
          : `<p class="small muted">No CELLULIFT device linked yet. Owners get device programmes automatically.</p><a class="btn sm" style="margin-top:10px" href="#/equipment">Link a device</a>`}
      </section>
    </div>
  </div>`;
}
function sessionItem(s) {
  const d = new Date(s.date + "T12:00:00");
  const reg = mine().sessions.includes(s.title);
  return `<div class="item"><div class="date-tile"><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span></div>
    <div style="flex:1;min-width:0"><div class="small" style="font-weight:600">${esc(s.title)}</div><div class="mono" style="font-size:9.5px;margin-top:3px">${esc(s.kind)} · ${esc(s.place)}</div></div>
    ${reg ? `<span class="badge ok">Registered</span>` : ""}</div>`;
}

/* ───────────────────────── Catalogue ───────────────────────── */
function filteredCourses() {
  const f = ui.filters;
  const q = f.q.trim().toLowerCase();
  return D.courses.filter((c) => {
    if (!S.published[c.id]) return false;
    const acc = access(c);
    if (q && ![c.title, c.summary, c.family, c.device, D.trainers[c.trainer].name].join(" ").toLowerCase().includes(q)) return false;
    if (f.family !== "All" && c.family !== f.family) return false;
    if (f.level !== "All" && c.level !== f.level) return false;
    if (f.access !== "All") {
      const map = { Free: ["free"], Paid: ["buy"], "My access": ["open"], "Partner exclusive": ["exclusive"], Locked: ["locked", "pending"] };
      if (!map[f.access].includes(acc.state) && !(f.access === "Free" && acc.cls === "free")) return false;
    }
    if (f.mine && acc.state !== "open") return false;
    return true;
  });
}
function viewCatalog() {
  const f = ui.filters;
  const fams = ["All", ...new Set(D.courses.map((c) => c.family))];
  const chips = (key, vals) => vals.map((v) => `<button class="chip ${f[key] === v ? "on" : ""}" data-a="filter" data-k="${key}" data-v="${v}">${v}</button>`).join("");
  return `
  <div class="page-head">
    <div><div class="eyebrow">Course catalogue · ${D.courses.length} programmes</div><h1 class="display h1">Learn the <span class="iridescent">technology</span>.<br>Master the protocol.</h1></div>
  </div>
  <div class="glass card" style="margin-bottom:22px;display:flex;flex-direction:column;gap:14px">
    <div class="row wrap"><div style="position:relative;flex:1;min-width:220px"><span style="position:absolute;left:14px;top:13px;color:var(--deep-soft)">${icon("search", 16)}</span><input class="input" style="padding-left:40px" placeholder="Search by course, device, trainer…" value="${esc(f.q)}" data-in="q" aria-label="Search the catalogue"></div>
      <label class="row small" style="gap:10px"><span class="toggle"><input type="checkbox" data-a="mine" ${f.mine ? "checked" : ""}><span></span></span>Only what I can access</label></div>
    <div class="row wrap" style="gap:8px"><span class="mono" style="width:80px">Technology</span>${chips("family", fams)}</div>
    <div class="row wrap" style="gap:8px"><span class="mono" style="width:80px">Level</span>${chips("level", ["All", "Foundation", "Intermediate", "Advanced", "Expert"])}</div>
    <div class="row wrap" style="gap:8px"><span class="mono" style="width:80px">Access</span>${chips("access", ["All", "My access", "Free", "Paid", "Partner exclusive", "Locked"])}</div>
  </div>
  <div id="results">${catalogResults()}</div>`;
}
function catalogResults() {
  const list = filteredCourses();
  return list.length ? `<div class="mono" style="margin-bottom:12px">${list.length} result${list.length > 1 ? "s" : ""}</div><div class="grid g3 stagger">${list.map(courseCard).join("")}</div>`
    : `<div class="glass card" style="text-align:center;padding:48px"><h3 class="h3">No course matches these filters</h3><p class="small muted" style="margin-top:6px">Try another technology or clear the search.</p><button class="btn" style="margin-top:14px" data-a="clearfilters">Clear filters</button></div>`;
}
function viewLearning() {
  const list = myCourses();
  const groups = [["In progress", list.filter((c) => progressOf(c) > 0 && progressOf(c) < 100)], ["Not started", list.filter((c) => progressOf(c) === 0)], ["Completed", list.filter((c) => progressOf(c) === 100)]];
  const pend = mine().pending.map((p) => course(p.course));
  return `<div class="page-head"><div><div class="eyebrow">My learning</div><h1 class="display h1">Your programmes</h1></div></div>
  ${pend.length ? `<div class="section-title"><h2 class="h3">Enrollment pending</h2></div><div class="grid g3" style="margin-bottom:24px">${pend.map(courseCard).join("")}</div>` : ""}
  ${groups.map(([t, cs]) => cs.length ? `<div class="section-title"><h2 class="h3">${t} <span class="mono">· ${cs.length}</span></h2></div><div class="grid g3 stagger" style="margin-bottom:28px">${cs.map(courseCard).join("")}</div>` : "").join("")}`;
}

/* ───────────────────────── Course detail ───────────────────────── */
function viewCourse(id) {
  const c = course(id);
  if (!c) return notFound();
  const acc = access(c), t = D.trainers[c.trainer];
  const p = acc.state === "open" ? progressOf(c) : 0;
  const doneSet = mine().done[c.id] || [];
  let cta = "";
  if (acc.state === "open") cta = `<a class="cta" href="#/learn/${c.id}/${nextLesson(c).id}">${p ? "Continue" : "Start course"} <span class="arrow">${icon("arrow", 16)}</span></a>`;
  else if (acc.state === "free") cta = `<button class="cta" data-a="enrol" data-v="${c.id}">Enrol for free <span class="arrow">${icon("arrow", 16)}</span></button>`;
  else if (acc.state === "buy") cta = `<button class="cta" data-a="buy" data-v="${c.id}">Enrol · ${fmtMAD(c.access.price)} <span class="arrow">${icon("arrow", 16)}</span></button>`;
  else if (acc.state === "pending") cta = `<span class="btn" style="pointer-events:none">${icon("clock", 16)} ${esc(acc.reason)}</span>`;
  else if (acc.cta === "verify") cta = `<a class="btn solid" href="#/account" data-a="accttab" data-v="verification">${icon("shield", 16)} Verify my professional status</a>`;
  else if (acc.state === "exclusive") cta = `<button class="btn" data-a="askdevice" data-v="${c.id}">Learn about ${esc(c.device)}</button>`;
  const what = {
    open: acc.label, free: "Free for registered professionals", buy: `One-time enrolment, lifetime access${acc.also?.length ? ` · also included with ${acc.also.join(", ")}` : ""}`,
    exclusive: acc.reason, locked: acc.reason, pending: acc.reason,
  }[acc.state];
  return `
  <div class="mono" style="margin-bottom:16px"><a href="#/catalog">Catalogue</a> / ${esc(c.family)}</div>
  <section class="glass" style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);overflow:hidden" id="course-hero">
    <div style="padding:32px;display:flex;flex-direction:column;gap:16px">
      <div class="row wrap">${badge(acc)}<span class="tag">${esc(c.format)} · ${esc(c.device)}</span></div>
      <h1 class="display h1" style="font-size:clamp(1.7rem,2.8vw,2.4rem)">${esc(c.title)}</h1>
      <p class="muted">${esc(c.summary)}</p>
      <div class="facts"><span>${icon("clock", 12)} ${fmtMin(c.duration)}</span><span>${c.modules.length} modules · ${c.lessonCount} lessons</span><span>${c.level}</span><span>Certificate of completion</span></div>
      ${acc.state === "open" ? `<div class="row" style="max-width:420px">${bar(p)}<span class="mono">${p}%</span></div>` : ""}
      <div class="row wrap" style="margin-top:6px">${cta}</div>
    </div>
    <div class="cover" style="aspect-ratio:auto;min-height:280px;margin:10px"><img src="img/${c.img}.jpg" alt="${esc(c.device)}"></div>
  </section>
  <div class="cols-main" style="margin-top:24px">
    <div class="stack">
      <section class="glass card">
        <div class="eyebrow" style="margin-bottom:12px">Learning objectives</div>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:10px">${c.objectives.map((o) => `<li class="row" style="align-items:flex-start"><span style="color:#7b61ff;margin-top:2px">${icon("check", 16)}</span><span>${esc(o)}</span></li>`).join("")}</ul>
      </section>
      <section class="glass card">
        <div class="row between" style="margin-bottom:8px"><span class="eyebrow">Curriculum</span><span class="mono">${c.lessonCount} lessons · ${fmtMin(c.duration)}</span></div>
        ${c.modules.map((m, i) => `<details ${i < 2 ? "open" : ""} style="border-top:1px solid var(--line);padding:6px 0">
          <summary class="row between" style="cursor:pointer;padding:10px 0;list-style:none"><span><span class="mono">Module ${i + 1}</span> <b style="margin-left:8px">${esc(m.title)}</b></span><span class="mono">${m.lessons.length} · ${fmtMin(m.lessons.reduce((a, l) => a + l.min, 0))}</span></summary>
          ${m.lessons.map((l) => `<div class="row" style="padding:8px 0 8px 4px;font-size:14px">
            <span style="color:${doneSet.includes(l.id) ? "var(--ok)" : "var(--deep-soft)"}">${icon(doneSet.includes(l.id) ? "check" : l.kind === "quiz" ? "quiz" : l.kind === "resource" ? "file" : acc.state === "open" ? "play" : "lock", 15)}</span>
            <span class="mono" style="width:32px">${l.id}</span><span style="flex:1">${esc(l.title)}</span><span class="mono">${l.min} min</span></div>`).join("")}
        </details>`).join("")}
      </section>
    </div>
    <div class="stack" style="position:sticky;top:110px">
      <section class="glass card">
        <div class="eyebrow" style="margin-bottom:10px">Your access</div>
        <div class="row" style="align-items:flex-start">${icon(acc.state === "open" ? "check" : acc.state === "locked" ? "lock" : "key", 18)}<div><b>${esc(acc.badge)}</b><div class="small muted">${esc(what || "")}</div></div></div>
        <div class="signal" style="margin:16px 0"></div>
        <ul class="small muted" style="margin:0;padding-left:18px;display:grid;gap:6px">
          <li>Streamed securely — no downloadable video files</li><li>Protocol sheets (personally watermarked)</li><li>Final assessment · pass mark ${c.passing}%</li><li>CELLULIFT certificate of training completion</li>
        </ul>
        <p class="small muted" style="margin-top:12px;font-size:12px">This certificate attests training completion. It is not an accredited medical qualification.</p>
      </section>
      <section class="glass card">
        <div class="eyebrow" style="margin-bottom:12px">Trainer</div>
        <div class="row"><div class="avatar lg">${t.initials}</div><div><b>${esc(t.name)}</b><div class="small muted">${esc(t.title)}</div></div></div>
      </section>
    </div>
  </div>`;
}
function viewCheckout(id) {
  const c = course(id);
  return `<div class="eyebrow">Enrolment</div><h2 class="display h2" style="margin:10px 0 6px">${esc(c.title)}</h2>
  <div class="row between" style="padding:14px 0;border-bottom:1px solid var(--line)"><span class="muted">Total (TTC)</span><b style="font-family:var(--f-mono)">${fmtMAD(c.access.price)}</b></div>
  <form data-form="pay" data-v="${c.id}" class="stack" style="gap:12px;margin-top:16px">
    <label class="opt"><input type="radio" name="m" value="card" checked style="accent-color:#7b61ff"> <div><b class="small">Bank card (CMI)</b><div class="small muted">Moroccan & international cards · 3-D Secure · instant access</div></div></label>
    <label class="opt"><input type="radio" name="m" value="transfer" style="accent-color:#7b61ff"> <div><b class="small">Bank transfer / clinic invoice</b><div class="small muted">Access opens once finance confirms payment (1–3 working days)</div></div></label>
    ${simNote("No payment is taken. In production you are redirected to the CMI hosted payment page and access is granted only after the signed server callback.")}
    <div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Continue to payment</button></div>
  </form>`;
}

/* ───────────────────────── Player ───────────────────────── */
function viewPlayer(id, lid) {
  const c = course(id);
  if (!c) return notFound();
  const acc = access(c);
  if (acc.state !== "open") { location.hash = `#/course/${id}`; return ""; }
  const all = lessons(c);
  const l = all.find((x) => x.id === lid) || nextLesson(c);
  mine().last[c.id] = l.id; save();
  const st = mine(), done = st.done[c.id] || [];
  const p = progressOf(c);
  const u = me(), t = D.trainers[c.trainer];
  const prev = all[l.n - 1], next = all[l.n + 1];
  const isDone = done.includes(l.id);
  let stage;
  if (l.kind === "quiz") stage = `<section class="glass card" style="text-align:center;padding:48px 24px"><div class="eyebrow" style="justify-content:center">Assessment</div><h2 class="display h2" style="margin:12px 0">${esc(c.title)} — final quiz</h2><p class="muted">${D.quizBank.length} questions · pass mark ${c.passing}% · 3 attempts</p><a class="cta" style="margin-top:20px" href="#/quiz/${c.id}">Start the quiz <span class="arrow">${icon("arrow", 16)}</span></a></section>`;
  else if (l.kind === "resource") stage = `<section class="glass card"><div class="eyebrow" style="margin-bottom:12px">Protocol sheets</div>${resources(c)}</section>`;
  else stage = `
    <div class="video" id="video" data-dur="${l.min * 60}">
      <div class="stage"><img src="img/${c.img}.jpg" alt=""></div>
      <div class="title-over"><div class="mono" style="color:#9b9ea4">Lesson ${l.id}</div><div class="display" style="font-size:24px;margin-top:8px;color:#ecebe7">${esc(l.title)}</div></div>
      ${S.protection.watermark ? `<div class="wm" id="wm" style="left:8%;top:72%">${esc(wmText(u))}</div>` : ""}
      <span class="drm badge" style="background:rgba(255,255,255,.12);color:#ecebe7;border-color:rgba(255,255,255,.2)">${icon("shield", 11)} Simulated DRM</span>
      <button class="play" data-a="play" aria-label="Play">${icon(ui.playing ? "pause" : "play", 28)}</button>
      <div class="controls"><button class="btn ghost sm" style="color:#fff" data-a="play" aria-label="Play or pause">${icon(ui.playing ? "pause" : "play", 14)}</button><span id="tcur">00:00</span><div class="bar" data-a="seek"><i id="tbar"></i></div><span>${String(l.min).padStart(2, "0")}:00</span><span>1×</span><span>HD</span></div>
    </div>`;
  return `
  <div class="player-layout">
    <aside class="left" aria-label="Course navigation">
      <a href="#/course/${c.id}" class="mono row" style="gap:6px;margin:0 6px 14px">${icon("left", 12)} Course overview</a>
      <div style="padding:0 8px 14px"><div class="small" style="font-weight:600;line-height:1.3">${esc(c.title)}</div><div class="row" style="margin-top:10px">${bar(p)}<span class="mono">${p}%</span></div></div>
      ${c.modules.map((m, mi) => `<div style="margin-bottom:6px"><div class="mod-title"><span class="mono">${mi + 1}</span>${esc(m.title)}<span class="mono">${m.lessons.filter((x) => done.includes(x.id)).length}/${m.lessons.length}</span></div>
        ${m.lessons.map((x) => `<a href="#/learn/${c.id}/${x.id}" class="lesson-link ${x.id === l.id ? "on" : ""}"><span class="st ${done.includes(x.id) ? "done" : x.id === l.id ? "cur" : ""}">${done.includes(x.id) ? icon("check", 10) : ""}</span>${esc(x.title)}<span class="dur">${x.min}′</span></a>`).join("")}</div>`).join("")}
    </aside>
    <section class="player-main">
      ${stage}
      <div class="pm-body">
        <div class="row between wrap" style="margin:22px 0 10px">
          <div><div class="mono">Module ${l.id.split(".")[0]} · Lesson ${l.id}</div><h1 class="h2 display" style="margin-top:8px">${esc(l.title)}</h1></div>
          ${isDone ? `<span class="badge ok">${icon("check", 11)} Completed</span>` : ""}
        </div>
        <div class="row" style="margin-bottom:18px"><div class="avatar">${t.initials}</div><div><div class="small" style="font-weight:600">${esc(t.name)}</div><div class="small muted">${esc(t.title)}</div></div></div>
        <div class="prose">
          <p>${esc(c.summary)} In this lesson, ${esc(t.name.split(" ")[0] === "Dr" ? t.name : t.name.split(" ")[0])} walks through <b>${esc(l.title.toLowerCase())}</b> step by step.</p>
          <ul><li>Key points are summarised under the video and in the protocol sheets.</li><li>Take time-stamped notes in the panel; they stay private to you.</li><li>Lessons are marked complete at 90 % watched, or manually.</li></ul>
        </div>
        <div class="row between wrap" style="margin-top:26px;padding-top:18px;border-top:1px solid var(--line)">
          ${prev ? `<a class="btn" href="#/learn/${c.id}/${prev.id}">${icon("left", 14)} Previous</a>` : "<span></span>"}
          <div class="row">
            ${!isDone && l.kind !== "quiz" ? `<button class="btn" data-a="complete" data-c="${c.id}" data-l="${l.id}">${icon("check", 14)} Mark complete</button>` : ""}
            ${next ? `<a class="btn solid" href="#/learn/${c.id}/${next.id}" data-a="${!isDone && l.kind === "video" ? "completenext" : ""}" data-c="${c.id}" data-l="${l.id}">Next lesson ${icon("right", 14)}</a>` : ""}
          </div>
        </div>
      </div>
    </section>
    <aside class="right" aria-label="Lesson tools">
      <div class="tabs" role="tablist">${[["notes", "Notes"], ["resources", "Resources"], ["quiz", "Quiz"], ["progress", "Progress"]].map(([k, n]) => `<button role="tab" class="${ui.tab === k ? "on" : ""}" data-a="tab" data-v="${k}">${n}</button>`).join("")}</div>
      <div id="tabpanel">${tabPanel(c, l)}</div>
    </aside>
  </div>`;
}
const wmText = (u) => {
  const p = S.protection, parts = [];
  if (p.wmName) parts.push(u.name);
  if (p.wmEmail) parts.push(u.email);
  if (p.wmId) parts.push("ID " + u.id.replace("u-", ""));
  if (p.wmTime) parts.push(new Date().toISOString().slice(0, 16).replace("T", " "));
  return parts.join(" · ");
};
function resources(c) {
  return [["Protocol sheet — " + c.device, "PDF · 4 pages"], ["Parameter quick reference", "PDF · 1 page"], ["Patient consent template", "DOCX · 2 pages"]]
    .map(([n, m]) => `<div class="res" style="margin-bottom:10px"><span class="ic">${icon("file", 16)}</span><div style="flex:1;min-width:0"><div class="small" style="font-weight:600">${esc(n)}</div><div class="mono" style="font-size:9.5px">${m} · stamped with your name</div></div><button class="btn sm" data-a="resource" data-v="${esc(n)}">Open</button></div>`).join("");
}
function tabPanel(c, l) {
  const st = mine();
  if (ui.tab === "notes") {
    const notes = (st.notes[c.id] || []);
    return `<form data-form="note" data-c="${c.id}" data-l="${l.id}" class="stack" style="gap:10px"><textarea class="input" name="body" placeholder="Write a note at ${document.getElementById("tcur")?.textContent || "00:00"}…" aria-label="New note"></textarea><button class="btn solid sm">Save note</button></form>
      <div class="stack" style="gap:10px;margin-top:16px">${notes.length ? notes.map((n) => `<div class="note"><div class="mono" style="font-size:9.5px;margin-bottom:4px">Lesson ${n.lesson} · ${n.at}</div>${esc(n.body)}</div>`).join("") : `<p class="small muted">No notes yet for this course.</p>`}</div>`;
  }
  if (ui.tab === "resources") return resources(c) + `<p class="small muted" style="margin-top:8px">Files are generated per learner with a visible name stamp and served through short-lived links.</p>`;
  if (ui.tab === "quiz") {
    const att = st.quiz?.[c.id];
    return `<div class="note"><b>Final assessment</b><div class="small muted" style="margin:6px 0 12px">${D.quizBank.length} questions · pass mark ${c.passing}% · 3 attempts</div>${att ? `<div class="mono" style="margin-bottom:10px">Best score: ${att.best}% ${att.best >= c.passing ? "· passed" : ""}</div>` : ""}<a class="btn solid sm" href="#/quiz/${c.id}">${att ? "Retake" : "Start"} quiz</a></div>`;
  }
  const p = progressOf(c);
  return `<div style="text-align:center;padding:10px 0 18px"><div class="ring" style="--p:${p};width:110px;height:110px;margin:0 auto"><span style="font-size:18px">${p}%</span></div></div>
    ${c.modules.map((m) => { const n = m.lessons.filter((x) => (st.done[c.id] || []).includes(x.id)).length; return `<div style="margin-bottom:12px"><div class="row between small"><span>${esc(m.title)}</span><span class="mono">${n}/${m.lessons.length}</span></div>${bar(Math.round((n / m.lessons.length) * 100))}</div>`; }).join("")}
    <p class="small muted">Resume point is saved automatically — you'll return to lesson ${l.id} next time.</p>`;
}
function markDone(cid, lid, silent) {
  const st = mine();
  st.done[cid] = [...new Set([...(st.done[cid] || []), lid])];
  save();
  if (!silent) toast("Lesson marked complete");
}

/* Simulated playback loop (no real media is loaded) */
let tick = null, wmTick = null;
function stopPlayback() { ui.playing = false; clearInterval(tick); clearInterval(wmTick); }
function startPlayback() {
  const v = $("#video");
  if (!v) return;
  ui.playing = true;
  const dur = +v.dataset.dur;
  tick = setInterval(() => {
    ui.pos = Math.min(dur, ui.pos + dur / 60);
    paintTime(dur);
    if (ui.pos >= dur * 0.9) {
      const [, , cid, lid] = location.hash.split("/");
      if (!(mine().done[cid] || []).includes(lid)) { markDone(cid, lid, true); toast("90 % watched — lesson completed"); }
    }
    if (ui.pos >= dur) { stopPlayback(); render(); }
  }, 250);
  wmTick = setInterval(moveWm, 4000);
  moveWm();
  const btns = v.querySelectorAll("[data-a=play]");
  btns.forEach((b) => (b.innerHTML = icon("pause", b.classList.contains("play") ? 28 : 14)));
}
function paintTime(dur) {
  const b = $("#tbar"), t = $("#tcur");
  if (!b) return;
  b.style.width = (ui.pos / dur) * 100 + "%";
  const s = Math.floor(ui.pos);
  t.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function moveWm() {
  const w = $("#wm");
  if (w) { w.style.left = 5 + Math.random() * 50 + "%"; w.style.top = 10 + Math.random() * 70 + "%"; }
}

/* ───────────────────────── Quiz ───────────────────────── */
function viewQuiz(id) {
  const c = course(id);
  if (access(c).state !== "open") { location.hash = `#/course/${id}`; return ""; }
  if (!ui.quiz || ui.quiz.course !== id) ui.quiz = { course: id, answers: {}, submitted: false };
  const q = ui.quiz;
  const score = q.submitted ? Math.round((D.quizBank.filter((x, i) => q.answers[i] === x.a).length / D.quizBank.length) * 100) : 0;
  const passed = score >= c.passing;
  return `
  <div class="mono" style="margin-bottom:14px"><a href="#/learn/${c.id}/${mine().last[c.id] || nextLesson(c).id}">${icon("left", 12)} Back to course</a></div>
  <div class="page-head"><div><div class="eyebrow">Assessment · pass mark ${c.passing}%</div><h1 class="display h1" style="font-size:clamp(1.6rem,2.6vw,2.2rem)">${esc(c.title)}</h1></div>
    ${q.submitted ? `<div class="ring" style="--p:${score};width:90px;height:90px"><span style="font-size:16px">${score}%</span></div>` : `<span class="mono">${Object.keys(q.answers).length}/${D.quizBank.length} answered</span>`}</div>
  ${q.submitted ? `<div class="callout ${passed ? "" : "warn"}" style="margin-bottom:20px;${passed ? "background:var(--ok-bg);border-color:rgba(31,138,91,.25)" : ""}">${icon(passed ? "award" : "alert", 20)}<div style="flex:1"><b>${passed ? "Passed — certificate issued." : "Not passed this time."}</b> <span class="small">${passed ? "Your certificate is available with a public verification ID." : `You need ${c.passing}%. Review the explanations below and retry (2 attempts left).`}</span></div>
    ${passed ? `<a class="btn solid sm" href="#/certificates">View certificate</a>` : `<button class="btn sm" data-a="retry">Retry</button>`}</div>` : ""}
  <form data-form="quiz" class="stack">
    ${D.quizBank.map((x, i) => `<fieldset class="glass q" style="border:0"><legend class="mono" style="padding:0;margin-bottom:8px">Question ${i + 1}</legend><div style="font-weight:600;margin-bottom:14px">${esc(x.q)}</div>
      <div class="stack" style="gap:8px">${x.o.map((o, j) => {
        let cls = q.answers[i] === j ? "sel" : "";
        if (q.submitted) cls = j === x.a ? "right" : q.answers[i] === j ? "wrong" : "";
        return `<label class="opt ${cls}"><input type="radio" name="q${i}" value="${j}" ${q.answers[i] === j ? "checked" : ""} ${q.submitted ? "disabled" : ""} data-a="answer" data-q="${i}" data-o="${j}" style="position:absolute;opacity:0"><span class="k">${"ABCD"[j]}</span>${esc(o)}</label>`;
      }).join("")}</div>
      ${q.submitted ? `<p class="small muted" style="margin-top:12px">${icon("note", 13)} ${esc(x.e)}</p>` : ""}</fieldset>`).join("")}
    ${q.submitted ? "" : `<div class="row" style="justify-content:flex-end"><button class="btn solid" ${Object.keys(q.answers).length < D.quizBank.length ? "disabled" : ""}>Submit answers</button></div>`}
  </form>`;
}

/* ───────────────────────── Certificates ───────────────────────── */
function viewCertificates() {
  const list = myCerts();
  return `<div class="page-head"><div><div class="eyebrow">Certificates</div><h1 class="display h1">Your <span class="iridescent">credentials</span></h1></div></div>
  <div class="callout" style="margin-bottom:22px">${icon("shield", 18)}<div class="small"><b>About these certificates.</b> CELLULIFT Academy certificates attest completion of a manufacturer/distributor training programme. They are not medical diplomas, licences to practise or accredited CME credits. Each has a public verification ID.</div></div>
  ${list.length ? `<div class="grid g2 stagger">${list.map((x) => { const c = course(x.course); return `<div class="glass card">
    <div class="row between"><span class="badge included">Training completion</span><span class="mono">${fmtDate(x.date)}</span></div>
    <h3 class="h3" style="margin:14px 0 6px">${esc(c.title)}</h3>
    <div class="facts"><span>Score ${x.score}%</span><span>${x.hours} h</span><span>${x.code}</span></div>
    <div class="row wrap" style="margin-top:16px"><a class="btn solid sm" href="#/certificate/${x.code}">View</a><button class="btn sm" data-a="pdf">Download PDF</button><button class="btn sm" data-a="copylink" data-v="${x.code}">${icon("link", 14)} Copy verification link</button></div>
  </div>`; }).join("")}</div>` : `<div class="glass card" style="text-align:center;padding:48px"><div class="ring" style="--p:0;margin:0 auto 14px"><span>0</span></div><h3 class="h3">No certificates yet</h3><p class="small muted">Complete a course and pass its assessment to earn one.</p></div>`}`;
}
function certDoc(x) {
  const c = course(x.course);
  const holder = [D.personas.partner, D.personas.open, S.custom?.profile].find((p) => p && p.id === x.user) || { name: "Sample holder" };
  return `<div class="cert">
    <div class="row between" style="align-items:flex-start">${logo("", "Academy").replace("<a ", "<div ").replace("</a>", "</div>")}<div class="seal"><div>CELLULIFT<br>ACADEMY<br>${new Date(x.date).getFullYear()}</div></div></div>
    <div style="margin-top:auto">
      <div class="eyebrow">Certificate of training completion</div>
      <div class="name">${esc(holder.name)}</div>
      <p class="muted small" style="max-width:560px">has completed the training programme <b style="color:var(--deep)">${esc(c.title)}</b> (${x.hours} h) and passed its final assessment with a score of ${x.score}%.</p>
    </div>
    <div class="row between wrap" style="margin:22px 0 14px;gap:20px">
      <div><div class="mono">Issued</div><div class="small">${fmtDate(x.date)}</div></div>
      <div><div class="mono">Trainer</div><div class="small">${esc(D.trainers[c.trainer].name)}</div></div>
      <div><div class="mono">Verification ID</div><div class="small" style="font-family:var(--f-mono)">${x.code}</div></div>
      <div><div class="mono">Verify at</div><div class="small">academy.cellulift.ma/verify</div></div>
    </div>
    <div class="disc">This certificate attests completion of a manufacturer/distributor training programme delivered by CELLULIFT Academy. It is not a medical qualification, diploma, licence to practise or accredited continuing medical education credit.</div>
  </div>`;
}
function viewCertificate(code) {
  const x = S.certs.find((c) => c.code === code);
  if (!x) return notFound();
  return `<div class="mono" style="margin-bottom:14px"><a href="#/certificates">${icon("left", 12)} Certificates</a></div>${certDoc(x)}
    <div class="row wrap" style="justify-content:center;margin-top:22px"><button class="btn solid" data-a="pdf">Download PDF</button><a class="btn" href="#/verify/${x.code}">Open public verification page</a></div>`;
}
function viewVerify(code) {
  const x = S.certs.find((c) => c.code === (code || "").toUpperCase());
  const holder = x && [D.personas.partner, D.personas.open, S.custom?.profile].find((p) => p && p.id === x.user);
  return `<div style="min-height:calc(100vh - 34px);display:grid;place-items:center;padding:40px 16px"><div style="width:100%;max-width:620px" class="stack">
    <div style="text-align:center">${logo("lg", "Certificate verification")}</div>
    <form class="glass card row" data-form="verify"><input class="input" name="code" value="${esc(code || "")}" placeholder="CA-2026-XXXX-XXXX" aria-label="Verification ID"><button class="btn solid">Verify</button></form>
    ${code ? x ? `<section class="glass card"><div class="row between"><span class="badge ok">${icon("check", 11)} Valid certificate</span><span class="mono">${x.code}</span></div>
        <h2 class="display h2" style="margin:16px 0 8px">${esc(holder?.name || "—")}</h2>
        <p class="muted small">Completed <b style="color:var(--deep)">${esc(course(x.course).title)}</b> on ${fmtDate(x.date)} (${x.hours} h).</p>
        <p class="small muted" style="margin-top:14px;font-size:12px">Type: training completion certificate — not an accredited medical qualification. Only name, course and date are shown publicly.</p></section>`
      : `<section class="glass card"><span class="badge err">Not found</span><p class="small muted" style="margin-top:10px">No certificate matches this ID. Check the characters or contact academy@cellulift.ma.</p></section>` : ""}
    <p class="small muted" style="text-align:center"><a href="#/login" style="text-decoration:underline">Academy sign in</a></p>
  </div></div>`;
}

/* ───────────────────────── Equipment, sessions, account ───────────────────────── */
function viewEquipment() {
  return `<div class="page-head"><div><div class="eyebrow">My equipment</div><h1 class="display h1">Your CELLULIFT <span class="iridescent">technologies</span></h1></div><button class="btn solid" data-a="linkdevice">${icon("plus", 16)} Link a device</button></div>
  <p class="muted" style="max-width:720px;margin:-8px 0 22px">Each device linked to your account unlocks its training programme. Devices are linked by CELLULIFT from your purchase record; you can also request a link with the serial number.</p>
  ${mine().devices.length ? `<div class="grid g2 stagger">${mine().devices.map((d) => { const dev = device(d.device); const cs = D.courses.filter((c) => S.equipRules[`${d.device}|${c.id}`]); return `<section class="glass card">
    <div class="row" style="align-items:flex-start;gap:18px"><div class="cover" style="width:120px;aspect-ratio:3/4;margin:0;flex:none"><img src="img/${d.device}.jpg" alt="" style="right:0;left:0;margin:auto;height:100%"></div>
    <div style="flex:1;min-width:0"><div class="row between"><span class="tag">${dev.family}</span><span class="badge ok">Linked</span></div><h3 class="display h2" style="margin:10px 0">${dev.name}</h3>
      <div class="facts"><span>S/N ${d.serial}</span><span>Since ${fmtDate(d.date)}</span></div><div class="small muted" style="margin-top:6px">${esc(d.clinic)}</div></div></div>
    <div class="signal" style="margin:18px 0 12px"></div><div class="eyebrow" style="margin-bottom:8px">Training included</div>
    ${cs.map((c) => `<a class="row between" href="#/course/${c.id}" style="padding:8px 0"><span class="small" style="font-weight:500">${esc(c.title)}</span><span class="mono">${progressOf(c)}%</span></a>`).join("") || `<p class="small muted">No programme mapped yet.</p>`}
    <div class="row wrap" style="margin-top:12px"><button class="btn sm" data-a="support">Technical support</button><a class="btn sm" href="#/sessions">Practical workshops</a></div>
  </section>`; }).join("")}</div>`
  : `<div class="glass card" style="text-align:center;padding:54px 24px"><div style="margin:0 auto 14px;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,rgba(127,227,240,.4),rgba(167,151,255,.35))">${icon("cpu", 24)}</div><h3 class="h3">No device linked</h3><p class="small muted" style="max-width:420px;margin:6px auto 16px">If your clinic owns a CELLULIFT technology, request a link with its serial number. Your current courses, purchases and certificates stay on this account.</p><button class="btn solid" data-a="linkdevice">Request a device link</button></div>`}`;
}
function viewSessions() {
  return `<div class="page-head"><div><div class="eyebrow"><span class="dot-live"></span>Live & in-person</div><h1 class="display h1">Upcoming <span class="iridescent">training</span></h1></div></div>
  <div class="stack stagger">${D.sessions.filter((s) => s.date >= today()).map((s) => {
    const d = new Date(s.date + "T12:00:00"); const reg = mine().sessions.includes(s.title); const partnerOnly = s.partner && !mine().devices.find((x) => x.device === s.partner);
    return `<section class="glass card row wrap" style="gap:20px"><div class="date-tile" style="width:72px;padding:10px 0"><b style="font-size:28px">${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span></div>
      <div style="flex:1;min-width:220px"><div class="row wrap"><span class="badge ${s.kind === "Partner" ? "exclusive" : ""}">${s.kind}</span><span class="mono">${icon("pin", 11)} ${esc(s.place)}</span>${s.seats ? `<span class="mono">${s.seats} seats</span>` : ""}</div>
      <h3 class="h3" style="margin-top:10px">${esc(s.title)}</h3><div class="small muted">${esc(s.sub)}</div></div>
      ${reg ? `<span class="badge ok">${icon("check", 11)} Registered</span>` : partnerOnly ? `<span class="small muted">For ${device(s.partner).name} owners</span>` : `<button class="btn solid sm" data-a="regsession" data-v="${esc(s.title)}">Register</button>`}</section>`;
  }).join("")}</div>
  <p class="small muted" style="margin-top:18px">Dates of public sessions come from cellulift.ma. Registration here is simulated; the live site currently uses Cal.com.</p>`;
}
function viewAccount() {
  const u = me(), st = mine(), t = ui.acctTab;
  const tabs = [["profile", "Profile"], ["verification", "Verification"], ["security", "Devices & sessions"], ["purchases", "Purchases"]];
  let body;
  if (t === "profile") body = `<form class="form-grid" data-form="profile">
    <div class="field"><label>Full name</label><input class="input" value="${esc(u.name)}"></div><div class="field"><label>Email</label><input class="input" value="${esc(u.email)}" type="email"></div>
    <div class="field"><label>Profession</label><select class="input">${PROFESSIONS.map(([v, l]) => `<option ${u.profession === v ? "selected" : ""}>${l}</option>`).join("")}</select></div><div class="field"><label>Specialty</label><input class="input" value="${esc(u.specialty)}"></div>
    <div class="field"><label>Clinic / organisation</label><input class="input" value="${esc(u.org)}"></div><div class="field"><label>City</label><input class="input" value="${esc(u.city)}"></div>
    <div class="field full"><label>Language</label><div class="row">${["Français", "English", "العربية"].map((l, i) => `<button type="button" class="chip ${i === 1 ? "on" : ""}">${l}</button>`).join("")}<span class="small muted">Prototype in English; FR/EN/AR planned.</span></div></div>
    <div class="full row" style="justify-content:flex-end"><button class="btn solid">Save changes</button></div></form>`;
  else if (t === "verification") body = st.verification === "verified" ? `<div class="row"><span class="badge ok">${icon("check", 11)} Verified professional</span><span class="small muted">${esc(u.registration)} · checked by CELLULIFT</span></div>`
    : st.verification === "pending" ? `<div class="row"><span class="badge pending">Under review</span><span class="small muted">Usually within 2 working days. You'll be notified by email.</span></div>`
    : `<form class="form-grid" data-form="verification"><p class="full small muted">Verification unlocks programmes on energy-based devices and medical procedures. Your document is visible only to the verification team.</p>
      <div class="field"><label for="vb">Registration body</label><input id="vb" class="input" required placeholder="e.g. CNOM, Ordre des infirmiers…"></div><div class="field"><label for="vn">Registration number</label><input id="vn" class="input" required></div>
      <div class="field full"><label for="vd">Supporting document</label><input id="vd" type="file" class="input" style="padding:10px"></div><div class="full row" style="justify-content:flex-end"><button class="btn solid">Submit for review</button></div></form>`;
  else if (t === "security") body = `<p class="small muted" style="margin-bottom:14px">Your plan allows <b>${S.protection.devices} devices</b> and <b>${S.protection.streams} simultaneous stream${S.protection.streams > 1 ? "s" : ""}</b>. Signing out a device ends its playback within minutes.</p>
    <table class="t"><thead><tr><th>Device</th><th>Location</th><th>Last active</th><th></th></tr></thead><tbody>
    ${[["Safari · macOS", "Casablanca, MA", "Now", true], ["Chrome · Windows", "Casablanca, MA", "Yesterday", false], ["Safari · iPhone", "Rabat, MA", "3 days ago", false]].map(([d, l, w, cur]) => `<tr><td><div class="row">${icon("monitor", 16)}${d}${cur ? ' <span class="badge ok">This device</span>' : ""}</div></td><td>${l}</td><td class="mono">${w}</td><td style="text-align:right">${cur ? "" : `<button class="btn sm danger" data-a="signout-device">Sign out</button>`}</td></tr>`).join("")}</tbody></table>
    <div class="row wrap" style="margin-top:18px"><button class="btn" data-a="signout-all">Sign out all other devices</button><button class="btn">${icon("key", 14)} Change password</button><button class="btn">Enable two-step verification</button></div>`;
  else body = `<table class="t"><thead><tr><th>Order</th><th>Course</th><th>Method</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>
    ${st.entitlements.filter((e) => e.source === "purchase").map((e) => `<tr><td class="mono">${esc((e.ref || "").replace("Order ", ""))}</td><td>${esc(course(e.course).title)}</td><td>Card (CMI)</td><td class="mono">${fmtMAD(course(e.course).access.price)}</td><td><span class="badge ok">Paid</span></td><td><button class="btn sm" data-a="pdf">Invoice</button></td></tr>`).join("")}
    ${st.pending.map((p) => `<tr><td class="mono">AC-2026-0207</td><td>${esc(course(p.course).title)}</td><td>Bank transfer</td><td class="mono">${fmtMAD(course(p.course).access.price)}</td><td><span class="badge pending">Pending</span></td><td></td></tr>`).join("")}
    </tbody></table>${!st.entitlements.some((e) => e.source === "purchase") && !st.pending.length ? `<p class="small muted" style="padding:14px">No purchases yet.</p>` : ""}`;
  return `<div class="page-head"><div class="row" style="gap:18px"><div class="avatar lg">${u.initials}</div><div><div class="eyebrow">Account</div><h1 class="display h2" style="margin-top:8px">${esc(u.name)}</h1><div class="small muted">${esc(u.specialty)} · ${esc(u.org)}</div></div></div></div>
    <div class="tabs" style="max-width:620px">${tabs.map(([k, n]) => `<button class="${t === k ? "on" : ""}" data-a="accttab" data-v="${k}">${n}</button>`).join("")}</div>
    <section class="glass card">${body}</section>`;
}
const notFound = () => `<div class="glass card" style="text-align:center;padding:60px"><h1 class="display h2">Page not found</h1><a class="btn" style="margin-top:16px" href="#/dashboard">Back home</a></div>`;

/* ───────────────────────── Router ───────────────────────── */
function render() {
  stopPlayback();
  const parts = location.hash.replace(/^#\/?/, "").split("/");
  const [r, a, b] = parts;
  const app = $("#app");
  document.body.classList.remove("nav-open");
  const publicRoutes = ["login", "register", "forgot", "verify", "verify-email"];
  if (!S.authed && !publicRoutes.includes(r)) { location.replace("#/login"); return; }
  if (S.authed && ["login", "register", "forgot", "verify-email", ""].includes(r || "")) { if (r === "" || r === undefined) { location.replace(S.mode === "admin" ? "#/admin" : "#/dashboard"); return; } }
  let html;
  if (r === "admin") { S.mode = "admin"; save(); html = window.renderAdmin(a, b); }
  else {
    if (S.authed && !publicRoutes.includes(r)) { S.mode = "learner"; save(); }
    switch (r) {
      case "login": html = viewLogin(); break;
      case "forgot": html = viewForgot(); break;
      case "register": html = viewRegister(); break;
      case "verify-email": html = viewVerifyEmail(); break;
      case "verify": html = viewVerify(a); break;
      case "dashboard": html = shell("dashboard", viewDashboard()); break;
      case "catalog": html = shell("catalog", viewCatalog()); break;
      case "learning": html = shell("learning", viewLearning()); break;
      case "course": html = shell("catalog", viewCourse(a)); break;
      case "learn": html = shell("learning", viewPlayer(a, b), { raw: true, immersive: true }); break;
      case "quiz": html = shell("learning", viewQuiz(a)); break;
      case "certificates": html = shell("certificates", viewCertificates()); break;
      case "certificate": html = shell("certificates", viewCertificate(a)); break;
      case "equipment": html = shell("equipment", viewEquipment()); break;
      case "sessions": html = shell("sessions", viewSessions()); break;
      case "account": html = shell("account", viewAccount()); break;
      default: html = shell("", notFound());
    }
  }
  if (!html) return;
  app.innerHTML = protoBar() + html;
  ui.pos = 0;
  if (!/^(learn|catalog)$/.test(r)) window.scrollTo(0, 0);
  document.title = `${({ dashboard: "Home", catalog: "Catalogue", course: "Course", learn: "Lesson", admin: "Admin" })[r] || "Academy"} · CELLULIFT Academy`;
}
function protoBar() {
  return `<div class="proto-bar" role="note"><b>Prototype</b><span class="hide-sm">Sample data · auth, payments, DRM, email and uploads are simulated</span><span class="sp"></span>
    ${S.authed ? `<label class="hide-sm">View as</label><select data-a="persona" aria-label="Demo persona">
      <option value="partner" ${S.persona === "partner" && S.mode === "learner" ? "selected" : ""}>Partner doctor</option>
      <option value="open" ${S.persona === "open" && S.mode === "learner" ? "selected" : ""}>Open Academy</option>
      ${S.custom ? `<option value="custom" ${S.persona === "custom" && S.mode === "learner" ? "selected" : ""}>${esc(S.custom.profile.name)}</option>` : ""}
      <option value="admin" ${S.mode === "admin" ? "selected" : ""}>Administrator</option></select>` : ""}
    <button data-a="reset">Reset demo</button></div>`;
}

/* ───────────────────────── Actions ───────────────────────── */
const actions = {
  close: closeOverlay,
  nav: () => document.body.classList.toggle("nav-open"),
  reset: () => { if (confirm("Reset all prototype data?")) { S = freshState(); save(); location.hash = "#/login"; render(); } },
  login: (el) => { S.authed = true; S.persona = el.dataset.v; S.mode = "learner"; save(); location.hash = "#/dashboard"; },
  loginadmin: () => { S.authed = true; S.mode = "admin"; save(); location.hash = "#/admin"; },
  logout: (el, e) => { e.preventDefault(); S.authed = false; save(); location.hash = "#/login"; toast("Signed out. Session token revoked."); },
  mode: (el, e) => { e.preventDefault(); S.mode = el.dataset.v; save(); location.hash = S.mode === "admin" ? "#/admin" : "#/dashboard"; },
  persona: (el) => {
    if (el.value === "admin") { S.mode = "admin"; save(); location.hash = "#/admin"; return; }
    S.persona = el.value; S.mode = "learner"; ui.quiz = null; save();
    location.hash === "#/dashboard" ? render() : (location.hash = "#/dashboard");
  },
  notif: () => { ui.notifOpen = !ui.notifOpen; render(); },
  readall: () => { mine().read = (D.notifications[S.persona] || []).map((n) => n.t); ui.notifOpen = false; save(); render(); },
  readone: (el) => { mine().read.push(el.dataset.v); ui.notifOpen = false; save(); },
  regback: () => { ui.reg.step--; render(); },
  verifyemail: () => {
    const d = ui.reg.data;
    const initials = (d.name || "New User").replace(/^Dr\.?\s+/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const profile = { id: "u-" + (6000 + Math.floor(Math.random() * 999)), key: "custom", name: d.name || "New professional", first: (d.name || "there").replace(/^Dr\.?\s+/i, "").split(" ")[0], title: /^dr/i.test(d.name || "") ? "Dr" : "", initials,
      email: d.email, profession: d.profession || "doctor", specialty: d.specialty || "—", org: d.org || "—", city: d.city || "", country: d.country || "MA", registration: d.regNum ? `${d.regBody} · ${d.regNum}` : "", devices: [] };
    S.custom = { profile, state: { entitlements: [], pending: [], done: {}, last: {}, notes: {}, verification: d.regNum ? "pending" : "unverified", sessions: [], read: [], devices: [] } };
    S.users.unshift({ id: profile.id, name: profile.name, email: profile.email, prof: PROFESSIONS.find((p) => p[0] === profile.profession)[1], city: profile.city, type: "Open Academy", status: S.custom.state.verification, courses: 0, last: "Now" });
    if (d.regNum) S.queue.unshift({ user: profile.id, name: profile.name, prof: profile.specialty, reg: profile.registration, doc: "—", submitted: "Just now" });
    S.authed = true; S.persona = "custom"; S.mode = "learner"; ui.reg = { step: 1, data: {} }; save();
    location.hash = "#/dashboard"; toast("Email verified — welcome to CELLULIFT Academy");
  },
  pwstrength: () => {},
  filter: (el) => { ui.filters[el.dataset.k] = el.dataset.v; render(); },
  clearfilters: () => { ui.filters = { q: "", family: "All", level: "All", access: "All", mine: false }; render(); },
  mine: (el) => { ui.filters.mine = el.checked; $("#results").innerHTML = catalogResults(); },
  enrol: (el) => {
    const c = course(el.dataset.v);
    mine().entitlements.push({ course: c.id, source: "free", at: today() }); save();
    toast(`Enrolled in “${c.title}”`); location.hash = `#/learn/${c.id}/${nextLesson(c).id}`;
  },
  buy: (el) => overlay(viewCheckout(el.dataset.v)),
  askdevice: (el) => {
    const c = course(el.dataset.v);
    overlay(`<div class="eyebrow">Partner programme</div><h2 class="display h2" style="margin:10px 0">${esc(c.device)}</h2><p class="muted small">This programme is included for clinics equipped with ${esc(c.device)}. If you'd like to learn more about the technology, a CELLULIFT specialist can contact you — no obligation.</p>
      <div class="row wrap" style="margin-top:18px"><button class="btn solid" data-a="contactme">Request information</button><a class="btn" href="https://cellulift.ma" target="_blank" rel="noopener">View on cellulift.ma</a><button class="btn ghost" data-a="close">Not now</button></div>`);
  },
  contactme: () => { closeOverlay(); toast("Request sent to CELLULIFT (simulated)"); },
  linkdevice: () => overlay(`<div class="eyebrow">Link a device</div><h2 class="display h2" style="margin:10px 0 14px">Request a device link</h2>
    <form data-form="linkdevice" class="stack" style="gap:12px"><div class="field"><label for="ld-m">Device</label><select id="ld-m" class="input">${D.devices.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}</select></div>
    <div class="field"><label for="ld-s">Serial number</label><input id="ld-s" class="input" required placeholder="On the rear label"></div>
    <div class="field"><label for="ld-c">Clinic named on the invoice</label><input id="ld-c" class="input" required></div>
    <p class="small muted">CELLULIFT checks the serial against its sales records, then training is unlocked on this account. Your existing courses, purchases and certificates are kept.</p>
    <div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Send request</button></div></form>`),
  support: () => toast("Support ticket form would open here (after-sales service)"),
  regsession: (el) => { mine().sessions.push(el.dataset.v); save(); render(); toast("Registered — confirmation email (simulated)"); },
  accttab: (el, e) => { ui.acctTab = el.dataset.v; if (location.hash !== "#/account") return; e.preventDefault(); render(); },
  "signout-device": (el) => { el.closest("tr").remove(); toast("Device signed out · tokens revoked"); },
  "signout-all": () => toast("All other sessions signed out (simulated)"),
  tab: (el) => { ui.tab = el.dataset.v; document.querySelectorAll(".tabs [data-a=tab]").forEach((b) => b.classList.toggle("on", b === el)); const [, , cid, lid] = location.hash.split("/"); const c = course(cid); $("#tabpanel").innerHTML = tabPanel(c, lessons(c).find((l) => l.id === lid) || nextLesson(c)); },
  play: () => { if (ui.playing) { stopPlayback(); document.querySelectorAll("#video [data-a=play]").forEach((b) => (b.innerHTML = icon("play", b.classList.contains("play") ? 28 : 14))); } else startPlayback(); },
  seek: (el, e) => { const r = el.getBoundingClientRect(); const v = $("#video"); ui.pos = ((e.clientX - r.left) / r.width) * +v.dataset.dur; paintTime(+v.dataset.dur); },
  complete: (el) => { markDone(el.dataset.c, el.dataset.l); render(); },
  completenext: (el) => markDone(el.dataset.c, el.dataset.l, true),
  resource: (el) => toast(`“${el.dataset.v}” — stamped PDF via 5-min signed link (simulated)`),
  answer: (el) => { ui.quiz.answers[el.dataset.q] = +el.dataset.o; render(); },
  retry: () => { ui.quiz = null; render(); },
  pdf: () => toast("PDF generated server-side in production (simulated)"),
  copylink: (el) => { const url = `https://academy.cellulift.ma/verify/${el.dataset.v}`; navigator.clipboard?.writeText(url).catch(() => {}); toast("Verification link copied"); },
};

const forms = {
  login: () => { S.authed = true; S.persona = $("#em").value.includes("amrani") ? "open" : "partner"; S.mode = "learner"; save(); location.hash = "#/dashboard"; },
  forgot: () => { toast("If an account exists, a reset link has been sent."); location.hash = "#/login"; },
  register: (f, e) => {
    Object.assign(ui.reg.data, Object.fromEntries(new FormData(f)));
    if (ui.reg.step < 3) { ui.reg.step++; render(); return; }
    if (e.submitter?.name === "skip") { ui.reg.data.regNum = ""; }
    location.hash = "#/verify-email";
  },
  pay: (f) => {
    const id = f.dataset.v, m = new FormData(f).get("m"), c = course(id);
    closeOverlay();
    if (m === "card") {
      mine().entitlements.push({ course: id, source: "purchase", ref: "Order AC-2026-0" + (210 + Math.floor(Math.random() * 80)), at: today() });
      S.audit.unshift({ at: `${today()} ${new Date().toTimeString().slice(0, 5)}`, actor: "System", action: "order.paid", target: `${c.title} · ${fmtMAD(c.access.price)}`, note: "CMI callback (simulated)" });
      save(); toast("Payment confirmed — access granted"); location.hash = `#/learn/${id}/${nextLesson(c).id}`;
    } else {
      mine().pending.push({ course: id, reason: "Bank transfer awaiting confirmation" }); save(); render(); toast("Order created — enrollment pending");
    }
  },
  note: (f) => {
    const body = new FormData(f).get("body").trim();
    if (!body) return;
    const st = mine(); (st.notes[f.dataset.c] ||= []).unshift({ lesson: f.dataset.l, at: $("#tcur")?.textContent || "—", body }); save();
    $("#tabpanel").innerHTML = tabPanel(course(f.dataset.c), lessons(course(f.dataset.c)).find((l) => l.id === f.dataset.l));
  },
  quiz: () => {
    const c = course(ui.quiz.course);
    ui.quiz.submitted = true;
    const score = Math.round((D.quizBank.filter((x, i) => ui.quiz.answers[i] === x.a).length / D.quizBank.length) * 100);
    const st = mine(); st.quiz ||= {}; st.quiz[c.id] = { best: Math.max(score, st.quiz[c.id]?.best || 0) };
    if (score >= c.passing) {
      lessons(c).forEach((l) => markDone(c.id, l.id, true));
      if (!S.certs.find((x) => x.user === me().id && x.course === c.id)) {
        const rnd = () => Math.random().toString(36).slice(2, 6).toUpperCase();
        S.certs.unshift({ code: `CA-${new Date().getFullYear()}-${rnd()}-${rnd()}`, user: me().id, course: c.id, date: today(), score, hours: +(c.duration / 60).toFixed(1) });
      }
    }
    save(); render(); window.scrollTo(0, 0);
  },
  verify: (f) => { location.hash = `#/verify/${new FormData(f).get("code").trim().toUpperCase()}`; },
  profile: () => toast("Profile saved (prototype)"),
  verification: () => { mine().verification = "pending"; const u = me(); if (!S.queue.find((q) => q.user === u.id)) S.queue.unshift({ user: u.id, name: u.name, prof: u.specialty, reg: $("#vb").value + " · " + $("#vn").value, doc: "upload.pdf", submitted: "Just now" }); save(); render(); toast("Submitted — review usually within 2 working days"); },
  linkdevice: () => { closeOverlay(); toast("Request sent — CELLULIFT will confirm the serial number"); },
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-a]");
  if (ui.notifOpen && !e.target.closest(".notif-pop") && !e.target.closest("[data-a=notif]")) { ui.notifOpen = false; if (!el) render(); }
  if (!el) return;
  const fn = actions[el.dataset.a] || window.ADMIN_ACTIONS?.[el.dataset.a];
  if (!fn || el.tagName === "SELECT" || el.dataset.a === "pwstrength" || el.dataset.a === "topsearch") return;
  if (el.type === "checkbox" && el.dataset.a !== "mine" && !window.ADMIN_ACTIONS?.[el.dataset.a]) return;
  if (el.type === "radio") { fn(el, e); return; }
  fn(el, e);
});
document.addEventListener("change", (e) => {
  const el = e.target;
  if (el.matches("select[data-a]")) (actions[el.dataset.a] || window.ADMIN_ACTIONS?.[el.dataset.a])?.(el, e);
});
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.in === "q") { ui.filters.q = el.value; $("#results").innerHTML = catalogResults(); }
  if (el.dataset.in && window.ADMIN_INPUTS?.[el.dataset.in]) window.ADMIN_INPUTS[el.dataset.in](el);
  if (el.dataset.a === "pwstrength") {
    const v = el.value; const s = [v.length >= 10, /[A-Z]/.test(v) && /[a-z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v) || v.length >= 16].filter(Boolean).length;
    document.querySelectorAll("#strength i").forEach((i, k) => i.classList.toggle("on", k < s));
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeOverlay(); ui.notifOpen = false; document.body.classList.remove("nav-open"); }
  if (e.key === "Enter" && e.target.dataset.a === "topsearch") {
    if (S.mode === "admin") { window.__adminQ = e.target.value; location.hash = "#/admin/users"; render(); }
    else { ui.filters.q = e.target.value; location.hash === "#/catalog" ? render() : (location.hash = "#/catalog"); }
  }
});
document.addEventListener("submit", (e) => {
  const f = e.target.closest("[data-form]");
  if (!f) return;
  e.preventDefault();
  (forms[f.dataset.form] || window.ADMIN_FORMS?.[f.dataset.form])?.(f, e);
});
window.addEventListener("hashchange", () => { ui.notifOpen = false; closeOverlay(); render(); });

window.ACADEMY = { S: () => S, save, render, toast, overlay, closeOverlay, icon, esc, course, device, fmtMAD, fmtDate, fmtMin, bar, badge, simNote, access, progressOf, audit, today, logo, shell };
