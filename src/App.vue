<template>
  <div class="min-h-screen flex bg-slate-950 text-slate-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div class="px-4 py-4 border-b border-slate-800">
        <h1 class="text-lg font-semibold">Bus Admin</h1>
        <p class="text-xs text-slate-400">Management panel</p>
      </div>

      <nav class="flex-1 px-2 py-4 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
          exact
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/trips"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Trips
        </RouterLink>

        <RouterLink
          to="/cities"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Cities
        </RouterLink>

        <RouterLink
          to="/buses"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Buses
        </RouterLink>

        <RouterLink
          to="/bookings"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Bookings
        </RouterLink>
      </nav>

      <div class="px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
        © {{ currentYear }} Bus App
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 flex flex-col">
      <header class="h-14 border-b border-slate-800 flex items-center px-6">
        <h2 class="text-base font-semibold">{{ currentTitle }}</h2>
      </header>

      <section class="flex-1 p-6 overflow-auto">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, RouterView, RouterLink } from 'vue-router';

const route = useRoute();
const currentYear = new Date().getFullYear();

const titles = {
  dashboard: 'Dashboard',
  trips: 'Trips',
  cities: 'Cities',
  buses: 'Buses',
  bookings: 'Bookings',
};

const currentTitle = computed(() => titles[route.name] || 'Admin');
</script>

<style scoped>

</style>
