import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with KojiCards — trading card vendor.",
};

const VENDOR_EMAIL = process.env.NEXT_PUBLIC_VENDOR_EMAIL ?? "contact@example.com";
const VENDOR_PHONE = process.env.NEXT_PUBLIC_VENDOR_PHONE ?? "+1 (555) 000-0000";
const VENDOR_WHATSAPP = process.env.NEXT_PUBLIC_VENDOR_WHATSAPP ?? "15550000000";
const VENDOR_INSTAGRAM = process.env.NEXT_PUBLIC_VENDOR_INSTAGRAM ?? "#";
const VENDOR_ADDRESS = process.env.NEXT_PUBLIC_VENDOR_ADDRESS ?? "Address not set";
const MAPS_EMBED = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED ?? "";

export default function ContactPage() {
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

          {/* Email */}
          <ContactCard
            icon="✉️"
            title="Email"
            value={VENDOR_EMAIL}
            href={`mailto:${VENDOR_EMAIL}`}
          />

          {/* Phone */}
          <ContactCard
            icon="📞"
            title="Phone"
            value={VENDOR_PHONE}
            href={`tel:${VENDOR_PHONE.replace(/\D/g, "")}`}
          />

          {/* WhatsApp */}
          <ContactCard
            icon="💬"
            title="WhatsApp"
            value="Chat on WhatsApp"
            href={`https://wa.me/${VENDOR_WHATSAPP}`}
            external
          />

          {/* Instagram */}
          <ContactCard
            icon="📸"
            title="Instagram"
            value="@kojicards"
            href={VENDOR_INSTAGRAM}
            external
          />

          {/* Address */}
          <div
            className="p-5 rounded-xl flex gap-4"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Location</p>
              <p className="text-white font-medium">{VENDOR_ADDRESS}</p>
            </div>
          </div>

          {/* Map embed */}
          {MAPS_EMBED && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <iframe
                src={MAPS_EMBED}
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
