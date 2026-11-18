import { conflict } from '../../domain/errors'
import {
  buildLines, calculateChange, mergeItems, newOrderCode,
  type OrderRequestItem,
} from '../../domain/order'
import type { OrderRepository, UnitOfWork } from '../ports'

export const createOrder = (uow: UnitOfWork) =>
  (input: { items: OrderRequestItem[]; paid: number }) =>
    uow.run(async ({ products, orders }) => {
      const items = mergeItems(input.items)
      const found = await products.findByIds(items.map(i => i.productId))

      const { lines, total } = buildLines(items, found)
      const change = calculateChange(total, input.paid)

      for (const l of lines) {
        const ok = await products.decrementStock(l.productId, l.qty)
        if (!ok) throw conflict(`Stok ${l.name} tidak cukup`)
      }

      return orders.create({
        code: newOrderCode(),
        total,
        paid: input.paid,
        change,
        items: lines,
      })
    })

export const listOrders = (repo: OrderRepository) => () => repo.findRecent(100)