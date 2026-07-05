"use client";

import { useState, useRef } from "react";
import { sendContactEmail } from "@/lib/actions";

export function ContactForm() {
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
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required placeholder="Your name" />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" required placeholder="e.g. Inquiry about Charizard PSA 10" />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us which card(s) you're interested in, any questions you have, etc."
          style={{ resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

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
