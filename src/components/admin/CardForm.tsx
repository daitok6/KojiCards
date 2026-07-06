"use client";

import { useState, useRef, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { createCard, updateCard } from "@/lib/actions";
import type { Card, CardMedia } from "@/types";

const GAMES = ["Pokémon", "Magic: The Gathering", "Yu-Gi-Oh!", "Dragon Ball Super", "One Piece", "Flesh and Blood", "Other"];
const RARITIES = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare", "Promo"];
const CONDITIONS = ["Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"];
const FINISHES = ["Normal", "Holo", "Reverse Holo", "Foil", "Other"];
const LANGUAGES = ["English", "Japanese", "Chinese", "Korean", "French", "German", "Spanish", "Italian", "Other"];
const GRADING_COMPANIES = ["PSA", "BGS", "CGC", "SGC", "Other"];
const STATUSES = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

interface GalleryItem { url: string; previewUrl?: string; type: "image" | "video"; position: number; }

interface CardFormProps {
  card?: Card;
}

async function uploadFile(file: File): Promise<{ url: string; type: "image" | "video" }> {
  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "videos" : "cards";
  const blob = await upload(`${folder}/${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    contentType: file.type,
  });
  return { url: blob.url, type: isVideo ? "video" : "image" };
}

export function CardForm({ card }: CardFormProps) {
  const [isGraded, setIsGraded] = useState(card?.graded ?? false);
  const [imageUrl, setImageUrl] = useState(card?.imageUrl ?? "");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(card?.imageUrl ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [gallery, setGallery] = useState<GalleryItem[]>(
    (card?.media ?? []).map((m: CardMedia) => ({ url: m.url, previewUrl: m.url, type: m.type, position: m.position }))
  );

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (coverPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(coverPreviewUrl);
      gallery.forEach((item) => {
        if (item.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ── Cover upload ──────────────────────────────────────────────────────────
  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    if (coverPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(localUrl);

    setCoverUploading(true);
    setCoverError("");
    try {
      const { url } = await uploadFile(file);
      setImageUrl(url);
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  // ── Gallery upload ────────────────────────────────────────────────────────
  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryUploading(true);
    setGalleryError("");
    try {
      const localUrls = files.map((f) => URL.createObjectURL(f));
      const results = await Promise.all(files.map(uploadFile));
      setGallery((prev) => [
        ...prev,
        ...results.map((r, i) => ({
          url: r.url,
          previewUrl: localUrls[i],
          type: r.type,
          position: prev.length + i,
        })),
      ]);
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setGalleryUploading(false);
      // Reset so same files can be re-selected if needed
      e.target.value = "";
    }
  }

  function removeGalleryItem(index: number) {
    setGallery((prev) => {
      const removed = prev[index];
      if (removed?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, position: i }));
    });
  }

  function moveGalleryItem(index: number, dir: -1 | 1) {
    setGallery((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, i) => ({ ...item, position: i }));
    });
  }

  // ── Form submit ───────────────────────────────────────────────────────────
  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    if (imageUrl) formData.set("imageUrl", imageUrl);
    formData.set("galleryMedia", JSON.stringify(gallery.map(({ url, type, position }) => ({ url, type, position }))));
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
      {/* ── Cover image ───────────────────────────────────────────────────── */}
      <div
        className="p-6 rounded-xl"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold mb-1">Cover Image *</h2>
        <p className="text-white/30 text-xs mb-4">Shown in the catalog grid and holographic showcase.</p>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 140, height: 196, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
          >
            {coverPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-white/20 text-4xl">🃏</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="btn-ghost text-sm px-5 py-2.5 disabled:opacity-50"
            >
              {coverUploading ? "Uploading…" : imageUrl ? "Change Cover" : "Upload Cover"}
            </button>
            {coverError && <p className="text-red-400 text-xs">{coverError}</p>}
            {imageUrl && !coverUploading && <p className="text-green-400 text-xs">✓ Cover uploaded</p>}
            <p className="text-white/30 text-xs">JPEG, PNG, WebP, or GIF.</p>
          </div>
        </div>
      </div>

      {/* ── Gallery media ─────────────────────────────────────────────────── */}
      <div
        className="p-6 rounded-xl"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold mb-1">Gallery</h2>
        <p className="text-white/30 text-xs mb-4">
          Additional photos and short video clips shown on the card detail page. Drag to reorder using the arrows.
        </p>

        {/* Existing gallery thumbnails */}
        {gallery.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {gallery.map((item, i) => (
              <div
                key={item.url}
                className="relative rounded-lg overflow-hidden flex-shrink-0"
                style={{ width: 80, height: 112, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
              >
                {item.type === "video" ? (
                  <div className="flex items-center justify-center w-full h-full bg-black/50">
                    <span className="text-2xl">🎬</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.previewUrl ?? item.url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                )}

                {/* Controls overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-1 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => moveGalleryItem(i, -1)} disabled={i === 0}
                      className="text-white/70 hover:text-white text-xs disabled:opacity-30 leading-none px-1">←</button>
                    <button type="button" onClick={() => moveGalleryItem(i, 1)} disabled={i === gallery.length - 1}
                      className="text-white/70 hover:text-white text-xs disabled:opacity-30 leading-none px-1">→</button>
                  </div>
                  <button type="button" onClick={() => removeGalleryItem(i)}
                    className="text-red-400 hover:text-red-300 text-xs text-center leading-none">✕ Remove</button>
                </div>

                {/* Type badge */}
                <span className="absolute top-1 left-1 text-[9px] font-bold px-1 rounded"
                  style={{ background: item.type === "video" ? "rgba(168,85,247,0.8)" : "rgba(59,130,246,0.8)", color: "white" }}>
                  {item.type === "video" ? "VID" : "IMG"}
                </span>
              </div>
            ))}
          </div>
        )}

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          onChange={handleGalleryChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={galleryUploading}
          className="btn-ghost text-sm px-5 py-2.5 disabled:opacity-50"
        >
          {galleryUploading ? "Uploading…" : "+ Add Photos / Videos"}
        </button>
        {galleryError && <p className="text-red-400 text-xs mt-2">{galleryError}</p>}
        <p className="text-white/30 text-xs mt-2">Images: JPEG, PNG, WebP, GIF · Videos: MP4, WebM · Max 50 MB each</p>
      </div>

      {/* ── Card details ──────────────────────────────────────────────────── */}
      <div
        className="p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold">Card Details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm text-white/50 mb-1.5">Card Name *</label>
            <input name="name" type="text" required defaultValue={card?.name} placeholder="e.g. Charizard" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Game *</label>
            <select name="game" required defaultValue={card?.game ?? ""}>
              <option value="">Select game…</option>
              {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Set / Expansion *</label>
            <input name="set" type="text" required defaultValue={card?.set} placeholder="e.g. Base Set" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Rarity *</label>
            <select name="rarity" required defaultValue={card?.rarity ?? ""}>
              <option value="">Select rarity…</option>
              {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Condition *</label>
            <select name="condition" required defaultValue={card?.condition ?? ""}>
              <option value="">Select condition…</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Price (USD)</label>
            <input name="price" type="number" min="0" step="0.01"
              defaultValue={card?.price !== null ? Number(card?.price) : ""}
              placeholder="Leave blank if price on request" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Stock Quantity *</label>
            <input name="stock" type="number" min="0" step="1" required defaultValue={card?.stock ?? 1} />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Card Number</label>
            <input name="cardNumber" type="text" defaultValue={card?.cardNumber ?? ""} placeholder="e.g. 4/102" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Finish *</label>
            <select name="finish" required defaultValue={card?.finish ?? "Normal"}>
              {FINISHES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Language *</label>
            <select name="language" required defaultValue={card?.language ?? "English"}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">SKU</label>
            <input name="sku" type="text" defaultValue={card?.sku ?? ""} placeholder="Your stock code" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Artist</label>
            <input name="artist" type="text" defaultValue={card?.artist ?? ""} placeholder="Card illustrator" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Release Year</label>
            <input name="releaseYear" type="number" min="1990" max="2100" step="1"
              defaultValue={card?.releaseYear ?? ""} placeholder="e.g. 1999" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-white/50 mb-1.5">Availability Status *</label>
            <select name="status" required defaultValue={card?.status ?? "available"}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="featured" type="checkbox" defaultChecked={card?.featured}
              className="w-4 h-4 accent-purple-500"
              style={{ width: "auto", background: "none", border: "none", padding: 0 }} />
            <span className="text-sm text-white/60">Feature on homepage</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="firstEdition" type="checkbox" defaultChecked={card?.firstEdition}
              className="w-4 h-4 accent-purple-500"
              style={{ width: "auto", background: "none", border: "none", padding: 0 }} />
            <span className="text-sm text-white/60">1st Edition</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="graded" type="checkbox" checked={isGraded} onChange={e => setIsGraded(e.target.checked)}
              className="w-4 h-4 accent-purple-500"
              style={{ width: "auto", background: "none", border: "none", padding: 0 }} />
            <span className="text-sm text-white/60">Graded card</span>
          </label>
        </div>
        {isGraded && (
          <div
            className="p-4 rounded-xl"
            style={{ border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.05)" }}
          >
            <p className="text-sm text-purple-300 font-semibold mb-4">Grading Details</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Grading Company</label>
                <select name="gradingCompany" defaultValue={card?.gradingCompany ?? ""}>
                  <option value="">Select…</option>
                  {GRADING_COMPANIES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Grade</label>
                <input name="grade" type="text" defaultValue={card?.grade ?? ""} placeholder="e.g. 10, 9.5" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Cert Number</label>
                <input name="certNumber" type="text" defaultValue={card?.certNumber ?? ""} placeholder="Cert / serial number" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Details / Notes ──────────────────────────────────────────────────── */}
      <div
        className="p-6 rounded-xl space-y-3"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-white font-semibold">Details / Notes</h2>
        <p className="text-white/30 text-xs">
          Free text for condition notes, whitening, misprint details, signatures, or anything else buyers should know.
        </p>
        <textarea
          name="details"
          rows={4}
          defaultValue={card?.details ?? ""}
          placeholder="e.g. Light whitening on back, first-print error, signed by artist…"
          style={{
            width: "100%",
            resize: "vertical",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            color: "white",
            padding: "10px 14px",
            fontSize: 14,
          }}
        />
      </div>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting || coverUploading || galleryUploading || !imageUrl}
          className="btn-primary px-10 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : card ? "Save Changes" : "Add Card"}
        </button>
        <a href="/admin" className="btn-ghost px-8 py-3">Cancel</a>
      </div>
      {!imageUrl && (
        <p className="text-yellow-400/70 text-xs">Please upload a cover image to continue.</p>
      )}
    </form>
  );
}
