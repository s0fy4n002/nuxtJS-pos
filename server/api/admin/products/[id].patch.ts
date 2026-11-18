import { z } from 'zod'
import { useCases } from '../../../infrastructure/container'

const schema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.number().int().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const id = idParam(event)
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Data tidak valid' })
  return handle(() => useCases.updateProduct(id, parsed.data))
})