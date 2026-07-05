export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with KojiCards — trading card vendor.",
};

export default async function ContactPage() {
  const info = await prisma.vendorInfo.findUnique({ where: { id: "singleton" } });

  const email     = info?.email     || "";
  const phone     = info?.phone     || "";
  const whatsapp  = info?.whatsapp  || "";
  const instagram = info?.instagram || "";
  const address   = info?.address   || "";
  const mapsEmbed = info?.mapsEmbed || "";

  const hasAnyInfo = email || phone || whatsapp || instagram || address;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
          Get in Touch
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Contact KojiCards
        </h1>
        <p className="text-white/40 max-w-lg mx-auto">
          Interested in a card? Want to inquire about availability or arrange a purchase?
          Reach out directly — we&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left — contact info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Reach us directly</h2>

          {!hasAnyInfo && (
            <div
              className="p-5 rounded-xl text-white/40 text-sm"
              style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
            >
              Contact details not set up yet. Log in to the admin panel to add them.
            </div>
          )}

          {email && (
            <ContactCard icon="✉️" title="Email" value={email} href={`mailto:${email}`} />
          )}

          {phone && (
            <ContactCard
              icon="📞"
              title="Phone"
              value={phone}
              href={`tel:${phone.replace(/\D/g, "")}`}
            />
          )}

          {whatsapp && (
            <ContactCard
              icon="💬"
              title="WhatsApp"
              value="Chat on WhatsApp"
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              external
            />
          )}

          {instagram && (
            <ContactCard
              icon="📸"
              title="Instagram"
              value={instagram.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "@").replace(/\/$/, "")}
              href={instagram}
              external
            />
          )}

          {address && (
            <div
              className="p-5 rounded-xl flex gap-4"
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Location</p>
                <p className="text-white font-medium">{address}</p>
              </div>
            </div>
          )}

          {mapsEmbed && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <iframe
                src={mapsEmbed}
                width="100%"
                height="220"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop location"
              />
            </div>
          )}
        </div>

        {/* Right — contact form */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon, title, value, href, external = false,
}: {
  icon: string;
  title: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex gap-4 p-5 rounded-xl transition-all no-underline group"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{title}</p>
        <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}
