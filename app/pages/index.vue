<template>
  <UCard>
    <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-semibold">
      Продукт
    </h2>

    <div class="flex gap-2">
      <UInput
        v-model="search"
        placeholder="Поиск..."
        icon="i-lucide-search"
        class="w-64"
      />

      <USelect
        v-model="selectedCategory"
        :items="categories"
        placeholder="Фильтр"
        class="w-48"
      />
    </div>
  </div>

    <UTable
      :key="page"
      :data="paginatedItems"
      :columns="columns"
    >
      <template #image-cell="{ row }">
        <UAvatar
          :src="row.original.image"
          size="lg"
        />
      </template>

      <template #link-cell="{ row }">
        <UButton
          size="sm"
          :to="row.original.gisLink"
          target="_blank"
        >
          Open
        </UButton>
      </template>
    </UTable>
    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="page"
        :items-per-page="pageSize"
        :total="filteredItems.length"
      />
    </div>
    <div></div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { $supabase } = useNuxtApp()
const page = ref(1)
const pageSize = 8
const search = ref('')
const selectedCategory = ref('all')

const { data } = await $supabase
  .from('food')
  .select(`
    id,
    name,
    price,
    image_url,
    category,
    restaurants (
      name,
      gis_link
    )
  `)

const categories = computed(() => {
  const unique = [...new Set(
    (data ?? []).map(food => food.category)
  )]

  return [
    { label: 'Все', value: 'all' },
    ...unique.map(category => ({
      label: category,
      value: category
    }))
  ]
})

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchSearch =
      item.foodName
        .toLowerCase()
        .includes(search.value.toLowerCase())

    const matchCategory =
      selectedCategory.value === 'all' ||
      item.category === selectedCategory.value

    return matchSearch && matchCategory
  })
})

const items = computed(() => 
    (data ?? []).map(food => ({
      id: food.id,
      image: food.image_url,
      foodName: food.name,
      cafeName: (food.restaurants as any).name,
      gisLink: (food.restaurants as any).gis_link,
      price: food.price,
      category: food.category
    }))
)

const columns = [
  {
    accessorKey: 'image',
    header: ''
  },
  {
    accessorKey: 'foodName',
    header: 'Food Name'
  },
  {
    accessorKey: 'cafeName',
    header: 'Cafe Name'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    id: 'link',
    header: 'Link'
  }
]

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  
  return filteredItems.value.slice(start, end)
})
</script>