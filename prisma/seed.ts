import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const makanan = await prisma.category.upsert({
    where: { name: 'Makanan' }, update: {}, create: { name: 'Makanan' },
  })
  const minuman = await prisma.category.upsert({
    where: { name: 'Minuman' }, update: {}, create: { name: 'Minuman' },
  })

  const data = [
    { sku: 'MKN-001', name: 'Nasi Goreng', price: 18000, stock: 50, categoryId: makanan.id, description: 'Nasi goreng spesial dengan telur.' },
    { sku: 'MKN-002', name: 'Mie Ayam', price: 15000, stock: 40, categoryId: makanan.id, description: 'Mie ayam dengan pangsit.' },
    { sku: 'MNM-001', name: 'Es Teh Manis', price: 5000, stock: 100, categoryId: minuman.id, description: 'Teh manis dingin.' },
    { sku: 'MNM-002', name: 'Kopi Susu', price: 12000, stock: 80, categoryId: minuman.id, description: 'Kopi susu gula aren.' },
  ]

  for (const p of data) {
    await prisma.product.upsert({ where: { sku: p.sku }, update: {}, create: p })
  }
}

main().finally(() => prisma.$disconnect())