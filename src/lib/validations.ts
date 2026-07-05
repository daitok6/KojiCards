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
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type CardFormData = z.infer<typeof cardSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
