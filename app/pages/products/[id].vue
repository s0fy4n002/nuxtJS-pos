<script setup lang="ts">
import { toast } from 'vue-sonner'

const route = useRoute()
const { data: product, error } = await useFetch(`/api/products/${route.params.id}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan', fatal: true })

const { add } = useCart()
const qty = ref<number | string>(1)

function addToCart() {
  if (!product.value) return
  add(
    { id: product.value.id, name: product.value.name, price: product.value.price, stock: product.value.stock },
    Math.max(1, Number(qty.value)),
  )
  toast.success('Ditambahkan ke keranjang')
}
</script>

<template>
  <div v-if="product" class="mx-auto max-w-2xl p-4">
    <NuxtLink to="/" class="text-sm underline">← Kembali</NuxtLink>
    <Card class="mt-4">
      <CardHeader>
        <CardTitle class="text-2xl">{{ product.name }}</CardTitle>
        <CardDescription>SKU {{ product.sku }} · {{ product.category?.name ?? 'Tanpa kategori' }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-3xl font-bold">{{ rupiah(product.price) }}</p>
        <Badge :variant="product.stock > 10 ? 'secondary' : 'destructive'">Stok {{ product.stock }}</Badge>
        <p class="text-muted-foreground">{{ product.description ?? 'Tidak ada deskripsi.' }}</p>
      </CardContent>
      <CardFooter class="gap-3">
        <Input v-model="qty" type="number" min="1" class="w-24" />
        <Button :disabled="product.stock === 0" @click="addToCart">Tambah ke keranjang</Button>
      </CardFooter>
    </Card>
  </div>
</template>