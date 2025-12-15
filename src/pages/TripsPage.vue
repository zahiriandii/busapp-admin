<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Trips</h1>
        <p class="text-sm text-slate-500">
          Manage all bus trips for your app.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        @click="toggleCreate"
      >
        <span class="mr-1 text-lg">＋</span>
        New trip
      </button>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Create trip form -->
    <div
      v-if="showCreate"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 class="mb-3 text-sm font-medium text-slate-800">Create new trip</h2>

      <form @submit.prevent="createTrip" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- From city -->
          <label class="flex flex-col text-sm text-slate-700">
            From (departure city)
            <select
              v-model.number="form.cityFromId"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            >
              <option value="" disabled>Select city</option>
              <option
                v-for="city in cities"
                :key="city.id"
                :value="city.id"
              >
                {{ city.name }} ({{ city.countryCode }})
              </option>
            </select>
          </label>

          <!-- To city -->
          <label class="flex flex-col text-sm text-slate-700">
            To (arrival city)
            <select
              v-model.number="form.cityToId"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            >
              <option value="" disabled>Select city</option>
              <option
                v-for="city in cities"
                :key="city.id"
                :value="city.id"
              >
                {{ city.name }} ({{ city.countryCode }})
              </option>
            </select>
          </label>

          <!-- Bus -->
          <label class="flex flex-col text-sm text-slate-700">
            Bus
            <select
              v-model.number="form.busId"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            >
              <option value="" disabled>Select bus</option>
              <option
                v-for="bus in buses"
                :key="bus.id"
                :value="bus.id"
              >
                {{ bus.busName }} ({{ bus.plateNumber }})
              </option>
            </select>
          </label>

          <!-- Departure datetime -->
          <label class="flex flex-col text-sm text-slate-700">
            Departure time
            <input
              v-model="form.departureTime"
              type="datetime-local"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            />
          </label>

          <!-- Arrival datetime -->
          <label class="flex flex-col text-sm text-slate-700">
            Arrival time
            <input
              v-model="form.arrivalTime"
              type="datetime-local"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            />
          </label>

          <!-- Price -->
          <label class="flex flex-col text-sm text-slate-700">
            Price
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="1"
              required
              class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
            />
          </label>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            :disabled="submitting"
          >
            <span v-if="!submitting">Save trip</span>
            <span v-else>Saving...</span>
          </button>

          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="cancelCreate"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Trips table -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"
      >
        <span class="text-sm font-medium text-slate-800">
          All trips
        </span>

        <input
          v-model="search"
          type="text"
          placeholder="Search by city..."
          class="w-48 rounded-lg border border-slate-300 px-3 py-1.5 text-sm shadow-sm
                 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-black"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm text-black">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-slate-600">ID</th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">
                From → To
              </th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">
                Departure
              </th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">
                Arrival
              </th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">
                Price
              </th>
              <th class="px-4 py-2 text-right font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-4 text-center text-slate-500">
                Loading trips...
              </td>
            </tr>

            <tr v-else-if="filteredTrips.length === 0">
              <td colspan="6" class="px-4 py-4 text-center text-slate-500">
                No trips found.
              </td>
            </tr>

            <tr
                v-for="trip in filteredTrips"
                :key="trip.tripId"
                class="hover:bg-slate-50 text-black"
              >
                <td class="px-4 py-3 text-slate-700 text-black">
                  {{ trip.tripId }}
                </td>

                <td class="px-4 py-3 text-slate-700 text-black">
                  {{ trip.cityFrom }} → {{ trip.cityTo }}
                </td>

                <td class="px-4 py-3 text-slate-700 text-black">
                  {{ formatDate(trip.departureTime) }}
                </td>

                <td class="px-4 py-3 text-slate-700 text-black">
                  {{ formatDate(trip.arrivalTime) }}
                </td>

                <td class="px-4 py-3 text-slate-700 text-black">
                  {{ trip.price }}
                </td>

                <td class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    @click="deleteTrip(trip.tripId)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const trips = ref([]);
const cities = ref([]);
const buses = ref([]);

const loading = ref(false);
const submitting = ref(false);
const error = ref("");
const showCreate = ref(false);
const search = ref("");


const form = ref({
  cityFromId: "",
  cityToId: "",
  busId: "",
  departureTime: "",
  arrivalTime: "",
  price: 0,
});

// search filter
const filteredTrips = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return trips.value
  return trips.value.filter((t) => {
    const text = `${t.cityFrom ?? ''} ${t.cityTo ?? ''}`.toLowerCase()
    return text.includes(q)
  })
})

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const resetForm = () => {
  form.value = {
    cityFromId: "",
    cityToId: "",
    busId: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
  };
};

const toggleCreate = () => {
  showCreate.value = !showCreate.value;
  if (!showCreate.value) resetForm();
};

const cancelCreate = () => {
  showCreate.value = false;
  resetForm();
};

// API calls
const loadTrips = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get("/api/admin/trips");
    trips.value = data;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load trips from server.";
  } finally {
    loading.value = false;
  }
};

const loadCities = async () => {
  try {
    const { data } = await api.get("/api/admin/cities");
    cities.value = data;
  } catch (e) {
    console.error(e);
  }
};

const loadBuses = async () => {
  try {
    const { data } = await api.get("/api/admin/buses");
    buses.value = data;
  } catch (e) {
    console.error(e);
  }
};

const createTrip = async () => {
  submitting.value = true;
  error.value = "";
  try {
    

    const payload = {
      cityFromId: form.value.cityFromId,
      cityToId: form.value.cityToId,
      busId: form.value.busId,
      // departureDate,
      departureTime: form.value.departureTime,
      arrivalTime: form.value.arrivalTime,
      price: form.value.price,
    };

    await api.post("/api/admin/trips", payload);
    await loadTrips();
    showCreate.value = false;
    resetForm();
  } catch (e) {
    console.error(e);
    error.value = "Failed to create trip.";
  } finally {
    submitting.value = false;
  }
};

const deleteTrip = async (id) => {
  if (!confirm('Delete this trip?')) return
  error.value = ''
  try {
    await api.delete(`/api/admin/trips/${id}`)
    trips.value = trips.value.filter((t) => t.tripId !== id)
  } catch (e) {
    console.error(e)
    error.value = 'Failed to delete trip.'
  }
}

onMounted(async () => {
  await Promise.all([loadTrips(), loadCities(), loadBuses()]);
});
</script>
