<script setup lang="ts">
import { LayoutDashboard, Package, Receipt, Store } from 'lucide-vue-next'

const route = useRoute()
const menu = [
  { title: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { title: 'Produk', to: '/admin/products', icon: Package },
  { title: 'Transaksi', to: '/admin/orders', icon: Receipt },
  { title: 'Kasir', to: '/', icon: Store },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="px-4 py-3 text-lg font-semibold">POS Admin</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="m in menu" :key="m.to">
                <SidebarMenuButton as-child :is-active="route.path === m.to">
                  <NuxtLink :to="m.to">
                    <component :is="m.icon" />
                    <span>{{ m.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>

    <SidebarInset>
      <header class="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-4" />
        <span class="text-sm text-muted-foreground">Panel Admin</span>
      </header>
      <main class="p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>