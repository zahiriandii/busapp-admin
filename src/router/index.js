import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue';
import TripsPage from '../pages/TripsPage.vue';
import CitiesPage from '../pages/CitiesPage.vue';
import BusesPage from '../pages/BusesPage.vue';
import BookingsPage from '../pages/BookingsPage.vue';
import LogInPage from '../pages/LogInPage.vue';


const routes = [
  { path: '/', name: 'dashboard', component: DashboardPage },
  { path: '/trips', name: 'trips', component: TripsPage },
  { path: '/cities', name: 'cities', component: CitiesPage },
  { path: '/buses', name: 'buses', component: BusesPage },
  { path: '/bookings', name: 'bookings', component: BookingsPage },
  { path: '/login', name: 'logIn', component: LogInPage },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // trying to access protected route without token
    next({ name: 'logIn' })
  } else if (to.name === 'logIn' && isAuthenticated) {
    // already logged in → redirect away from login
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router