// CELLULIFT ACADEMY — prototype admin panel. Figures are sample data.
(() => {
  const A = window.ACADEMY, D = window.ACADEMY_DATA;
  const { icon, esc, course, device, fmtMAD, bar, simNote, toast, overlay, closeOverlay, audit, save, today } = A;
  const S = () => A.S();
  const personaOf = (uid) => (uid === D.personas.partner.id ? "partner" : uid === D.personas.open.id ? "open" : S().custom?.profile.id === uid ? "custom" : null);
  const stateOf = (uid) => { const k = personaOf(uid); return k === "custom" ? S().custom.state : k ? S().people[k] : null; };
  const userName = (uid) => S().users.find((u) => u.id === uid)?.name || "—";
  const statusBadge = (s) => ({ verified: `<span class="badge ok">Verified</span>`, pending: `<span class="badge pending">Pending</span>`, unverified: `<span class="badge locked">Unverified</span>`, rejected: `<span class="badge err">Rejected</span>`, suspended: `<span class="badge err">Suspended</span>` }[s] || s);
  const rulesOf = (c) => {
    const r = [...c.access.rules];
    const eq = D.devices.filter((d) => S().equipRules[`${d.id}|${c.id}`]);
    if (eq.length && !r.includes("equipment")) r.push("equipment");
    return r.map((x) => `<span class="badge ${x === "free" ? "free" : x === "paid" ? "purchased" : x === "equipment" ? "included" : "exclusive"}">${x === "paid" ? fmtMAD(c.access.price) : x === "manual_only" ? "Invitation" : x}</span>`).join(" ");
  };
  // Sample per-course figures (stable)
  const stats = (c, i) => ({ enrolled: [212, 96, 41, 158, 634, 702, 88, 57, 120, 301][i % 10], completion: [71, 64, 58, 77, 52, 69, 61, 74, 48, 55][i % 10] });

  window.ADMIN_NAV = [
    ["admin", "home", "Overview"],
    ["admin/users", "users", "Users"],
    ["admin/verification", "shield", "Verification", () => S().queue.length],
    ["admin/courses", "layers", "Courses"],
    ["admin/entitlements", "key", "Access & entitlements"],
    ["admin/equipment", "cpu", "Equipment sales"],
    ["admin/protection", "lock", "Content protection", () => S().alerts.length],
    ["admin/analytics", "chart", "Analytics"],
    ["admin/audit", "log", "Audit log"],
  ].map((x) => (x[3] ? [x[0], x[1], x[2], x[3]] : x));

  const head = (eyebrow, title, right = "") => `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1 class="display h1">${title}</h1></div><div class="row wrap">${right}</div></div>`;
  const kpi = (l, v, d, down) => `<div class="glass kpi"><span class="eyebrow">${l}</span><div class="v">${v}</div>${d ? `<div class="d ${down ? "down" : ""}">${d}</div>` : ""}</div>`;
  const sampleTag = `<span class="badge">Sample figures</span>`;

  /* ── Overview ── */
  function overview() {
    const months = [["May", 62], ["Jun", 74], ["Jul", 58], ["Aug", 49], ["Sep", 96], ["Oct", 118]];
    const max = Math.max(...months.map((m) => m[1]));
    return `${head("Administration · " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), `Academy <span class="iridescent">overview</span>`, sampleTag)}
    <div class="grid g4 kpis stagger" style="margin-bottom:22px">
      ${kpi("Registered professionals", "1 284", "+86 this month")}${kpi("Verified", "812", "63 % of registered")}${kpi("Active learners · 30 d", "437", "+12 % vs Sep")}${kpi("Course completion", "64 %", "+3 pts")}
    </div>
    <div class="cols-main">
      <div class="stack">
        <section class="glass card"><div class="row between"><span class="eyebrow">Enrolments per month</span><span class="mono">2026</span></div>
          <div class="bars">${months.map(([m, v]) => `<div><span>${v}</span><i style="height:${(v / max) * 100}%"></i><span>${m}</span></div>`).join("")}</div></section>
        <section class="glass card"><div class="row between" style="margin-bottom:14px"><span class="eyebrow">Open Academy funnel · 2026</span><span class="mono">Free → paid → customer</span></div>
          <div class="funnel">${[["Registered", 702, 100], ["Enrolled in a free course", 488, 70], ["Bought a paid course", 131, 19], ["Became CELLULIFT customer", 23, 3.3]].map(([l, v, p]) => `<div class="f"><span>${l}</span>${bar(p)}<span class="mono">${v}</span></div>`).join("")}</div></section>
        <section class="glass card"><div class="row between" style="margin-bottom:6px"><span class="eyebrow">Recent activity</span><a class="small" href="#/admin/audit" style="text-decoration:underline">Audit log</a></div>
          <div class="list">${S().audit.slice(0, 5).map((a) => `<div class="item"><span class="mono" style="width:120px">${a.at.slice(5)}</span><span class="badge">${a.action}</span><span class="small" style="flex:1">${esc(a.target)}</span><span class="small muted">${esc(a.actor)}</span></div>`).join("")}</div></section>
      </div>
      <div class="stack">
        <section class="glass card"><span class="eyebrow">Partner activation</span><div class="row" style="margin-top:14px;gap:18px"><div class="ring" style="--p:81;width:88px;height:88px"><span style="font-size:16px">81%</span></div><div class="small muted">118 of 146 devices sold since Jan 2026 have an activated training programme.<br><b style="color:var(--deep)">28 to follow up.</b></div></div></section>
        <section class="glass card"><div class="row between"><span class="eyebrow">Verification queue</span><a href="#/admin/verification" class="small" style="text-decoration:underline">Open</a></div>
          <div class="list">${S().queue.slice(0, 3).map((q) => `<div class="item"><div class="avatar">${q.name.replace("Dr ", "").split(" ").map((w) => w[0]).join("").slice(0, 2)}</div><div style="flex:1"><div class="small" style="font-weight:600">${esc(q.name)}</div><div class="mono" style="font-size:9.5px">${esc(q.submitted)}</div></div></div>`).join("") || `<p class="small muted" style="padding:10px 0">Queue is empty.</p>`}</div></section>
        <section class="glass card"><div class="row between"><span class="eyebrow">Protection alerts</span><a href="#/admin/protection" class="small" style="text-decoration:underline">Review</a></div>
          <div class="list">${S().alerts.map((a) => `<div class="item"><span style="color:var(--warn)">${icon("alert", 16)}</span><div style="flex:1"><div class="small" style="font-weight:600">${esc(a.kind)}</div><div class="small muted">${esc(a.user)}</div></div><span class="badge ${a.score === "High" ? "err" : "warn"}">${a.score}</span></div>`).join("") || `<p class="small muted" style="padding:10px 0">No open alerts.</p>`}</div></section>
      </div>
    </div>`;
  }

  /* ── Users ── */
  function users() {
    const q = A.ui?.adminQ || window.__adminQ || "";
    return `${head("People", "Users", `<button class="btn solid" data-a="invite">${icon("plus", 16)} Invite professional</button>`)}
    <div class="glass card" style="padding:0">
      <div class="row wrap" style="padding:16px 18px;border-bottom:1px solid var(--line)"><div style="position:relative;flex:1;min-width:220px"><span style="position:absolute;left:14px;top:13px;color:var(--deep-soft)">${icon("search", 16)}</span><input class="input" style="padding-left:40px" placeholder="Name, email, city…" value="${esc(q)}" data-in="adminq" aria-label="Search users"></div>
        ${["All", "Partner", "Open Academy", "Pending"].map((f) => `<button class="chip ${(window.__userFilter || "All") === f ? "on" : ""}" data-a="ufilter" data-v="${f}">${f}</button>`).join("")}</div>
      <div class="table-wrap" id="usertable">${userTable()}</div>
    </div>`;
  }
  function userTable() {
    const q = (window.__adminQ || "").toLowerCase(), f = window.__userFilter || "All";
    const list = S().users.filter((u) => (!q || [u.name, u.email, u.city, u.prof].join(" ").toLowerCase().includes(q)) && (f === "All" || (f === "Pending" ? u.status === "pending" : u.type === f)));
    return `<table class="t"><thead><tr><th>Professional</th><th>Profession</th><th>City</th><th>Access model</th><th>Status</th><th>Courses</th><th>Last active</th><th></th></tr></thead><tbody>
      ${list.map((u) => `<tr><td><div class="row"><div class="avatar">${u.name.replace("Dr ", "").split(" ").map((w) => w[0]).join("").slice(0, 2)}</div><div><div style="font-weight:600">${esc(u.name)}</div><div class="small muted">${esc(u.email)}</div></div></div></td>
        <td>${esc(u.prof)}</td><td>${esc(u.city)}</td><td><span class="badge ${u.type === "Partner" ? "included" : ""}">${u.type}</span></td><td>${statusBadge(u.status)}</td><td class="mono">${u.courses}</td><td class="mono">${u.last}</td>
        <td style="text-align:right"><button class="btn sm" data-a="usersheet" data-v="${u.id}">Manage</button></td></tr>`).join("")}
      </tbody></table>${list.length ? "" : `<p class="small muted" style="padding:18px">No user matches.</p>`}`;
  }
  function userSheet(uid) {
    const u = S().users.find((x) => x.id === uid);
    const st = stateOf(uid);
    const ents = st ? st.entitlements.filter((e) => !e.revoked) : [];
    const devs = st ? st.devices : S().sales.filter((s) => s.user === uid).map((s) => ({ device: s.device, serial: s.serial }));
    overlay(`<div class="row between"><span class="eyebrow">User · ${u.id}</span><button class="icon-btn" data-a="close" aria-label="Close">${icon("x", 16)}</button></div>
      <div class="row" style="margin:16px 0"><div class="avatar lg">${u.name.replace("Dr ", "").split(" ").map((w) => w[0]).join("").slice(0, 2)}</div><div><h2 class="h2 display">${esc(u.name)}</h2><div class="small muted">${esc(u.prof)} · ${esc(u.city)}</div><div class="row" style="margin-top:8px">${statusBadge(u.status)}<span class="badge ${u.type === "Partner" ? "included" : ""}">${u.type}</span></div></div></div>
      <div class="signal" style="margin:10px 0 18px"></div>
      <div class="eyebrow" style="margin-bottom:8px">Linked equipment</div>
      ${devs.length ? devs.map((d) => `<div class="row" style="padding:6px 0">${icon("cpu", 16)}<b class="small">${device(d.device).name}</b><span class="mono">S/N ${d.serial}</span></div>`).join("") : `<p class="small muted">None</p>`}
      <div class="eyebrow" style="margin:18px 0 8px">Course access</div>
      ${st ? ents.map((e, i) => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><div><div class="small" style="font-weight:600">${esc(course(e.course).title)}</div><div class="mono" style="font-size:9.5px">${e.source}${e.ref ? " · " + esc(e.ref) : ""}${e.until ? " · until " + e.until : ""}</div></div>${e.source === "equipment" ? `<span class="small muted">via device</span>` : `<button class="btn sm danger" data-a="revoke" data-u="${uid}" data-i="${st.entitlements.indexOf(e)}">Revoke</button>`}</div>`).join("") || `<p class="small muted">No access yet.</p>` : `<p class="small muted">${u.courses} courses (sample — not modelled in prototype)</p>`}
      <form data-form="grant" data-u="${uid}" class="stack hair" style="gap:10px;padding:16px;margin-top:18px"><b class="small">Grant access manually</b>
        <select class="input" name="course">${D.courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select>
        <div class="form-grid"><input class="input" name="reason" required placeholder="Reason (logged)"><input class="input" name="until" type="date" aria-label="End date (optional)"></div>
        <button class="btn solid sm">Grant access</button></form>
      <div class="row wrap" style="margin-top:18px">${u.status !== "verified" ? `<button class="btn sm" data-a="approve" data-v="${uid}">Mark verified</button>` : ""}<button class="btn sm" data-a="toast" data-v="Password reset email sent (simulated)">Send password reset</button><button class="btn sm" data-a="toast" data-v="All sessions revoked (simulated)">Sign out all sessions</button><button class="btn sm danger" data-a="suspend" data-v="${uid}">${u.status === "suspended" ? "Reactivate" : "Suspend"}</button></div>`, "sheet");
  }

  /* ── Verification ── */
  function verification() {
    const q = S().queue;
    return `${head("People", "Professional verification")}
    <p class="muted" style="margin:-8px 0 20px;max-width:720px">Check the registration number with the relevant body (e.g. CNOM for physicians) before approving. Documents are stored in a private bucket and deleted 90 days after the decision.</p>
    ${q.length ? `<div class="grid g2 stagger">${q.map((v) => `<section class="glass card">
      <div class="row between"><span class="badge pending">Pending review</span><span class="mono">${esc(v.submitted)}</span></div>
      <h3 class="h3" style="margin:14px 0 4px">${esc(v.name)}</h3><div class="small muted">${esc(v.prof)}</div>
      <div class="hair" style="padding:12px 14px;margin:14px 0;display:grid;gap:6px"><div class="row between small"><span class="muted">Registration</span><span class="mono">${esc(v.reg)}</span></div><div class="row between small"><span class="muted">Document</span><a href="#" data-a="toast" data-v="Document opened in secure viewer (simulated)" style="text-decoration:underline">${esc(v.doc)}</a></div></div>
      <div class="row"><button class="btn solid sm" data-a="approve" data-v="${v.user}">${icon("check", 14)} Approve</button><button class="btn sm danger" data-a="reject" data-v="${v.user}">Reject</button></div></section>`).join("")}</div>`
      : `<div class="glass card" style="text-align:center;padding:48px"><h3 class="h3">Queue is empty</h3><p class="small muted">New requests appear here.</p></div>`}`;
  }

  /* ── Courses ── */
  function courses() {
    return `${head("Content", "Courses", `<button class="btn solid" data-a="newcourse">${icon("plus", 16)} New course</button>`)}
    <div class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Course</th><th>Format</th><th>Access rules</th><th>Lessons</th><th>Enrolled</th><th>Completion</th><th>Published</th><th></th></tr></thead><tbody>
      ${D.courses.map((c, i) => { const s = stats(c, i); return `<tr><td><div class="row"><img src="img/${c.img}.jpg" alt="" style="width:34px;height:40px;object-fit:contain"><div><div style="font-weight:600">${esc(c.title)}</div><div class="small muted">${esc(D.trainers[c.trainer].name)}</div></div></div></td>
        <td class="small">${c.format}</td><td>${rulesOf(c)}</td><td class="mono">${c.lessonCount}</td><td class="mono">${s.enrolled}</td><td style="min-width:120px"><div class="row">${bar(s.completion)}<span class="mono">${s.completion}%</span></div></td>
        <td><label class="toggle"><input type="checkbox" data-a="publish" data-v="${c.id}" ${S().published[c.id] ? "checked" : ""} aria-label="Published"><span></span></label></td>
        <td style="text-align:right"><a class="btn sm" href="#/admin/course/${c.id}">${icon("edit", 14)} Edit</a></td></tr>`; }).join("")}
    </tbody></table></div></div>`;
  }
  function builder(id) {
    const c = course(id);
    if (!c) return `<p>Not found</p>`;
    const r = c.access;
    return `<div class="mono" style="margin-bottom:14px"><a href="#/admin/courses">${icon("left", 12)} Courses</a></div>
    ${head("Course builder", esc(c.title).replace(/—.*/, ""), `<a class="btn" href="#/course/${c.id}">${icon("eye", 16)} Preview as learner</a><button class="btn solid" data-a="savecourse" data-v="${c.id}">Save & publish</button>`)}
    <div class="cols-main" style="grid-template-columns:minmax(0,1fr) 380px">
      <div class="stack">
        <section class="glass card"><div class="row between" style="margin-bottom:14px"><span class="eyebrow">Curriculum</span><button class="btn sm" data-a="toast" data-v="Module added (simulated)">${icon("plus", 14)} Module</button></div>
          ${c.modules.map((m, mi) => `<div class="hair" style="padding:14px;margin-bottom:12px"><div class="row between"><b>${mi + 1}. ${esc(m.title)}</b><span class="mono">${m.lessons.length} lessons</span></div>
            ${m.lessons.map((l) => `<div class="row" style="padding:10px 0;border-top:1px solid var(--line);margin-top:8px"><span class="mono" style="width:30px">${l.id}</span>${icon(l.kind === "quiz" ? "quiz" : l.kind === "resource" ? "file" : "play", 15)}<span class="small" style="flex:1">${esc(l.title)}</span>
              ${l.kind === "video" ? `<span class="badge ok" id="vs-${c.id}-${l.id.replace(".", "-")}">${icon("shield", 10)} Encoded · DRM</span><button class="btn sm" data-a="upload" data-v="vs-${c.id}-${l.id.replace(".", "-")}">${icon("upload", 13)} Replace</button>` : `<span class="badge">${l.kind}</span>`}</div>`).join("")}
            <button class="btn ghost sm" style="margin-top:8px" data-a="toast" data-v="Lesson added (simulated)">${icon("plus", 13)} Add lesson</button></div>`).join("")}
          <div class="hair" style="padding:26px;text-align:center;border-style:dashed" data-a="upload" data-v="newupload" role="button" tabindex="0">${icon("upload", 22)}<div class="small" style="font-weight:600;margin-top:8px">Drop video files to create lessons</div><div class="small muted">MP4/MOV up to 20 GB · uploaded directly to the video provider · <span id="newupload">no upload in progress</span></div></div>
        </section>
        ${simNote("Uploads are not sent anywhere. In production the browser uploads straight to the video provider with a one-time upload URL; the provider encodes, packages with DRM and calls back a signed webhook.")}
      </div>
      <div class="stack">
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Details</span>
          <div class="field"><label>Title</label><input class="input" value="${esc(c.title)}"></div>
          <div class="field"><label>Summary</label><textarea class="input">${esc(c.summary)}</textarea></div>
          <div class="form-grid"><div class="field"><label>Level</label><select class="input">${["Foundation", "Intermediate", "Advanced", "Expert"].map((l) => `<option ${l === c.level ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label>Trainer</label><select class="input">${Object.values(D.trainers).map((t) => `<option ${t.id === c.trainer ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select></div></div></section>
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Access rules</span>
          ${[["free", "Free for eligible professionals"], ["paid", "Paid enrolment"], ["equipment", "Included with equipment"], ["manual_only", "By invitation only"]].map(([k, l]) => `<label class="check"><input type="checkbox" ${r.rules.includes(k) ? "checked" : ""}> ${l}</label>`).join("")}
          <div class="form-grid"><div class="field"><label>Price (MAD, TTC)</label><input class="input" type="number" value="${r.price || ""}" placeholder="—"></div><div class="field"><label>Access duration</label><select class="input"><option>Lifetime</option><option>12 months</option><option>6 months</option></select></div></div>
          <div class="small muted">Devices: ${D.devices.filter((d) => S().equipRules[`${d.id}|${c.id}`]).map((d) => d.name).join(", ") || "none"} · <a href="#/admin/entitlements" style="text-decoration:underline">edit mapping</a></div>
          <span class="eyebrow" style="margin-top:6px">Eligibility</span>
          <label class="check"><input type="checkbox" ${r.verifiedOnly ? "checked" : ""}> Verified professionals only</label>
          <label class="check"><input type="checkbox" ${r.professions ? "checked" : ""}> Physicians only</label></section>
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Assessment & certificate</span>
          <div class="form-grid"><div class="field"><label>Pass mark</label><input class="input" type="number" value="${c.passing}" min="0" max="100"></div><div class="field"><label>Attempts</label><input class="input" type="number" value="3"></div></div>
          <div class="field"><label>Certificate type</label><select class="input"><option selected>Training completion</option><option disabled>Accredited (requires accrediting body)</option></select></div></section>
      </div>
    </div>`;
  }

  /* ── Entitlements ── */
  function entitlements() {
    return `${head("Access control", `Equipment <span class="iridescent">×</span> training`, `<button class="btn solid" data-a="grantmodal">${icon("key", 16)} Grant access</button>`)}
    <p class="muted" style="max-width:760px;margin:-8px 0 20px">Tick a box to include a programme with a device model. Linking a device to an account creates the matching entitlements automatically. Buying one technology never unlocks the others.</p>
    <section class="glass card" style="padding:8px"><div class="table-wrap"><table class="t matrix"><thead><tr><th>Device model</th>${D.courses.map((c) => `<th class="rot" title="${esc(c.title)}">${esc(c.title.split(" — ")[0].split(":")[0].slice(0, 30))}</th>`).join("")}</tr></thead><tbody>
      ${D.devices.map((d) => `<tr><td style="white-space:nowrap"><div class="row"><img src="img/${d.id}.jpg" alt="" style="width:24px;height:30px;object-fit:contain"><b class="small">${d.name}</b></div></td>${D.courses.map((c) => `<td class="c"><input type="checkbox" data-a="rule" data-v="${d.id}|${c.id}" ${S().equipRules[`${d.id}|${c.id}`] ? "checked" : ""} aria-label="${d.name} includes ${esc(c.title)}"></td>`).join("")}</tr>`).join("")}
    </tbody></table></div></section>
    <div class="section-title" style="margin-top:28px"><h2 class="h3">Manual grants</h2><span class="mono">${S().grants.length} active</span></div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Professional</th><th>Course</th><th>Reason</th><th>Until</th><th>Granted by</th><th></th></tr></thead><tbody>
      ${S().grants.map((g, i) => `<tr><td style="font-weight:600">${esc(g.user)}</td><td>${esc(course(g.course).title)}</td><td class="small">${esc(g.reason)}</td><td class="mono">${g.until || "—"}</td><td class="small muted">${esc(g.by)}</td><td style="text-align:right"><button class="btn sm danger" data-a="revokegrant" data-v="${i}">Revoke</button></td></tr>`).join("")}
    </tbody></table></div></section>
    <div class="callout" style="margin-top:20px">${icon("link", 18)}<div class="small"><b>CRM provisioning (planned).</b> The same entitlement records will later be created from CELLULIFT's customer database (sale registered → device linked → access granted), with this screen kept for exceptions.</div></div>`;
  }

  /* ── Equipment ── */
  function equipment() {
    const st = { linked: `<span class="badge ok">Linked</span>`, invite_sent: `<span class="badge pending">Invitation sent</span>`, unlinked: `<span class="badge locked">Not linked</span>` };
    return `${head("Customers", "Equipment sales", `<button class="btn solid" data-a="newsale">${icon("plus", 16)} Register a sale</button>`)}
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Client</th><th>Device</th><th>Serial</th><th>Sale date</th><th>Academy account</th><th>Status</th><th></th></tr></thead><tbody>
      ${S().sales.map((s, i) => `<tr><td style="font-weight:600">${esc(s.client)}</td><td><div class="row"><img src="img/${s.device}.jpg" alt="" style="width:22px;height:28px;object-fit:contain">${device(s.device).name}</div></td><td class="mono">${s.serial}</td><td class="mono">${s.date}</td>
        <td>${s.user ? esc(userName(s.user)) : s.email ? `<span class="small muted">${esc(s.email)}</span>` : "—"}</td><td>${st[s.status]}</td>
        <td style="text-align:right">${s.status !== "linked" ? `<button class="btn sm" data-a="linksale" data-v="${i}">${icon("link", 13)} Link to account</button>` : ""}</td></tr>`).join("")}
    </tbody></table></div></section>
    <div class="callout" style="margin-top:20px">${icon("users", 18)}<div class="small"><b>Tip — Open Academy → customer.</b> Link a new sale to <b>Youssef Amrani</b>, then switch the demo persona to “Open Academy”: his free course, pending order and history stay intact and the device programme appears.</div></div>`;
  }

  /* ── Protection ── */
  function protection() {
    const p = S().protection;
    const tg = (k, l, h) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div><div class="small" style="font-weight:600">${l}</div>${h ? `<div class="small muted">${h}</div>` : ""}</div><label class="toggle"><input type="checkbox" data-a="prot" data-v="${k}" ${p[k] ? "checked" : ""} aria-label="${l}"><span></span></label></div>`;
    const sel = (k, l, opts, unit) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div class="small" style="font-weight:600">${l}</div><select class="input" style="width:130px;height:36px" data-a="protsel" data-v="${k}">${opts.map((o) => `<option value="${o}" ${p[k] == o ? "selected" : ""}>${o} ${unit}</option>`).join("")}</select></div>`;
    const level = [
      ["Authenticated, entitlement-checked playback", "Enforceable", "ok"],
      ["Signed playback tokens (expiring, user-bound)", "Enforceable", "ok"],
      ["Encrypted streaming, no MP4 exposed", "Enforceable", "ok"],
      ["Widevine / FairPlay / PlayReady key protection", "Enforceable", "ok"],
      ["Stream & device limits, revocation", "Enforceable", "ok"],
      ["Screen-capture blackout", "Platform-dependent", "warn"],
      ["Visible dynamic watermark", "Deterrent · traceable", "pending"],
      ["Sharing detection", "Detective", "pending"],
      ["Right-click / dev-tools blocking", "Cosmetic", "locked"],
      ["Filming the screen with a phone", "Not preventable", "err"],
    ];
    return `${head("Security", `Content <span class="iridescent">protection</span>`, `<button class="btn solid" data-a="saveprot">Save policy</button>`)}
    ${simNote("These settings drive the simulated player only. Real protection requires the video/DRM provider described in docs/04-production-roadmap.md.")}
    <div class="grid g2" style="margin-top:20px">
      <section class="glass card"><span class="eyebrow">Playback</span>
        ${tg("drm", "Require DRM for all course videos", "Widevine, FairPlay or PlayReady depending on browser")}
        ${sel("ttl", "Playback token lifetime", [1, 2, 4, 6], "h")}${sel("streams", "Simultaneous streams per account", [1, 2, 3], "")}${sel("devices", "Registered devices per account", [2, 3, 5], "")}
        ${tg("pdfStamp", "Stamp protocol PDFs with learner identity", "Name, ID and date on every page")}</section>
      <section class="glass card"><span class="eyebrow">Dynamic watermark</span>
        ${tg("watermark", "Show moving watermark on video", "Repositions every few seconds")}${tg("wmName", "Full name")}${tg("wmEmail", "Email address")}${tg("wmId", "Learner ID")}${tg("wmTime", "Date & time")}
        <div class="video" style="margin-top:14px;aspect-ratio:16/6;border-radius:16px"><div class="stage"></div><div class="wm" style="left:12%;top:40%">${esc(p.watermark ? "Dr Salma Benali · ID 4821 · " + today() + " 14:32" : "Watermark off")}</div></div></section>
      <section class="glass card"><span class="eyebrow">Sharing detection</span>
        ${tg("travel", "Flag impossible travel", "Two distant countries within 6 hours")}
        <div class="row between" style="padding:12px 0"><div class="small" style="font-weight:600">Action on alert</div><select class="input" style="width:200px;height:36px"><option>Review by admin</option><option>Require re-login</option><option>Suspend automatically</option></select></div>
        ${tg("rightClick", "Disable right-click on player", "Cosmetic only — trivially bypassed; not counted as protection")}</section>
      <section class="glass card"><span class="eyebrow">What each layer really does</span>
        <div class="list" style="margin-top:6px">${level.map(([l, t, c]) => `<div class="item" style="padding:9px 0"><span class="small" style="flex:1">${l}</span><span class="badge ${c}">${t}</span></div>`).join("")}</div></section>
    </div>
    <div class="section-title" style="margin-top:28px"><h2 class="h3">Open alerts</h2></div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Learner</th><th>Signal</th><th>Detail</th><th>Severity</th><th>When</th><th></th></tr></thead><tbody>
      ${S().alerts.map((a, i) => `<tr><td style="font-weight:600">${esc(a.user)}</td><td>${esc(a.kind)}</td><td class="small">${esc(a.detail)}</td><td><span class="badge ${a.score === "High" ? "err" : "warn"}">${a.score}</span></td><td class="mono">${a.when}</td>
        <td style="text-align:right;white-space:nowrap"><button class="btn sm" data-a="alertact" data-v="${i}" data-k="signout">Sign out all</button> <button class="btn sm ghost" data-a="alertact" data-v="${i}" data-k="dismiss">Dismiss</button></td></tr>`).join("") || `<tr><td colspan="6" class="small muted">No open alerts.</td></tr>`}
    </tbody></table></div></section>`;
  }

  /* ── Analytics ── */
  function analytics() {
    return `${head("Business & learning", "Analytics", sampleTag + `<button class="btn" data-a="toast" data-v="CSV export generated (simulated)">Export CSV</button>`)}
    <div class="grid g4 kpis stagger" style="margin-bottom:20px">
      ${kpi("Registered professionals", "1 284", "+7.2 % MoM")}${kpi("Verified professionals", "812", "63 %")}${kpi("Active learners · 30 d", "437", "+12 %")}${kpi("Enrolments · YTD", "2 409", "+31 % YoY")}
      ${kpi("Completion rate", "64 %", "+3 pts")}${kpi("Free → paid", "18.6 %", "of free learners")}${kpi("Open Academy → customer", "23", "3.3 % · 2026")}${kpi("Partner 90-day retention", "72 %", "−2 pts", true)}
    </div>
    <div class="grid g2">
      <section class="glass card"><span class="eyebrow">Completion by course</span><div style="margin-top:12px;display:grid;gap:12px">
        ${D.courses.map((c, i) => [c, stats(c, i)]).sort((a, b) => b[1].completion - a[1].completion).map(([c, s]) => `<div><div class="row between small"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:75%">${esc(c.title)}</span><span class="mono">${s.completion}%</span></div>${bar(s.completion)}</div>`).join("")}</div></section>
      <div class="stack">
        <section class="glass card"><span class="eyebrow">Partner activation by family</span><div class="funnel" style="margin-top:14px">${[["Lasers", 88], ["Rejuvenation", 79], ["Body contouring", 71], ["Photomodulation", 64]].map(([l, v]) => `<div class="f"><span>${l}</span>${bar(v)}<span class="mono">${v}%</span></div>`).join("")}</div>
          <p class="small muted" style="margin-top:12px">Share of devices sold whose owner started the matching programme within 30 days.</p></section>
        <section class="glass card"><span class="eyebrow">Engagement</span><div class="grid g2" style="margin-top:12px;gap:14px">
          ${[["Median watch time / learner / week", "38 min"], ["Lessons completed · 30 d", "3 112"], ["Quiz pass rate (1st attempt)", "71 %"], ["Workshop registrations", "64"]].map(([l, v]) => `<div class="hair" style="padding:14px"><div class="mono" style="font-size:9.5px">${l}</div><div class="display" style="font-size:24px;margin-top:8px">${v}</div></div>`).join("")}</div></section>
        <div class="callout small">${icon("eye", 18)}<div>Commercial indicators are visible to CELLULIFT staff only. Learners never see sales prompts inside lessons; recommendations stay educational.</div></div>
      </div>
    </div>`;
  }

  /* ── Audit ── */
  function auditView() {
    const f = window.__auditFilter || "All";
    const list = S().audit.filter((a) => f === "All" || a.action.startsWith(f));
    return `${head("Security", "Audit log", `<button class="btn" data-a="toast" data-v="Export signed and downloaded (simulated)">Export</button>`)}
    <div class="row wrap" style="margin-bottom:14px">${["All", "entitlement", "user", "device", "course", "order", "protection"].map((x) => `<button class="chip ${f === x ? "on" : ""}" data-a="afilter" data-v="${x}">${x}</button>`).join("")}</div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Target</th><th>Note</th></tr></thead><tbody>
      ${list.map((a) => `<tr><td class="mono">${a.at}</td><td class="small">${esc(a.actor)}</td><td><span class="badge">${a.action}</span></td><td>${esc(a.target)}</td><td class="small muted">${esc(a.note)}</td></tr>`).join("")}
    </tbody></table></div></section>
    <p class="small muted" style="margin-top:12px">Append-only in production: written in the same transaction as the change, never editable from the admin UI.</p>`;
  }

  window.renderAdmin = (a, b) => {
    const views = { undefined: overview, "": overview, users, verification, courses, entitlements, equipment, protection, analytics, audit: auditView };
    if (a === "course") return A.shell("admin/courses", builder(b));
    const v = views[a] || overview;
    return A.shell(a ? `admin/${a}` : "admin", v());
  };

  const rerender = () => { save(); A.render(); };
  const linkDeviceTo = (uid, sale) => {
    const st = stateOf(uid);
    if (st && !st.devices.find((d) => d.serial === sale.serial)) st.devices.push({ device: sale.device, serial: sale.serial, date: sale.date, clinic: sale.client });
    const u = S().users.find((x) => x.id === uid);
    if (u) u.type = "Partner";
    sale.user = uid; sale.status = "linked";
    audit("device.link", `${sale.serial} → ${userName(uid)}`, st ? "Entitlements generated" : "");
  };

  window.ADMIN_ACTIONS = {
    toast: (el, e) => { e.preventDefault(); toast(el.dataset.v); },
    ufilter: (el) => { window.__userFilter = el.dataset.v; rerender(); },
    afilter: (el) => { window.__auditFilter = el.dataset.v; rerender(); },
    usersheet: (el) => userSheet(el.dataset.v),
    approve: (el) => {
      const uid = el.dataset.v, u = S().users.find((x) => x.id === uid);
      if (u) u.status = "verified";
      S().queue = S().queue.filter((q) => q.user !== uid);
      const st = stateOf(uid); if (st) st.verification = "verified";
      audit("user.verify", u?.name || uid, "Registration checked"); closeOverlay(); rerender(); toast(`${u?.name} verified — learner notified`);
    },
    reject: (el) => {
      const uid = el.dataset.v, u = S().users.find((x) => x.id === uid);
      if (u) u.status = "rejected";
      S().queue = S().queue.filter((q) => q.user !== uid);
      const st = stateOf(uid); if (st) st.verification = "unverified";
      audit("user.reject", u?.name || uid, "Number not found in register"); rerender(); toast("Request rejected — reason sent to learner");
    },
    suspend: (el) => { const u = S().users.find((x) => x.id === el.dataset.v); u.status = u.status === "suspended" ? "verified" : "suspended"; audit(u.status === "suspended" ? "user.suspend" : "user.reactivate", u.name); closeOverlay(); rerender(); toast(u.status === "suspended" ? "Account suspended · sessions and licences revoked" : "Account reactivated"); },
    revoke: (el) => { const st = stateOf(el.dataset.u); const e = st.entitlements[+el.dataset.i]; e.revoked = true; audit("entitlement.revoke", `${userName(el.dataset.u)} → ${course(e.course).title}`); save(); userSheet(el.dataset.u); toast("Access revoked · active playback stops at next licence check"); },
    invite: () => overlay(`<div class="eyebrow">Invite</div><h2 class="display h2" style="margin:10px 0 14px">Invite a professional</h2><form data-form="invite" class="stack" style="gap:12px"><input class="input" required placeholder="Full name"><input class="input" type="email" required placeholder="Email"><select class="input"><option value="">No course pre-assigned</option>${D.courses.map((c) => `<option>${esc(c.title)}</option>`).join("")}</select><div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Send invitation</button></div></form>`),
    publish: (el) => { S().published[el.dataset.v] = el.checked; audit(el.checked ? "course.publish" : "course.unpublish", course(el.dataset.v).title); save(); toast(el.checked ? "Course published" : "Course hidden from catalogue"); },
    newcourse: () => overlay(`<div class="eyebrow">New course</div><h2 class="display h2" style="margin:10px 0 14px">Create a course</h2><form data-form="invite" class="stack" style="gap:12px"><input class="input" required placeholder="Title"><select class="input"><option>Device programme</option><option>Masterclass</option><option>Module</option></select><select class="input">${D.devices.map((d) => `<option>${d.name}</option>`).join("")}<option>No specific device</option></select><div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Create draft</button></div></form>`),
    savecourse: (el) => { audit("course.update", course(el.dataset.v).title); save(); toast("Course saved — new version published"); },
    upload: (el) => {
      const target = document.getElementById(el.dataset.v);
      if (!target) return;
      const steps = ["Uploading 0 %", "Uploading 46 %", "Uploading 100 %", "Encoding…", "Packaging DRM…", "Ready · DRM"];
      let i = 0; target.className = target.className.replace("ok", "pending");
      const t = setInterval(() => { target.textContent = steps[i++]; if (i === steps.length) { clearInterval(t); target.className = target.className.replace("pending", "ok"); toast("Video ready (simulated pipeline)"); } }, 650);
    },
    rule: (el) => { S().equipRules[el.dataset.v] = el.checked; const [d, c] = el.dataset.v.split("|"); audit("entitlement.mapping", `${device(d).name} ${el.checked ? "includes" : "no longer includes"} ${course(c).title}`); save(); toast("Mapping updated — applies to all owners of this device"); },
    grantmodal: () => overlay(`<div class="eyebrow">Manual grant</div><h2 class="display h2" style="margin:10px 0 14px">Grant access</h2>
      <form data-form="grant" class="stack" style="gap:12px"><div class="field"><label>Professional</label><select class="input" name="user">${S().users.map((u) => `<option value="${u.id}">${esc(u.name)} — ${esc(u.email)}</option>`).join("")}</select></div>
      <div class="field"><label>Course</label><select class="input" name="course">${D.courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select></div>
      <div class="form-grid"><div class="field"><label>Reason (logged)</label><input class="input" name="reason" required placeholder="e.g. Trade-show demo"></div><div class="field"><label>Until (optional)</label><input class="input" name="until" type="date"></div></div>
      <div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Grant access</button></div></form>`),
    revokegrant: (el) => { const g = S().grants.splice(+el.dataset.v, 1)[0]; audit("entitlement.revoke", `${g.user} → ${course(g.course).title}`); rerender(); toast("Grant revoked"); },
    linksale: (el) => { const s = S().sales[+el.dataset.v]; overlay(`<div class="eyebrow">Link device</div><h2 class="display h2" style="margin:10px 0 6px">${device(s.device).name} · ${s.serial}</h2><p class="small muted" style="margin-bottom:14px">${esc(s.client)} · sold ${s.date}</p>
      <form data-form="linksale" data-v="${el.dataset.v}" class="stack" style="gap:12px"><div class="field"><label>Existing Academy account</label><select class="input" name="user">${S().users.map((u) => `<option value="${u.id}" ${u.id === D.personas.open.id ? "selected" : ""}>${esc(u.name)} — ${esc(u.email)}</option>`).join("")}</select><span class="hint">Search by name, email or registration number before inviting, to avoid duplicate accounts.</span></div>
      <div class="row between"><button type="button" class="btn" data-a="sendinvite" data-v="${el.dataset.v}">Send invitation instead</button><button class="btn solid">Link & grant training</button></div></form>`); },
    sendinvite: (el) => { const s = S().sales[+el.dataset.v]; s.status = "invite_sent"; s.email ||= "contact@client-sample.ma"; audit("device.invite", `${s.serial} → ${s.email}`); closeOverlay(); rerender(); toast("Invitation sent (simulated)"); },
    newsale: () => overlay(`<div class="eyebrow">Sales operations</div><h2 class="display h2" style="margin:10px 0 14px">Register a sale</h2>
      <form data-form="newsale" class="stack" style="gap:12px"><input class="input" name="client" required placeholder="Clinic / client"><select class="input" name="device">${D.devices.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}</select>
      <div class="form-grid"><input class="input" name="serial" required placeholder="Serial number"><input class="input" name="date" type="date" value="${today()}"></div><input class="input" name="email" type="email" placeholder="Practitioner email (invitation)">
      <div class="row between"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn solid">Register</button></div></form>`),
    prot: (el) => { S().protection[el.dataset.v] = el.checked; save(); if (el.dataset.v.startsWith("wm") || el.dataset.v === "watermark") A.render(); },
    protsel: (el) => { S().protection[el.dataset.v] = +el.value; save(); },
    saveprot: () => { audit("protection.policy", "Content protection policy updated"); save(); toast("Policy saved"); },
    alertact: (el) => { const a = S().alerts.splice(+el.dataset.v, 1)[0]; audit("protection." + el.dataset.k, a.user, a.kind); rerender(); toast(el.dataset.k === "signout" ? "All sessions revoked · password reset required" : "Alert dismissed"); },
  };
  window.ADMIN_FORMS = {
    grant: (f) => {
      const d = Object.fromEntries(new FormData(f));
      const uid = f.dataset.u || d.user, st = stateOf(uid);
      if (st) st.entitlements.push({ course: d.course, source: "manual", ref: d.reason, until: d.until || null, at: today() });
      S().grants.unshift({ user: userName(uid), course: d.course, by: "Meryem (admin)", reason: d.reason, until: d.until || "" });
      audit("entitlement.grant", `${userName(uid)} → ${course(d.course).title}`, d.reason);
      closeOverlay(); rerender(); toast("Access granted — learner notified");
    },
    invite: () => { closeOverlay(); toast("Done (simulated)"); },
    linksale: (f) => { linkDeviceTo(new FormData(f).get("user"), S().sales[+f.dataset.v]); closeOverlay(); rerender(); toast("Device linked — training unlocked on the existing account"); },
    newsale: (f) => { const d = Object.fromEntries(new FormData(f)); S().sales.unshift({ client: d.client, device: d.device, serial: d.serial, date: d.date, user: null, status: d.email ? "invite_sent" : "unlinked", email: d.email }); audit("device.sale", `${d.serial} · ${d.client}`); closeOverlay(); rerender(); toast(d.email ? "Sale registered · invitation sent" : "Sale registered"); },
  };
  window.ADMIN_INPUTS = { adminq: (el) => { window.__adminQ = el.value; document.getElementById("usertable").innerHTML = userTable(); } };
})();
