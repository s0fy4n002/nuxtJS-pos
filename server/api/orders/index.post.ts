import { z } from 'zod'
import { useCases } from '../../infrastructure/container'

const schema = z.object({
  items: z.array(z.object({
    productId: z.number().int(),
    qty: z.number().int().positive(),
  })).min(1),
  paid: z.number().int().nonnegative(),
})

export default defineEventHandler(async (event) => {
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Data tidak valid' })
  return handle(() => useCases.createOrder(parsed.data))
})