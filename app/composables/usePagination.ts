import type { Ref } from 'vue'

export function usePagination<T>(
  items: Ref<T[]>,
  resetTriggers: any[] = [],
  pageSize = 8
) {
  const page = ref(1)

  watch(
    resetTriggers,
    () => {
      page.value = 1
    },
    {
      deep: true
    }
  )

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize

    return items.value.slice(
      start,
      start + pageSize
    )
  })

  return {
    page,
    pageSize,
    paginatedItems
  }
}