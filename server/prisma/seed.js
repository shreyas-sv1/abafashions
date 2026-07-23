require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Products across categories (Sarees, Dresses, Lehengas, Kurtis & Suits)
const initialProducts = [
  {
    name: 'Royal Kanjivaram Silk Saree',
    category: 'Sarees',
    price: 4500,
    originalPrice: 6000, // 25% off
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Banarasi Zari Silk Saree',
    category: 'Sarees',
    price: 3200,
    originalPrice: 4200, // ~24% off
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Floral Georgette Anarkali Dress',
    category: 'Dresses',
    price: 2250,
    originalPrice: 3000, // 25% off
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Embroidered Velvet Gown Dress',
    category: 'Dresses',
    price: 3500,
    originalPrice: 5000, // 30% off
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Designer Velvet Lehenga Choli',
    category: 'Lehengas',
    price: 6800,
    originalPrice: 8500, // 20% off
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Bridal Raw Silk Lehenga',
    category: 'Lehengas',
    price: 8900,
    originalPrice: 12000, // ~26% off
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Chikankari Cotton Kurti Set',
    category: 'Kurtis & Suits',
    price: 1350,
    originalPrice: 1800, // 25% off
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    name: 'Silk Straight Suit with Dupatta',
    category: 'Kurtis & Suits',
    price: 2400,
    originalPrice: 3200, // 25% off
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
];

async function main() {
  console.log('🌱 Seeding ABAfashions database...\n');

  // Seed admin
  const passwordHash = await bcrypt.hash('ababfashions123', 12);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { passwordHash },
    create: { username: 'admin', passwordHash },
  });
  console.log(`✅ Admin seeded: ${admin.username}`);

  // Seed products
  for (const item of initialProducts) {
    const product = await prisma.product.upsert({
      where: { id: initialProducts.indexOf(item) + 1 },
      update: item,
      create: item,
    });
    console.log(`  ✅ [${product.category}] ${product.name} — ₹${product.price} (MRP: ₹${product.originalPrice})`);
  }

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
