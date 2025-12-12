<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Cities</h1>

    <!-- Form -->
    <div class="bg-white rounded-xl shadow p-4 mb-6 max-w-md">
      <h2 class="text-lg font-semibold mb-3 text-black">
        {{ editingCity ? "Edit City" : "Create City" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1 text-black">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2 text-sm text-black"
            placeholder="Skopje"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-black">Country Code</label>
          <input
            v-model="form.countryCode"
            type="text"
            class="w-full border rounded-lg px-3 py-2 text-sm uppercase text-black"
            placeholder="MKD"
            required
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="bg-lime-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-lime-700"
          >
            {{ editingCity ? "Save changes" : "Create city" }}
          </button>
          <button
            v-if="editingCity"
            type="button"
            @click="resetForm"
            class="border border-gray-300 px-4 py-2 rounded-lg text-sm text-black"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-black">
          <tr>
            <th class="px-4 py-2 text-left font-medium">ID</th>
            <th class="px-4 py-2 text-left font-medium">Name</th>
            <th class="px-4 py-2 text-left font-medium">Country Code</th>
            <th class="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="city in cities"
            :key="city.id"
            class="border-t hover:bg-gray-50 text-black"
          >
            <td class="px-4 py-2">{{ city.id }}</td>
            <td class="px-4 py-2">{{ city.name }}</td>
            <td class="px-4 py-2">{{ city.countryCode }}</td>
            <td class="px-4 py-2 text-right">
              <button
                class="text-blue-600 text-xs mr-3 "
                @click="startEdit(city)"
              >
                Edit
              </button>
              <button
                class="text-red-600 text-xs"
                @click="handleDelete(city.id)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!cities.length">
            <td colspan="4" class="px-4 py-4 text-center text-gray-500">
              No cities yet. Create your first one above.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error -->
    <p v-if="error" class="mt-3 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api"; 

const cities = ref([]);
const error = ref("");

const form = ref({
  name: "",
  countryCode: "",
});

const editingCity = ref(null);

async function loadCities() {
  try {
    error.value = "";
    const res = await api.get("/admin/cities"); // baseURL = /api -> /api/admin/cities
    cities.value = res.data;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load cities.";
  }
}

function resetForm() {
  editingCity.value = null;
  form.value = {
    name: "",
    countryCode: "",
  };
}

function startEdit(city) {
  editingCity.value = city;
  form.value = {
    name: city.name,
    countryCode: city.countryCode,
  };
}

async function handleSubmit() {
  try {
    error.value = "";

    if (!editingCity.value) {
      // create
      const res = await api.post("/admin/cities", form.value);
      cities.value.push(res.data);
    } else {
      // update
      const res = await api.put(
        `/admin/cities/${editingCity.value.id}`,
        form.value
      );
      const updated = res.data;
      const index = cities.value.findIndex((c) => c.id === updated.id);
      if (index !== -1) {
        cities.value[index] = updated;
      }
    }

    resetForm();
  } catch (e) {
    console.error(e);
    error.value = "Failed to save city.";
  }
}

async function handleDelete(id) {
  if (!confirm("Delete this city?")) return;
  try {
    error.value = "";
    await api.delete(`/admin/cities/${id}`);
    cities.value = cities.value.filter((c) => c.id !== id);
  } catch (e) {
    console.error(e);
    error.value = "Failed to delete city.";
  }
}

onMounted(loadCities);
</script>
