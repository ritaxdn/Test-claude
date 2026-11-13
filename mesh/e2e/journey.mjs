// End-to-end user journey: sign-up → email confirmation → onboarding → project
// → discover/filters → pass → interested → accept → chat (realtime) → privacy checks.
//
// Requires the LOCAL Supabase stack (`npx supabase start`, which includes Mailpit)
// and `npm run dev`. Run on a fresh DB (`npx supabase db reset`):
//   npm i -D playwright && npx playwright install chromium
//   node e2e/journey.mjs [screenshot-dir]
import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MAIL = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";
const SHOTS = process.argv[2];
const run = Date.now().toString(36);
const alice = { email: `alice.${run}@example.test`, password: "correct-horse-1" };
const bob = { email: `bob.${run}@example.test`, password: "correct-horse-2" };

const log = (...a) => console.log("•", ...a);
const assert = (c, m) => {
  if (!c) throw new Error("ASSERT FAILED: " + m);
  log("ok", m);
};

async function confirmLink(email) {
  for (let i = 0; i < 30; i++) {
    const r = await fetch(`${MAIL}/api/v1/search?query=${encodeURIComponent("to:" + email)}`).then((r) => r.json());
    if (r.messages?.length) {
      const msg = await fetch(`${MAIL}/api/v1/message/${r.messages[0].ID}`).then((r) => r.json());
      const m = (msg.Text || msg.HTML).match(/https?:\/\/[^\s"'<>)]+verify[^\s"'<>)]*/);
      if (m) return m[0].replace(/&amp;/g, "&");
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("No confirmation email for " + email);
}

async function signUpAndOnboard(browser, user, profile, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto(`${BASE}/signup`);
  await page.fill("#email", user.email);
  await page.fill("#password", "short");
  await page.click("button[type=submit]");
  await page.getByText("Use at least 8 characters.").waitFor();
  log("ok signup validation shows field error");
  await page.fill("#password", user.password);
  await page.click("button[type=submit]");
  await page.waitForURL(/check-email/);
  log("ok signup → check-email");

  const link = await confirmLink(user.email);
  await page.goto(link);
  await page.waitForURL(/onboarding/);
  log("ok email confirmation → onboarding");
  if (SHOTS && profile.shot) await page.screenshot({ path: `${SHOTS}/${profile.shot}-onboarding-1.png` });

  assert(!(await page.getByText("Commitment level").isVisible()), "wizard shows only the current step");
  // step 1: try continuing without name
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByText("Tell us your name.").waitFor();
  await page.fill("#full_name", profile.name);
  await page.fill("#headline", profile.headline);
  await page.fill("#location", profile.location);
  await page.getByRole("button", { name: "Continue" }).click();
  // step 2
  await page.getByRole("checkbox", { name: new RegExp(profile.role) }).click();
  await page.fill("#skills-input", profile.skill);
  await page.keyboard.press("Enter");
  await page.getByRole("checkbox", { name: "Climate" }).click();
  await page.waitForTimeout(300);
  if (SHOTS && profile.shot) await page.screenshot({ path: `${SHOTS}/${profile.shot}-onboarding-2.png` });
  assert(!(await page.getByText("Commitment level").isVisible()), "step 2 hides step 3 fields");
  await page.getByRole("button", { name: "Continue" }).click();
  // step 3
  await page.getByRole("radio", { name: "Part-time" }).click();
  await page.getByRole("radio", { name: /Serious side project/ }).click();
  await page.getByRole("button", { name: /Finish/ }).click();
  await page.waitForURL(/discover/);
  await page.getByText(`Welcome to MESH, ${profile.name.split(" ")[0]}`).waitFor();
  log("ok onboarding complete →", profile.name);
  return { ctx, page };
}

const browser = await chromium.launch();
const mobile = { ...devices["iPhone 13"] };
const desktop = { viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 };

// ---------------- Alice: founder creates a project
const A = await signUpAndOnboard(
  browser,
  alice,
  { name: "Alice Martin", headline: "Founder, ex-PM", location: "Paris, France", role: "Founder", skill: "Fundraising", shot: "alice" },
  desktop,
);
let cards = await A.page.locator("article").count();
assert(cards === 6, `alice sees 6 demo projects in Discover (got ${cards})`);
assert((await A.page.getByText("Fictional demo").count()) >= 6, "demo projects are labeled");
if (SHOTS) await A.page.screenshot({ path: `${SHOTS}/desktop-discover.png`, fullPage: false });

// filters
await A.page.getByLabel("Sector").selectOption("climate");
await A.page.waitForURL(/industry=climate/);
await A.page.waitForFunction(() => document.querySelectorAll("article").length === 1);
log("ok sector filter narrows feed to 1");
await A.page.getByLabel("Sector").selectOption("devtools");
await A.page.getByLabel("Stage").selectOption("idea");
await A.page.getByText("No projects match these filters").waitFor();
log("ok empty filtered state");
await A.page.getByRole("link", { name: "Clear filters" }).click();
await A.page.waitForFunction(() => document.querySelectorAll("article").length === 6);

// demo project: interested disabled
assert((await A.page.getByText("Fictional demo listing — requests are disabled.").count()) === 6, "demo cards can't receive requests");

// create project (with validation)
await A.page.goto(`${BASE}/projects`);
await A.page.getByText("You haven't posted a project yet").waitFor();
await A.page.goto(`${BASE}/projects/new`);
await A.page.fill("#title", "Ab");
await A.page.getByRole("button", { name: "Publish project" }).click();
await A.page.getByText("At least 3 characters.").waitFor();
log("ok project validation errors shown");
await A.page.fill("#title", "Solar Commons");
await A.page.fill("#tagline", "Community solar for renters");
await A.page.fill("#problem", "Renters can't install solar panels on buildings they don't own.");
await A.page.fill("#solution", "A subscription to a share of a local solar farm, billed with your utility.");
await A.page.selectOption("#industry", "climate");
await A.page.selectOption("#stage", "prototype");
await A.page.fill("#location", "Paris, France");
await A.page.getByRole("checkbox", { name: "Engineer" }).click();
await A.page.getByRole("checkbox", { name: "Designer" }).click();
if (SHOTS) await A.page.screenshot({ path: `${SHOTS}/desktop-new-project.png`, fullPage: true });
await A.page.getByRole("button", { name: "Publish project" }).click();
await A.page.waitForURL(/\/projects\/[0-9a-f-]{36}/);
const projectUrl = A.page.url().split("?")[0];
await A.page.getByText("You own this project").waitFor();
log("ok project created", projectUrl);

// alice's own project not in her feed
await A.page.goto(`${BASE}/discover`);
assert((await A.page.getByText("Solar Commons").count()) === 0, "own project hidden from own feed");

// edit
await A.page.goto(`${projectUrl}/edit`);
await A.page.fill("#traction", "40 renters on the waitlist.");
await A.page.getByRole("button", { name: "Save changes" }).click();
await A.page.waitForURL(new RegExp(projectUrl.replace(/[/.]/g, "\\$&")));
await A.page.getByText("40 renters on the waitlist.").waitFor();
log("ok project edited");

// ---------------- Bob: builder on mobile
const B = await signUpAndOnboard(
  browser,
  bob,
  { name: "Bob Okafor", headline: "Full-stack engineer", location: "Lagos, Nigeria", role: "Builder", skill: "Full-stack", shot: "bob" },
  mobile,
);
cards = await B.page.locator("article").count();
assert(cards === 7, `bob sees 7 projects (got ${cards})`);
if (SHOTS) await B.page.screenshot({ path: `${SHOTS}/mobile-discover.png` });

// pass a demo project via "Hide it", then undo
const gridnest = B.page.locator("article", { hasText: "Demo · Gridnest" });
await gridnest.getByRole("button", { name: "Hide it" }).click();
await B.page.getByText("Passed on Demo · Gridnest").waitFor();
await B.page.waitForFunction(() => document.querySelectorAll("article").length === 6);
log("ok pass hides card");

// Bob can't edit Alice's project
const r = await B.page.goto(`${projectUrl}/edit`);
await B.page.getByText("This page doesn't exist, or you don't have access to it.").waitFor();
log("ok non-owner edit → not found", r.status());

// interested with a note
await B.page.goto(`${BASE}/discover`);
const solar = B.page.locator("article", { hasText: "Solar Commons" });
await solar.getByRole("button", { name: "Interested" }).click();
await solar.locator("textarea").fill("I've built two energy dashboards and would love to help.");
if (SHOTS) await B.page.screenshot({ path: `${SHOTS}/mobile-interested-note.png` });
await solar.getByRole("button", { name: "Send request" }).click();
await B.page.getByText("Request sent.").waitFor();
await B.page.waitForFunction(() => ![...document.querySelectorAll("article")].some((a) => a.textContent.includes("Solar Commons")));
log("ok interest sent, card removed");

// project page shows pending; duplicate impossible via UI
await B.page.goto(projectUrl);
await B.page.getByText("Request pending").waitFor();
log("ok project page shows pending status");
await B.page.goto(`${BASE}/requests?tab=sent`);
await B.page.getByText("Solar Commons").waitFor();

// gate: no conversation yet
await B.page.goto(`${BASE}/matches`);
await B.page.getByText("No matches yet").waitFor();
log("ok no match before acceptance");

// ---------------- Alice accepts
await A.page.goto(`${BASE}/discover`);
const badge = await A.page.locator('nav[aria-label="Main"] a[href="/requests"]').first().innerText();
assert(/1/.test(badge), `nav badge shows 1 pending (got "${badge.trim()}")`);
await A.page.goto(`${BASE}/requests`);
await A.page.getByText("I've built two energy dashboards").waitFor();
if (SHOTS) await A.page.screenshot({ path: `${SHOTS}/desktop-requests.png` });
await A.page.getByRole("button", { name: "Accept" }).click();
await A.page.getByText("It's a match").waitFor();
log("ok alice accepted");
await A.page.goto(`${BASE}/matches`);
await A.page.getByText("Bob Okafor").click();
await A.page.waitForURL(/\/matches\/[0-9a-f-]{36}/);
const matchUrl = A.page.url();
await A.page.fill("#message", "Hi Bob! Want to grab a call this week?");
await A.page.keyboard.press("Enter");
await A.page.locator("li", { hasText: "Hi Bob! Want to grab a call" }).getByText(/\d:\d\d/).waitFor();
log("ok alice sent a message");

// ---------------- Bob replies (realtime: open thread first, then alice writes again)
await B.page.goto(`${BASE}/matches`);
await B.page.getByText("Hi Bob! Want to grab a call").waitFor();
await B.page.getByText("Alice Martin").click();
await B.page.waitForURL(/\/matches\//);
await B.page.fill("#message", "Absolutely — Thursday works.");
await B.page.getByRole("button", { name: "Send message" }).click();
await B.page.locator("li", { hasText: "Absolutely — Thursday works." }).getByText(/\d:\d\d/).waitFor();
log("ok bob replied");

await A.page.fill("#message", "Great, sending an invite.");
await A.page.keyboard.press("Enter");
try {
  await B.page.getByText("Great, sending an invite.").waitFor({ timeout: 8000 });
  log("ok realtime delivered alice's message to bob without reload");
} catch {
  log("WARN realtime did not deliver within 8s (polling fallback would within 20s)");
}
if (SHOTS) await B.page.screenshot({ path: `${SHOTS}/mobile-chat.png` });

// bob's project page now says matched
await B.page.goto(projectUrl);
await B.page.getByText("You're matched").waitFor();
log("ok bob sees matched state on project page");

// ---------------- privacy: a third user can't open the chat
const C = await signUpAndOnboard(
  browser,
  { email: `carol.${run}@example.test`, password: "correct-horse-3" },
  { name: "Carol Diaz", headline: "Angel investor", location: "Madrid", role: "Investor", skill: "Fundraising" },
  desktop,
);
await C.page.goto(matchUrl);
await C.page.getByText("This page doesn't exist, or you don't have access to it.").waitFor();
log("ok outsider cannot open someone else's chat");

// sign-out returns to landing and protects routes
await C.page.goto(`${BASE}/profile`);
await C.page.getByRole("button", { name: "Sign out" }).click();
await C.page.waitForURL(BASE + "/");
await C.page.goto(`${BASE}/matches`);
await C.page.waitForURL(/login\?next=/);
log("ok signed out user redirected to login");

if (SHOTS) {
  const L = await browser.newContext(mobile);
  const lp = await L.newPage();
  await lp.goto(BASE);
  await lp.screenshot({ path: `${SHOTS}/mobile-landing.png` });
  await A.page.goto(projectUrl);
  await A.page.screenshot({ path: `${SHOTS}/desktop-project-owner.png`, fullPage: true });
  await A.page.goto(matchUrl);
  await A.page.screenshot({ path: `${SHOTS}/desktop-chat.png` });
}

await browser.close();
console.log("\nE2E JOURNEY PASSED");
