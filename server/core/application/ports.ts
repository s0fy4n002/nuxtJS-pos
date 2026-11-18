import type {
  DailySales, NewOrder, NewProduct, Order, OrderSummary,
  PeriodSummary, Product, TopProduct,
} from '../domain/entities'

export interface ProductRepository {
  findAll(): Promise<Product[]>
  findById(id: number): Promise<Product | null>
  findByIds(ids: number[]): Promise<Product[]>
  create(data: NewProduct): Promise<Product>
  update(id: number, data: Partial<NewProduct>): Promise<Product>
  /** false jika stok tidak cukup (tidak ada yang berubah) */
  decrementStock(id: number, qty: number): Promise<boolean>
  countAll(): Promise<number>
  countLowStock(threshold: number): Promise<number>
}

export interface OrderRepository {
  create(data: NewOrder): Promise<Order>
  findRecent(limit: number): Promise<OrderSummary[]>
  summary(from: Date): Promise<PeriodSummary>
  dailySales(from: Date): Promise<DailySales[]>
  topProducts(from: Date, take: number): Promise<TopProduct[]>
}

export interface Repositories {
  products: ProductRepository
  orders: OrderRepository
}

export interface UnitOfWork {
  run<T>(fn: (repos: Repositories) => Promise<T>): Promise<T>
}

export interface FileStorage {
  /** Simpan file, kembalikan URL publik yang disimpan di database */
  save(input: { path: string; data: Uint8Array; contentType: string }): Promise<{ url: string }>
  /** Hapus file berdasarkan URL yang pernah dikembalikan save() */
  remove(url: string): Promise<void>
}