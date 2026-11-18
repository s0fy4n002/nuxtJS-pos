import { createOrder, listOrders } from '../core/application/use-case/orders'
import {
  createProduct, getProduct, listProducts, updateProduct,
} from '../core/application/use-case/products'
import { getReport } from '../core/application/use-case/reports'

import { prisma } from './prisma/client'
import { PrismaOrderRepository } from './prisma/order.repository'
import { PrismaProductRepository } from './prisma/product.repository'
import { PrismaUnitOfWork } from './prisma/unit-of-work'

const products = new PrismaProductRepository(prisma)
const orders = new PrismaOrderRepository(prisma)
const uow = new PrismaUnitOfWork(prisma)

export const useCases = {
  listProducts: listProducts(products),
  getProduct: getProduct(products),
  createProduct: createProduct(products),
  updateProduct: updateProduct(products),
  createOrder: createOrder(uow),
  listOrders: listOrders(orders),
  getReport: getReport(products, orders),
}