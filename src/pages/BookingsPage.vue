<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 text-white">Bookings</h1>
        <p class="text-sm text-slate-500 text-white">
          Manage all customer bookings, passengers and statuses.
        </p>
      </div>

      <input
        v-model="search"
        type="text"
        placeholder="Search by email, name or booking ID..."
        class="w-72 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-black shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <span class="text-sm font-medium text-slate-800">All bookings</span>
        <span class="text-xs text-slate-500">
          {{ filteredBookings.length }} booking(s)
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-slate-600">Booking ID</th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">Trip ID</th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">Customer</th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">Email</th>
              <th class="px-4 py-2 text-left font-medium text-slate-600">Status</th>
              <th class="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-4 text-center text-slate-500">
                Loading bookings...
              </td>
            </tr>

            <tr v-else-if="filteredBookings.length === 0">
              <td colspan="6" class="px-4 py-4 text-center text-slate-500">
                No bookings found.
              </td>
            </tr>

            <tr
              v-else
              v-for="b in filteredBookings"
              :key="b.bookingId"
              class="hover:bg-slate-50"
            >
              <td class="px-4 py-3 text-slate-800">
                {{ b.bookingId }}
              </td>
              <td class="px-4 py-3 text-slate-800">
                {{ b.tripId }}
              </td>
              <td class="px-4 py-3 text-slate-800">
                {{ b.firstName }} {{ b.lastName }}
              </td>
              <td class="px-4 py-3 text-slate-700">
                {{ b.contactEmail }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="statusBadgeClass(b.status)"
                >
                  {{ b.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right space-x-2">
                <!-- Status dropdown -->
                <select
                  class="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  :value="b.status"
                  @change="onStatusChange(b, $event)"
                >
                  <option v-for="s in statuses" :key="s" :value="s">
                    {{ s }}
                  </option>
                </select>

                <!-- View details -->
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  @click="openDetails(b.bookingId)"
                >
                  View details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details modal -->
    <div
      v-if="showDetails && selectedBooking"
      class="fixed inset-0 z-30 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div class="mb-3 flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">
              Booking #{{ selectedBooking.bookingId }}
            </h2>
            <p class="text-xs text-slate-500">
              Trip ID: {{ selectedBooking.tripId }} ·
              {{ selectedBooking.contactEmail }}
            </p>
          </div>

          <button
            type="button"
            class="text-slate-400 hover:text-slate-600"
            @click="closeDetails"
          >
            ✕
          </button>
        </div>

        <div class="mb-3">
          <p class="text-sm text-slate-700">
            Customer:
            <span class="font-medium">
              {{ selectedBooking.firstName }} {{ selectedBooking.lastName }}
            </span>
          </p>
          <p class="text-sm text-slate-700">
            Status:
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              :class="statusBadgeClass(selectedBooking.status)"
            >
              {{ selectedBooking.status }}
            </span>
          </p>
        </div>

        <h3 class="mb-2 text-sm font-medium text-slate-800">
          Passengers
        </h3>

        <div class="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
          <table class="min-w-full text-xs">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-3 py-1.5 text-left font-medium text-slate-600">
                  Name
                </th>
                <th class="px-3 py-1.5 text-left font-medium text-slate-600">
                  Type
                </th>
                <th class="px-3 py-1.5 text-left font-medium text-slate-600">
                  Seat
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-if="!selectedBooking.passengers || selectedBooking.passengers.length === 0">
                <td colspan="3" class="px-3 py-3 text-center text-slate-500">
                  No passengers for this booking.
                </td>
              </tr>

              <tr
                v-else
                v-for="(p, idx) in selectedBooking.passengers"
                :key="idx"
              >
                <td class="px-3 py-1.5 text-slate-800">
                  {{ p.firstName }} {{ p.lastName }}
                </td>
                <td class="px-3 py-1.5 text-slate-700">
                  {{ p.passengerType }}
                </td>
                <td class="px-3 py-1.5 text-slate-700">
                  {{ p.seatNumber || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            @click="closeDetails"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

// State
const bookings = ref([]); // list of BookingResponseDTO
const loading = ref(false);
const error = ref("");
const search = ref("");

// Details modal
const showDetails = ref(false);
const selectedBooking = ref(null); // booking + passengers from details endpoint
const loadingDetails = ref(false);

// possible statuses (should match your BookingStatus enum)
const statuses = ["PENDING", "CONFIRMED", "CANCELLED"];

// Load all bookings (summary list)
const loadBookings = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get("/api/admin/bookings"); // -> /api/admin/bookings
    bookings.value = data;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load bookings.";
  } finally {
    loading.value = false;
  }
};

// Open details modal: fetch booking + passengers
const openDetails = async (bookingId) => {
  showDetails.value = true;
  selectedBooking.value = null;
  loadingDetails.value = true;
  error.value = "";

  try {
    const { data } = await api.get(`/admin/bookings/${bookingId}`);
    // expected structure:
    // {
    //   bookingId, tripId, firstName, lastName, contactEmail, status,
    //   passengers: [{ firstName, lastName, passengerType, seatNumber }, ...]
    // }
    selectedBooking.value = data;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load booking details.";
    showDetails.value = false;
  } finally {
    loadingDetails.value = false;
  }
};

const closeDetails = () => {
  showDetails.value = false;
  selectedBooking.value = null;
};

// Status -> badge style
const statusBadgeClass = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border border-red-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border border-amber-200";
  }
};

// When dropdown changes
const onStatusChange = async (booking, event) => {
  const newStatus = event.target.value;
  const oldStatus = booking.status;

  if (newStatus === oldStatus) return;

  try {
    error.value = "";
    // PATCH /api/admin/bookings/{id}/status?status=CONFIRMED
    await api.patch(`/admin/bookings/${booking.bookingId}/status`, null, {
      params: { status: newStatus },
    });
    booking.status = newStatus;

    // if details modal open for same booking, sync it too
    if (selectedBooking.value && selectedBooking.value.bookingId === booking.bookingId) {
      selectedBooking.value.status = newStatus;
    }
  } catch (e) {
    console.error(e);
    error.value = "Failed to update status.";
    // revert select on error
    booking.status = oldStatus;
  }
};

// filter bookings by search
const filteredBookings = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return bookings.value;

  return bookings.value.filter((b) => {
    const bookingIdStr = (b.bookingId ?? "").toString();
    const fullName = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
    const email = (b.contactEmail ?? "").toLowerCase();
    return (
      bookingIdStr.includes(q) ||
      fullName.includes(q) ||
      email.includes(q)
    );
  });
});

onMounted(() => {
  loadBookings();
});
</script>
