import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { inviteDoctor } from "../../actions";

export const metadata: Metadata = { title: "Inviter un médecin" };

export default async function Nouveau({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const admin = await requireAdmin();
  const { erreur } = await searchParams;
  const models = await sql<{ id: string; name: string; programs: number }[]>`
    select dm.id, dm.name, (select count(*)::int from programs p where p.device_model_id = dm.id and p.published) as programs from device_models dm order by dm.name`;
  return (
    <Shell user={admin} active="/admin">
      <p className="crumbs mono"><a href="/admin">Médecins</a> / Inviter</p>
      <div className="page-head"><div><span className="eyebrow">Après l'installation d'une machine</span><h1 className="display h1">Inviter un médecin</h1></div></div>
      <form action={inviteDoctor} className="glass card stack" style={{ maxWidth: 760 }}>
        {erreur && <p className="alert err" role="alert">{erreur}</p>}
        <div className="form-grid">
          <div className="field"><label htmlFor="full_name">Nom complet</label><input className="input" id="full_name" name="full_name" required placeholder="Dr Prénom Nom" /></div>
          <div className="field"><label htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="specialty">Spécialité</label><input className="input" id="specialty" name="specialty" placeholder="Dermatologie" /></div>
          <div className="field"><label htmlFor="city">Ville</label><input className="input" id="city" name="city" /></div>
          <div className="field full"><label htmlFor="clinic">Clinique / cabinet</label><input className="input" id="clinic" name="clinic" /></div>
        </div>
        <hr className="signal" />
        <div className="form-grid">
          <div className="field"><label htmlFor="device_model_id">Machine installée</label>
            <select className="input" id="device_model_id" name="device_model_id" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}{m.programs ? "" : " (pas encore de parcours publié)"}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="serial_number">N° de série</label><input className="input" id="serial_number" name="serial_number" /></div>
          <div className="field"><label htmlFor="installed_on">Date d'installation</label><input className="input" id="installed_on" name="installed_on" type="date" /></div>
        </div>
        <p className="small muted">Le médecin reçoit un lien personnel (valable 14 jours) pour créer son mot de passe. Le parcours de la machine lui est ouvert automatiquement.</p>
        <div className="row" style={{ justifyContent: "flex-end" }}><a className="btn ghost" href="/admin">Annuler</a><button className="btn solid" type="submit">Créer et inviter</button></div>
      </form>
    </Shell>
  );
}
