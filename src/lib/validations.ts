import { z } from "zod";

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  game: z.string().min(1, "Game is required").max(100),
  set: z.string().min(1, "Set is required").max(200),
  rarity: z.string().min(1, "Rarity is required"),
  condition: z.string().min(1, "Condition is required"),
  price: z.coerce.number().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0).default(1),
  featured: z.coerce.boolean().default(false),

  // Identity fields
  cardNumber: z.string().max(50).optional().transform(v => v === "" ? undefined : v),
  finish: z.string().default("Normal"),
  language: z.string().default("English"),

  // Flags
  firstEdition: z.coerce.boolean().default(false),
  graded: z.coerce.boolean().default(false),

  // Graded block (only meaningful when graded=true)
  gradingCompany: z.string().max(50).optional().transform(v => v === "" ? undefined : v),
  grade: z.string().max(10).optional().transform(v => v === "" ? undefined : v),
  certNumber: z.string().max(100).optional().transform(v => v === "" ? undefined : v),

  // Commerce
  sku: z.string().max(100).optional().transform(v => v === "" ? undefined : v),
  status: z.enum(["available", "reserved", "sold"]).default("available"),

  // Descriptive
  artist: z.string().max(200).optional().transform(v => v === "" ? undefined : v),
  releaseYear: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.coerce.number().int().min(1990).max(2100).optional()
  ),
  details: z.string().max(2000).optional().transform(v => v === "" ? undefined : v),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  startDate: z.coerce.date(),
  endDate: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.coerce.date().optional()
  ),
  city: z.string().min(1, "City is required").max(200),
  venue: z.string().max(200).optional().transform(v => v === "" ? undefined : v),
  booth: z.string().max(100).optional().transform(v => v === "" ? undefined : v),
  description: z.string().max(2000).optional().transform(v => v === "" ? undefined : v),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional().transform(v => v === "" ? undefined : v),
});

export type CardFormData = z.infer<typeof cardSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
