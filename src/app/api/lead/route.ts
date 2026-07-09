import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/lead";

/**
 * Central lead intake endpoint. Every form on the site (quote request,
 * demo booking, callback, brochure download, ROI study, contact) posts
 * here. Forwards to a CRM webhook when CRM_WEBHOOK_URL is configured
 * (works out of the box with HubSpot/Pipedrive/Zoho/Zapier/Make webhook
 * URLs) so the site never needs a rebuild to change CRM.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const lead = parsed.data;
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          submittedAt: new Date().toISOString(),
          source: "cellulift-website",
        }),
      });

      if (!response.ok) {
        console.error("CRM webhook responded with an error status", response.status);
      }
    } catch (error) {
      console.error("Failed to forward lead to CRM webhook", error);
    }
  } else {
    console.info("[lead] CRM_WEBHOOK_URL not configured — lead logged only:", lead);
  }

  return NextResponse.json({ ok: true });
}
