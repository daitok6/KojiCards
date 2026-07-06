"use server";

import { prisma } from "@/lib/prisma";
import { cardSchema, contactSchema, eventSchema } from "@/lib/validations";
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

interface MediaItem {
  url: string;
  type: "image" | "video";
  position: number;
}

function parseGalleryMedia(formData: FormData): MediaItem[] {
  const raw = formData.get("galleryMedia") as string | null;
  if (!raw) return [];
  try {
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    return items.filter(
      (item): item is MediaItem =>
        typeof item.url === "string" &&
        (item.type === "image" || item.type === "video") &&
        typeof item.position === "number"
    );
  } catch {
    return [];
  }
}

export async function createCard(formData: FormData) {
  await requireAdmin();

  const imageUrl = formData.get("imageUrl") as string;
  if (!imageUrl) throw new Error("Image is required");

  const raw = Object.fromEntries(formData.entries());
  const parsed = cardSchema.safeParse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
    firstEdition: raw.firstEdition === "on" || raw.firstEdition === "true",
    graded: raw.graded === "on" || raw.graded === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  // When not graded, null out stale graded sub-fields
  const cardData = {
    ...parsed.data,
    ...(parsed.data.graded ? {} : { gradingCompany: undefined, grade: undefined, certNumber: undefined }),
  };

  const galleryMedia = parseGalleryMedia(formData);

  await prisma.card.create({
    data: {
      ...cardData,
      imageUrl,
      price: cardData.price ?? null,
      media: {
        create: galleryMedia.map((m) => ({
          url: m.url,
          type: m.type,
          position: m.position,
        })),
      },
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
    firstEdition: raw.firstEdition === "on" || raw.firstEdition === "true",
    graded: raw.graded === "on" || raw.graded === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  // When not graded, null out stale graded sub-fields
  const cardData = {
    ...parsed.data,
    ...(parsed.data.graded ? {} : { gradingCompany: null, grade: null, certNumber: null }),
  };

  const galleryMedia = parseGalleryMedia(formData);

  // Get old gallery blobs so we can remove any that are no longer referenced
  const existingMedia = await prisma.cardMedia.findMany({ where: { cardId: id } });
  const newUrls = new Set(galleryMedia.map((m) => m.url));
  const removed = existingMedia.filter((m) => !newUrls.has(m.url));

  await prisma.$transaction([
    prisma.cardMedia.deleteMany({ where: { cardId: id } }),
    prisma.card.update({
      where: { id },
      data: {
        ...cardData,
        price: cardData.price ?? null,
        ...(imageUrl ? { imageUrl } : {}),
        media: {
          create: galleryMedia.map((m) => ({
            url: m.url,
            type: m.type,
            position: m.position,
          })),
        },
      },
    }),
  ]);

  // Clean up removed blobs (non-fatal)
  for (const m of removed) {
    try { await del(m.url); } catch { /* continue */ }
  }

  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath(`/cards/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteCard(id: string) {
  await requireAdmin();

  const card = await prisma.card.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!card) throw new Error("Card not found");

  // Remove all blobs (cover + gallery) — non-fatal individually
  const blobUrls = [card.imageUrl, ...card.media.map((m) => m.url)];
  await Promise.allSettled(blobUrls.map((url) => del(url)));

  await prisma.card.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath("/admin");
}

// ── Vendor Info Action ────────────────────────────────────────────────────────

export async function updateVendorInfo(formData: FormData) {
  await requireAdmin();

  const data = {
    email:     (formData.get("email")     as string ?? "").trim(),
    phone:     (formData.get("phone")     as string ?? "").trim(),
    whatsapp:  (formData.get("whatsapp")  as string ?? "").trim(),
    instagram: (formData.get("instagram") as string ?? "").trim(),
    address:   (formData.get("address")   as string ?? "").trim(),
    mapsEmbed: (formData.get("mapsEmbed") as string ?? "").trim(),
  };

  await prisma.vendorInfo.upsert({
    where:  { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

// ── Event Actions ─────────────────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.event.create({
    data: {
      ...parsed.data,
      endDate: parsed.data.endDate ?? null,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.event.update({
    where: { id },
    data: {
      ...parsed.data,
      endDate: parsed.data.endDate ?? null,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  await prisma.event.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

// ── Announcement Action ───────────────────────────────────────────────────────

export async function updateAnnouncement(formData: FormData) {
  await requireAdmin();

  const data = {
    message: (formData.get("message") as string ?? "").trim(),
    link:    (formData.get("link")    as string ?? "").trim(),
    active:  formData.get("active") === "on" || formData.get("active") === "true",
  };

  await prisma.announcement.upsert({
    where:  { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/");
  revalidatePath("/admin/announcement");
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
