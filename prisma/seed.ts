import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const POKE = "https://images.pokemontcg.io";
const OP = "https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/one-piece";

const SAMPLE_CARDS = [
  // ── Pokémon ────────────────────────────────────────────────────────────────
  {
    name: "Charizard",
    imageUrl: `${POKE}/base1/4_hires.png`,
    game: "Pokémon",
    set: "Base Set",
    rarity: "Holo Rare",
    condition: "Near Mint",
    price: 450,
    stock: 1,
    featured: true,
  },
  {
    name: "Blastoise",
    imageUrl: `${POKE}/base1/2_hires.png`,
    game: "Pokémon",
    set: "Base Set",
    rarity: "Holo Rare",
    condition: "Near Mint",
    price: 180,
    stock: 1,
    featured: true,
  },
  {
    name: "Lugia",
    imageUrl: `${POKE}/neo1/9_hires.png`,
    game: "Pokémon",
    set: "Neo Genesis",
    rarity: "Holo Rare",
    condition: "Near Mint",
    price: 320,
    stock: 1,
    featured: true,
  },
  {
    name: "Pikachu VMAX",
    imageUrl: `${POKE}/swsh4/25_hires.png`,
    game: "Pokémon",
    set: "Vivid Voltage",
    rarity: "Ultra Rare",
    condition: "Mint",
    price: 85,
    stock: 2,
    featured: true,
  },
  {
    name: "Umbreon VMAX (Alt Art)",
    imageUrl: `${POKE}/swsh7/215_hires.png`,
    game: "Pokémon",
    set: "Evolving Skies",
    rarity: "Secret Rare",
    condition: "Near Mint",
    price: 680,
    stock: 1,
    featured: true,
  },
  {
    name: "Mew ex (Special Art Rare)",
    imageUrl: `${POKE}/sv3pt5/199_hires.png`,
    game: "Pokémon",
    set: "Scarlet & Violet 151",
    rarity: "Secret Rare",
    condition: "Mint",
    price: 95,
    stock: 3,
    featured: false,
  },
  {
    name: "Charizard ex",
    imageUrl: `${POKE}/sv3pt5/6_hires.png`,
    game: "Pokémon",
    set: "Scarlet & Violet 151",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 140,
    stock: 2,
    featured: false,
  },
  {
    name: "Regieleki VMAX (Alt Art)",
    imageUrl: `${POKE}/swsh12pt5/160_hires.png`,
    game: "Pokémon",
    set: "Crown Zenith",
    rarity: "Secret Rare",
    condition: "Near Mint",
    price: 55,
    stock: 0,
    featured: false,
  },
  {
    name: "Arceus VSTAR (Rainbow)",
    imageUrl: `${POKE}/swsh9/174_hires.png`,
    game: "Pokémon",
    set: "Brilliant Stars",
    rarity: "Secret Rare",
    condition: "Near Mint",
    price: 60,
    stock: 2,
    featured: false,
  },
  {
    name: "Pikachu",
    imageUrl: `${POKE}/base1/58_hires.png`,
    game: "Pokémon",
    set: "Base Set",
    rarity: "Common",
    condition: "Lightly Played",
    price: 25,
    stock: 5,
    featured: false,
  },
  // ── One Piece TCG ──────────────────────────────────────────────────────────
  {
    name: "Monkey D. Luffy (Alt Art)",
    imageUrl: `${OP}/OP01/OP01-121_EN.webp`,
    game: "One Piece TCG",
    set: "Romance Dawn",
    rarity: "Secret Rare",
    condition: "Mint",
    price: 280,
    stock: 0,
    featured: true,
  },
  {
    name: "Monkey D. Luffy",
    imageUrl: `${OP}/OP01/OP01-001_EN.webp`,
    game: "One Piece TCG",
    set: "Romance Dawn",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 85,
    stock: 2,
    featured: false,
  },
  {
    name: "Roronoa Zoro",
    imageUrl: `${OP}/OP01/OP01-002_EN.webp`,
    game: "One Piece TCG",
    set: "Romance Dawn",
    rarity: "Rare",
    condition: "Near Mint",
    price: 35,
    stock: 3,
    featured: false,
  },
  {
    name: "Portgas D. Ace",
    imageUrl: `${OP}/OP01/OP01-025_EN.webp`,
    game: "One Piece TCG",
    set: "Romance Dawn",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 50,
    stock: 2,
    featured: false,
  },
  {
    name: "Nami",
    imageUrl: `${OP}/OP01/OP01-060_EN.webp`,
    game: "One Piece TCG",
    set: "Romance Dawn",
    rarity: "Uncommon",
    condition: "Near Mint",
    price: 8,
    stock: 6,
    featured: false,
  },
  {
    name: "Trafalgar Law",
    imageUrl: `${OP}/OP02/OP02-013_EN.webp`,
    game: "One Piece TCG",
    set: "Paramount War",
    rarity: "Rare",
    condition: "Near Mint",
    price: 28,
    stock: 3,
    featured: false,
  },
  {
    name: "Whitebeard",
    imageUrl: `${OP}/OP02/OP02-098_EN.webp`,
    game: "One Piece TCG",
    set: "Paramount War",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 65,
    stock: 1,
    featured: false,
  },
  {
    name: "Boa Hancock",
    imageUrl: `${OP}/OP03/OP03-040_EN.webp`,
    game: "One Piece TCG",
    set: "Pillars of Strength",
    rarity: "Rare",
    condition: "Lightly Played",
    price: 18,
    stock: 4,
    featured: false,
  },
  {
    name: "Shanks",
    imageUrl: `${OP}/OP05/OP05-060_EN.webp`,
    game: "One Piece TCG",
    set: "Awakening of the New Era",
    rarity: "Ultra Rare",
    condition: "Mint",
    price: 110,
    stock: 1,
    featured: false,
  },
  {
    name: "Monkey D. Luffy (Starter)",
    imageUrl: `${OP}/ST01/ST01-001_EN.webp`,
    game: "One Piece TCG",
    set: "Straw Hat Crew Starter",
    rarity: "Promo",
    condition: "Near Mint",
    price: 12,
    stock: 8,
    featured: false,
  },
];

async function main() {
  // ── Admin user ────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { password: hash },
      create: { email, password: hash },
    });
    console.log(`Admin user seeded: ${email}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.");
  }

  // ── Sample cards ──────────────────────────────────────────────────────────
  const existing = await prisma.card.count();
  if (existing > 0) {
    console.log(`Cards already present (${existing}) — skipping sample card seed.`);
    return;
  }

  await prisma.card.createMany({ data: SAMPLE_CARDS });
  console.log(`Seeded ${SAMPLE_CARDS.length} sample cards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
