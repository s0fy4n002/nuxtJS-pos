import type { H3Event } from 'h3'
import { AppError } from '../core/domain/errors'

const STATUS = { NOT_FOUND: 404, CONFLICT: 409, INVALID: 400 } as const

export async function handle<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    if (e instanceof AppError) {
      throw createError({ statusCode: STATUS[e.code], message: e.message })
    }
    throw e
  }
}

export function idParam(event: H3Event): number {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'ID tidak valid' })
  }
  return id
}