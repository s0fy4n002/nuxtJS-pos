import { detectImageType } from '@server/core/domain/file'
import { invalid, notFound } from '../../domain/errors'
import type { FileStorage, ProductRepository } from '../ports'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB (aman untuk limit body Vercel 4.5MB)

export const uploadProductImage = (products: ProductRepository, storage: FileStorage) =>
  async (productId: number, file: { data: Uint8Array }) => {
    if (file.data.byteLength === 0) throw invalid('File kosong')
    if (file.data.byteLength > MAX_SIZE) throw invalid('Ukuran maksimal 2MB')

    const type = detectImageType(file.data)
    if (!type) throw invalid('Format harus JPG, PNG, atau WebP')

    const product = await products.findById(productId)
    if (!product) throw notFound('Produk tidak ditemukan')

    const { url } = await storage.save({
      path: `products/${productId}-${globalThis.crypto.randomUUID()}.${type.ext}`,
      data: file.data,
      contentType: type.mime,
    })

    let updated
    try {
      updated = await products.update(productId, { image: url })
    } catch (e) {
      await storage.remove(url).catch(() => {})
      throw e
    }

    if (product.image) await storage.remove(product.image).catch(() => {})
    return updated
  }