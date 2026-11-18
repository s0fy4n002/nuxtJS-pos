import { Prisma } from '@prisma/client'
import type { ProductRepository } from '../../core/application/ports'
import type { NewProduct, Product } from '../../core/domain/entities'
import { conflict, notFound } from '../../core/domain/errors'
import type { Db } from './client'

const include = { category: true } as const

function mapError(e: unknown): unknown {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') return conflict('SKU sudah dipakai')
    if (e.code === 'P2025') return notFound('Produk tidak ditemukan')
  }
  return e
}

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly db: Db) {}

  findAll(): Promise<Product[]> {
    return this.db.product.findMany({ include, orderBy: { name: 'asc' } })
  }

  findById(id: number): Promise<Product | null> {
    return this.db.product.findUnique({ where: { id }, include })
  }

  findByIds(ids: number[]): Promise<Product[]> {
    return this.db.product.findMany({ where: { id: { in: ids } }, include })
  }

  async create(data: NewProduct): Promise<Product> {
    try {
      return await this.db.product.create({ data, include })
    } catch (e) {
      throw mapError(e)
    }
  }

  async update(id: number, data: Partial<NewProduct>): Promise<Product> {
    try {
      return await this.db.product.update({ where: { id }, data, include })
    } catch (e) {
      throw mapError(e)
    }
  }

  async decrementStock(id: number, qty: number): Promise<boolean> {
    const r = await this.db.product.updateMany({
      where: { id, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    })
    return r.count === 1
  }

  countAll(): Promise<number> {
    return this.db.product.count()
  }

  countLowStock(threshold: number): Promise<number> {
    return this.db.product.count({ where: { stock: { lte: threshold } } })
  }
}