"use client";

import { useState } from "react";
import { updateAnnouncement } from "@/lib/actions";
import type { Announcement } from "@/types";

interface AnnouncementFormProps {
  announcement: Announcement | null;
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setSaved(false);
    try {
      await updateAnnouncement(formData);
      setSaved(true);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div
        className="p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <div>
          <label className="block text-sm text-white/50 mb-1.5">Message</label>
          <textarea
            name="message"
            rows={2}
            defaultValue={announcement?.message ?? ""}
            placeholder="e.g. New Mega Evolution singles just dropped — check the catalog!"
            style={{ resize: "vertical" }}
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1.5">Link (optional)</label>
          <input name="link" type="text" defaultValue={announcement?.link ?? ""} placeholder="/cards or https://…" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            name="active"
            type="checkbox"
            defaultChecked={announcement?.active}
            className="w-4 h-4 accent-purple-500"
            style={{ width: "auto", background: "none", border: "none", padding: 0 }}
          />
          <span className="text-sm text-white/60">Show banner on the home page</span>
        </label>
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
          <span className="text-green-400 text-sm">✓ Saved — home page updated</span>
        )}
      </div>
    </form>
  );
}
