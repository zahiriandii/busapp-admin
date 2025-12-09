import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue';
import TripsPage from '../pages/TripsPage.vue';
import CitiesPage from '../pages/CitiesPage.vue';
import BusesPage from '../pages/BusesPage.vue';
import BookingsPage from '../pages/BookingsPage.vue';
// Your pages will go here
const routes = [
  { path: '/', name: 'dashboard', component: DashboardPage },
  { path: '/trips', name: 'trips', component: TripsPage },
  { path: '/cities', name: 'cities', component: CitiesPage },
  { path: '/buses', name: 'buses', component: BusesPage },
  { path: '/bookings', name: 'bookings', component: BookingsPage },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router