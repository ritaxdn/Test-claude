import { TechDiagram } from "@/components/illustrations/TechDiagram";
import { ScrollStory } from "@/components/motion/ScrollStory";

const chapters = [
  {
    title: "Le constat",
    body: "La médecine esthétique explose en Afrique francophone. Mais l'accès à des technologies fiables, avec un vrai accompagnement clinique et commercial, reste rare — et c'est exactement le vide que Cellulift comble.",
  },
  {
    title: "Notre rôle",
    body: "Distributeur et ambassadeur officiel de LGL Expert, nous ne vendons pas une machine : nous construisons avec chaque professionnel un modèle économique autour d'une technologie qui lui correspond.",
  },
  {
    title: "Notre méthode",
    body: "Diagnostic de votre activité, recommandation technologique argumentée, formation clinique et commerciale à l'installation, puis suivi technique dans la durée — un seul interlocuteur, du premier contact au dixième réassort.",
  },
  {
    title: "Notre ambition",
    body: "Devenir le partenaire de référence de la médecine esthétique sur l'ensemble du continent africain, avec un niveau d'exigence comparable aux standards européens.",
  },
];

export function Manifesto() {
  return (
    <section className="border-b border-border bg-paper py-20 md:py-28">
      <div className="container-cl">
        <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">NOTRE APPROCHE</p>
        <ScrollStory
          chapters={chapters}
          visual={<TechDiagram motif="pulse" className="w-full max-w-sm" />}
          className="mt-8"
        />
      </div>
    </section>
  );
}
