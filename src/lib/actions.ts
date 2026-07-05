"use server";

import { prisma } from "@/lib/prisma";
import { cardSchema, contactSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { del } from "@vercel/blob";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Card Actions ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function createCard(formData: FormData) {
  await requireAdmin();

  const imageUrl = formData.get("imageUrl") as string;
  if (!imageUrl) throw new Error("Image is required");

  const raw = Object.fromEntries(formData.entries());
  const parsed = cardSchema.safeParse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.card.create({
    data: {
      ...parsed.data,
      imageUrl,
      price: parsed.data.price ?? null,
    },
  });

  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateCard(id: string, formData: FormData) {
  await requireAdmin();

  const imageUrl = formData.get("imageUrl") as string | null;
  const raw = Object.fromEntries(formData.entries());
  const parsed = cardSchema.safeParse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.card.update({
    where: { id },
    data: {
      ...parsed.data,
      price: parsed.data.price ?? null,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath(`/cards/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteCard(id: string) {
  await requireAdmin();

  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) throw new Error("Card not found");

  // Remove image from Vercel Blob
  try {
    await del(card.imageUrl);
  } catch {
    // Non-fatal: continue with DB delete even if blob removal fails
  }

  await prisma.card.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath("/admin");
}

// ── Contact Action ────────────────────────────────────────────────────────────

export async function sendContactEmail(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, subject, message } = parsed.data;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) return { success: false, error: "Contact not configured." };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "KojiCards Contact <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `[KojiCards Contact] ${subject}`,
      html: `
        <h2>New inquiry from KojiCards</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
