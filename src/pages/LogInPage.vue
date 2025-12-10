<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
      <h1 class="mb-1 text-xl font-semibold text-slate-900">Admin login</h1>
      <p class="mb-4 text-sm text-slate-500">
        Sign in to access the admin dashboard.
      </p>

      <div
        v-if="error"
        class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-slate-700">
            Email / username
          </label>
          <input
            v-model="form.email"
            type="text"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          class="mt-2 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="!loading">Sign in</span>
          <span v-else>Signing in...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api' // same path you use in TripsPage
import { logIn } from '../services/useAuth'
import axios from 'axios'
const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    // adjust body keys if your backend expects different names
   const { data } = await axios.post(
    "http://localhost:8080/auth/logIn",
    {
        email: form.value.email,
        password: form.value.password
    }
    );

    // Try to detect token field (adjust if needed)
    const token =
      data.token || data.jwt || data.accessToken || data.authToken

    if (!token) {
      throw new Error('No token found in response. Check login endpoint.')
    }

    logIn(token);
    router.push({ name: 'dashboard' })
  } catch (e) {
    console.error(e)
    error.value = 'Invalid credentials or server error.'
  } finally {
    loading.value = false
  }
}
</script>
