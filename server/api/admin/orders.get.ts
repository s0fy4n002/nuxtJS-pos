import { useCases } from '../../infrastructure/container'

export default defineEventHandler(() => handle(() => useCases.listOrders()))