"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { sendContactEmail } from "@/lib/actions";
import { toViewableUrl } from "@/lib/blobUrl";

interface CardContext {
  id: string;
  name: string;
  imageUrl: string;
  condition: string;
  price: number | null;
  set: string;
  game: string;
}

interface ContactFormProps {
  cardContext?: CardContext | null;
}

export function ContactForm({ cardContext }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("sending");
    const result = await sendContactEmail(formData);
    if (result.success) {
      setStatus("success");
      formRef.current?.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Card context box */}
      {cardContext && (
        <div
          className="flex gap-3 items-center rounded-xl p-3"
          style={{ border: "1px solid rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.06)" }}
        >
          <div
            className="relative flex-shrink-0 rounded-md overflow-hidden"
            style={{ width: 38, height: 52, background: "#101018" }}
          >
            <Image
              src={toViewableUrl(cardContext.imageUrl)}
              alt={cardContext.name}
              fill
              className="object-contain"
              sizes="38px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate" style={{ fontSize: 12 }}>
              Asking about: {cardContext.name} — {cardContext.set}
            </p>
            <p className="text-white/45" style={{ fontSize: 11 }}>
              {cardContext.condition}{cardContext.price !== null ? ` · $${cardContext.price.toFixed(0)}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Hidden subject when card context is present */}
      {cardContext ? (
        <input
          type="hidden"
          name="subject"
          value={`Inquiry: ${cardContext.name} (${cardContext.set})`}
        />
      ) : (
        <div>
          <label className="block text-sm text-white/50 mb-1.5" htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="e.g. Inquiry about Charizard PSA 10"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required placeholder="Your name" />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={
            cardContext
              ? "Questions, offers, or a request for more photos…"
              : "Tell us which card(s) you're interested in, any questions you have, etc."
          }
          style={{ resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ padding: "15px", fontSize: 15 }}
      >
        {status === "sending" ? "Sending…" : cardContext ? "Send inquiry" : "Send Message"}
      </button>

      {!cardContext && (
        <p className="text-center text-white/40" style={{ fontSize: 11.5 }}>
          You&apos;ll get a reply at your email — no account needed.
        </p>
      )}

      {status === "success" && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          ✅ Message sent! We&apos;ll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}
    </form>
  );
}
