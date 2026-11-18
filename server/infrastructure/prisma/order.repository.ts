import type { OrderRepository } from '../../core/application/ports'
import type {
  DailySales, NewOrder, Order, OrderSummary, PeriodSummary, TopProduct,
} from '../../core/domain/entities'
import type { Db } from './client'

export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly db: Db) {}

  create(data: NewOrder): Promise<Order> {
    return this.db.order.create({
      data: {
        code: data.code,
        total: data.total,
        paid: data.paid,
        change: data.change,
        items: { create: data.items },
      },
      include: { items: true },
    })
  }

  async findRecent(limit: number): Promise<OrderSummary[]> {
    const rows = await this.db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { _count: { select: { items: true } } },
    })
    return rows.map(({ _count, ...o }) => ({ ...o, itemCount: _count.items }))
  }

  async summary(from: Date): Promise<PeriodSummary> {
    const r = await this.db.order.aggregate({
      where: { createdAt: { gte: from } },
      _sum: { total: true },
      _count: true,
    })
    return { revenue: r._sum.total ?? 0, orders: r._count }
  }

  dailySales(from: Date): Promise<DailySales[]> {
    return this.db.$queryRaw<DailySales[]>`
      SELECT TO_CHAR(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS date,
             SUM(total)::float8 AS revenue,
             COUNT(*)::int AS orders
      FROM "Order"
      WHERE "createdAt" >= ${from}
      GROUP BY 1
      ORDER BY 1`
  }

  async topProducts(from: Date, take: number): Promise<TopProduct[]> {
    const rows = await this.db.orderItem.groupBy({
      by: ['productId', 'name'],
      where: { order: { createdAt: { gte: from } } },
      _sum: { qty: true, subtotal: true },
      orderBy: { _sum: { subtotal: 'desc' } },
      take,
    })
    return rows.map(r => ({
      productId: r.productId,
      name: r.name,
      qty: r._sum.qty ?? 0,
      revenue: r._sum.subtotal ?? 0,
    }))
  }
}