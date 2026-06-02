import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BusSchedule {
  id: string
  company: string
  origin: string
  destination: string
  departure: string
  arrival: string
  price: number
  duration: string
}

export const useTransportStore = defineStore('transport', () => {
  const schedules = ref<BusSchedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filteredOrigin = ref('')
  const filteredDestination = ref('')

  const setOriginFilter = (origin: string) => {
    filteredOrigin.value = origin
    sessionStorage.setItem('transportOriginFilter', origin)
  }

  const setDestinationFilter = (destination: string) => {
    filteredDestination.value = destination
    sessionStorage.setItem('transportDestinationFilter', destination)
  }

  const getSchedules = () => {
    return schedules.value.filter(s => {
      const originMatch = !filteredOrigin.value || s.origin.toLowerCase().includes(filteredOrigin.value.toLowerCase())
      const destMatch = !filteredDestination.value || s.destination.toLowerCase().includes(filteredDestination.value.toLowerCase())
      return originMatch && destMatch
    })
  }

  const fetchSchedules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://uruguayapi.onrender.com/api/v1/buses/schedules')
      if (!response.ok) throw new Error('Failed to fetch schedules')
      const data = await response.json()
      schedules.value = data.map((item: any, index: number) => ({
        id: `schedule-${index}`,
        company: item.company || 'Unknown Company',
        origin: item.origin || 'Unknown Origin',
        destination: item.destination || 'Unknown Destination',
        departure: item.departure || '00:00',
        arrival: item.arrival || '00:00',
        price: item.price || 0,
        duration: item.duration || 'N/A',
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // Load filters from sessionStorage
  const loadFilters = () => {
    const origin = sessionStorage.getItem('transportOriginFilter')
    const destination = sessionStorage.getItem('transportDestinationFilter')
    if (origin) filteredOrigin.value = origin
    if (destination) filteredDestination.value = destination
  }

  loadFilters()

  return {
    schedules,
    loading,
    error,
    filteredOrigin,
    filteredDestination,
    setOriginFilter,
    setDestinationFilter,
    getSchedules,
    fetchSchedules,
  }
})
