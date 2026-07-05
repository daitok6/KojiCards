"use client";

import { useState } from "react";
import { updateVendorInfo } from "@/lib/actions";

interface VendorInfo {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  mapsEmbed: string;
}

interface VendorInfoFormProps {
  info: VendorInfo | null;
}

export function VendorInfoForm({ info }: VendorInfoFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setSaved(false);
    try {
      await updateVendorInfo(formData);
      setSaved(true);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const fields: { name: keyof VendorInfo; label: string; placeholder: string; hint?: string }[] = [
    {
      name: "email",
      label: "Email address",
      placeholder: "contact@example.com",
    },
    {
      name: "phone",
      label: "Phone number",
      placeholder: "+1 (555) 000-0000",
    },
    {
      name: "whatsapp",
      label: "WhatsApp number",
      placeholder: "15550000000",
      hint: "Digits only (country code + number), e.g. 15551234567",
    },
    {
      name: "instagram",
      label: "Instagram URL",
      placeholder: "https://instagram.com/yourshop",
    },
    {
      name: "address",
      label: "Shop address",
      placeholder: "123 Card Street, City, State 00000",
    },
  ];

  return (
    <form action={handleSubmit} className="space-y-6">
      <div
        className="p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        {fields.map(({ name, label, placeholder, hint }) => (
          <div key={name}>
            <label className="block text-sm text-white/50 mb-1.5">{label}</label>
            <input
              name={name}
              type="text"
              defaultValue={info?.[name] ?? ""}
              placeholder={placeholder}
            />
            {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
          </div>
        ))}

        {/* Maps embed — textarea since these are long */}
        <div>
          <label className="block text-sm text-white/50 mb-1.5">Google Maps embed URL</label>
          <textarea
            name="mapsEmbed"
            rows={3}
            defaultValue={info?.mapsEmbed ?? ""}
            placeholder="https://www.google.com/maps/embed?pb=..."
            style={{ resize: "vertical" }}
          />
          <p className="text-white/30 text-xs mt-1">
            Google Maps → Share → Embed a map → copy the <code>src</code> URL from the iframe code.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-10 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm">✓ Saved — contact page updated</span>
        )}
      </div>
    </form>
  );
}
