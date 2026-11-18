export interface CartItem {
  id: number
  name: string
  price: number
  stock: number
  qty: number
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart', () => [])

  const add = (p: Omit<CartItem, 'qty'>, qty = 1) => {
    const found = items.value.find(i => i.id === p.id)
    if (found) found.qty = Math.min(found.qty + qty, p.stock)
    else if (p.stock > 0) items.value.push({ ...p, qty: Math.min(qty, p.stock) })
  }

  const setQty = (id: number, qty: number) => {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    item.qty = Math.max(1, Math.min(qty, item.stock))
  }

  const remove = (id: number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const clear = () => { items.value = [] }

  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))

  return { items, add, setQty, remove, clear, total, count }
}