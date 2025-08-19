// store/apartments.ts
import { defineStore } from 'pinia'
import type { IApartment } from '~/types/IApartment'
import { fetchApartments } from '~/utils/fetchApartments'

// Ключ для localStorage
const STORAGE_KEY = 'apartments-store-v1'

export const useApartmentsStore = defineStore('apartments', {
  state: () => ({
    apartments: [] as IApartment[],
    filteredApartments: [] as IApartment[],
    isLoading: false,
    currentPage: 1,
    itemsPerPage: 20,

    // Пределы (устанавливаются один раз)
    priceRangeLimits: [0, 0] as [number, number],
    areaRangeLimits: [0, 0] as [number, number],

    // Фильтры
    filters: {
      rooms: null as number | null,
      priceRange: [0, 0] as [number, number],
      areaRange: [0, 0] as [number, number],
    },

    // Сортировка
    sortBy: '' as 'area' | 'price' | 'floor' | '',
    sortDirection: 'asc' as 'asc' | 'desc',

    // Для debounce
    debouncedPrice: null as [number, number] | null,
    debouncedArea: null as [number, number] | null,
    debounceTimer: null as null | ReturnType<typeof setTimeout>,
  }),

  getters: {
    displayedApartments: (state): IApartment[] => {
      const endIndex = state.currentPage * state.itemsPerPage
      return state.filteredApartments.slice(0, endIndex)
    },
    hasMore: (state): boolean => {
      return state.filteredApartments.length > state.currentPage * state.itemsPerPage
    },
  },

  actions: {
    async load() {
      if (this.apartments.length > 0) return

      this.isLoading = true
      try {
        const data = await fetchApartments()
        this.apartments = data

        // Устанавливаем ЛИМИТЫ один раз
        const prices = data.map(a => a.price)
        const areas = data.map(a => a.area)

        this.priceRangeLimits = [Math.min(...prices), Math.max(...prices)]
        this.areaRangeLimits = [Math.min(...areas), Math.max(...areas)]

        // Восстанавливаем состояние из localStorage
        this.restoreFromStorage()

        // Если фильтры не установлены — используем лимиты
        if (this.filters.priceRange[0] === 0 || this.filters.priceRange[1] === 0) {
          this.filters.priceRange = [...this.priceRangeLimits]
        }
        if (this.filters.areaRange[0] === 0 || this.filters.areaRange[1] === 0) {
          this.filters.areaRange = [...this.areaRangeLimits]
        }

        this.applyFilters()
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      } finally {
        this.isLoading = false;


      }
    },

    setSortBy(field: 'area' | 'price' | 'floor') {
      if (this.sortBy === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = field
        this.sortDirection = 'asc'
      }
      this.applyFilters()
    },

    resetFilters() {
      this.filters.rooms = null
      this.filters.priceRange = [...this.priceRangeLimits]
      this.filters.areaRange = [...this.areaRangeLimits]
      this.applyFiltersWithLoading()
    },

    setRooms(rooms: number | null) {
      this.filters.rooms = rooms
      this.applyFiltersWithLoading()
    },

    updateFiltersDebounced(newFilters: Partial<{
      rooms: number | null
      priceRange: [number, number]
      areaRange: [number, number]
    }>) {
      Object.assign(this.filters, newFilters)
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.applyFiltersWithLoading()
      }, 400)
    },

    async applyFiltersWithLoading() {
      this.isLoading = true
      await new Promise(resolve => setTimeout(resolve, 300))
      this.applyFilters()
      this.isLoading = false
    },

    applyFilters() {
      let sorted = this.apartments.filter(apt => {
        const { rooms, priceRange, areaRange } = this.filters
        if (rooms !== null && !apt.title.includes(`${rooms}-комнатная`)) return false
        if (apt.price < priceRange[0] || apt.price > priceRange[1]) return false
        if (apt.area < areaRange[0] || apt.area > areaRange[1]) return false
        return true
      })

      // Сортировка
      if (this.sortBy === 'area') {
        sorted.sort((a, b) => this.sortDirection === 'asc' ? a.area - b.area : b.area - a.area)
      } else if (this.sortBy === 'price') {
        sorted.sort((a, b) => this.sortDirection === 'asc' ? a.price - b.price : b.price - a.price)
      } else if (this.sortBy === 'floor') {
        sorted.sort((a, b) => this.sortDirection === 'asc' ? a.floor - b.floor : b.floor - a.floor)
      }

      this.filteredApartments = sorted
      this.currentPage = 1
      this.saveToStorage()
    },

    loadMore() {
      if (this.isLoading || !this.hasMore) return
      this.currentPage++
      this.saveToStorage()
    },

    // Сохранение в localStorage
    saveToStorage() {
      if (process.client) {
        const state = {
          filters: this.filters,
          sortBy: this.sortBy,
          sortDirection: this.sortDirection,
          currentPage: this.currentPage,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    },

    // Восстановление из localStorage
    restoreFromStorage() {
      if (process.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed.filters) this.filters = parsed.filters
            if (parsed.sortBy) this.sortBy = parsed.sortBy
            if (parsed.sortDirection) this.sortDirection = parsed.sortDirection
            if (parsed.currentPage) this.currentPage = parsed.currentPage
          } catch (e) {
            console.warn('Failed to restore state from localStorage')
          }
        }
      }
    },
  },
})