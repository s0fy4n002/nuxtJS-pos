export type ErrorCode = 'NOT_FOUND' | 'CONFLICT' | 'INVALID'

export class AppError extends Error {
  constructor(public readonly code: ErrorCode, message: string) {
    super(message)
  }
}

export const notFound = (m: string) => new AppError('NOT_FOUND', m)
export const conflict = (m: string) => new AppError('CONFLICT', m)
export const invalid = (m: string) => new AppError('INVALID', m)