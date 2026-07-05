export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with KojiCards — trading card vendor.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const cardId = typeof sp.card === "string" ? sp.card : undefined;

  const [info, inquiryCard] = await Promise.all([
    prisma.vendorInfo.findUnique({ where: { id: "singleton" } }),
    cardId
      ? prisma.card.findUnique({ where: { id: cardId } })
      : Promise.resolve(null),
  ]);

  const email     = info?.email     || "";
  const phone     = info?.phone     || "";
  const whatsapp  = info?.whatsapp  || "";
  const instagram = info?.instagram || "";
  const address   = info?.address   || "";
  const mapsEmbed = info?.mapsEmbed || "";

  const hasAnyInfo = email || phone || whatsapp || instagram || address;

  const cardContext = inquiryCard
    ? {
        id: inquiryCard.id,
        name: inquiryCard.name,
        imageUrl: inquiryCard.imageUrl,
        condition: inquiryCard.condition,
        price: inquiryCard.price !== null ? Number(inquiryCard.price) : null,
        set: inquiryCard.set,
        game: inquiryCard.game,
      }
    : null;

  const whatsappNum = whatsapp.replace(/\D/g, "");
  const whatsappHref = whatsappNum
    ? `https://wa.me/${whatsappNum}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

      {/* ── Mobile layout ─────────────────────────────────────────────────── */}
      <div className="md:hidden">
        <h1 className="font-black text-white mb-1.5" style={{ fontSize: 28 }}>
          {cardContext ? "Ask about a card" : "Contact KojiCards"}
        </h1>
        <p className="text-white/45 mb-5" style={{ fontSize: 14 }}>
          A real person answers — typically within 24 hours.
        </p>

        {/* Channel tiles */}
        <div className="flex flex-col gap-2.5 mb-6">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline rounded-xl p-4"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}
            >
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-white font-bold" style={{ fontSize: 14 }}>WhatsApp</p>
                <span
                  className="font-bold text-green-400"
                  style={{ fontSize: 10, background: "rgba(74,222,128,0.12)", padding: "3px 9px", borderRadius: 999 }}
                >
                  Fastest
                </span>
              </div>
              <p className="text-white/50" style={{ fontSize: 12 }}>Usually answered within hours.</p>
            </a>
          )}

          {(instagram || email) && (
            <div className="grid grid-cols-2 gap-2.5">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline rounded-xl p-3.5"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-white font-bold" style={{ fontSize: 13 }}>Instagram</p>
                  <p className="text-white/50 mt-0.5" style={{ fontSize: 11.5 }}>
                    {instagram.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "@").replace(/\/$/, "")}
                  </p>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block no-underline rounded-xl p-3.5"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-white font-bold" style={{ fontSize: 13 }}>Email</p>
                  <p className="text-white/50 mt-0.5" style={{ fontSize: 11.5 }}>Within 24h</p>
                </a>
              )}
            </div>
          )}
        </div>

        {!hasAnyInfo && !cardContext && (
          <div
            className="p-5 rounded-xl text-white/40 text-sm mb-6"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            Contact details not set up yet. Log in to the admin panel to add them.
          </div>
        )}

        <ContactForm cardContext={cardContext} />
      </div>

      {/* ── Desktop layout ────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {cardContext ? `Ask about ${cardContext.name}` : "Contact KojiCards"}
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
            {whatsappHref && (
              <ContactCard
                icon="💬"
                title="WhatsApp"
                value="Chat on WhatsApp"
                href={whatsappHref}
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

          {/* Right — form */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Send a message</h2>
            <ContactForm cardContext={cardContext} />
          </div>
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
