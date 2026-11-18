import type { FileStorage } from '../../core/application/ports'
import { LocalFileStorage } from './local.storage'
import { SupabaseFileStorage } from './supabase.storage'

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Env ${name} wajib diisi`)
  return v
}

export function createStorage(): { storage: FileStorage; local: LocalFileStorage | null } {
  const driver = process.env.STORAGE_DRIVER ?? 'local'

  if (driver === 'supabase') {
    return {
      storage: new SupabaseFileStorage(
        required('SUPABASE_URL'),
        required('SUPABASE_SERVICE_ROLE_KEY'),
        process.env.SUPABASE_BUCKET ?? 'product-images',
      ),
      local: null,
    }
  }

  if (driver === 'local') {
    const local = new LocalFileStorage(
      process.env.UPLOAD_DIR ?? './uploads',
      process.env.UPLOAD_PUBLIC_BASE ?? '/uploads',
    )
    return { storage: local, local }
  }

  throw new Error(`STORAGE_DRIVER tidak dikenal: ${driver} (pilih: supabase | local)`)
}