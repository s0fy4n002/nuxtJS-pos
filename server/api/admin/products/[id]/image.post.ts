import { useCases } from '@server/infrastructure/container'

export default defineEventHandler(async (event) => {
  const id = idParam(event)
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  if (!file?.data) throw createError({ statusCode: 400, message: 'File tidak ditemukan' })
  return handle(() => useCases.uploadProductImage(id, { data: file.data }))
})