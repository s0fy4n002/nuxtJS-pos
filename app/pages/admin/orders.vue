<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: orders } = await useFetch('/api/admin/orders', { default: () => [] })
const fmt = (s: string) => new Date(s).toLocaleString('id-ID')
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Riwayat Transaksi</h1>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kode</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead class="text-right">Item</TableHead>
          <TableHead class="text-right">Total</TableHead>
          <TableHead class="text-right">Bayar</TableHead>
          <TableHead class="text-right">Kembali</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="o in orders" :key="o.id">
          <TableCell>{{ o.code }}</TableCell>
          <TableCell>{{ fmt(o.createdAt) }}</TableCell>
          <TableCell class="text-right">{{ o._count.items }}</TableCell>
          <TableCell class="text-right">{{ rupiah(o.total) }}</TableCell>
          <TableCell class="text-right">{{ rupiah(o.paid) }}</TableCell>
          <TableCell class="text-right">{{ rupiah(o.change) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>