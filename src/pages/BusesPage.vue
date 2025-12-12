<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Buses</h1>

    <!-- Form -->
    <div class="bg-white rounded-xl shadow p-4 mb-6 max-w-md">
      <h2 class="text-lg font-semibold mb-3 text-black">
        {{ editingBus ? "Edit Bus" : "Create Bus" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1 text-black">Bus Name</label>
          <input
            v-model="form.busName"
            type="text"
            class="w-full border rounded-lg px-3 py-2 text-sm text-black"
            placeholder="Setra Comfort"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-black">Plate Number</label>
          <input
            v-model="form.plateNumber"
            type="text"
            class="w-full border rounded-lg px-3 py-2 text-sm text-black"
            placeholder="SK-1234-AB"
            required
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="bg-lime-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-lime-700"
          >
            {{ editingBus ? "Save changes" : "Create bus" }}
          </button>
          <button
            v-if="editingBus"
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
            <th class="px-4 py-2 text-left font-medium">Plate</th>
            <th class="px-4 py-2 text-center font-medium">Seats</th>
            <th class="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="bus in buses"
            :key="bus.id"
            class="border-t hover:bg-gray-50 text-black"
          >
            <td class="px-4 py-2 ">{{ bus.id }}</td>
            <td class="px-4 py-2">{{ bus.busName }}</td>
            <td class="px-4 py-2">{{ bus.plateNumber }}</td>
            <td class="px-4 py-2 text-center">
              {{ bus.seatCount }}
            </td>
            <td class="px-4 py-2 text-right">
              <button
                class="text-blue-600 text-xs mr-3"
                @click="startEdit(bus)"
              >
                Edit
              </button>
              <button
                class="text-amber-600 text-xs mr-3"
                @click="openSeatGenerator(bus)"
              >
                Seats
              </button>
              <button
                class="text-red-600 text-xs"
                @click="handleDelete(bus.id)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!buses.length">
            <td colspan="5" class="px-4 py-4 text-center text-gray-500">
              No buses yet. Create your first one above.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error -->
    <p v-if="error" class="mt-3 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Seat generator dialog -->
    <div
      v-if="seatBus"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl shadow-lg p-5 w-full max-w-xs">
        <h2 class="text-lg font-semibold mb-3 text-black">
          Generate seats for {{ seatBus.busName }}
        </h2>

        <form @submit.prevent="handleGenerateSeats" class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1 text-black">Seat rows</label>
            <input
              v-model.number="seatForm.seatRows"
              type="number"
              min="1"
              class="w-full border rounded-lg px-3 py-2 text-sm text-black"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-black">
              Seats per row
            </label>
            <input
              v-model.number="seatForm.seatsPerRow"
              type="number"
              min="1"
              class="w-full border rounded-lg px-3 py-2 text-sm text-black"
              required
            />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeSeatGenerator"
              class="border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-lime-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-lime-700"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api"; 

const buses = ref([]);
const error = ref("");

const form = ref({
  busName: "",
  plateNumber: "",
});

const editingBus = ref(null);

// seat generator
const seatBus = ref(null);
const seatForm = ref({
  seatRows: 10,
  seatsPerRow: 4,
});

async function loadBuses() {
  try {
    error.value = "";
    const res = await api.get("/admin/buses"); // -> /api/admin/buses
    buses.value = res.data;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load buses.";
  }
}

function resetForm() {
  editingBus.value = null;
  form.value = {
    busName: "",
    plateNumber: "",
  };
}

function startEdit(bus) {
  editingBus.value = bus;
  form.value = {
    busName: bus.busName,
    plateNumber: bus.plateNumber,
  };
}

async function handleSubmit() {
  try {
    error.value = "";

    if (!editingBus.value) {
      const res = await api.post("/admin/buses", form.value);
      buses.value.push(res.data);
    } else {
      const res = await api.put(`/admin/buses/${editingBus.value.id}`, form.value);
      const updated = res.data;
      const index = buses.value.findIndex((b) => b.id === updated.id);
      if (index !== -1) {
        buses.value[index] = updated;
      }
    }

    resetForm();
  } catch (e) {
    console.error(e);
    error.value = "Failed to save bus.";
  }
}

async function handleDelete(id) {
  if (!confirm("Delete this bus?")) return;
  try {
    error.value = "";
    await api.delete(`/admin/buses/${id}`);
    buses.value = buses.value.filter((b) => b.id !== id);
  } catch (e) {
    console.error(e);
    error.value = "Failed to delete bus.";
  }
}

function openSeatGenerator(bus) {
  seatBus.value = bus;
  seatForm.value = {
    seatRows: 10,
    seatsPerRow: 4,
  };
}

function closeSeatGenerator() {
  seatBus.value = null;
}

async function handleGenerateSeats() {
  if (!seatBus.value) return;
  try {
    error.value = "";
    await api.post(`/admin/seats/bus/${seatBus.value.id}/generate`, seatForm.value);
    await loadBuses(); // refresh seatCount
    closeSeatGenerator();
  } catch (e) {
    console.error(e);
    error.value = "Failed to generate seats.";
  }
}

onMounted(loadBuses);
</script>
