"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Heading } from "@/components/system/Heading";

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
        styles: { branding: { brandColor: "#1d1b26" } },
      });
    })();
  }, []);

  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        <div className="glass mt-8 overflow-hidden rounded-[1.75rem] p-3 md:p-5">
          <Cal
calLink="celluliftacademy"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        </div>
      </div>
    </section>
  );
}
