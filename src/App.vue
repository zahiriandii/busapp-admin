<template>
  <div class="p-6">
      <button
        v-if="!isAuthenticated && router.name !== 'logIn'"
        @click="() => router.push({ name: 'logIn' })"
        class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Login
      </button>
    <div class="flex justify-between items-center">

      <h1 class="text-2xl font-bold">Dashboard</h1>

      <!-- 🔥 Logout button only if:
           1. User is logged in
           2. Not on the login page -->
      <button
        v-if="isAuthenticated && router.name !== 'logIn'"
        @click="handleLogout"
        class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Logout
      </button>

    </div>
  </div>
  <div class="min-h-screen flex bg-slate-950 text-slate-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div class="px-4 py-4 border-b border-slate-800">
        <h1 class="text-lg font-semibold">Bus Admin</h1>
        <p class="text-xs text-slate-400">Management panel</p>
      </div>

      <nav class="flex-1 px-2 py-4 space-y-1">
        <RouterLink
          v-if="isAuthenticated"
          to="/"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
          exact
        >
          Dashboard
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/trips"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Trips
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/cities"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Cities
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/buses"
          class="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-800"
          active-class="bg-emerald-500 text-slate-950"
        >
          Buses
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
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
import { useRouter, RouterView, RouterLink } from 'vue-router';
import { logOut } from './services/useAuth';
import { isAuthenticated } from './services/useAuth';
const router = useRouter();
const currentYear = new Date().getFullYear();

const titles = {
  dashboard: 'Dashboard',
  trips: 'Trips',
  cities: 'Cities',
  buses: 'Buses',
  bookings: 'Bookings',
};

const handleLogout = () => {
  logOut();
  router.push({ name: 'login' })
}

const currentTitle = computed(() => titles[router.name] || 'Admin');
</script>

<style scoped>

</style>
