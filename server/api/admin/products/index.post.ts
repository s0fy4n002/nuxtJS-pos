import { z } from 'zod'
import { useCases } from '../../../infrastructure/container'

const schema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Data tidak valid' })
  return handle(() => useCases.createProduct(parsed.data))
})