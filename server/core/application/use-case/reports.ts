import { startOfDayWIB } from '../../domain/date'
import type { OrderRepository, ProductRepository } from '../ports'

export const getReport = (products: ProductRepository, orders: OrderRepository) =>
  async (daysInput: number) => {
    const days = Math.min(Math.max(daysInput || 7, 1), 90)
    const from = startOfDayWIB(days - 1)
    const today = startOfDayWIB(0)

    const [period, todayAgg, productCount, lowStock, daily, top] = await Promise.all([
      orders.summary(from),
      orders.summary(today),
      products.countAll(),
      products.countLowStock(10),
      orders.dailySales(from),
      orders.topProducts(from, 5),
    ])

    return {
      days,
      revenue: period.revenue,
      orders: period.orders,
      todayRevenue: todayAgg.revenue,
      todayOrders: todayAgg.orders,
      productCount,
      lowStock,
      daily,
      top,
    }
  }