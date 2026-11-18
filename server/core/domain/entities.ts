export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  sku: string
  description: string | null
  price: number
  stock: number
  image: string | null
  categoryId: number | null
  category: Category | null
}

export interface NewProduct {
  name: string
  sku: string
  description?: string | null
  price: number
  stock: number
  categoryId?: number | null
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  name: string
  price: number
  qty: number
  subtotal: number
}

export interface Order {
  id: number
  code: string
  total: number
  paid: number
  change: number
  paymentMethod: string
  createdAt: Date
  items: OrderItem[]
}

export type OrderSummary = Omit<Order, 'items'> & { itemCount: number }

export interface NewOrderLine {
  productId: number
  name: string
  price: number
  qty: number
  subtotal: number
}

export interface NewOrder {
  code: string
  total: number
  paid: number
  change: number
  items: NewOrderLine[]
}

export interface PeriodSummary {
  revenue: number
  orders: number
}

export interface DailySales {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  productId: number
  name: string
  qty: number
  revenue: number
}

export interface NewProduct {
  name: string
  sku: string
  description?: string | null
  price: number
  stock: number
  categoryId?: number | null
  image?: string | null
}