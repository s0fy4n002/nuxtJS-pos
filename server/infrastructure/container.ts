
import { prisma } from './prisma/client'
import { PrismaOrderRepository } from './prisma/order.repository'
import { PrismaProductRepository } from './prisma/product.repository'
import { PrismaUnitOfWork } from './prisma/unit-of-work'
import { createStorage } from './storage/factory'
import { createOrder, listOrders } from '../core/application/use-case/orders'
import { createProduct, getProduct, listProducts, updateProduct } from '../core/application/use-case/products'
import { uploadProductImage } from '../core/application/use-case/upload-product-image'
import { getReport } from '../core/application/use-case/reports'

const products = new PrismaProductRepository(prisma)
const orders = new PrismaOrderRepository(prisma)
const uow = new PrismaUnitOfWork(prisma)
const { storage, local } = createStorage()

/** Non-null hanya jika STORAGE_DRIVER=local */
export const localFiles = local

export const useCases = {
  listProducts: listProducts(products),
  getProduct: getProduct(products),
  createProduct: createProduct(products),
  updateProduct: updateProduct(products),
  uploadProductImage: uploadProductImage(products, storage),
  createOrder: createOrder(uow),
  listOrders: listOrders(orders),
  getReport: getReport(products, orders),
}