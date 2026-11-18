import type { NewOrderLine, Product } from './entities'
import { conflict, invalid, notFound } from './errors'

export interface OrderRequestItem {
  productId: number
  qty: number
}

export function mergeItems(items: OrderRequestItem[]): OrderRequestItem[] {
  const map = new Map<number, number>()
  for (const i of items) map.set(i.productId, (map.get(i.productId) ?? 0) + i.qty)
  return [...map].map(([productId, qty]) => ({ productId, qty }))
}

export function buildLines(items: OrderRequestItem[], products: Product[]) {
  let total = 0
  const lines: NewOrderLine[] = items.map(({ productId, qty }) => {
    const p = products.find(x => x.id === productId)
    if (!p) throw notFound(`Produk #${productId} tidak ada`)
    if (p.stock < qty) throw conflict(`Stok ${p.name} tidak cukup (sisa ${p.stock})`)
    const subtotal = p.price * qty
    total += subtotal
    return { productId, name: p.name, price: p.price, qty, subtotal }
  })
  return { lines, total }
}

export function calculateChange(total: number, paid: number): number {
  if (paid < total) throw invalid('Uang bayar kurang')
  return paid - total
}

export const newOrderCode = () =>
  `INV-${Date.now()}-${globalThis.crypto.randomUUID().slice(0, 4).toUpperCase()}`