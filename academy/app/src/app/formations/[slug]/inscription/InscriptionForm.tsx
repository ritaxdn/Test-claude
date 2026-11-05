"use client";
import { useActionState, useState } from "react";
import { requestEnrollment, type FormState } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

type Opt = [string, string];
export function InscriptionForm({ slug, professions, countries }: { slug: string; professions: Opt[]; countries: Opt[] }) {
  const [state, action] = useActionState<FormState, FormData>(requestEnrollment, {});
  const [started] = useState(() => Date.now());
  const val = (k: string) => state.values?.[k] ?? "";
  return (
    <form action={action} className="stack" style={{ gap: 14 }} encType="multipart/form-data" noValidate={false}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="started" value={started} />
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state.error && <p className="alert err" role="alert">{state.error}</p>}
      <div className="form-grid">
        <div className="field full"><label htmlFor="full_name">Nom complet</label><input className="input" id="full_name" name="full_name" required minLength={2} maxLength={200} autoComplete="name" defaultValue={val("full_name")} key={`n${val("full_name")}`} /></div>
        <div className="field"><label htmlFor="email">E-mail professionnel</label><input className="input" id="email" name="email" type="email" required maxLength={200} autoComplete="email" defaultValue={val("email")} key={`e${val("email")}`} /></div>
        <div className="field"><label htmlFor="phone">Téléphone (facultatif)</label><input className="input" id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" defaultValue={val("phone")} key={`p${val("phone")}`} /></div>
        <div className="field"><label htmlFor="country">Pays d&apos;exercice</label>
          <select className="input" id="country" name="country" required defaultValue={val("country") || "MA"} key={`c${val("country")}`}>{countries.map(([c, l]) => <option key={c} value={c}>{l}</option>)}</select></div>
        <div className="field"><label htmlFor="profession">Profession</label>
          <select className="input" id="profession" name="profession" required defaultValue={val("profession")} key={`f${val("profession")}`}><option value="">Choisir…</option>{professions.map(([c, l]) => <option key={c} value={c}>{l}</option>)}</select></div>
        <div className="field full"><label htmlFor="professional_id">N° d&apos;inscription à l&apos;Ordre (ou équivalent)</label><input className="input" id="professional_id" name="professional_id" required minLength={3} maxLength={100} defaultValue={val("professional_id")} key={`o${val("professional_id")}`} /></div>
        <div className="field full"><label htmlFor="proof">Justificatif (facultatif) : carte ou attestation professionnelle, PDF, JPEG ou PNG, 5 Mo maximum</label><input className="input" id="proof" name="proof" type="file" accept="application/pdf,image/jpeg,image/png" /></div>
        <div className="field full"><label htmlFor="message">Message (facultatif)</label><textarea className="input" id="message" name="message" maxLength={1000} defaultValue={val("message")} key={`m${val("message")}`} /></div>
      </div>
      <label className="row small" style={{ alignItems: "flex-start", gap: 10 }}>
        <input type="checkbox" name="consent" required style={{ marginTop: 3 }} />
        <span>J&apos;accepte que CELLULIFT Academy utilise ces informations pour vérifier ma qualification et traiter ma demande. Un justificatif éventuel est supprimé 30 jours après la décision.</span>
      </label>
      <label className="row small" style={{ alignItems: "flex-start", gap: 10 }}>
        <input type="checkbox" name="marketing" style={{ marginTop: 3 }} />
        <span>J&apos;accepte d&apos;être contacté(e) par CELLULIFT Academy au sujet de ses formations et de ses services (facultatif, révocable à tout moment).</span>
      </label>
      <SubmitButton className="btn solid">Envoyer ma demande</SubmitButton>
      <p className="small muted">Aucun paiement à cette étape : les modalités de paiement vous sont envoyées après vérification.</p>
    </form>
  );
}
