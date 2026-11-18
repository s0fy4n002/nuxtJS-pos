import { createReadStream } from 'node:fs'
import { mkdir, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve, sep } from 'node:path'
import type { FileStorage } from '../../core/application/ports'
import { invalid } from '../../core/domain/errors'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

export class LocalFileStorage implements FileStorage {
  private readonly root: string

  constructor(rootDir: string, private readonly publicBase: string) {
    this.root = resolve(rootDir)
  }

  /** Cegah path traversal (../) keluar dari folder upload */
  private resolveKey(key: string): string | null {
    const full = resolve(this.root, key)
    return full.startsWith(this.root + sep) ? full : null
  }

  private keyFromUrl(url: string): string | null {
    const prefix = `${this.publicBase}/`
    return url.startsWith(prefix) ? url.slice(prefix.length) : null
  }

  async save({ path, data }: { path: string; data: Uint8Array; contentType: string }) {
    const full = this.resolveKey(path)
    if (!full) throw invalid('Path file tidak valid')
    await mkdir(dirname(full), { recursive: true })
    await writeFile(full, data)
    return { url: `${this.publicBase}/${path}` }
  }

  async remove(url: string) {
    const key = this.keyFromUrl(url)
    const full = key ? this.resolveKey(key) : null
    if (full) await rm(full, { force: true })
  }

  /** Dipakai route /uploads/** (fallback jika tidak lewat Nginx) */
  async open(key: string) {
    const full = this.resolveKey(key)
    if (!full) return null
    try {
      if (!(await stat(full)).isFile()) return null
    } catch {
      return null
    }
    return {
      stream: createReadStream(full),
      contentType: MIME[extname(full).toLowerCase()] ?? 'application/octet-stream',
    }
  }
}