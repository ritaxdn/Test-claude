"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AcademyCalendar({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#1A1814" } },
      });
    })();
  }, []);

  return (
    <section className="bg-ivory-2 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-14">
          <Cal
calLink="celluliftacademy"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        </div>
      </Container>
    </section>
  );
}
