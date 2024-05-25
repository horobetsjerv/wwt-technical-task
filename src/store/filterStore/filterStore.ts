import { create } from 'zustand'

interface FilterStore {
	filters: Record<string, string[]>
	setFilters: (category: string, optionId: string) => void
	applyFilters: () => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterStore>(set => ({
	filters: {},
	setFilters: (category, optionId) =>
		set(state => {
			const categoryFilters = state.filters[category] || []
			const newCategoryFilters = categoryFilters.includes(optionId)
				? categoryFilters.filter(id => id !== optionId)
				: [...categoryFilters, optionId]
			return { filters: { ...state.filters, [category]: newCategoryFilters } }
		}),
	applyFilters: () => {},
	resetFilters: () => set({ filters: {} }),
	clearFilters: () => set({ filters: {} }) // реализация очистки фильтров
}))
