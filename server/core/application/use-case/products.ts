import type { NewProduct } from '../../domain/entities'
import { notFound } from '../../domain/errors'
import type { ProductRepository } from '../ports'

export const listProducts = (repo: ProductRepository) => () => repo.findAll()

export const getProduct = (repo: ProductRepository) => async (id: number) => {
  const product = await repo.findById(id)
  if (!product) throw notFound('Produk tidak ditemukan')
  return product
}

export const createProduct = (repo: ProductRepository) => (data: NewProduct) =>
  repo.create(data)

export const updateProduct = (repo: ProductRepository) =>
  (id: number, data: Partial<NewProduct>) => repo.update(id, data)