import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  subject?: string;
  message?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message || !emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // TODO: wire up to Cellulift's CRM / email provider (e.g. Resend, SendGrid) or webhook.
  console.log("[contact] new lead", body);

  return NextResponse.json({ ok: true });
}
