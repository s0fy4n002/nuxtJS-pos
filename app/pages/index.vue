<script setup lang="ts">
import { toast } from 'vue-sonner'
import { rupiah } from '@/utils/format';

const { data: products, refresh } = await useFetch('/api/products', { default: () => [] })
const { items, add, setQty, remove, clear, total, count } = useCart()

const q = ref('')
const filtered = computed(() =>
  products.value.filter(p => p.name.toLowerCase().includes(q.value.toLowerCase())),
)

const open = ref(false)
const paid = ref<number | string>(0)
const loading = ref(false)
const change = computed(() => Number(paid.value) - total.value)

async function checkout() {
  loading.value = true
  try {
    const order = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items: items.value.map(i => ({ productId: i.id, qty: i.qty })),
        paid: Number(paid.value),
      },
    })
    toast.success(`Transaksi ${order.code} berhasil`)
    clear()
    open.value = false
    paid.value = 0
    await refresh()
  } catch (e) {
    const err = e as { data?: { message?: string } }
    toast.error(err.data?.message ?? 'Transaksi gagal')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_380px]">
    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold">Kasir</h1>
        <NuxtLink to="/admin" class="ml-auto text-sm underline">Admin</NuxtLink>
      </div>
      <Input v-model="q" placeholder="Cari produk..." />

      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card v-for="p in filtered" :key="p.id">
          <CardHeader>
            <CardTitle class="text-base">
              <NuxtLink :to="`/products/${p.id}`" class="hover:underline">{{ p.name }}</NuxtLink>
            </CardTitle>
            <CardDescription>{{ p.category?.name }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <p class="font-semibold">{{ rupiah(p.price) }}</p>
            <Badge :variant="p.stock > 10 ? 'secondary' : 'destructive'">Stok {{ p.stock }}</Badge>
          </CardContent>
          <CardFooter>
            <Button class="w-full" :disabled="p.stock === 0" @click="add(p)">Tambah</Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <aside>
      <Card class="sticky top-4">
        <CardHeader>
          <CardTitle>Keranjang ({{ count }})</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <p v-if="!items.length" class="text-sm text-muted-foreground">Keranjang kosong.</p>
          <div v-for="i in items" :key="i.id" class="flex items-center gap-2">
            <div class="flex-1">
              <p class="text-sm font-medium">{{ i.name }}</p>
              <p class="text-xs text-muted-foreground">{{ rupiah(i.price) }}</p>
            </div>
            <Input
              type="number"
              class="w-16"
              :model-value="i.qty"
              @update:model-value="setQty(i.id, Number($event))"
            />
            <Button size="sm" variant="ghost" @click="remove(i.id)">✕</Button>
          </div>
          <Separator />
          <div class="flex justify-between font-semibold">
            <span>Total</span><span>{{ rupiah(total) }}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" :disabled="!items.length" @click="open = true">Bayar</Button>
        </CardFooter>
      </Card>
    </aside>

    <Dialog v-model:open="open">
      <DialogContent>
        <DialogHeader><DialogTitle>Pembayaran</DialogTitle></DialogHeader>
        <div class="space-y-3">
          <p>Total: <b>{{ rupiah(total) }}</b></p>
          <div class="space-y-1">
            <Label for="paid">Uang diterima</Label>
            <Input id="paid" v-model="paid" type="number" />
          </div>
          <p>Kembalian: <b>{{ rupiah(Math.max(change, 0)) }}</b></p>
        </div>
        <DialogFooter>
          <Button :disabled="loading || change < 0" @click="checkout">
            {{ loading ? 'Memproses...' : 'Selesaikan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>