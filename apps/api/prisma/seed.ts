// Seed: categories + 20 products. Idempotent (upsert by slug), so it is safe to re-run.
// Run with: pnpm db:seed
import { prisma } from '../src/lib/prisma.ts';

/** Prices are written in naira for readability and stored in kobo. */
const naira = (amount: number) => Math.round(amount * 100);

/** Placeholder images until real ones are uploaded to Cloudinary from the admin panel. */
const placeholder = (slug: string) => `https://picsum.photos/seed/${slug}/800/800`;

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Sports', slug: 'sports' },
] as const;

type CategorySlug = (typeof categories)[number]['slug'];

interface SeedProduct {
  name: string;
  slug: string;
  category: CategorySlug;
  price: number; // naira
  stock: number;
  description: string;
}

const products: SeedProduct[] = [
  {
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    category: 'electronics',
    price: 45000,
    stock: 40,
    description: 'Noise-cancelling earbuds with 30-hour battery life and wireless charging case.',
  },
  {
    name: 'Smart Watch Series 5',
    slug: 'smart-watch-series-5',
    category: 'electronics',
    price: 120000,
    stock: 15,
    description: 'Fitness tracking, heart-rate monitoring and notifications on your wrist.',
  },
  {
    name: '20,000mAh Power Bank',
    slug: 'power-bank-20000',
    category: 'electronics',
    price: 18500,
    stock: 60,
    description: 'Fast-charging power bank with USB-C PD and two USB-A ports.',
  },
  {
    name: 'Bluetooth Speaker Mini',
    slug: 'bluetooth-speaker-mini',
    category: 'electronics',
    price: 22000,
    stock: 35,
    description: 'Pocket-sized waterproof speaker with surprisingly big sound.',
  },
  {
    name: '4K Action Camera',
    slug: '4k-action-camera',
    category: 'electronics',
    price: 95000,
    stock: 8,
    description: 'Rugged 4K60 camera with stabilisation and waterproof housing.',
  },
  {
    name: 'Classic Ankara Shirt',
    slug: 'classic-ankara-shirt',
    category: 'fashion',
    price: 15000,
    stock: 25,
    description: 'Tailored short-sleeve shirt in vibrant Ankara print. 100% cotton.',
  },
  {
    name: 'Leather Sneakers',
    slug: 'leather-sneakers',
    category: 'fashion',
    price: 38000,
    stock: 20,
    description: 'Minimal white leather sneakers with cushioned insole.',
  },
  {
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    category: 'fashion',
    price: 27500,
    stock: 12,
    description: 'Mid-wash denim jacket with a relaxed fit.',
  },
  {
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    category: 'fashion',
    price: 6500,
    stock: 80,
    description: 'Heavy-duty canvas tote with inner zip pocket.',
  },
  {
    name: 'Non-stick Frying Pan 28cm',
    slug: 'non-stick-frying-pan-28',
    category: 'home-kitchen',
    price: 14000,
    stock: 30,
    description: 'PFOA-free non-stick pan, suitable for all hobs including induction.',
  },
  {
    name: 'Electric Kettle 1.7L',
    slug: 'electric-kettle-1-7l',
    category: 'home-kitchen',
    price: 16500,
    stock: 22,
    description: 'Stainless steel kettle with auto shut-off and boil-dry protection.',
  },
  {
    name: 'Blender 1.5L',
    slug: 'blender-1-5l',
    category: 'home-kitchen',
    price: 32000,
    stock: 14,
    description: 'Powerful 600W blender for smoothies, pepper and soups.',
  },
  {
    name: 'Cotton Bedsheet Set',
    slug: 'cotton-bedsheet-set',
    category: 'home-kitchen',
    price: 21000,
    stock: 18,
    description: 'Double-size bedsheet with two pillowcases. Soft breathable cotton.',
  },
  {
    name: 'Shea Butter Body Cream',
    slug: 'shea-butter-body-cream',
    category: 'beauty',
    price: 4500,
    stock: 100,
    description: 'Rich moisturising cream made with unrefined shea butter.',
  },
  {
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    category: 'beauty',
    price: 9800,
    stock: 45,
    description: 'Brightening face serum with 15% vitamin C.',
  },
  {
    name: 'Black Soap Bar (3-pack)',
    slug: 'black-soap-3-pack',
    category: 'beauty',
    price: 3500,
    stock: 120,
    description: 'Traditional African black soap, gentle on all skin types.',
  },
  {
    name: 'Yoga Mat 6mm',
    slug: 'yoga-mat-6mm',
    category: 'sports',
    price: 12000,
    stock: 28,
    description: 'Non-slip yoga mat with carry strap.',
  },
  {
    name: 'Adjustable Dumbbells 20kg',
    slug: 'adjustable-dumbbells-20kg',
    category: 'sports',
    price: 65000,
    stock: 6,
    description: 'Space-saving adjustable dumbbell pair with quick-change plates.',
  },
  {
    name: 'Football Size 5',
    slug: 'football-size-5',
    category: 'sports',
    price: 9000,
    stock: 40,
    description: 'Match-quality size 5 football with durable stitched panels.',
  },
  {
    name: 'Skipping Rope',
    slug: 'skipping-rope',
    category: 'sports',
    price: 3000,
    stock: 3, // deliberately low: handy for testing out-of-stock at checkout
    description: 'Speed rope with ball-bearing handles.',
  },
];

async function main() {
  const categoryIds = new Map<CategorySlug, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { name: c.name, slug: c.slug },
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const p of products) {
    const categoryId = categoryIds.get(p.category);
    if (!categoryId) throw new Error(`Unknown category ${p.category}`);

    const data = {
      name: p.name,
      description: p.description,
      price: naira(p.price),
      stock: p.stock,
      categoryId,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: {
        ...data,
        slug: p.slug,
        images: { create: [{ url: placeholder(p.slug), alt: p.name, position: 0 }] },
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
