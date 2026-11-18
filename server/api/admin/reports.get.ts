import { useCases } from '../../infrastructure/container'

export default defineEventHandler((event) => {
  const days = Number(getQuery(event).days)
  return handle(() => useCases.getReport(days))
})