<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin' })

const { data: products, refresh } = await useFetch('/api/admin/../products', { default: () => [] })

interface Form {
  id?: number
  name: string
  sku: string
  description: string
  price: number | string
  stock: number | string
}
const empty = (): Form => ({ name: '', sku: '', description: '', price: 0, stock: 0 })

const open = ref(false)
const form = ref<Form>(empty())

function openForm(p?: (typeof products.value)[number]) {
  form.value = p
    ? { id: p.id, name: p.name, sku: p.sku, description: p.description ?? '', price: p.price, stock: p.stock }
    : empty()
  open.value = true
}

async function save() {
  const { id, ...rest } = form.value
  const body = { ...rest, price: Number(rest.price), stock: Number(rest.stock) }
  try {
    if (id) await $fetch(`/api/admin/products/${id}`, { method: 'PATCH', body })
    else await $fetch('/api/admin/products', { method: 'POST', body })
    toast.success('Produk disimpan')
    open.value = false
    await refresh()
  } catch (e) {
    const err = e as { data?: { message?: string } }
    toast.error(err.data?.message ?? 'Gagal menyimpan')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h1 class="text-2xl font-bold">Produk</h1>
      <Button class="ml-auto" @click="openForm()">Tambah produk</Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead class="text-right">Harga</TableHead>
          <TableHead class="text-right">Stok</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="p in products" :key="p.id">
          <TableCell>{{ p.sku }}</TableCell>
          <TableCell>{{ p.name }}</TableCell>
          <TableCell>{{ p.category?.name ?? '-' }}</TableCell>
          <TableCell class="text-right">{{ rupiah(p.price) }}</TableCell>
          <TableCell class="text-right">
            <Badge :variant="p.stock > 10 ? 'secondary' : 'destructive'">{{ p.stock }}</Badge>
          </TableCell>
          <TableCell class="text-right">
            <Button size="sm" variant="outline" @click="openForm(p)">Edit</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Dialog v-model:open="open">
      <DialogContent>
        <DialogHeader><DialogTitle>{{ form.id ? 'Edit' : 'Tambah' }} produk</DialogTitle></DialogHeader>
        <div class="grid gap-3">
          <div class="space-y-1"><Label>Nama</Label><Input v-model="form.name" /></div>
          <div class="space-y-1"><Label>SKU</Label><Input v-model="form.sku" /></div>
          <div class="space-y-1"><Label>Deskripsi</Label><Input v-model="form.description" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1"><Label>Harga</Label><Input v-model="form.price" type="number" /></div>
            <div class="space-y-1"><Label>Stok</Label><Input v-model="form.stock" type="number" /></div>
          </div>
        </div>
        <DialogFooter><Button @click="save">Simpan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>