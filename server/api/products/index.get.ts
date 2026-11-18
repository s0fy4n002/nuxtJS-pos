import { useCases } from '~~/server/infrastructure/container'


export default defineEventHandler(() => handle(() => useCases.listProducts()))