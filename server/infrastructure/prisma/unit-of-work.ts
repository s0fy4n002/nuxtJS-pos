import type { PrismaClient } from '@prisma/client'
import type { Repositories, UnitOfWork } from '../../core/application/ports'
import { PrismaOrderRepository } from './order.repository'
import { PrismaProductRepository } from './product.repository'

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  run<T>(fn: (repos: Repositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(tx =>
      fn({
        products: new PrismaProductRepository(tx),
        orders: new PrismaOrderRepository(tx),
      }),
    )
  }
}