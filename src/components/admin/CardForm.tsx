"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createCard, updateCard } from "@/lib/actions";
import type { Card } from "@/types";

const GAMES = ["Pokémon", "Magic: The Gathering", "Yu-Gi-Oh!", "Dragon Ball Super", "One Piece", "Flesh and Blood", "Other"];
const RARITIES = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare", "Promo"];
const CONDITIONS = ["Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"];

interface CardFormProps {
  card?: Card;
}

export function CardForm({ card }: CardFormProps) {
  const [imageUrl, setImageUrl] = useState(card?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    if (imageUrl) formData.set("imageUrl", imageUrl);
    try {
      if (card) {
        await updateCard(card.id, formData);
      } else {
        await createCard(formData);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Image upload */}
      <div
        className="p-6 rounded-xl"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold mb-4">Card Image</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Preview */}
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 140, height: 196, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
          >
            {imageUrl ? (
              <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="140px" />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-white/20 text-4xl">🃏</span>
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-ghost text-sm px-5 py-2.5 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : imageUrl ? "Change Image" : "Upload Image"}
            </button>
            {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
            {imageUrl && !uploading && (
              <p className="text-green-400 text-xs">✓ Image uploaded</p>
            )}
            <p className="text-white/30 text-xs">JPEG, PNG, WebP, or GIF. Max 10MB recommended.</p>
          </div>
        </div>
      </div>

      {/* Card details */}
      <div
        className="p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold">Card Details</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-white/50 mb-1.5">Card Name *</label>
            <input name="name" type="text" required defaultValue={card?.name} placeholder="e.g. Charizard" />
          </div>

          {/* Game */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Game *</label>
            <select name="game" required defaultValue={card?.game ?? ""}>
              <option value="">Select game…</option>
              {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Set */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Set / Expansion *</label>
            <input name="set" type="text" required defaultValue={card?.set} placeholder="e.g. Base Set" />
          </div>

          {/* Rarity */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Rarity *</label>
            <select name="rarity" required defaultValue={card?.rarity ?? ""}>
              <option value="">Select rarity…</option>
              {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Condition *</label>
            <select name="condition" required defaultValue={card?.condition ?? ""}>
              <option value="">Select condition…</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Price (USD)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={card?.price !== null ? Number(card?.price) : ""}
              placeholder="Leave blank if price on request"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Stock Quantity *</label>
            <input name="stock" type="number" min="0" step="1" required defaultValue={card?.stock ?? 1} />
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={card?.featured}
            className="w-4 h-4 accent-purple-500"
            style={{ width: "auto", background: "none", border: "none", padding: 0 }}
          />
          <span className="text-sm text-white/60">Feature this card on the homepage</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting || uploading || !imageUrl}
          className="btn-primary px-10 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : card ? "Save Changes" : "Add Card"}
        </button>
        <a href="/admin" className="btn-ghost px-8 py-3">
          Cancel
        </a>
      </div>
      {!imageUrl && (
        <p className="text-yellow-400/70 text-xs">Please upload a card image to continue.</p>
      )}
    </form>
  );
}
