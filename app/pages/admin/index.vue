<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const days = ref(7)
const { data } = await useFetch('/api/admin/reports', { query: { days } })

const maxRevenue = computed(() => Math.max(1, ...(data.value?.daily.map(d => d.revenue) ?? [0])))
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
</script>

<template>
  <div v-if="data" class="space-y-6">
    <div class="flex items-center gap-2">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <div class="ml-auto flex gap-2">
        <Button
          v-for="d in [7, 30, 90]" :key="d"
          size="sm" :variant="days === d ? 'default' : 'outline'"
          @click="days = d"
        >{{ d }} hari</Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader><CardDescription>Pendapatan hari ini</CardDescription>
          <CardTitle>{{ rupiah(data.todayRevenue) }}</CardTitle></CardHeader>
        <CardContent class="text-sm text-muted-foreground">{{ data.todayOrders }} transaksi</CardContent>
      </Card>
      <Card>
        <CardHeader><CardDescription>Pendapatan {{ data.days }} hari</CardDescription>
          <CardTitle>{{ rupiah(data.revenue) }}</CardTitle></CardHeader>
        <CardContent class="text-sm text-muted-foreground">{{ data.orders }} transaksi</CardContent>
      </Card>
      <Card>
        <CardHeader><CardDescription>Total produk</CardDescription>
          <CardTitle>{{ data.productCount }}</CardTitle></CardHeader>
      </Card>
      <Card>
        <CardHeader><CardDescription>Stok menipis (≤ 10)</CardDescription>
          <CardTitle>{{ data.lowStock }}</CardTitle></CardHeader>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Penjualan harian</CardTitle></CardHeader>
        <CardContent class="space-y-2">
          <p v-if="!data.daily.length" class="text-sm text-muted-foreground">Belum ada data.</p>
          <div v-for="d in data.daily" :key="d.date" class="flex items-center gap-3 text-sm">
            <span class="w-14 shrink-0">{{ fmtDate(d.date) }}</span>
            <div class="h-4 flex-1 rounded bg-muted">
              <div class="h-4 rounded bg-primary" :style="{ width: `${(d.revenue / maxRevenue) * 100}%` }" />
            </div>
            <span class="w-28 shrink-0 text-right">{{ rupiah(d.revenue) }}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Produk terlaris</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead class="text-right">Terjual</TableHead>
                <TableHead class="text-right">Omzet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="t in data.top" :key="t.productId">
                <TableCell>{{ t.name }}</TableCell>
                <TableCell class="text-right">{{ t.qty }}</TableCell>
                <TableCell class="text-right">{{ rupiah(t.revenue) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>