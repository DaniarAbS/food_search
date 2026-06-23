<template>
    <div class="container mx-auto p-8">
        <div class="flex gap-10">
            <CatalogSidebar 
                :categories="categories"
                :selected-category="selectedCategory"
                @select-category="selectedCategory = $event"
            />

            <div class="flex-1">
              <div class="flex justify-end mb-4">
                <UButton
                    icon="i-lucide-sparkles"
                    color="primary"
                    variant="soft"
                    @click="openAiFood = true"
                >
                    AI подбор
                </UButton>
              </div>
              <CatalogFilters 
                v-model:search="search"
                v-model:selected-cafe="selectedCafe"
                v-model:selected-ingredient="selectedIngredient"
                v-model:price-range="priceRange"
                :cafe-options="cafeOptions"
                :ingredient-options="ingredientOptions"
                :max-price="maxPrice"
              />
              <div
                v-if="isAiActive"
                class="mb-4 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
              >
                <p class="text-sm">
                  <template v-if="aiFoods.length">✨ Подобрано блюд: {{ aiFoods.length }}</template>
                  <template v-else>По вашему запросу ничего не найдено</template>
                </p>
                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" @click="clearAi">
                  Сбросить
                </UButton>
              </div>

              <CatalogGrid :foods="isAiActive ? aiFoods : paginatedFoods" />
              
              <div v-if="!isAiActive" class="flex justify-center mt-10">
                <UPagination
                  v-model:page="page"
                  :items-per-page="pageSize"
                  :total="filteredFoods.length"
                />
              </div>
            </div>
        </div>
        <AIFoodModal
          :open="openAiFood"
          :category-options="categoryOptions"
          :loading="aiLoading"
          :error="aiError"
          @submit="handleAiSubmit"
          @close="openAiFood = false"
        />
    </div>
</template>

<script setup lang="ts">
import CatalogGrid from '~/components/CatalogGrid.vue';
import AIFoodModal from '~/components/AIFoodModal.vue';
import type { AiRequest } from '~/composables/useAiFood';
const { foods } = await useFoods()
const openAiFood = ref(false)

const aiFoods = computed(() =>
  (aiResultIds.value ?? [])
    .map(id => foods.value.find(food => food.id === id))
    .filter((food): food is NonNullable<typeof food> => Boolean(food))
)

async function handleAiSubmit(request: AiRequest) {
  await submitAiFood(request, foods.value)

  if (!aiError.value) {
    openAiFood.value = false
  }
}

const {
  aiLoading,
  aiError,
  aiResultIds,
  clearAi,
  submitAiFood
} = useAiFood()

const isAiActive = computed(() => aiResultIds.value !== null)

const {
  categories, 
  cafeOptions,
  ingredientOptions,
  filteredFoods,

  selectedCategory,
  search,
  selectedCafe,
  selectedIngredient,
  priceRange
} = useFoodFilters(foods)

const categoryOptions = computed(() =>
  categories.value
    .filter(c => c.name !== 'Все блюда')
    .map(c => c.name)
)

const {
  page,
  pageSize,
  paginatedItems: paginatedFoods
} = usePagination(
  filteredFoods,
  [
    search,
    selectedCategory,
    selectedCafe,
    selectedIngredient,
    priceRange
  ]
)

const maxPrice = computed(() => {
  if (foods.value.length === 0) return 5000
  return Math.max(...foods.value.map(food => food.price))
})
</script>