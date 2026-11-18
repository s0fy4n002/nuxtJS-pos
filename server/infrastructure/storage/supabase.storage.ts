import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { FileStorage } from '../../core/application/ports'

export class SupabaseFileStorage implements FileStorage {
  private readonly client: SupabaseClient

  constructor(url: string, serviceRoleKey: string, private readonly bucket: string) {
    this.client = createClient(url, serviceRoleKey, { auth: { persistSession: false } })
  }

  async save({ path, data, contentType }: { path: string; data: Uint8Array; contentType: string }) {
    const bucket = this.client.storage.from(this.bucket)
    const { error } = await bucket.upload(path, data, { contentType, upsert: false })
    if (error) throw new Error(`Upload ke Supabase gagal: ${error.message}`)
    return { url: bucket.getPublicUrl(path).data.publicUrl }
  }

  async remove(url: string) {
    const marker = `/storage/v1/object/public/${this.bucket}/`
    const i = url.indexOf(marker)
    if (i === -1) return
    const key = decodeURIComponent(url.slice(i + marker.length))
    await this.client.storage.from(this.bucket).remove([key])
  }
}